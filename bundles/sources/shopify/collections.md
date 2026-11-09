---
title: "Collections"
description: |
  One row per collection: title, handle, description, sort order, template suffix, number of products, image URL and last update. Which products belong to a collection is not a column here, so this table describes collections but does not list their members.

  Collection Metafields point here on the collection `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Collections endpoint (`collections`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Collection"
    title: "Shopify Admin GraphQL API reference — Collection"
---

## Connector endpoint

- **Endpoint:** Shopify · `collections`
- **Default destination table:** `shopify_collections`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the collection. |
| `handle` | STRING | Handle | A unique, human-friendly string for the collection URL. |
| `description` | STRING | Description | The description of the collection, including any HTML tags and formatting. |
| `descriptionHtml` | STRING | DescriptionHtml | The description of the collection in HTML format. |
| `sortOrder` | STRING | SortOrder | The order in which the products in the collection are displayed. |
| `templateSuffix` | STRING | TemplateSuffix | The name of the template the collection is using. |
| `productsCount` | INTEGER | ProductsCount | The number of products in the collection. |
| `imageUrl` | STRING | ImageUrl | The URL of the image associated with the collection. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the collection was last updated. |

# Example Questions

- Which collections hold the most products?
- Which collections were updated most recently?
- How are collections sorted, and how many use each sort order?
