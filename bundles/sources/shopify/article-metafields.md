---
title: "Article Metafields"
description: |
  One row per metafield attached to articles: namespace, key, value, type, and the owner (`ownerId`, `ownerType`) with creation and update times. A metafield is a custom field a merchant or app adds to a Shopify resource; its value is stored as text whatever its type.

  `ownerId` is the `id` of the row in Articles that the metafield belongs to. The connector reads the first 250 metafields per owner.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/metafieldsFields.js"
    title: "OWOX Data Marts Shopify connector — Article Metafields endpoint (`metafield-articles`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Metafield"
    title: "Shopify Admin GraphQL API reference — Article Metafields"
---

## Connector endpoint

- **Endpoint:** Shopify · `metafield-articles`
- **Default destination table:** `shopify_metafield_articles`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `namespace` | STRING | Namespace | The namespace of the metafield. |
| `key` | STRING | Key | The key of the metafield. |
| `value` | STRING | Value | The value of the metafield. |
| `type` | STRING | Type | The type of the metafield. |
| `ownerId` | STRING | Owner ID | The ID of the owner resource. FK to [Articles](./articles.md) |
| `ownerType` | STRING | Owner Type | The type of the owner resource. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the metafield was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the metafield was last updated. |

# Example Questions

- Which metafield namespaces and keys exist on `articles`, and how many rows does each have?
- Which `articles` have a given metafield set, and to what value?

## Joins

- [Articles](./articles.md) — `ownerId = id` [N:1] — The article the metafield is attached to.
  - [Article's Blog](./blogs.md) — The blog the metafield's article is published in.
