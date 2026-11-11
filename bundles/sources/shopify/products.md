---
title: "Products"
description: |
  One row per product in the catalog: title, handle, vendor, product type, status, tags, total inventory, number of variants, the lowest and highest variant price, SEO title and description, and publication and update times. Prices live on the variants; this table holds the range.

  Product Variants and Product Metafields point here on the product `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/productsFields.js"
    title: "OWOX Data Marts Shopify connector — Products endpoint (`products`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Product"
    title: "Shopify Admin GraphQL API reference — Products"
---

## Connector endpoint

- **Endpoint:** Shopify · `products`
- **Default destination table:** `shopify_products`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the product. |
| `handle` | STRING | Handle | A unique, human-friendly string for the product URL. |
| `description` | STRING | Description | The description of the product. |
| `descriptionHtml` | STRING | Description HTML | The description of the product in HTML format. |
| `vendor` | STRING | Vendor | The name of the product vendor. |
| `productType` | STRING | Product Type | The product type the merchant defines for the product, used to group and filter products. |
| `status` | STRING | Status | The product status, which controls its visibility across all sales channels: `ACTIVE`, `ARCHIVED`, `DRAFT` or `UNLISTED`. |
| `tags` | STRING | Tags | A comma-separated list of tags. |
| `templateSuffix` | STRING | Template Suffix | The name of the template the product is using. |
| `totalInventory` | INTEGER | Total Inventory | The total inventory across all variants. |
| `variantsCount` | INTEGER | Variants Count | The number of variants. |
| `featuredImageUrl` | STRING | Featured Image URL | The URL of the featured image. |
| `priceRangeMinAmount` | FLOAT | Price Range Min Amount | The lowest price among the product's variants. |
| `priceRangeMaxAmount` | FLOAT | Price Range Max Amount | The highest price among the product's variants. |
| `seoTitle` | STRING | SEO Title | The page title the merchant set for search engine results (Shopify `seo.title`). |
| `seoDescription` | STRING | SEO Description | The meta description the merchant set for search engine results (Shopify `seo.description`). |
| `onlineStoreUrl` | STRING | Online Store URL | The URL of the product on the online store. |
| `publishedAt` | TIMESTAMP | Published At | The date and time when the product was published. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the product was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the product was last updated. |

# Example Questions

- Which vendors and product types have the most active products?
- Which active products have no inventory left?
- How many products were published each month, and which are still drafts?
