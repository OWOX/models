---
title: "Articles"
description: |
  One row per blog article: title, handle, body, summary, author name, the blog it sits in (`blogId`, `blogTitle`), whether it is published, publication time, tags, template suffix, image URL and timestamps.

  Use it to count content output per blog and author.
tags: ["owox", "connector", "shopify"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/Shopify/ShopifyAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Shopify connector — Articles endpoint (`articles`)"
  - id: "vendor-reference"
    resource: "https://shopify.dev/docs/api/admin-graphql/2026-07/objects/Article"
    title: "Shopify Admin GraphQL API reference — Article"
---

## Connector endpoint

- **Endpoint:** Shopify · `articles`
- **Default destination table:** `shopify_articles`
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
| `authorName` | STRING | AuthorName | The name of the author of the article. |
| `blogId` | STRING | BlogId | The ID of the blog containing the article. |
| `blogTitle` | STRING | BlogTitle | The title of the blog containing the article. |
| `isPublished` | BOOLEAN | IsPublished | Whether or not the article is visible. |
| `publishedAt` | TIMESTAMP | PublishedAt | The date and time when the article became or will become visible. |
| `tags` | STRING | Tags | A comma-separated list of tags. |
| `templateSuffix` | STRING | TemplateSuffix | The name of the template the article is using. |
| `imageUrl` | STRING | ImageUrl | The URL of the image associated with the article. |
| `createdAt` | TIMESTAMP | CreatedAt | The date and time when the article was created. |
| `updatedAt` | TIMESTAMP | UpdatedAt | The date and time when the article was last updated. |

# Example Questions

- How many articles were published per blog and month?
- Which authors wrote the most articles?
- Which articles are still unpublished, and since when?

## Joins

- [Blogs](./blogs.md) — `blogId = id` [N:1] — The blog the article is published in.
  - Description: The blog the article is published in.
