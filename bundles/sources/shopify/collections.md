---
title: "Collections"
description: |
  One row per collection: title, handle, description, sort order, template suffix, number of products, image URL and last update. Which products belong to a collection is not a column here, so this table describes collections but does not list their members.

  Collection Metafields point here on the collection `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/collectionsFields.js"
    title: "OWOX Data Marts Shopify connector — Collections endpoint (`collections`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Collection"
    title: "Shopify Admin GraphQL API reference — Collections"
---

## Connector endpoint

- **Endpoint:** Shopify · `collections`
- **Default destination table:** `shopify_collections`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the collection. |
| `handle` | STRING | Handle | A unique, human-friendly string for the collection URL. |
| `description` | STRING | Description | The description of the collection, including any HTML tags and formatting. |
| `descriptionHtml` | STRING | Description HTML | The description of the collection in HTML format. |
| `sortOrder` | STRING | Sort Order | The order in which the products in the collection are displayed. |
| `templateSuffix` | STRING | Template Suffix | The name of the template the collection is using. |
| `productsCount` | INTEGER | Products Count | The number of products in the collection. |
| `imageUrl` | STRING | Image URL | The URL of the image associated with the collection. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the collection was last updated. |

# Example Questions

- Which collections hold the most `products`?
- Which collections were updated most recently?
- How are collections sorted, and how many use each sort `order`?
