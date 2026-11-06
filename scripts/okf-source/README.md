# Source bundles: `scripts/okf-source`

Writes the OKF data-model bundle of a data source (`bundles/sources/<source-key>/`): what an
OWOX Data Marts connector loads, as one Markdown document per endpoint, drawn and importable
like any other bundle here.

```bash
pnpm okf:source google-ads --owox-com ../owox.com --data-marts ../owox-data-marts
pnpm okf:source google-ads --owox-com ../owox.com --data-marts ../owox-data-marts --check   # write nothing; exit 1 if the files differ
pnpm okf:source quickbooks --owox-com ../owox.com --manifest quickbooks-manifest.json         # a custom connector: keys from its manifest
```

`--data-marts` must be a git checkout at the commit the Data Source item pins (`repoCommitSha`); the
generator refuses any other (`--allow-unpinned` overrides), because every source link in the bundle
says that commit. A folder that is not a git checkout is accepted with a warning.

Same inputs, same bytes: nothing is fetched, dated or timestamped. Stale `.md` files in the
bundle folder (an endpoint that no longer exists) are removed.

## Inputs

| Input | Where | What it gives |
|---|---|---|
| Data Source item | `--owox-com`: `collections/portfolio-management-data-source/<key>/item.json` | the name, its endpoints, `repoCommitSha` (every source link in the bundle is pinned to it) |
| Endpoints | `--owox-com`: `collections/portfolio-management-endpoint/<folder>/item.json` + `schema.md` | the schema rows (field, type, description), `summary`, destination table, time series flag, vendor docs URL |
| Unique keys | `--data-marts`: `packages/connectors/src/Sources/<Source>/**/*FieldsSchema.js` | each endpoint's `uniqueKeys`, written as the `PK.` rows |
| Unique keys, custom connector | `--manifest <file>` in place of `--data-marts`: the connector manifest's `nodes.<endpoint key>.uniqueKeys` | the same keys for a source with no FieldsSchema file (QuickBooks). Its Data Source item has no `repoCommitSha`, so the bundle carries no pinned connector link, only the vendor's |
| Authored file | `scripts/okf-source/sources/<key>.json` | the model description, each endpoint's description and 2 to 3 example questions, the joins |

## Generated, and authored

**Generated, never typed:** the `# Schema` rows and their types (`NUMBER` -> `NUMERIC`,
`ARRAY` and `OBJECT` -> `JSON`, `DATETIME` stays `DATETIME`, see `TYPE_MAP`; Meta and X datetimes carry a time-zone offset, which the connector's own type does not say, so the bundle keeps the connector's type), the primary keys, the endpoint facts, the index table,
the file names.

**Authored, by hand:** descriptions, questions and joins. The generator refuses to build when
an authored join names a field the schemas do not have, when an N:1 join does not cover the
target's whole unique key, when a join has no `source`, or when an endpoint has no description
or questions. The note of a join is written twice (inline, where the owox.com site reads it, and as the indented
`- Description:` line, the only place the canvas and OWOX read it) and may not contain a backticked
`a = b`. A join's `source` is the vendor documentation that confirms it; a join is proposed
by matching field names across the endpoints and then checked against that documentation.

## Preview drawing

`index.md` embeds `bundles/res/screens/sources/<key>.svg`, the drawing sites mirror. It is made
by `scripts/model-svg/generate.mjs` in OWOX/owox.com from the bundle's GitHub URL, so it is
produced after the bundle is pushed:

```bash
node scripts/model-svg/generate.mjs https://github.com/OWOX/models/tree/main/bundles/sources/google-ads --out <dir> --name google-ads
```

## Checks

`pnpm test:scripts` (the generator's own tests) and `pnpm --filter @mc/okf test`, whose
`source-bundles.test.ts` imports every `bundles/sources/*` folder with the canvas's own
`parseBundle` and checks the index links, one document per mart, a primary key on every mart,
canonical field types, joins that resolve to real fields, and the preview drawing.
