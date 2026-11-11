---
title: "Accounts"
description: |
  One row per advertising account listed in the connector's Account IDs: its name and business name, country code, timezone, industry type, business ID, approval status, created and updated times, and whether it is deleted. It is the top of the hierarchy: campaigns belong to an account.

  The connector reads each account by its ID, so the table holds only the accounts you configured. Use it to label campaigns, which join here on `account_id`.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds/XAdsAPIReference/accountFields.js"
    title: "OWOX Data Marts X Ads connector — Accounts endpoint (`accounts`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/account-structure"
    title: "X Ads API reference — Accounts"
---

## Connector endpoint

- **Endpoint:** X Ads · `accounts`
- **Default destination table:** `x_ads_accounts`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `name` | STRING | Name | The name of the account |
| `business_name` | STRING | Business Name | The business name associated with the account |
| `timezone` | STRING | Timezone | The timezone of the account |
| `timezone_switch_at` | DATETIME | Timezone Switch At | When the timezone was last switched |
| `country_code` | STRING | Country Code | The country code of the account (e.g. SI) |
| `id` | STRING | ID | PK. The unique identifier for the account |
| `created_at` | DATETIME | Created At | When the account was created |
| `updated_at` | DATETIME | Updated At | When the account was last updated |
| `industry_type` | STRING | Industry Type | The industry type of the account |
| `business_id` | STRING | Business ID | The business identifier associated with the account |
| `approval_status` | STRING | Approval Status | The approval status of the account (e.g. ACCEPTED) |
| `deleted` | BOOLEAN | Deleted | Whether the account is deleted |

# Example Questions

- Which advertising accounts does this connector load, and what is the approval status of each?
- In which timezone and country is each account set up?
- Which accounts are marked as deleted, or do not have an accepted approval status?
