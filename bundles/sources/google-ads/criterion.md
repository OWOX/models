---
title: "Criterion"
description: |
  One row per targeting criterion of an ad group: keywords, placements and negative exclusions, with their type, status, bids, quality score, final URLs and estimated first-page and top-of-page bids. A criterion is identified by its ID together with its ad group.

  The `negative` field tells a criterion that is targeted from one that is excluded. Keyword performance is in Keywords Stats, which joins here on `keyword_id`, `ad_group_id` and `campaign_id`.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/criterionFields.js"
    title: "OWOX Data Marts Google Ads connector — Criterion endpoint (`criterion`)"
    last_modified: 2026-09-28
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group_criterion"
    title: "Google Ads API reference — Criterion"
---

## Connector endpoint

- **Endpoint:** Google Ads · `criterion`
- **Default destination table:** `google_ads_criterion`
- **Last updated:** 2026-09-28 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([3de731ea8](https://github.com/OWOX/owox-data-marts/commit/3de731ea89fa5701d5f45624a3fa5789e2df3e53))
- **Google Ads API version:** v25
- **Unique keys:** `criterion_id`, `ad_group_id`, `campaign_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `criterion_id` | STRING | Criterion ID | PK. ID of the criterion; unique only together with `ad_group_id` and `campaign_id`, which complete the key. |
| `criterion_type` | STRING | Criterion Type | Criterion Type (KEYWORD, PLACEMENT, etc.) |
| `criterion_status` | STRING | Criterion Status | Criterion Status (ENABLED, PAUSED, REMOVED) |
| `keyword_text` | STRING | Keyword Text | The text of the keyword, at most 80 characters and 10 words. |
| `keyword_match_type` | STRING | Keyword Match Type | Keyword Match Type (EXACT, PHRASE, BROAD) |
| `ad_group_id` | STRING | Ad Group ID | PK. ID of the ad group the row belongs to. FK to [Ad Groups](./ad-groups.md) |
| `campaign_id` | STRING | Campaign ID | PK. ID of the campaign the row belongs to. |
| `quality_score` | FLOAT | Quality Score | The keyword's quality score; empty when Google does not have enough information to compute it. |
| `final_urls` | STRING | Final URLs | The list of possible final URLs of the keyword after all cross-domain redirects. Stored as a JSON string. |
| `final_urls_parsed` | STRING | Final URLs Parsed | final_urls with each short link resolved to its landing page; other URLs stay unchanged. Requires final_urls and Process Short Links. Stored as a JSON string. |
| `negative` | BOOLEAN | Negative Criterion | Whether to target (false) or exclude (true) the criterion |
| `cpc_bid_micros` | FLOAT | CPC Bid Micros | CPC Bid in Micros |
| `effective_cpc_bid_micros` | FLOAT | Effective CPC Bid Micros | Effective CPC Bid in Micros (includes bid modifiers) |
| `position_estimates_first_page_cpc_micros` | FLOAT | Position Estimates First Page CPC Micros | Estimated CPC Bid needed to appear on first page |
| `position_estimates_top_of_page_cpc_micros` | FLOAT | Position Estimates Top Of Page CPC Micros | Estimated CPC Bid needed to appear at top of page |
| `position_estimates_first_position_cpc_micros` | FLOAT | Position Estimates First Position CPC Micros | Estimated CPC Bid needed to appear in first position |
| `ad_group_name` | STRING | Ad Group Name | Name of the ad group. |
| `campaign_name` | STRING | Campaign Name | Name of the campaign. |

# Example Questions

- How many keywords and negative keywords does each `ad group` have?
- Which keywords have a CPC bid below the estimated first-page bid?
- Which placements are targeted rather than excluded?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the criterion belongs to.
  - [Criterion's Campaign](./campaigns.md) — The campaign of the ad group this criterion belongs to — its settings, not its results.
