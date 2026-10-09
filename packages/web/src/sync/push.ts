import type { ModelStore } from "../state/model";
import { api as defaultApi } from "../lib/api";
import { type ModelNode, type ModelGraph, type SchemaField, normalizeFieldType, isCalculated, toStoredFormula } from "@mc/okf";
import { buildFormulaContext, joinAlias } from "../lib/formulaContext";
import { joinFieldType, alignedJoinTypes } from "./joinFieldType";

type Api = typeof defaultApi;

export interface PushResult {
  created: number;
  updated: number;
  failed: number;
  /** Marts a forced push held back because they are still in OWOX. Not a failure
   *  — nothing broke, we refused to create a duplicate. */
  blocked: number;
  /** Subset of `created`: marts that looked created here but had been deleted in
   *  OWOX, so this push re-created them (and gave them a new OWOX id). */
  recreated: number;
  relationshipsCreated: number;
  relationshipsFailed: number;
  /** Links created as "Join not configured" in OWOX because the canvas edge has no
   *  join keys yet. Counted separately: they were created, but need finishing. */
  relationshipsWithoutKeys: number;
  /** Marts published in OWOX (only marts with an input source can be). */
  published: number;
  /** Marts whose calculated fields OWOX refused; their base schema still landed. */
  calculatedFailed: number;
  /** The push stopped because the OWOX session was gone and could not be renewed.
   *  Nothing here is a modelling error — the remaining marts were never tried. */
  authExpired?: boolean;
  errors: string[];
}

// api() already re-connects silently when the 15-minute OWOX token expires, so a
// 401 reaching us means re-connecting failed too (key revoked, or never stored).
// Every subsequent call would fail identically, so the push stops here.
const isAuthError = (e: unknown) => (e as { status?: number })?.status === 401;

const SESSION_EXPIRED =
  "Your OWOX session expired and could not be renewed — nothing else was pushed. Connect to OWOX again, then push.";

// A calculated field OWOX can accept: named, with a non-blank formula. A field added
// with "+ Add calculated field" and never filled in would otherwise make OWOX refuse
// the whole schema PUT, taking the mart's valid calculated fields down with it.
const isPushableCalculated = (f: SchemaField) =>
  isCalculated(f) && !!f.name.trim() && !!(f.formula ?? "").trim();

// Preview what a push to the active storage would do, mirroring pushModel's skip
// logic so the confirmation dialog's counts match reality. A mart is "already
// live here" when it's created AND tagged to the active storage; such marts are
// skipped. An imported (existing) edge is skipped only when both endpoints stay.
// alreadyPushed reports how many marts the skip swallows, so the dialog can say
// why a push would send nothing and offer a force push instead.
//
// Deliberately local and synchronous: it cannot know that a mart was deleted in
// OWOX (pushModel finds that out with a listing and re-creates it), so its counts
// are a floor, not a promise. The dialog's wording accounts for that.
export function pushPreview(graph: ModelGraph, storageId: string | null): { marts: number; relationships: number; alreadyPushed: number; calculatedFields: number; published: number } {
  const liveHere = (n: ModelNode) => n.status === "created" && n.owoxStorageId === storageId;
  const skipped = new Set(graph.nodes.filter(liveHere).map(n => n.key));
  const marts = graph.nodes.filter(n => !skipped.has(n.key)).length;
  let relationships = 0;
  for (const e of graph.edges) {
    if (e.existing && skipped.has(e.from) && skipped.has(e.to)) continue;
    relationships++;
  }
  const calculatedFields = graph.nodes
    .filter(n => !skipped.has(n.key))
    .reduce((sum, n) => sum + n.schema.filter(isPushableCalculated).length, 0);
  // Push publishes every mart it creates that has an input source to send.
  const published = graph.nodes.filter(n => !skipped.has(n.key) && definitionBody(n) !== null).length;
  return { marts, relationships, alreadyPushed: skipped.size, calculatedFields, published };
}

// OWOX validates the output schema with a discriminator keyed on the storage
// ENGINE, not its full type: GOOGLE_BIGQUERY and LEGACY_GOOGLE_BIGQUERY both use
// "bigquery-data-mart-schema"; SNOWFLAKE → "snowflake-data-mart-schema". Strip
// the vendor/legacy prefixes (LEGACY_ before GOOGLE_, so LEGACY_GOOGLE_BIGQUERY
// collapses to "bigquery") to land on the engine name OWOX expects.
function schemaDiscriminator(storageType: string): string {
  const base = storageType
    .replace(/^LEGACY_/, "")
    .replace(/^GOOGLE_/, "")
    .replace(/^AWS_/, "")
    .toLowerCase();
  return `${base}-data-mart-schema`;
}

// One field envelope for both schema PUTs. OWOX derives a calculated field's level
// from its formula, so none is sent; a formula column is never a primary key.
function fieldBody(f: SchemaField) {
  return {
    // Normalise the type here too, not only on import: models saved before
    // normalisation existed (or hand-edited) can still carry a spelling OWOX's
    // case-sensitive enum rejects, and one bad field costs the mart its whole schema.
    name: f.name, type: normalizeFieldType(f.type), mode: "NULLABLE",
    status: "CONNECTED", description: f.description ?? "", isPrimaryKey: isCalculated(f) ? false : f.pk,
    ...(f.alias ? { alias: f.alias } : {}),
    ...(isCalculated(f) ? { calculated: { formula: f.formula ?? "" } } : {}),
  };
}

export interface PushOptions {
  /** Re-create marts that are already live in the active storage — the "I want this
   *  model in OWOX again" hammer. A normal push already repairs marts that were
   *  deleted in OWOX (see the ghosts half of reconcileWithOwox), so force is for
   *  the rest: re-creating marts that ARE still there. Anything still present is
   *  held back rather than duplicated. */
  force?: boolean;
}

/** Reconciles what the canvas believes about OWOX against what OWOX actually has.
 *  Two mirror-image answers come out of the same listing:
 *
 *  - `blocked` — the mart's stored owoxId IS still there. A forced push must not
 *    re-create those: the project would end up with two copies and no way to tell
 *    them apart. Carries each one's OWOX status so we can name it.
 *  - `ghosts` — the mart is marked created here but its owoxId is GONE (deleted in
 *    OWOX, or the model was imported and then cleaned up there). A normal push used
 *    to skip these on local state alone and then fail the relationship POST with a
 *    404 about a mart that no longer exists — or, for a fully imported model, do
 *    nothing at all and report success. They are re-created instead.
 *
 *  Throws if the listing can't be read; each caller decides what that means. */
async function reconcileWithOwox(
  store: ModelStore, api: Api, storageId: string,
): Promise<{ blocked: Map<string, string | undefined>; ghosts: Set<string> }> {
  const live = await api<Array<{ id: string; title?: string; status?: string }>>("/api/data-marts");
  if (!Array.isArray(live)) throw new Error("unexpected data mart listing");
  const statusById = new Map(live.map(m => [m.id, m.status]));
  const blocked = new Map<string, string | undefined>();
  const ghosts = new Set<string>();
  for (const n of store.get().nodes) {
    if (n.status !== "created" || n.owoxStorageId !== storageId || !n.owoxId) continue;
    if (statusById.has(n.owoxId)) blocked.set(n.key, statusById.get(n.owoxId));
    else ghosts.add(n.key);
  }
  return { blocked, ghosts };
}

export async function pushModel(store: ModelStore, api: Api = defaultApi, storageType?: string, opts: PushOptions = {}): Promise<PushResult> {
  const res: PushResult = { created: 0, updated: 0, failed: 0, blocked: 0, recreated: 0, relationshipsCreated: 0, relationshipsFailed: 0, relationshipsWithoutKeys: 0, published: 0, calculatedFailed: 0, errors: [] };

  const storageId = store.get().storageId;
  if (!storageId) {
    const pending = store.get().nodes.filter(n => n.status !== "created");
    pending.forEach(n => store.updateNode(n.key, { status: "error", error: "No storage selected" }));
    res.failed = pending.length;
    res.errors.push("No storage selected — pick a storage in the top bar before pushing.");
    return res;
  }

  // ── 0. Ask OWOX what is actually there before trusting our own bookkeeping ──
  // A forced push says "I deleted these in OWOX" — verify it, because a mart still
  // listed there would become a duplicate nobody can untangle afterwards. A normal
  // push needs the mirror answer: a mart we think we created but which is gone must
  // be re-created, or its relationships fail against a dead id.
  const blockedKeys = new Set<string>();
  const ghostKeys = new Set<string>();
  {
    let recon: { blocked: Map<string, string | undefined>; ghosts: Set<string> } | null = null;
    try {
      recon = await reconcileWithOwox(store, api, storageId);
    } catch (e) {
      // A forced push cannot continue on a guess — duplicates are unrecoverable.
      if (opts.force) {
        if (isAuthError(e)) { res.authExpired = true; res.errors.push(SESSION_EXPIRED); return res; }
        res.errors.push(`Could not check which marts still exist in OWOX (${(e as Error).message}) — nothing was pushed.`);
        return res;
      }
      // An expired session fails the listing first, before any mart is touched.
      // Saying so beats silently falling through to 21 identical 401s below.
      if (isAuthError(e)) { res.authExpired = true; res.errors.push(SESSION_EXPIRED); return res; }
      // A normal push falls back to the old local-state-only skip: without the
      // listing, re-creating would risk exactly the duplicates we guard against.
    }
    if (opts.force) {
      for (const [key, owoxStatus] of recon?.blocked ?? []) {
        const title = store.get().nodes.find(n => n.key === key)?.title ?? key;
        blockedKeys.add(key);
        res.blocked++;
        res.errors.push(
          `"${title}" still exists in OWOX${owoxStatus ? ` (${owoxStatus})` : ""} — delete it there first, otherwise this would create a duplicate.`,
        );
      }
    } else {
      for (const key of recon?.ghosts ?? []) ghostKeys.add(key);
    }
  }

  // ── 1. Ensure every join-key field exists in its mart's output schema ───────
  // Joining on a field that isn't defined is meaningless, so auto-add missing
  // ones before we push schemas. Infer the new field's type from the other side
  // of the join (a key matching an INTEGER PK must not be created as STRING, or
  // OWOX rejects the relationship with "Incompatible types").
  {
    const g0 = store.get();
    for (const e of g0.edges) {
      for (const k of e.keys) {
        // Step 1 never targets a calculated field: it is not a column of the mart.
        const leftCalc = isCalcField(g0.nodes, e.from, k.left);
        const rightCalc = isCalcField(g0.nodes, e.to, k.right);
        if (k.left && !leftCalc) ensureField(store, e.from, k.left, joinFieldType(g0.nodes, g0.edges, e.from, k.left));
        if (k.right && !rightCalc) ensureField(store, e.to, k.right, joinFieldType(g0.nodes, g0.edges, e.to, k.right));
        if (k.left && k.right && !leftCalc && !rightCalc) alignJoinKeyTypes(store, e.from, k.left, e.to, k.right);
      }
    }
  }

  // ── 2. Create pending marts, then push their output schema ──────────────────
  // Track marts we skip because they already exist IN THIS STORAGE — a "created"
  // mart whose owoxStorageId points at a different storage (e.g. imported from
  // another project, then signed into this one) is NOT in the active storage, so
  // it must be recreated here rather than silently skipped. A forced push skips
  // only what step 0 found still living in OWOX; everything else is created again
  // (and so are its relationships, since the edge skip below keys off this set).
  // Ghosts — created here, but no longer in OWOX — are likewise NOT skipped.
  const skippedKeys = new Set<string>();
  const pushedHere = new Map<string, string>();
  const baseFailed = new Set<string>();   // marts whose base schema PUT was refused
  for (const n of store.get().nodes) {
    if (blockedKeys.has(n.key)) { skippedKeys.add(n.key); continue; }
    if (!opts.force && n.status === "created" && n.owoxStorageId === storageId && !ghostKeys.has(n.key)) { skippedKeys.add(n.key); continue; }
    store.updateNode(n.key, { status: "creating", error: null });
    try {
      // Create a draft with just { title, storageId } — confirmed to always 201.
      const out = await api<{ id: string }>("/api/data-marts", {
        method: "POST",
        body: JSON.stringify({ title: n.title, storageId }),
      });
      if (n.description) {
        await api(`/api/data-marts/${out.id}/description`, { method: "PUT", body: JSON.stringify({ description: n.description }) }).catch(() => {});
      }
      // Best-effort: push the source definition together with its input-source
      // type so the mart keeps SQL / TABLE / VIEW (instead of staying a typeless
      // draft). Uses OWOX's definition envelope { definitionType, definition };
      // swallowed on error so an unconfirmed edge case never fails the mart.
      const defBody = definitionBody(n);
      if (defBody) {
        await api(`/api/data-marts/${out.id}/definition`, { method: "PUT", body: JSON.stringify(defBody) }).catch(() => {});
      }
      // Push the output schema (fields + types + PK). Best-effort: a schema error
      // doesn't fail the mart itself, but it's surfaced in the result.
      const fields = n.schema.filter(f => f.name.trim() && !isCalculated(f));
      if (fields.length && storageType) {
        try {
          await api(`/api/data-marts/${out.id}/schema`, {
            method: "PUT",
            body: JSON.stringify({
              schema: {
                type: schemaDiscriminator(storageType),
                fields: fields.map(fieldBody),
              },
            }),
          });
        } catch (e) {
          baseFailed.add(n.key);
          res.errors.push(`Schema for "${n.title}": ${(e as Error).message}`);
        }
      }
      pushedHere.set(n.key, out.id);
      store.updateNode(n.key, { status: "created", owoxId: out.id, owoxStorageId: storageId, createdAt: new Date().toISOString() });
      res.created++;
      // Counted only once it actually landed, so a failed re-create isn't reported
      // as a repair. Surfaced in the toast: the mart quietly changed its OWOX id.
      if (ghostKeys.has(n.key)) res.recreated++;
    } catch (e) {
      const msg = (e as Error).message;
      store.updateNode(n.key, { status: "error", error: msg });
      res.failed++;
      if (isAuthError(e)) { res.authExpired = true; res.errors.push(SESSION_EXPIRED); break; }
      res.errors.push(`"${n.title}": ${msg}`);
    }
  }

  // Relationships need a live session just as much as marts do; pushing on would
  // only add one failed link per edge to a toast that already says what to fix.
  if (res.authExpired) return res;

  // ── 2b. Actualize + publish marts that have an input source ─────────────────
  // OWOX accepts a formula reference only to a CONNECTED field, and fields written
  // by PUT /schema stay DISCONNECTED until the schema is re-read from the warehouse.
  // So: actualize (every column becomes CONNECTED), then publish — a joined reference
  // resolves only against PUBLISHED relationship targets. A mart without an input
  // source can do neither and stays a draft.
  const actualized = new Set<string>();
  for (const [key, owoxId] of pushedHere) {
    const n = store.get().nodes.find(x => x.key === key);
    if (!n || baseFailed.has(key) || !definitionBody(n)) continue;
    try {
      const r = await api<{ success?: boolean; error?: string }>(`/api/data-marts/${owoxId}/actualize-schema`, { method: "POST", body: "{}" });
      if (!r?.success) {
        res.errors.push(`Couldn't read "${n.title}" from the warehouse: ${r?.error || "Schema actualization failed"}`);
        continue;
      }
    } catch (e) {
      if (isAuthError(e)) { res.authExpired = true; res.errors.push(SESSION_EXPIRED); return res; }
      res.errors.push(`Couldn't read "${n.title}" from the warehouse: ${(e as Error).message}`);
      continue;
    }
    actualized.add(key);
    try {
      await api(`/api/data-marts/${owoxId}/publish`, { method: "PUT", body: "{}" });
      res.published++;
    } catch (e) {
      if (isAuthError(e)) { res.authExpired = true; res.errors.push(SESSION_EXPIRED); return res; }
      res.errors.push(`Couldn't publish "${n.title}": ${(e as Error).message}`);
    }
  }

  // ── 3. Create joinable relationships (depends on both marts existing) ───────
  const g = store.get();
  const owoxIdByKey = new Map(g.nodes.map(n => [n.key, n.owoxId]));
  const titleByKey = new Map(g.nodes.map(n => [n.key, n.title]));

  for (const e of g.edges) {
    // Imported edges already exist in OWOX — but only in the storage they were
    // imported from. Skip them only when BOTH endpoints were skipped (i.e. still
    // live in the active storage). If an endpoint was recreated here (different
    // storage/project), the relationship doesn't exist yet and must be pushed.
    if (e.existing && skippedKeys.has(e.from) && skippedKeys.has(e.to)) continue;
    const keys = e.keys.filter(k => k.left && k.right);
    const fwdAlias = joinAlias(e.alias, { title: titleByKey.get(e.to) ?? "", key: e.to });
    const revAlias = joinAlias(e.reverseAlias, { title: titleByKey.get(e.from) ?? "", key: e.from });
    const directions: Array<[string, string, { left: string; right: string }[], string]> = e.bidirectional
      ? [[e.from, e.to, keys, fwdAlias], [e.to, e.from, keys.map(k => ({ left: k.right, right: k.left })), revAlias]]
      : [[e.from, e.to, keys, fwdAlias]];

    for (const [fromKey, toKey, ks, alias] of directions) {
      const fromId = owoxIdByKey.get(fromKey);
      const toId = owoxIdByKey.get(toKey);
      if (!fromId || !toId) {
        res.relationshipsFailed++;
        res.errors.push(`Link ${titleByKey.get(fromKey)} → ${titleByKey.get(toKey)}: both marts must be created first`);
        continue;
      }
      try {
        await api(`/api/data-marts/${fromId}/relationships`, {
          method: "POST",
          // NOTE: cardinality (e.cardinality) is intentionally NOT sent — it is a
          // view-only modeling annotation; OWOX's generated SQL aggregates joins.
          //
          // An edge with no join keys is still pushed, with joinConditions: [] —
          // OWOX accepts that (confirmed live: 201) and shows the link as "Join not
          // configured", so the modelled relationship survives the round trip and
          // the keys can be picked in either tool. The field must be present: OWOX
          // 400s on a missing joinConditions ("must be an array").
          body: JSON.stringify({
            targetDataMartId: toId,
            targetAlias: alias,
            joinConditions: ks.map(k => ({ sourceFieldName: k.left, targetFieldName: k.right })),
          }),
        });
        res.relationshipsCreated++;
        if (ks.length === 0) res.relationshipsWithoutKeys++;
      } catch (e) {
        res.relationshipsFailed++;
        res.errors.push(`Link ${titleByKey.get(fromKey)} → ${titleByKey.get(toKey)}: ${(e as Error).message}`);
      }
    }
  }

  // ── 4. Final schema — after relationships, since formulas read <alias>.<field> ──
  // Actualizing added every warehouse column to the mart, so each actualized mart gets
  // one PUT with exactly the canvas fields (restoring the canvas list, all CONNECTED).
  // Formulas go in OWOX's stored form: it validates `{{ref}}` tags, not plain SQL.
  // OWOX dry-runs every formula on this save and one refused formula fails the whole
  // request — hence the base-only retry below.
  if (storageType) {
    for (const [key, owoxId] of pushedHere) {
      const g4 = store.get();
      const n = g4.nodes.find(x => x.key === key);
      if (!n) continue;
      for (const f of n.schema) {
        if (isCalculated(f) && !isPushableCalculated(f) && !baseFailed.has(key)) {
          res.errors.push(`Calculated field "${f.name.trim() || "(unnamed)"}" in "${n.title}" has no formula — skipped.`);
        }
      }
      const hasCalc = n.schema.some(isPushableCalculated);
      if (!actualized.has(key)) {
        if (hasCalc && !baseFailed.has(key) && !definitionBody(n)) res.errors.push(`Calculated fields of "${n.title}" need an input source (table, view or SQL) — skipped.`);
        continue;
      }
      const ctx = buildFormulaContext(n, g4.nodes, g4.edges);
      const base = n.schema.filter(f => f.name.trim() && !isCalculated(f));
      const all = n.schema
        .filter(f => f.name.trim() && (!isCalculated(f) || isPushableCalculated(f)))
        .map(f => isCalculated(f) ? { ...f, formula: toStoredFormula(f.formula ?? "", ctx, f.name) } : f);
      const put = (fields: SchemaField[]) => api(`/api/data-marts/${owoxId}/schema`, {
        method: "PUT",
        body: JSON.stringify({ schema: { type: schemaDiscriminator(storageType), fields: fields.map(fieldBody) } }),
      });
      try {
        await put(all);
      } catch (e) {
        if (isAuthError(e)) { res.authExpired = true; res.errors.push(SESSION_EXPIRED); break; }
        if (hasCalc) {
          res.calculatedFailed++;
          res.errors.push(`Calculated fields for "${n.title}": ${(e as Error).message}`);
        } else {
          res.errors.push(`Schema for "${n.title}": ${(e as Error).message}`);
        }
        // Best effort: put the real columns back so actualize's extras don't linger.
        await put(base).catch(() => {});
      }
    }
  }

  return res;
}

// Map a node's input source + definition text to OWOX's definition envelope.
// SQL carries a SQL query; TABLE and VIEW both reference an existing object by
// fully-qualified name (OWOX's VIEW input source is a view path, not a query).
// CONNECTOR config can't be synthesized here, so it's skipped. Returns null
// when there's nothing to send.
function definitionBody(n: ModelNode): unknown | null {
  const text = n.definition?.trim();
  if (!text) return null;
  switch (n.inputSource) {
    case "SQL":   return { definitionType: "SQL",   definition: { sqlQuery: text } };
    case "TABLE": return { definitionType: "TABLE", definition: { fullyQualifiedName: text } };
    case "VIEW":  return { definitionType: "VIEW",  definition: { fullyQualifiedName: text } };
    default:      return null; // CONNECTOR / unknown
  }
}

function isCalcField(nodes: ModelNode[], nodeKey: string, fieldName: string): boolean {
  return !!fieldName && !!nodes.find(n => n.key === nodeKey)?.schema.some(f => f.name === fieldName && isCalculated(f));
}

// Add a field to a node's output schema if it isn't there yet (default STRING).
function ensureField(store: ModelStore, nodeKey: string, fieldName: string, type = "STRING") {
  const node = store.get().nodes.find(n => n.key === nodeKey);
  if (!node) return;
  if (node.schema.some(f => f.name === fieldName)) return;
  store.updateNode(nodeKey, { schema: [...node.schema, { name: fieldName, type, pk: false }] });
}

// Coerce a join key's two fields to a common type when they differ (FK type must
// equal the referenced PK type — otherwise OWOX rejects with "Incompatible
// types"). Only acts when exactly one side is a PK; leaves ambiguous cases for
// the user to resolve. Order-independent, so it also repairs a field that was
// created STRING in an earlier session.
function alignJoinKeyTypes(store: ModelStore, fromKey: string, leftName: string, toKey: string, rightName: string) {
  const g = store.get();
  const left = g.nodes.find(n => n.key === fromKey)?.schema.find(f => f.name === leftName);
  const right = g.nodes.find(n => n.key === toKey)?.schema.find(f => f.name === rightName);
  if (!left || !right) return;
  const aligned = alignedJoinTypes(left, right);
  if (!aligned) return;
  if (left.type !== aligned.left) setFieldType(store, fromKey, leftName, aligned.left);
  if (right.type !== aligned.right) setFieldType(store, toKey, rightName, aligned.right);
}

function setFieldType(store: ModelStore, nodeKey: string, fieldName: string, type: string) {
  const node = store.get().nodes.find(n => n.key === nodeKey);
  if (!node) return;
  store.updateNode(nodeKey, { schema: node.schema.map(f => f.name === fieldName ? { ...f, type } : f) });
}
