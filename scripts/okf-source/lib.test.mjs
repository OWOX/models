import { spawnSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { TYPE_MAP, buildModel, humanize, parseSchemaMd, parseUniqueKeys, pinned, renderBundle, slugify } from './lib.mjs'

const SCHEMA = `| Field | Type | Description |
| --- | --- | --- |
| id | STRING | Campaign ID |
| budget | NUMBER | Budget \\| in micros |
| urls | ARRAY | Final URLs |
`

describe('parseSchemaMd', () => {
  it('maps OBJECT to JSON and DATETIME to DATETIME', () => {
    const t = '| Field | Type | Description |\n| --- | --- | --- |\n| a | OBJECT | x |\n| b | DATETIME | y |\n'
    expect(parseSchemaMd(t).map((r) => r.type)).toEqual(['OBJECT', 'DATETIME'])
    expect(TYPE_MAP.OBJECT).toBe('JSON')
    expect(TYPE_MAP.DATETIME).toBe('DATETIME')
  })
  it('reads rows, keeps an escaped pipe in a description', () => {
    expect(parseSchemaMd(SCHEMA)).toEqual([
      { column: 'id', type: 'STRING', description: 'Campaign ID' },
      { column: 'budget', type: 'NUMBER', description: 'Budget | in micros' },
      { column: 'urls', type: 'ARRAY', description: 'Final URLs' },
    ])
  })
  it('maps OBJECT to JSON', () => {
    expect(parseSchemaMd('| Field | Type | Description |\n| --- | --- | --- |\n| by_geo | OBJECT | x |\n')[0].type).toBe('OBJECT')
    expect(TYPE_MAP.OBJECT).toBe('JSON')
    expect(TYPE_MAP.JSON).toBe('JSON')
  })
  it('refuses a type it cannot map and a repeated field', () => {
    expect(() => parseSchemaMd(SCHEMA.replace('ARRAY', 'DECIMAL128'))).toThrow(/DECIMAL128/)
    expect(() => parseSchemaMd(SCHEMA + '| id | STRING | again |\n')).toThrow(/twice/)
  })
})

describe('parseUniqueKeys', () => {
  it('reads each endpoint block, ignores endpoints without keys', () => {
    const js = `const S = {
  campaigns: {
    fields: campaignFields,
    uniqueKeys: ['campaign_id'],
  },
  geo_stats: {
    uniqueKeys: ['campaign_id', "country_criterion_id", 'date'],
  },
  other: {
    fields: x,
  }
};`
    expect(parseUniqueKeys(js)).toEqual({ campaigns: ['campaign_id'], geo_stats: ['campaign_id', 'country_criterion_id', 'date'] })
  })
  it('reads connectors that quote their endpoint and property names (JSON-style)', () => {
    const js = `var S = {
  "adCampaigns": {
    "fields": adCampaignFields,
    "uniqueKeys": ["id"],
  },
  'adAnalytics': {
    'uniqueKeys': ['dateRangeStart', 'dateRangeEnd', 'pivotValues'],
  },
};`
    expect(parseUniqueKeys(js)).toEqual({ adCampaigns: ['id'], adAnalytics: ['dateRangeStart', 'dateRangeEnd', 'pivotValues'] })
  })
  it('reads keys with - or /, a 4-space indent, and ignores nested objects', () => {
    const js = `var S = {
    "ad-account/adcreatives": {
        "fields": f,
        'uniqueKeys': ["id"],
        "parameters": {
            "level": { "x": 1 },
        },
    },
    "ad-account/insights": {
        "parameters": {
            "a": { "b": 1 },
        },
        "uniqueKeys": ["ad_id", "date_start"],
    },
};`
    expect(parseUniqueKeys(js)).toEqual({ 'ad-account/adcreatives': ['id'], 'ad-account/insights': ['ad_id', 'date_start'] })
  })
  it('reads quoted names and keys, hyphens and slashes in a name', () => {
    const js = `var S = {
  "abandoned-checkouts": {
    "fields": f,
    "uniqueKeys": ["id"],
  },
  'observations/group': {
    uniqueKeys: ["date", "label"],
  },
  'repositoryStats': {
    uniqueKeys: ["date"],
  },
};`
    expect(parseUniqueKeys(js)).toEqual({ 'abandoned-checkouts': ['id'], 'observations/group': ['date', 'label'], repositoryStats: ['date'] })
  })
})

const ep = (name, key, cols, uniqueKeys) => ({
  name, key, destinationTable: `t_${key}`, summary: `${name}.`, timeSeries: false,
  definitionSourceUrl: 'https://github.com/o/r/blob/main/a/b.js#L9', vendorDocsUrl: 'https://example.com/docs/thing',
  rows: cols.map((c) => ({ column: c, type: 'STRING', description: `${c}.` })), uniqueKeys,
})
const base = () => ({
  source: { key: 'x', name: 'X', sha: 'abc', sourceCodeUrl: 'https://github.com/o/r/tree/main/src/X' },
  endpoints: [ep('Parents', 'parents', ['id'], ['id']), ep('Children', 'children', ['id', 'parent_id'], ['id'])],
  authored: {
    vendorName: 'X API', description: 'd', questions: ['a?'],
    endpoints: {
      Parents: { description: 'p', questions: ['q1?', 'q2?'] },
      Children: { description: 'c', questions: ['q1?', 'q2?'] },
    },
    joins: [{ from: 'Children', to: 'Parents', on: [['parent_id', 'id']], cardinality: 'N:1', note: 'The parent.', source: 'https://example.com' }],
  },
})

describe('buildModel, alternateKeys and updated', () => {
  const withAccount = () => {
    const b = base()
    b.endpoints[0] = ep('Parents', 'parents', ['id', 'code'], ['id', 'code'])
    b.endpoints[1] = ep('Children', 'children', ['id', 'code'], ['id'])
    b.authored.joins = [{ from: 'Children', to: 'Parents', on: [['code', 'code']], cardinality: 'N:1', note: 'The parent.', source: 'https://example.com' }]
    return b
  }
  it('refuses an N:1 join on one of two key columns, unless the author names it an alternate key with a source', () => {
    expect(() => buildModel(withAccount())).toThrow(/do not cover Parents's unique keys \(id\)/)
    const b = withAccount()
    b.authored.endpoints.Parents.alternateKeys = [{ columns: ['code'], source: 'https://example.com (code: "The code")' }]
    const doc = renderBundle(buildModel(b), { svgPath: 's.svg', exploreUrl: 'u' })['parents.md']
    expect(doc).toContain('- **Also unique on its own:** `code`')
    b.authored.endpoints.Parents.alternateKeys = [{ columns: ['code'], source: '' }]
    expect(() => buildModel(b)).toThrow(/needs a source/)
    b.authored.endpoints.Parents.alternateKeys = [{ columns: ['nope'], source: 's' }]
    expect(() => buildModel(b)).toThrow(/must list columns this endpoint has/)
  })
  it('shows Last updated in the document and in the index table, and checks the date and commit', () => {
    const b = base()
    const sha = 'a'.repeat(40)
    b.authored.endpoints.Parents.updated = { date: '2026-05-18', commit: sha }
    const files = renderBundle(buildModel(b), { svgPath: 's.svg', exploreUrl: 'u' })
    expect(files['parents.md']).toContain(`- **Last updated:** 2026-05-18 — last change to this endpoint's fields in the connector ([aaaaaaaaa](https://github.com/o/r/commit/${sha}))`)
    expect(files['index.md']).toContain('| Data Mart | Fields | Last updated | Description |')
    expect(files['index.md']).toMatch(/\| \[Parents\]\(\.\/parents\.md\) \| 1 \| 2026-05-18 \|/)
    b.authored.endpoints.Parents.updated = { date: '18 May', commit: 'abc' }
    expect(() => buildModel(b)).toThrow(/updated needs a date/)
  })
})

describe('buildModel, OBJECT and DATETIME columns', () => {
  it('renders them as JSON and DATETIME in the schema table', () => {
    const b = base()
    b.endpoints[1].rows = [
      { column: 'id', type: 'STRING', description: 'id.' },
      { column: 'parent_id', type: 'STRING', description: 'parent.' },
      { column: 'spec', type: 'OBJECT', description: 'spec.' },
      { column: 'created_at', type: 'DATETIME', description: 'created.' },
    ]
    const doc = renderBundle(buildModel(b), { svgPath: '../../res/screens/sources/x.svg', exploreUrl: 'https://model.owox.com/?okf=u' })['children.md']
    expect(doc).toContain('| `spec` | JSON |')
    expect(doc).toContain('| `created_at` | DATETIME |')
  })
})

describe('buildModel', () => {
  it('builds, and renders the join on the child only', () => {
    const files = renderBundle(buildModel(base()), { svgPath: '../../res/screens/sources/x.svg', exploreUrl: 'https://model.owox.com/?okf=u' })
    expect(Object.keys(files).sort()).toEqual(['children.md', 'index.md', 'parents.md'])
    expect(files['children.md']).toContain('- [Parents](./parents.md) — `parent_id = id` [N:1] — The parent.')
    expect(files['parents.md']).not.toContain('## Joins')
    expect(files['children.md']).toContain('| `id` | STRING | ID | PK. id. |')
    expect(files['children.md']).toContain('| `parent_id` | STRING | Parent ID | parent_id. |')
  })
  it('is deterministic', () => {
    const o = { svgPath: 's.svg', exploreUrl: 'u' }
    expect(renderBundle(buildModel(base()), o)).toEqual(renderBundle(buildModel(base()), o))
  })
  it.each([
    ['a join to a field that does not exist', (b) => { b.authored.joins[0].on = [['nope', 'id']] }, /no field nope/],
    ['an N:1 join that misses part of the target key', (b) => { b.endpoints[0].uniqueKeys = ['id', 'other']; b.endpoints[0].rows.push({ column: 'other', type: 'STRING', description: '' }) }, /do not cover Parents's unique keys \(other\)/],
    ['two joins between the same two tables', (b) => { b.authored.joins.push({ ...b.authored.joins[0], on: [['id', 'id']], note: 'Again.' }) }, /merges it with join 1/],
    ['the same two tables joined the other way round', (b) => { b.authored.joins.push({ from: 'Parents', to: 'Children', on: [['id', 'parent_id']], cardinality: '1:N', note: 'Reverse.', source: 'https://example.com' }) }, /merges it with join 1/],
    ['a join with no source', (b) => { delete b.authored.joins[0].source }, /no source/],
    ['an endpoint nobody described', (b) => { delete b.authored.endpoints.Children }, /Children: no entry/],
    ['a connector with no uniqueKeys', (b) => { b.endpoints[0].uniqueKeys = undefined }, /declares no uniqueKeys/],
    ['an authored endpoint the source does not have', (b) => { b.authored.endpoints.Ghost = { description: 'g', questions: ['a', 'b'] } }, /Ghost/],
  ])('refuses %s', (_, mutate, message) => {
    const b = base()
    mutate(b)
    expect(() => buildModel(b)).toThrow(message)
  })
})

describe('the time series line', () => {
  const render = (timeSeries, cols) => {
    const b = base()
    b.endpoints[1].timeSeries = timeSeries
    b.endpoints[1].rows = cols.map((c) => ({ column: c, type: 'STRING', description: '' }))
    b.endpoints[1].uniqueKeys = ['id']
    b.authored.joins = []
    return renderBundle(buildModel(b), { svgPath: 's.svg', exploreUrl: 'u' })['children.md']
  }
  it('says per date only when there is a date column', () => {
    expect(render(true, ['id', 'date'])).toContain('yes, one row per key per `date`')
    expect(render(true, ['id', 'updated_at'])).toContain('**Time series:** yes, loaded by date range')
    expect(render(false, ['id', 'date'])).toContain('no, one current row per key')
  })
})

describe('a custom connector read from a manifest', () => {
  const custom = () => {
    const b = base()
    b.source = { key: 'x', name: 'X', sha: null, sourceCodeUrl: null, docsUrl: 'https://example.com/docs' }
    b.endpoints.forEach((e) => { e.definitionSourceUrl = null })
    return b
  }
  it('renders without a pinned connector link, keeping the vendor links', () => {
    const files = renderBundle(buildModel(custom()), { svgPath: 's.svg', exploreUrl: 'u' })
    expect(files['parents.md']).not.toContain('owox-connector')
    expect(files['parents.md']).toContain('id: "vendor-reference"')
    expect(files['index.md']).not.toContain('owox-connector')
    expect(files['index.md']).toContain('resource: "https://example.com/docs"')
  })
})

describe('helpers', () => {
  it('slugifies the way the canvas does', () => expect(slugify('Ad Group Ads Stats')).toBe('ad-group-ads-stats'))
  it('pins a blob URL to a commit and drops the line anchor', () =>
    expect(pinned('https://github.com/o/r/blob/main/a/b.js#L19', 'abc')).toBe('https://github.com/o/r/blob/abc/a/b.js'))
})

describe('join note guards', () => {
  it('writes the note inline and as a Description line', () => {
    const files = renderBundle(buildModel(base()), { svgPath: 's.svg', exploreUrl: 'u' })
    expect(files['children.md']).toContain('[N:1] — The parent.\n  - Description: The parent.')
  })
  it('refuses a note that the canvas would read as a key pair', () => {
    const b = base()
    b.authored.joins[0].note = 'Use `a = b` here.'
    expect(() => buildModel(b)).toThrow(/no backticked/)
  })
  it('refuses to pin a URL it cannot pin', () => {
    expect(() => pinned('https://example.com/x', 'abc')).toThrow(/Cannot pin/)
  })
})

describe('aliases', () => {
  it('humanises a column name: acronyms in capitals, small words in lower case', () => {
    expect(humanize('ad_group_cpc_bid_micros')).toBe('Ad Group CPC Bid Micros')
    expect(humanize('cost_per_conversion')).toBe('Cost per Conversion')
    expect(humanize('ad_final_urls')).toBe('Ad Final URLs')
    expect(humanize('position_estimates_top_of_page_cpc_micros')).toBe('Position Estimates Top of Page CPC Micros')
  })
  it('writes the Alias column, with endpoint-specific overrides winning over source-wide ones', () => {
    const b = base()
    b.authored.aliases = { parent_id: 'Parent', 'Children.parent_id': 'Parent of the child' }
    const files = renderBundle(buildModel(b), { svgPath: 's.svg', exploreUrl: 'u' })
    expect(files['children.md']).toContain('| Column | Type | Alias | Description |')
    expect(files['children.md']).toContain('| `id` | STRING | ID | PK. id. |')
    expect(files['children.md']).toContain('| `parent_id` | STRING | Parent of the child | parent_id. |')
  })
  it.each([
    ['an override for a field nothing has', (b) => { b.authored.aliases = { nope: 'X' } }, /matches no field/],
    ['an override for an endpoint the source lacks', (b) => { b.authored.aliases = { 'Ghost.id': 'X' } }, /Ghost, which/],
    ['an alias with a pipe', (b) => { b.authored.aliases = { id: 'a|b' } }, /no pipe/],
    ['two fields of one table with the same alias', (b) => { b.authored.aliases = { 'Children.parent_id': 'ID' } }, /same alias "ID"/],
  ])('refuses %s', (_, mutate, message) => {
    const b = base()
    mutate(b)
    expect(() => buildModel(b)).toThrow(message)
  })
})

describe('joins between one pair of tables', () => {
  const twice = (second) => {
    const b = base()
    b.endpoints[0].rows.push({ column: 'other', type: 'STRING', description: '' })
    b.endpoints[0].uniqueKeys = ['id']
    b.endpoints[1].rows.push({ column: 'other_id', type: 'STRING', description: '' })
    b.authored.joins.push({ ...b.authored.joins[0], ...second })
    return b
  }
  it('keeps parallel joins that differ in their keys', () => {
    const model = buildModel(twice({ on: [['other_id', 'id']], note: 'Another route.' }))
    expect(model.docs.find((d) => d.slug === 'children').joins).toHaveLength(2)
  })
  it('refuses the same join twice, whatever the order of its key pairs', () => {
    expect(() => buildModel(twice({ note: 'Again.' }))).toThrow(/repeats join 1/)
  })
  it('refuses a join of a table to itself', () => {
    const b = base()
    b.authored.joins[0] = { ...b.authored.joins[0], to: 'Children', on: [['id', 'id']] }
    expect(() => buildModel(b)).toThrow(/to itself/)
  })
})

describe('the CLI', () => {
  const run = (...args) => spawnSync(process.execPath, [join(dirname(fileURLToPath(import.meta.url)), 'generate.mjs'), ...args], { encoding: 'utf8' })
  it.each(['../e-commerce', 'Google_Ads', 'a/b', '-x'])('refuses the source key %s before touching a folder', (key) => {
    const r = run(key, '--owox-com', '.', '--data-marts', '.')
    expect(r.status).toBe(2)
    expect(r.stderr).toMatch(/source key must be/)
  })
})
