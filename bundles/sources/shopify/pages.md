---
title: "Pages"
description: |
  One row per static page of the online store: title, handle, body, body summary, publication status and time, template suffix and timestamps.

  Page Metafields point here on the page `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Pages endpoint (`pages`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Page"
    title: "Shopify Admin GraphQL API reference — Page"
---

## Connector endpoint

- **Endpoint:** Shopify · `pages`
- **Default destination table:** `shopify_pages`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the page. |
| `handle` | STRING | Handle | A unique, human-friendly string for the page URL. |
| `body` | STRING | Body | The body content of the page. |
| `bodySummary` | STRING | BodySummary | A summary of the body content. |
| `isPublished` | BOOLEAN | IsPublished | Whether the page is published. |
| `templateSuffix` | STRING | TemplateSuffix | The name of the template the page is using. |
| `publishedAt` | TIMESTAMP | PublishedAt | The date and time when the page was published. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the page was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the page was last updated. |

# Example Questions

- Which pages are unpublished?
- Which pages changed most recently?
- How many pages use a custom template?
