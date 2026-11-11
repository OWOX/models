---
title: "Blogs"
description: |
  One row per blog of the online store: title, handle, template suffix, creation and update times. A blog holds articles.

  Articles point here on `blogId`, and Blog Metafields on the blog `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/blogsFields.js"
    title: "OWOX Data Marts Shopify connector — Blogs endpoint (`blogs`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Blog"
    title: "Shopify Admin GraphQL API reference — Blogs"
---

## Connector endpoint

- **Endpoint:** Shopify · `blogs`
- **Default destination table:** `shopify_blogs`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the blog. |
| `handle` | STRING | Handle | A unique, human-friendly string for the blog URL. |
| `templateSuffix` | STRING | Template Suffix | The name of the template the blog is using. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the blog was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the blog was last updated. |

# Example Questions

- How many blogs does the store have, and when was each last updated?
- Which blogs use a custom template?
- Which blog was created first?
