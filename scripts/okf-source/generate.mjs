#!/usr/bin/env node
// Writes a data source's OKF bundle: bundles/sources/<source-key>/.
//
//   node scripts/okf-source/generate.mjs google-ads \
//     --owox-com ../owox.com --data-marts ../owox-data-marts
//   (or: pnpm okf:source google-ads --owox-com ... --data-marts ...)
//
// Inputs, all read from disk and never fetched, so the same checkouts give the
// same bytes:
//   --owox-com     a checkout of OWOX/owox.com: collections/portfolio-management-data-source/<key>/item.json,
//                  the endpoint folders it lists under collections/portfolio-management-endpoint/ (item.json, schema.md)
//   --data-marts   a checkout of OWOX/owox-data-marts: packages/connectors/src/Sources/<Source>/**/*FieldsSchema.js (uniqueKeys)
//   scripts/okf-source/sources/<key>.json   the authored part: descriptions, questions, joins
// (OWOX_COM_DIR and OWOX_DATA_MARTS_DIR work in place of the flags.)
//
// Flags: --check     write nothing, exit 1 if the files on disk differ from what would be written
//        --out <dir> bundles root (default: bundles/sources in this repo)
//        --explore-base <url>  where the "Explore on canvas" link points: the GitHub tree URL of the folder that
//                     holds the bundles (default https://github.com/OWOX/models/tree/main/bundles/sources)
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildModel, parseSchemaMd, parseUniqueKeys, renderBundle } from './lib.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '../..')

const args = process.argv.slice(2)
const flag = (name) => {
  const i = args.indexOf(name)
  return i < 0 ? undefined : args[i + 1]
}
const key = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--') && args[i - 1] !== '--check'))
const owoxCom = flag('--owox-com') ?? process.env.OWOX_COM_DIR
const dataMarts = flag('--data-marts') ?? process.env.OWOX_DATA_MARTS_DIR
const check = args.includes('--check')
const exploreBase = (flag('--explore-base') ?? 'https://github.com/OWOX/models/tree/main/bundles/sources').replace(/\/+$/, '')
const outRoot = resolve(flag('--out') ?? join(REPO, 'bundles/sources'))

if (!key || !owoxCom || !dataMarts) {
  console.error(
    'Usage: generate.mjs <source-key> --owox-com <dir> --data-marts <dir> [--check] [--out <dir>]\n' +
      '  <source-key> is the folder name under collections/portfolio-management-data-source/ (google-ads).',
  )
  process.exit(2)
}

const readJson = (p) => JSON.parse(readFileSync(p, 'utf8'))
const fail = (msg) => {
  console.error(msg)
  process.exit(1)
}

// 1. The Data Source item and its endpoints.
const sourceDir = join(resolve(owoxCom), 'collections/portfolio-management-data-source', key)
if (!existsSync(join(sourceDir, 'item.json'))) fail(`No ${join(sourceDir, 'item.json')}. Is --owox-com a checkout of OWOX/owox.com?`)
const item = readJson(join(sourceDir, 'item.json'))
if (item.status !== 'Active') fail(`${key} is ${item.status}, not Active.`)
if (!item.endpoints?.length) fail(`${key} has no endpoints, so there is no bundle to write.`)
if (!item.repoCommitSha) fail(`${key}/item.json has no repoCommitSha to pin the sources to.`)
const source = { key, name: item.name, sha: item.repoCommitSha, sourceCodeUrl: item.sourceCodeUrl }

// Endpoint folders are named by slug, with a uuid suffix when two sources share a name
// (campaigns-39111505-...), so they are found by collectionItemUuid, not by name.
const endpointRoot = join(resolve(owoxCom), 'collections/portfolio-management-endpoint')
const folderByUuid = new Map()
for (const d of readdirSync(endpointRoot, { withFileTypes: true })) {
  if (!d.isDirectory()) continue
  const f = join(endpointRoot, d.name, 'item.json')
  if (existsSync(f)) folderByUuid.set(readJson(f).collectionItemUuid, join(endpointRoot, d.name))
}

// 2. uniqueKeys from the connector.
const connectorDir = join(resolve(dataMarts), 'packages/connectors/src/Sources', item.sourceCodeUrl.split('/').pop())
if (!existsSync(connectorDir)) fail(`No ${connectorDir}. Is --data-marts a checkout of OWOX/owox-data-marts?`)
const schemaFiles = []
const walk = (dir) => {
  for (const d of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, d.name)
    if (d.isDirectory()) walk(p)
    else if (/FieldsSchema\.js$/.test(d.name)) schemaFiles.push(p)
  }
}
walk(connectorDir)
if (!schemaFiles.length) fail(`No *FieldsSchema.js under ${connectorDir}.`)
const uniqueKeys = {}
for (const f of schemaFiles.sort()) Object.assign(uniqueKeys, parseUniqueKeys(readFileSync(f, 'utf8')))

const endpoints = item.endpoints.map((uuid) => {
  const dir = folderByUuid.get(uuid)
  if (!dir) fail(`Endpoint ${uuid} (listed by ${key}/item.json) has no folder under ${endpointRoot}.`)
  const e = readJson(join(dir, 'item.json'))
  if (e.status !== 'Active') fail(`${key}: endpoint ${e.name} is ${e.status}.`)
  return {
    name: e.name,
    key: e.key,
    destinationTable: e.destinationTable,
    summary: e.summary,
    timeSeries: String(e.timeSeries).toLowerCase() === 'true',
    definitionSourceUrl: e.definitionSourceUrl,
    vendorDocsUrl: e.vendorDocsUrl,
    rows: parseSchemaMd(readFileSync(join(dir, 'schema.md'), 'utf8'), relative(resolve(owoxCom), join(dir, 'schema.md'))),
    uniqueKeys: uniqueKeys[e.key],
  }
})

// 3. The authored part.
const authoredPath = join(HERE, 'sources', `${key}.json`)
if (!existsSync(authoredPath)) fail(`No authored file ${relative(REPO, authoredPath)}: descriptions, questions and joins are written by hand.`)
const authored = readJson(authoredPath)

let files
try {
  const model = buildModel({ source, endpoints, authored })
  files = renderBundle(model, {
    svgPath: `../../res/screens/sources/${key}.svg`,
    exploreUrl: `https://model.owox.com/?okf=${exploreBase}/${key}`,
  })
} catch (e) {
  fail(e.message)
}

// 4. Write, or compare.
const dest = join(outRoot, key)
const existing = existsSync(dest) ? readdirSync(dest).filter((n) => n.endsWith('.md')) : []
const stale = existing.filter((n) => !(n in files))
const changed = Object.entries(files).filter(([n, text]) => !existsSync(join(dest, n)) || readFileSync(join(dest, n), 'utf8') !== text)

if (check) {
  if (changed.length || stale.length) {
    console.error(`${relative(REPO, dest)} is out of date: ${[...changed.map(([n]) => n), ...stale.map((n) => `${n} (stale)`)].join(', ')}`)
    process.exit(1)
  }
  console.log(`${relative(REPO, dest)} is up to date (${Object.keys(files).length} files).`)
  process.exit(0)
}
mkdirSync(dest, { recursive: true })
for (const n of stale) rmSync(join(dest, n))
for (const [n, text] of Object.entries(files)) writeFileSync(join(dest, n), text)
const fields = endpoints.reduce((n, e) => n + e.rows.length, 0)
console.log(
  `wrote ${relative(REPO, dest)}: ${Object.keys(files).length} files, ${endpoints.length} tables, ${fields} fields, ${authored.joins.length} joins ` +
    `(${changed.length} changed, ${stale.length} removed; pinned to connector commit ${source.sha.slice(0, 9)})`,
)
