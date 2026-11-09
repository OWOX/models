---
title: "Products"
description: |
  One row per product in the catalog: title, handle, vendor, product type, status, tags, total inventory, number of variants, the lowest and highest variant price, SEO title and description, and publication and update times. Prices live on the variants; this table holds the range.

  Product Variants and Product Metafields point here on the product `id`.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Products endpoint (`products`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Product"
    title: "Shopify Admin GraphQL API reference — Product"
---

## Connector endpoint

- **Endpoint:** Shopify · `products`
- **Default destination table:** `shopify_products`
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the product. |
| `handle` | STRING | Handle | A unique, human-friendly string for the product URL. |
| `description` | STRING | Description | The description of the product. |
| `descriptionHtml` | STRING | DescriptionHtml | The description of the product in HTML format. |
| `vendor` | STRING | Vendor | The name of the product vendor. |
| `productType` | STRING | ProductType | The product type. |
| `status` | STRING | Status | The status of the product. |
| `tags` | STRING | Tags | A comma-separated list of tags. |
| `templateSuffix` | STRING | TemplateSuffix | The name of the template the product is using. |
| `totalInventory` | INTEGER | TotalInventory | The total inventory across all variants. |
| `variantsCount` | INTEGER | VariantsCount | The number of variants. |
| `featuredImageUrl` | STRING | FeaturedImageUrl | The URL of the featured image. |
| `priceRangeMinAmount` | NUMERIC | PriceRangeMinAmount | The minimum price of the product. |
| `priceRangeMaxAmount` | NUMERIC | PriceRangeMaxAmount | The maximum price of the product. |
| `seoTitle` | STRING | SeoTitle | The SEO title. |
| `seoDescription` | STRING | SeoDescription | The SEO description. |
| `onlineStoreUrl` | STRING | OnlineStoreUrl | The URL of the product on the online store. |
| `publishedAt` | TIMESTAMP | PublishedAt | The date and time when the product was published. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the product was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the product was last updated. |

# Example Questions

- Which vendors and product types have the most active products?
- Which active products have no inventory left?
- How many products were published each month, and which are still drafts?
