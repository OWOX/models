---
title: "Performance by country and device"
description: |
  Daily clicks, impressions, CTR and position per country (ISO 3166-1 alpha-3) and device (DESKTOP, MOBILE, TABLET). Sums to the day total exactly; the table for market and mobile questions.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "OWOX Data Marts — Google Search Console custom connector (GoogleSearchConsole, 8 nodes) on the Search Console API v1"
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/searchanalytics/query"
    title: "Google Search Console API reference — Performance by country and device"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `performance_by_country_device`
- **Default destination table:** `search_console_by_country_device`
- **Unique keys:** `site_url`, `search_type`, `date`, `country`, `device`
- **Loads:** a dated snapshot per run window (`incremental: range`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `site_url` | STRING | Site URL | PK. FK to [Properties](./properties.md). The property, stamped from the Search Console property parameter. Key column together with search_type and the dimensions. |
| `search_type` | STRING | Search Type | PK. Search type the row belongs to (web, image, video, news, discover, googleNews), stamped from the Search type parameter. |
| `date` | DATE | Date | PK. FK to [Performance by date](./performance-by-date.md). Day in Pacific Time, as Search Console reports it. |
| `country` | STRING | Country | PK. Country of the search, ISO 3166-1 alpha-3 (usa, deu, ukr). |
| `device` | STRING | Device | PK. DESKTOP, MOBILE or TABLET. |
| `clicks` | INTEGER | Clicks | Clicks from Google Search results to the property for this row. |
| `impressions` | INTEGER | Impressions | Times a result for the property was shown to a user (an impression counts once a result is on a page the user viewed, scrolling not required). |
| `ctr` | FLOAT | CTR | clicks / impressions for the row, 0 to 1. Never average this column; recompute SUM(clicks)/SUM(impressions) in SQL. |
| `position` | FLOAT | Position | Average top position of the property's results in this row, 1 = first. Weight by impressions in SQL: SUM(position*impressions)/SUM(impressions). |

# Example Questions

- How do mobile and desktop differ in CTR and position for the same days?
- In which countries does the site rank well but get few clicks?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1]
- [Performance by date](./performance-by-date.md) — `date = date` [N:1] — Same site_url and search_type: country and device rows sum to the day total exactly.
