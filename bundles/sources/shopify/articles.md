---
title: "Articles"
description: |
  One row per blog article: title, handle, body, summary, author name, the blog it sits in (`blogId`, `blogTitle`), whether it is published, publication time, tags, template suffix, image URL and timestamps.

  Use it to count content output per blog and author.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/articlesFields.js"
    title: "OWOX Data Marts Shopify connector — Articles endpoint (`articles`)"
    last_modified: 2026-08-07
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Article"
    title: "Shopify Admin GraphQL API reference — Articles"
---

## Connector endpoint

- **Endpoint:** Shopify · `articles`
- **Default destination table:** `shopify_articles`
- **Last updated:** 2026-08-07 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([d5df95935](https://github.com/OWOX/owox-data-marts/commit/d5df95935e329451cbb627615bd723508ab3e339))
- **Shopify Admin GraphQL API version:** 2026-07
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. A globally-unique ID. |
| `title` | STRING | Title | The title of the article. |
| `handle` | STRING | Handle | A unique, human-friendly string for the article URL. |
| `body` | STRING | Body | The text of the article body, complete with HTML markup. |
| `summary` | STRING | Summary | A summary of the article, which can include HTML markup. |
| `authorName` | STRING | Author Name | The name of the author of the article. |
| `blogId` | STRING | Blog ID | The ID of the blog containing the article. FK to [Blogs](./blogs.md) |
| `blogTitle` | STRING | Blog Title | The title of the blog containing the article. |
| `isPublished` | BOOLEAN | Is Published | Whether or not the article is visible. |
| `publishedAt` | TIMESTAMP | Published At | The date and time when the article became or will become visible. |
| `tags` | STRING | Tags | A comma-separated list of tags. |
| `templateSuffix` | STRING | Template Suffix | The name of the template the article is using. |
| `imageUrl` | STRING | Image URL | The URL of the image associated with the article. |
| `createdAt` | TIMESTAMP | Created At | The date and time when the article was created. |
| `updatedAt` | TIMESTAMP | Updated At | The date and time when the article was last updated. |

# Example Questions

- How many articles were published per `blog` and month?
- Which authors wrote the most articles?
- Which articles are still unpublished, and since when?

## Joins

- [Blogs](./blogs.md) — `blogId = id` [N:1] — The blog the article is published in.
