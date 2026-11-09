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
//   --manifest     instead of --data-marts, for a custom connector that has no FieldsSchema file (QuickBooks): its
//                  manifest JSON, whose `nodes.<endpoint key>.uniqueKeys` give the keys. The Data Source item then has
//                  no repoCommitSha and the bundle carries no pinned connector link.
//   scripts/okf-source/sources/<key>.json   the authored part: descriptions, questions, joins
// (OWOX_COM_DIR and OWOX_DATA_MARTS_DIR work in place of the flags.)
//
// Flags: --check     write nothing, exit 1 if the files on disk differ from what would be written
//        --allow-unpinned  accept a --data-marts checkout that is not at the commit the Data Source item pins
//        --out <dir> bundles root (default: bundles/sources in this repo)
//        --explore-base <url>  where the "Explore on canvas" link points: the GitHub tree URL of the folder that
//                     holds the bundles (default https://github.com/OWOX/models/tree/main/bundles/sources)
import { spawnSync } from 'node:child_process'
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildModel, parseSchemaMd, parseUniqueKeys, renderBundle } from './lib.mjs'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO = resolve(HERE, '../..')

const VALUE_FLAGS = ['--owox-com', '--data-marts', '--manifest', '--out', '--explore-base']
const BOOL_FLAGS = ['--check', '--allow-unpinned']
const opts = {}
const positional = []
const argv = process.argv.slice(2)
for (let i = 0; i < argv.length; i++) {
  const [name, inline] = argv[i].startsWith('--') ? argv[i].split(/=(.*)/s) : [null]
  if (!name) positional.push(argv[i])
  else if (BOOL_FLAGS.includes(name) && inline === undefined) opts[name] = true
  else if (VALUE_FLAGS.includes(name)) {
    const value = inline ?? argv[++i]
    if (value === undefined || value.startsWith('--')) usage(`${name} needs a value.`)
    opts[name] = value
  } else usage(`Unknown option ${argv[i]}.`)
}
function usage(problem) {
  console.error(
    `${problem ? problem + '\n' : ''}Usage: generate.mjs <source-key> --owox-com <dir> (--data-marts <dir> | --manifest <file>) [--check] [--out <dir>] [--explore-base <url>] [--allow-unpinned]\n` +
      '  <source-key> is the folder name under collections/portfolio-management-data-source/ (google-ads).',
  )
  process.exit(2)
}
if (positional.length !== 1) usage(positional.length ? `Expected one source key, got ${positional.join(', ')}.` : '')
const key = positional[0]
// The key becomes a folder name under the bundles root and the stale-file cleanup deletes inside it:
// anything but a plain slug could reach a curated bundle (`../e-commerce`).
if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(key)) usage(`The source key must be lowercase letters, digits and single hyphens (google-ads), not "${key}".`)
const owoxCom = opts['--owox-com'] ?? process.env.OWOX_COM_DIR
const manifestPath = opts['--manifest']
const dataMarts = manifestPath ? undefined : (opts['--data-marts'] ?? process.env.OWOX_DATA_MARTS_DIR)
if (manifestPath && opts['--data-marts']) usage('Pass --data-marts or --manifest, not both: a source is read from one of them.')
const check = opts['--check'] === true
const allowUnpinned = opts['--allow-unpinned'] === true
const exploreBase = (opts['--explore-base'] ?? 'https://github.com/OWOX/models/tree/main/bundles/sources').replace(/\/+$/, '')
const outRoot = resolve(opts['--out'] ?? join(REPO, 'bundles/sources'))

if (!owoxCom || (!dataMarts && !manifestPath)) usage('--owox-com and one of --data-marts or --manifest are needed (OWOX_COM_DIR and OWOX_DATA_MARTS_DIR work in place of the first two).')

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
if (!manifestPath && !item.repoCommitSha) fail(`${key}/item.json has no repoCommitSha to pin the sources to. (A custom connector with a manifest is read with --manifest.)`)
if (manifestPath && (item.repoCommitSha || item.sourceCodeUrl)) fail(`${key}/item.json has a repoCommitSha or sourceCodeUrl, so it is a connector in OWOX/owox-data-marts: read it with --data-marts, not --manifest.`)
if (manifestPath && !item.docsUrl) fail(`${key}/item.json has no docsUrl, which a manifest source needs for its vendor link.`)
const source = manifestPath
  ? { key, name: item.name, sha: null, sourceCodeUrl: null, docsUrl: item.docsUrl }
  : { key, name: item.name, sha: item.repoCommitSha, sourceCodeUrl: item.sourceCodeUrl }

// Endpoint folders are named by slug, with a uuid suffix when two sources share a name
// (campaigns-39111505-...), so they are found by collectionItemUuid, not by name.
const endpointRoot = join(resolve(owoxCom), 'collections/portfolio-management-endpoint')
const folderByUuid = new Map()
for (const d of readdirSync(endpointRoot, { withFileTypes: true })) {
  if (!d.isDirectory()) continue
  const f = join(endpointRoot, d.name, 'item.json')
  if (existsSync(f)) folderByUuid.set(readJson(f).collectionItemUuid, join(endpointRoot, d.name))
}

// 2. uniqueKeys: from the connector's FieldsSchema files at the commit the item pins, or from a custom connector's manifest.
const uniqueKeys = {}
let keysFrom
if (manifestPath) {
  let manifest
  try {
    manifest = readJson(resolve(manifestPath))
  } catch (e) {
    fail(`Cannot read the manifest ${manifestPath}: ${e.message}`)
  }
  if (!manifest.nodes || typeof manifest.nodes !== 'object') fail(`${manifestPath} has no "nodes" object.`)
  for (const [node, def] of Object.entries(manifest.nodes)) {
    if (def.uniqueKeys === undefined) continue
    if (!Array.isArray(def.uniqueKeys) || !def.uniqueKeys.every((k) => typeof k === 'string' && k)) {
      fail(`${manifestPath}: node ${node} has uniqueKeys that are not a list of field names.`)
    }
    uniqueKeys[node] = def.uniqueKeys
  }
  keysFrom = `manifest ${manifest.name} v${manifest.version}`
} else {
  const connectorName = item.sourceCodeUrl.replace(/\/+$/, '').split('/').pop()
  if (!/^[A-Za-z0-9_]+$/.test(connectorName)) fail(`${key}/item.json: sourceCodeUrl does not end in a connector folder name: ${item.sourceCodeUrl}`)
  const connectorDir = join(resolve(dataMarts), 'packages/connectors/src/Sources', connectorName)
  if (!existsSync(connectorDir)) fail(`No ${connectorDir}. Is --data-marts a checkout of OWOX/owox-data-marts?`)
  const head = spawnSync('git', ['-C', resolve(dataMarts), 'rev-parse', 'HEAD'], { encoding: 'utf8' })
  if (head.status === 0) {
    if (head.stdout.trim() !== source.sha && !allowUnpinned) {
      fail(
        `--data-marts is at ${head.stdout.trim().slice(0, 9)}, but ${key}/item.json pins connector commit ${source.sha.slice(0, 9)}: ` +
          'the bundle would say one commit and hold the keys of another. Check out the pinned commit, or pass --allow-unpinned.',
      )
    }
  } else {
    console.warn(`note: --data-marts is not a git checkout, so it cannot be verified to be at connector commit ${source.sha.slice(0, 9)}.`)
  }
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
  for (const f of schemaFiles.sort()) {
    for (const [endpoint, keys] of Object.entries(parseUniqueKeys(readFileSync(f, 'utf8')))) {
      if (endpoint in uniqueKeys) fail(`${relative(connectorDir, f)}: endpoint ${endpoint} declares uniqueKeys twice in ${connectorName}.`)
      uniqueKeys[endpoint] = keys
    }
  }
  keysFrom = `connector commit ${source.sha.slice(0, 9)}`
}

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
if (dirname(dest) !== outRoot) fail(`${dest} is not directly under ${outRoot}.`)
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
    `(${changed.length} changed, ${stale.length} removed; keys from ${keysFrom})`,
)
