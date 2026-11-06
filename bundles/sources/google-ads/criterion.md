---
title: "Criterion"
description: |
  One row per targeting criterion of an ad group: keywords, placements and negative exclusions, with their type, status, bids, quality score, final URLs and estimated first-page and top-of-page bids. A criterion is identified by its ID together with its ad group.

  The `negative` field tells a criterion that is targeted from one that is excluded. Keyword performance is in Keywords Stats, which joins here on `keyword_id`, `ad_group_id` and `campaign_id`.
tags: ["owox", "connector", "google-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/GoogleAds/GoogleAdsAPIReference/GoogleAdsFieldsSchema.js"
    title: "OWOX Data Marts Google Ads connector — Criterion endpoint (`criterion`)"
  - id: "vendor-reference"
    resource: "https://developers.google.com/google-ads/api/fields/v25/ad_group_criterion"
    title: "Google Ads API reference — ad_group_criterion"
---

## Connector endpoint

- **Endpoint:** Google Ads · `criterion`
- **Default destination table:** `google_ads_criterion`
- **Unique keys:** `criterion_id`, `ad_group_id`, `campaign_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `criterion_id` | STRING | PK. Criterion ID |
| `criterion_type` | STRING | Criterion Type (KEYWORD, PLACEMENT, etc.) |
| `criterion_status` | STRING | Criterion Status (ENABLED, PAUSED, REMOVED) |
| `keyword_text` | STRING | Keyword Text |
| `keyword_match_type` | STRING | Keyword Match Type (EXACT, PHRASE, BROAD) |
| `ad_group_id` | STRING | PK. Ad Group ID |
| `campaign_id` | STRING | PK. Campaign ID |
| `quality_score` | NUMERIC | Quality Score |
| `final_urls` | JSON | Final URLs |
| `negative` | BOOLEAN | Whether to target (false) or exclude (true) the criterion |
| `cpc_bid_micros` | NUMERIC | CPC Bid in Micros |
| `effective_cpc_bid_micros` | NUMERIC | Effective CPC Bid in Micros (includes bid modifiers) |
| `position_estimates_first_page_cpc_micros` | NUMERIC | Estimated CPC Bid needed to appear on first page |
| `position_estimates_top_of_page_cpc_micros` | NUMERIC | Estimated CPC Bid needed to appear at top of page |
| `position_estimates_first_position_cpc_micros` | NUMERIC | Estimated CPC Bid needed to appear in first position |
| `ad_group_name` | STRING | Ad Group Name |
| `campaign_name` | STRING | Campaign Name |

# Example Questions

- How many keywords and negative keywords does each ad group have?
- Which keywords have a CPC bid below the estimated first-page bid?
- Which placements are targeted rather than excluded?

## Joins

- [Ad Groups](./ad-groups.md) — `ad_group_id = ad_group_id` [N:1] — The ad group the criterion targets for.
