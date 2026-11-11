---
title: "Ad Account User"
description: |
  Named in the connector for the users assigned to an ad account. As the connector currently requests it, it returns the account's own `id` (`act_` plus the number) and `name`, one row per account.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/7703667ccad8022f2fc89f8ddc1d27a125c219e0/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/ad-account-user-fields.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad Account User endpoint (`ad-account-user`)"
    last_modified: 2026-05-18
  - id: "meta-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account-user"
    title: "Meta Marketing API reference — Ad Account User"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account-user`
- **Default destination table:** `facebook_ads_ad_account_user`
- **Last updated:** 2026-05-18 — last change to this endpoint's fields in the connector ([8a33aca18](https://github.com/OWOX/owox-data-marts/commit/8a33aca183b6dbff95532a723e27803026ba94d9))
- **Meta Graph API version:** v26.0
- **Unique keys:** `id`

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

- [Ad Account](./ad-account.md) — `id = id` [1:1] — As requested today, this row is the account itself.
