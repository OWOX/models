---
title: "Advertiser Account"
description: |
  One row per advertiser account listed in the connector's Advertiser IDs: the advertiser ID, its name, company name and account currency. The connector reads it from the authorized ad accounts endpoint, whose documentation lists only the advertiser ID and name for each account, so `company_name` and `currency` are in the schema but are not documented for that endpoint.

  Every other table carries `advertiser_id`; this is the table to label them with the account name.
tags: ["owox", "connector", "tiktok-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/TikTokAds/TikTokAdsAPIReference/TikTokAdsFieldsSchema.js"
    title: "OWOX Data Marts TikTok Ads connector — Advertiser Account endpoint (`advertiser`)"
  - id: "vendor-reference"
    resource: "https://ads.tiktok.com/marketing_api/docs"
    title: "TikTok Business API reference — docs"
---

## Connector endpoint

- **Endpoint:** TikTok Ads · `advertiser`
- **Default destination table:** `tiktok_ads_advertiser`
- **Unique keys:** `advertiser_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `advertiser_id` | STRING | PK. Advertiser ID |
| `advertiser_name` | STRING | Advertiser Name |
| `company_name` | STRING | Company Name |
| `currency` | STRING | Account Currency |

# Example Questions

- Which advertiser accounts does this connector load, and what are their names?
- Which advertiser accounts belong to the same company?
- In which currency is each advertiser account set up?
