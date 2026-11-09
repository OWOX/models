// Pure functions behind scripts/okf-source/generate.mjs: no file or network
// access here, so the tests can feed them text and compare bytes.
//
// What is generated, and what is authored (see README.md in this folder):
//   generated  schema rows (column, type, description), primary keys, the
//              endpoint facts, the index table, the file layout
//   authored   the model description, each endpoint's description, the
//              example questions, the joins (scripts/okf-source/sources/<key>.json)

/** schema.md types (the owox.com endpoint files) -> the OKF field types the canvas accepts. */
export const TYPE_MAP = {
  STRING: 'STRING',
  INTEGER: 'INTEGER',
  FLOAT: 'FLOAT',
  NUMBER: 'NUMERIC',
  BOOLEAN: 'BOOLEAN',
  DATE: 'DATE',
  TIMESTAMP: 'TIMESTAMP',
  ARRAY: 'JSON',
}

/** The canvas's file name for a mart: title lowercased, runs of other characters -> one hyphen (packages/okf/src/slug.ts). */
export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** Rows of an endpoint `schema.md`: `| Field | Type | Description |` -> [{ column, type, description }]. */
export function parseSchemaMd(text, where = 'schema.md') {
  const lines = text.split('\n').filter((l) => l.trim().startsWith('|'))
  if (lines.length < 3) throw new Error(`${where}: no schema table`)
  const cells = (line) =>
    line
      .trim()
      .replace(/^\|/, '')
      .replace(/(?<!\\)\|$/, '')
      .split(/(?<!\\)\|/)
      .map((c) => c.trim().replace(/\\\|/g, '|'))
  const head = cells(lines[0]).map((c) => c.toLowerCase())
  if (head.join('|') !== 'field|type|description') {
    throw new Error(`${where}: expected the header "Field | Type | Description", found "${head.join(' | ')}"`)
  }
  const rows = lines.slice(2).map((line) => {
    const [column = '', type = '', ...rest] = cells(line)
    return { column: column.replace(/^`|`$/g, ''), type, description: rest.join('|').trim() }
  })
  const seen = new Set()
  for (const r of rows) {
    if (!r.column) throw new Error(`${where}: a row has no field name`)
    if (seen.has(r.column)) throw new Error(`${where}: field ${r.column} appears twice`)
    seen.add(r.column)
    if (!(r.type in TYPE_MAP)) throw new Error(`${where}: field ${r.column} has type ${r.type}, which TYPE_MAP does not know`)
  }
  return rows
}

/**
 * `uniqueKeys` per endpoint out of a connector's `*FieldsSchema.js`.
 * The file is a JS object literal of endpoints, each `  name: { ... uniqueKeys: ['a', 'b'] ... }`;
 * it is read as text because the file refers to field lists defined in sibling files.
 * Returns { endpointKey: ['a', 'b'] }; an endpoint without `uniqueKeys` is absent.
 */
export function parseUniqueKeys(js) {
  const out = {}
  const heads = [...js.matchAll(/^ {2}([A-Za-z_][\w]*):\s*\{/gm)]
  heads.forEach((m, i) => {
    const end = i + 1 < heads.length ? heads[i + 1].index : js.length
    const block = js.slice(m.index, end)
    const keys = block.match(/uniqueKeys:\s*\[([^\]]*)\]/)
    if (keys) out[m[1]] = [...keys[1].matchAll(/['"]([^'"]+)['"]/g)].map((k) => k[1])
  })
  return out
}

/** Words that are written in capitals in a business label. */
export const ACRONYMS = {
  id: 'ID', ids: 'IDs', url: 'URL', urls: 'URLs', cpc: 'CPC', cpm: 'CPM', cpa: 'CPA', cpl: 'CPL', ctr: 'CTR', roas: 'ROAS',
  roi: 'ROI', api: 'API', ip: 'IP', utc: 'UTC', sku: 'SKU', seo: 'SEO', kpi: 'KPI', iso: 'ISO', gdpr: 'GDPR', ga4: 'GA4',
  utm: 'UTM', ui: 'UI', os: 'OS', sms: 'SMS', vat: 'VAT', rss: 'RSS', csv: 'CSV', json: 'JSON',
}

const SMALL = new Set(['of', 'per', 'to', 'in', 'by', 'for', 'and', 'the', 'on', 'at', 'from'])

/** `ad_group_cpc_bid_micros` -> `Ad Group CPC Bid Micros`: the default alias of a column. */
export const humanize = (column) =>
  String(column)
    .split(/[_\s]+/)
    .filter(Boolean)
    .map((w, i) => ACRONYMS[w.toLowerCase()] ?? (i > 0 && SMALL.has(w.toLowerCase()) ? w.toLowerCase() : w[0].toUpperCase() + w.slice(1)))
    .join(' ')

/**
 * The Alias of a column: an authored override (`aliases` in the authored file, `"Endpoint.column"`
 * before `"column"`), else the humanised column name. The endpoint items carry no field titles,
 * and the connector's field `description` is a sentence, not a label.
 */
export const aliasOf = (aliases, endpointName, column) => aliases?.[`${endpointName}.${column}`] ?? aliases?.[column] ?? humanize(column)

const q = (s) => `"${String(s).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`

/** A frontmatter block scalar (`key: |`) holding paragraphs. */
const block = (key, text) =>
  [`${key}: |`, ...String(text).trim().split('\n').map((l) => (l === '' ? '' : `  ${l}`))].join('\n')

const cell = (s) => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ')

/** `https://github.com/.../blob/main/path#L9` -> the same file at a commit, no line anchor (lines move). */
export function pinned(url, sha, kind = 'blob') {
  if (!new RegExp(`/${kind}/[^/]+/`).test(url)) throw new Error(`Cannot pin ${url}: no /${kind}/<ref>/ in it`)
  return url.replace(new RegExp(`/${kind}/[^/]+/`), `/${kind}/${sha}/`).replace(/#L\d+(-L\d+)?$/, '')
}

/**
 * The model, ready to render.
 * source:    { key, name, sha }  (Fibery Data Source item)
 * endpoints: [{ name, key, destinationTable, summary, timeSeries, definitionSourceUrl, vendorDocsUrl, rows, uniqueKeys }]
 * authored:  the sources/<key>.json file
 */
export function buildModel({ source, endpoints, authored }) {
  const byName = new Map(endpoints.map((e) => [e.name, e]))
  const problems = []

  for (const e of endpoints) {
    if (!e.uniqueKeys?.length) problems.push(`${e.name}: the connector declares no uniqueKeys`)
    for (const k of e.uniqueKeys ?? []) {
      if (!e.rows.some((r) => r.column === k)) problems.push(`${e.name}: uniqueKey ${k} is not a field in schema.md`)
    }
    if (!authored.endpoints?.[e.name]) problems.push(`${e.name}: no entry under "endpoints" in the authored file`)
    else {
      const a = authored.endpoints[e.name]
      if (!a.description?.trim()) problems.push(`${e.name}: no authored description`)
      if (!Array.isArray(a.questions) || a.questions.length < 2 || a.questions.length > 3)
        problems.push(`${e.name}: needs 2 or 3 example questions`)
    }
  }
  for (const [k, v] of Object.entries(authored.aliases ?? {})) {
    const [endpoint, column] = k.includes('.') ? [k.slice(0, k.indexOf('.')), k.slice(k.indexOf('.') + 1)] : [null, k]
    const scope = endpoint ? endpoints.filter((e) => e.name === endpoint) : endpoints
    if (endpoint && !scope.length) problems.push(`aliases: "${k}" names endpoint ${endpoint}, which the Data Source does not have`)
    else if (!scope.some((e) => e.rows.some((r) => r.column === column))) problems.push(`aliases: "${k}" matches no field`)
    if (typeof v !== 'string' || !v.trim() || /[|\n]/.test(v)) problems.push(`aliases: "${k}" must be one line of text with no pipe`)
  }
  for (const e of endpoints) {
    const seen = new Map()
    for (const r of e.rows) {
      const a = aliasOf(authored.aliases, e.name, r.column)
      if (seen.has(a)) problems.push(`${e.name}: fields ${seen.get(a)} and ${r.column} get the same alias "${a}"; override one under "aliases"`)
      else seen.set(a, r.column)
    }
  }
  for (const name of Object.keys(authored.endpoints ?? {})) {
    if (!byName.has(name)) problems.push(`authored file names endpoint "${name}", which the Data Source does not have`)
  }

  const joins = (authored.joins ?? []).map((j, i) => ({ ...j, n: i + 1 }))
  const slugs = new Set()
  for (const e of endpoints) {
    const s = slugify(e.name)
    if (slugs.has(s)) problems.push(`${e.name}: two endpoints share the file name ${s}.md`)
    slugs.add(s)
  }
  // Parallel joins between one pair of marts are fine (the canvas keeps them as separate edges, OWOX/models#131);
  // only the same join written twice is refused.
  const written = new Map()
  for (const j of joins) {
    const id = `${j.from}\u0000${j.to}\u0000${(j.on ?? []).map(([l, r]) => `${l}=${r}`).sort().join(',')}`
    if (written.has(id)) problems.push(`join ${j.n} (${j.from} -> ${j.to}) repeats join ${written.get(id)}: same tables, same keys`)
    else written.set(id, j.n)
  }
  for (const j of joins) {
    const label = `join ${j.n} (${j.from} -> ${j.to})`
    const from = byName.get(j.from)
    const to = byName.get(j.to)
    if (!from) problems.push(`${label}: unknown endpoint ${j.from}`)
    if (!to) problems.push(`${label}: unknown endpoint ${j.to}`)
    if (j.from === j.to) problems.push(`${label}: joins an endpoint to itself`)
    if (!Array.isArray(j.on) || !j.on.length) problems.push(`${label}: no key pairs`)
    if (!/^(1|N):(1|N)$/.test(j.cardinality ?? '')) problems.push(`${label}: cardinality must be 1:1, 1:N, N:1 or N:N`)
    if (!j.source) problems.push(`${label}: no source (the vendor doc that confirms it)`)
    if (!j.note?.trim()) problems.push(`${label}: no note`)
    // The canvas reads every `a = b` in backticks on the join line as a key pair.
    else if (/\n/.test(j.note) || /`[^`]*=[^`]*`/.test(j.note)) problems.push(`${label}: the note must be one line with no backticked \`a = b\``)
    if (from && to) {
      for (const [l, r] of j.on ?? []) {
        if (!from.rows.some((x) => x.column === l)) problems.push(`${label}: ${j.from} has no field ${l}`)
        if (!to.rows.some((x) => x.column === r)) problems.push(`${label}: ${j.to} has no field ${r}`)
      }
      // An N:1 join must land on the target's whole primary key, or it fans out.
      if (j.cardinality === 'N:1') {
        const hit = new Set((j.on ?? []).map(([, r]) => r))
        const missing = (to.uniqueKeys ?? []).filter((k) => !hit.has(k))
        if (missing.length) problems.push(`${label}: N:1 but the key pairs do not cover ${j.to}'s unique keys (${missing.join(', ')})`)
      }
    }
  }
  if (problems.length) throw new Error(`The ${source.key} bundle cannot be built:\n  - ${problems.join('\n  - ')}`)

  const docs = [...endpoints]
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((e) => ({ endpoint: e, slug: slugify(e.name), authored: authored.endpoints[e.name], joins: joins.filter((j) => j.from === e.name) }))
  return { source, authored, docs, joins }
}

/* The note is written twice on purpose. Inline after the keys is where the owox.com
 * site reads a join's note (scripts/model-svg/okf.mjs); the indented `- Description:`
 * line is the only place the canvas and OWOX read it from (packages/okf/src/parse.ts). */
const joinLines = (j) => {
  const keys = j.on.map(([l, r]) => `\`${l} = ${r}\``).join(', ')
  const note = j.note.trim()
  return [`- [${j.to}](./${slugify(j.to)}.md) — ${keys} [${j.cardinality}] — ${note}`, `  - Description: ${note}`]
}

/** One endpoint document. */
export function renderMart(model, doc) {
  const { source, authored } = model
  const { endpoint: e } = doc
  const pk = new Set(e.uniqueKeys)
  const vendorTail = e.vendorDocsUrl.split('/').filter(Boolean).pop()
  const out = []
  out.push('---')
  out.push(`title: ${q(e.name)}`)
  out.push(block('description', doc.authored.description))
  out.push(`tags: ["owox", "connector", ${q(source.key)}]`)
  out.push('type: "OWOX Data Mart"')
  out.push('sources:')
  out.push('  - id: "owox-connector"')
  out.push(`    resource: ${q(pinned(e.definitionSourceUrl, source.sha))}`)
  out.push(`    title: ${q(`OWOX Data Marts ${source.name} connector — ${e.name} endpoint (\`${e.key}\`)`)}`)
  out.push('  - id: "vendor-reference"')
  out.push(`    resource: ${q(e.vendorDocsUrl)}`)
  out.push(`    title: ${q(`${authored.vendorName} reference — ${vendorTail}`)}`)
  out.push('---')
  out.push('')
  out.push('## Connector endpoint')
  out.push('')
  out.push(`- **Endpoint:** ${source.name} · \`${e.key}\``)
  out.push(`- **Default destination table:** \`${e.destinationTable}\``)
  out.push(`- **Unique keys:** ${e.uniqueKeys.map((k) => `\`${k}\``).join(', ')}`)
  out.push(`- **Time series:** ${e.timeSeries ? 'yes, one row per key per `date`' : 'no, one current row per key'}`)
  out.push('')
  out.push('# Schema')
  out.push('')
  out.push('| Column | Type | Alias | Description |')
  out.push('|--------|------|-------|-------------|')
  for (const r of e.rows) {
    const d = r.description ? cell(r.description) : ''
    out.push(`| \`${r.column}\` | ${TYPE_MAP[r.type]} | ${aliasOf(authored.aliases, e.name, r.column)} | ${pk.has(r.column) ? `PK. ${d}`.trim() : d} |`)
  }
  out.push('')
  out.push('# Example Questions')
  out.push('')
  for (const s of doc.authored.questions) out.push(`- ${s.trim()}`)
  if (doc.joins.length) {
    out.push('')
    out.push('## Joins')
    out.push('')
    for (const j of doc.joins) out.push(...joinLines(j))
  }
  return out.join('\n') + '\n'
}

/** The bundle's index.md. `svgPath` is the preview drawing, relative to the bundle folder. */
export function renderIndex(model, { svgPath, exploreUrl }) {
  const { source, authored, docs, joins } = model
  const fields = docs.reduce((n, d) => n + d.endpoint.rows.length, 0)
  const out = []
  out.push('---')
  out.push(`title: ${q(source.name)}`)
  out.push(block('description', authored.description))
  out.push(`tags: ["owox", "index", "connector", ${q(source.key)}]`)
  out.push('type: "index"')
  out.push('sources:')
  out.push('  - id: "owox-connector"')
  out.push(`    resource: ${q(pinned(source.sourceCodeUrl, source.sha, 'tree'))}`)
  out.push(`    title: ${q(`OWOX Data Marts — ${source.name} connector source`)}`)
  out.push('---')
  out.push('')
  out.push(`${docs.length} tables, ${fields} fields, ${joins.length} joins.`)
  out.push('')
  out.push('| Data Mart | Fields | Description |')
  out.push('|-----------|--------|-------------|')
  for (const d of docs) {
    out.push(`| [${d.endpoint.name}](./${d.slug}.md) | ${d.endpoint.rows.length} | ${cell(d.endpoint.summary)} |`)
  }
  out.push('')
  out.push('# Example Questions')
  out.push('')
  for (const s of authored.questions) out.push(`- ${s.trim()}`)
  out.push('')
  out.push('# Explore this model')
  out.push('')
  out.push(`**[▶ Explore on canvas](${exploreUrl})**`)
  out.push('')
  out.push('One click opens this model in a free OWOX canvas you can poke around in — no account needed.')
  out.push('')
  out.push('## Model preview')
  out.push('')
  out.push(`![${source.name} model diagram](${svgPath})`)
  return out.join('\n') + '\n'
}

/** { 'index.md': text, '<slug>.md': text, ... } */
export function renderBundle(model, opts) {
  const files = { 'index.md': renderIndex(model, opts) }
  for (const d of model.docs) files[`${d.slug}.md`] = renderMart(model, d)
  return files
}
