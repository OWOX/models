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
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. ID of the App Scoped User |
| `name` | STRING | User public full name |

# Example Questions

- Which accounts does the connector read, by id and name?
- How many accounts are loaded?
- Do the names here match the names in Ad Account?
