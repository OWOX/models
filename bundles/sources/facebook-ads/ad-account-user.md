---
title: "Ad Account User"
description: |
  Named in the connector for the users assigned to an ad account. As the connector currently requests it, it returns the account's own `id` (`act_` plus the number) and `name`, one row per account.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/ad-account-user-fields.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad Account User endpoint (`ad-account-user`)"
    last_modified: 2026-05-18
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account-user"
    title: "Meta Marketing API reference — Ad Account User"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account-user`
- **Default destination table:** `facebook_ads_ad_account_user`
- **Last updated:** 2026-05-18 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([8a33aca18](https://github.com/OWOX/owox-data-marts/commit/8a33aca183b6dbff95532a723e27803026ba94d9))
- **Meta Marketing API version:** v26.0
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. As currently requested, the ad account's own ID in `act_<number>` form. FK to [Ad Account](./ad-account.md) |
| `name` | STRING | Name | As currently requested, the ad account's name. |

# Example Questions

- Which `ad accounts` has this connector loaded, under what names?
- Has an account been renamed since the last load?
- Which account IDs appear in reports but not here?

## Joins

- [Ad Account](./ad-account.md) — `id = id` [1:1] — As the connector requests it, this row is the account itself.
