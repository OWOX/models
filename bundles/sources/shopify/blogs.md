---
title: "Blogs"
description: |
  One row per blog of the online store: title, handle, template suffix, creation and update times. A blog holds articles.

  Articles point here on `blogId`, and Blog Metafields on the blog `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Blogs endpoint (`blogs`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Blog"
    title: "Shopify Admin GraphQL API reference — Blog"
---

## Connector endpoint

- **Endpoint:** Shopify · `blogs`
- **Default destination table:** `shopify_blogs`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. A globally-unique ID. |
| `title` | STRING | The title of the blog. |
| `handle` | STRING | A unique, human-friendly string for the blog URL. |
| `templateSuffix` | STRING | The name of the template the blog is using. |
| `createdAt` | TIMESTAMP | The date and time when the blog was created. |
| `updatedAt` | TIMESTAMP | The date and time when the blog was last updated. |

# Example Questions

- How many blogs does the store have, and when was each last updated?
- Which blogs use a custom template?
- Which blog was created first?
