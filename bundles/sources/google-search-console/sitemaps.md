---
title: "Sitemaps"
description: |
  Sitemaps submitted for the property: last submitted and last downloaded times, pending state, type, and Google's counts of warnings and errors, with per-content-type submitted and indexed counts as JSON. One row per sitemap, current state.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/sitemaps/list"
    title: "Google Search Console API reference — Sitemaps"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `sitemaps`
- **Default destination table:** `search_console_sitemaps`
- **Manifest version:** 1.0
- **Unique keys:** `site_url`, `path`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `path` | STRING | Path | PK. Sitemap URL. Key together with site_url. |
| `errors` | INTEGER | Errors | Number of errors Google reported for the sitemap. |
| `contents` | STRING | Contents | Per content type (web, image, video, news): submitted and indexed URL counts, as JSON. Stored as a JSON string. |
| `site_url` | STRING | Site URL | PK. The property, stamped from the Search Console property parameter. Key together with path. FK to [Properties](./properties.md) |
| `warnings` | INTEGER | Warnings | Number of warnings Google reported for the sitemap. |
| `is_pending` | BOOLEAN | Is Pending | True while Google has not processed it yet. |
| `sitemap_type` | STRING | Sitemap Type | sitemap, rssFeed, atomFeed, urlList, oceanNews, notSitemap or patternSitemap. |
| `last_submitted` | DATETIME | Last Submitted | When the sitemap was last submitted. |
| `last_downloaded` | DATETIME | Last Downloaded | When Google last downloaded it. |
| `is_sitemaps_index` | BOOLEAN | Is Sitemaps Index | True for a sitemap index file. |

# Example Questions

- Which sitemaps are submitted, when did Google last download each one, and which report errors or warnings?
- How many URLs does each sitemap submit versus how many Google indexed from it?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1] — Sitemaps belong to one property.
