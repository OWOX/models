---
title: "Pages"
description: |
  One row per static page of the online store: title, handle, body, body summary, publication status and time, template suffix and timestamps.

  Page Metafields point here on the page `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/pagesFields.js"
    title: "OWOX Data Marts Shopify connector — Pages endpoint (`pages`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Page"
    title: "Shopify Admin GraphQL API reference — Pages"
---

## Connector endpoint

- **Endpoint:** Shopify · `pages`
- **Default destination table:** `shopify_pages`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the page. |
| `handle` | STRING | Handle | A unique, human-friendly string for the page URL. |
| `body` | STRING | Body | The body content of the page. |
| `bodySummary` | STRING | Body Summary | A summary of the body content. |
| `isPublished` | BOOLEAN | Is Published | Whether the page is published. |
| `templateSuffix` | STRING | Template Suffix | The name of the template the page is using. |
| `publishedAt` | TIMESTAMP | Published At | The date and time when the page was published. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the page was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the page was last updated. |

# Example Questions

- Which pages are unpublished?
- Which pages changed most recently?
- How many pages use a custom template?
