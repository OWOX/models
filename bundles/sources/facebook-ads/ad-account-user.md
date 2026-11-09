---
title: "Ad Account User"
description: |
  Meta defines this node as a user with access to an ad account, with an `id` and a `name`. The connector requests it from the account's own address (`act_<account id>/`) with just those two fields, so a row describes the account rather than an individual user, one row per account the connector reads. It carries no roles.

  Use it only as a short list of the accounts that were loaded; account settings are in [Ad Account](./ad-account.md).
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad Account User endpoint (`ad-account-user`)"
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account-user"
    title: "Meta Marketing API reference — ad-account-user"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account-user`
- **Default destination table:** `facebook_ads_ad_account_user`
- **Unique keys:** `id`
- **Last updated:** 2026-05-18 — last change to this endpoint's fields in the connector ([8a33aca18](https://github.com/OWOX/owox-data-marts/commit/8a33aca183b6dbff95532a723e27803026ba94d9))
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. ID of the App Scoped User |
| `name` | STRING | Name | User public full name |

# Example Questions

- Which accounts does the connector read, by id and name?
- How many accounts are loaded?
- Do the names here match the names in Ad Account?

## Joins

- [Ad Account](./ad-account.md) — `id = id` [1:1] — As the connector requests it, this row is the account itself.
  - Description: As the connector requests it, this row is the account itself.
