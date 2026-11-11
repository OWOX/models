# Publishing a model to the gallery

Instructions for an AI agent (or a person) adding or updating a bundle in this folder. Everything here is public; follow it before you open a pull request.

The format of a bundle — frontmatter, `# Schema`, `## Joins`, calculated fields — is defined in [`packages/web/public/okf-format.md`](../packages/web/public/okf-format.md). Read it first. This file covers only what the gallery adds on top: where a bundle goes, what it must contain, and how to check it.

## Where a bundle goes

| What the model describes | Folder | Preview drawing |
|---|---|---|
| A business or an industry (e-commerce, SaaS, a clinic network) | `bundles/<slug>/` | `bundles/res/screens/<slug>.svg` |
| What one data source or connector loads (Stripe, Facebook Ads) | `bundles/sources/<slug>/` | `bundles/res/screens/sources/<slug>.svg` |

- `<slug>` is lowercase letters, digits and single hyphens: `google-search-console`.
- One bundle per source or business. If a bundle for it already exists, update that one; do not add a second.
- Add one row for the bundle to [`index.md`](index.md), in the right section (models at the top, data sources under **Data sources**), sorted by folder:
  `` - [Title](./<folder>/index.md) — <number of marts> concept(s) ``
  The canvas Templates gallery lists exactly what this file lists.

## What a bundle contains

- `index.md`: frontmatter `type: "index"`, a `title` and a `description`; a table linking every mart document; `# Example Questions`; an **Explore on canvas** link to `https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/<folder>`; and a `## Model preview` section embedding the drawing with a relative path.
- One document per mart, linked from `index.md`, each with:
  - frontmatter `type: "OWOX Data Mart"`, a `title` and a one-paragraph `description` written for a business user;
  - a `# Schema` table `| Column | Type | Alias | Description |`, where every column has a business-friendly alias and a description, and every primary-key column's description starts with `PK.`;
  - 2 to 3 `# Example Questions` that the mart's own columns can answer;
  - `## Joins` on the source side of each relationship.

Write for the reader of the model, not about how it was made. Do not include credentials, internal URLs, project or account ids, or customer names.

## Join rules

These are the mistakes that break a model after import, in order of how often they happen.

1. **Join on the target's whole key.** An `[N:1]` join must match every primary-key column of the target. If the target is keyed on `account_id` + `id`, join on both: `` `account_id = account_id`, `customer_id = id` ``. A join on part of the key repeats rows as soon as the data holds more than one account, site or company. If the join lands on a different column that is unique on its own, say so in the join's note.
2. **Write a composite key as several backticked pairs**, separated by commas, before the cardinality: `` `site_url = site_url`, `date = date` [N:1] ``.
3. **Keep keys out of the note.** The canvas reads every backticked `a = b` on a join line as a key. In the note after the cardinality, write ``a row whose `status` is Deleted``, not `` `status = Deleted` ``. Keep the note to one short clause: what the join means, not which columns it uses.
4. **Several joins to one target are fine.** For example, a payment can join Accounts once on `bank_account_id` and once on `fee_account_id`. Write one line per join.
5. **No self-joins.** A mart joined to itself (a parent account, a sub-item) draws as a loop and cannot be pushed reliably. Describe the hierarchy in the parent column's description instead.

## Check before the pull request

1. Install and run the gallery check:

   ```bash
   pnpm install
   pnpm --filter @mc/okf test
   ```

   `packages/okf/test/gallery-bundles.test.ts` imports every bundle listed in `index.md` with the canvas's own parser. It fails when:
   - a bundle folder is missing from the root index;
   - a mart document is not linked from its `index.md`;
   - a mart has no primary key;
   - a field type is not canonical;
   - a join key is not a column on either side;
   - a mart joins itself;
   - the preview drawing is missing;
   - the canvas link points at another folder.
2. Review what the test cannot see, against the lists above:
   - every `[N:1]` join covers the target's whole key, or its note says why it doesn't;
   - every column has an alias and a description;
   - the example questions name real columns;
   - nothing private is in the text.
3. Open the bundle in the canvas from your branch, `https://model.owox.com/?okf=https://github.com/<you>/models/tree/<branch>/bundles/<folder>`. Check that every mart and every join is drawn.

## The pull request

- Branch from `main`, one bundle per pull request.
- Title: what the model describes, e.g. `Stripe: 14 tables with keys and joins`.
- Description: the number of marts and joins, where the schema and keys came from, and the result of the checks above.
- After a merge, any page that links the bundle should link `OWOX/models`, not a fork.
