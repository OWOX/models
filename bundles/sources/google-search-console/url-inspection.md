---
title: "URL inspection"
description: |
  Current index status of the URLs listed in the connector's URLs to inspect parameter: verdict, coverage state, indexing and robots.txt state, last crawl, Google's canonical versus the declared one, mobile-usability and rich-results verdicts. One row per URL, overwritten on each run; Google allows 2,000 inspections per property per day.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect"
    title: "Google Search Console API reference — URL inspection"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `url_inspection`
- **Default destination table:** `search_console_url_inspection`
- **Manifest version:** 1.0
- **Unique keys:** `site_url`, `inspection_url`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `verdict` | STRING | Verdict | PASS (indexed), NEUTRAL (excluded), FAIL (error) or VERDICT_UNSPECIFIED. |
| `site_url` | STRING | Site URL | PK. The property, stamped from the Search Console property parameter. FK to [Properties](./properties.md) |
| `sitemaps` | STRING | Sitemaps | Sitemaps that list the URL, as JSON. Stored as a JSON string. |
| `crawled_as` | STRING | Crawled As | DESKTOP or MOBILE Googlebot. |
| `coverage_state` | STRING | Coverage State | Human-readable index coverage, e.g. 'Submitted and indexed', 'Crawled - currently not indexed'. |
| `indexing_state` | STRING | Indexing State | INDEXING_ALLOWED or the blocking reason (BLOCKED_BY_META_TAG, BLOCKED_BY_HTTP_HEADER, BLOCKED_BY_ROBOTS_TXT). |
| `inspection_url` | STRING | Inspection URL | PK. The URL that was inspected. Key together with site_url. FK to [Performance by page](./performance-by-page.md) |
| `referring_urls` | STRING | Referring URLs | URLs Google followed to find this page, as JSON. Stored as a JSON string. |
| `user_canonical` | STRING | User Canonical | The canonical URL the page declares. Differs from google_canonical when Google overrode it. |
| `last_crawl_time` | DATETIME | Last Crawl Time | When Googlebot last crawled the URL. |
| `google_canonical` | STRING | Google Canonical | The canonical URL Google chose. |
| `page_fetch_state` | STRING | Page Fetch State | SUCCESSFUL, SOFT_404, NOT_FOUND, SERVER_ERROR, REDIRECT_ERROR and other fetch outcomes. |
| `robots_txt_state` | STRING | Robots Txt State | ALLOWED or DISALLOWED by robots.txt. |
| `rich_results_verdict` | STRING | Rich Results Verdict | PASS, FAIL or NEUTRAL for structured data detected on the page. |
| `inspection_result_link` | STRING | Inspection Result Link | Link to the same inspection in the Search Console interface. |
| `mobile_usability_verdict` | STRING | Mobile Usability Verdict | PASS, FAIL or NEUTRAL for mobile usability. |
| `rich_results_detected_items` | STRING | Rich Results Detected Items | Structured-data item types found and their issues, as JSON. Stored as a JSON string. |

# Example Questions

- Are the pages we care about indexed, and what does Google report as the reason when they are not?
- Where did Google pick a canonical different from the one the page declares?
- When was each key page last crawled, and by which Googlebot?

## Joins

- [Properties](./properties.md) — `site_url = site_url` [N:1] — The property the URL was inspected under.
- [Performance by page](./performance-by-page.md) — `site_url = site_url` AND `inspection_url = page` [1:N] — The inspected URL is the page the performance rows are keyed on; join to see whether a page that lost clicks is still indexed.
  - [Performance by page Performance by date](./performance-by-date.md)
    - [Performance by page Performance by date Properties](./properties.md)
  - [Performance by page Properties](./properties.md)
