---
title: "Ad Account"
description: |
  One row per ad account the connector is configured for: its name, type, currency, time zone, the click and view attribution windows, the business it belongs to, the primary contact member, and the account-level excluded communities and keywords. It is the top of the hierarchy: [Campaigns](./campaigns.md), [Custom Audiences](./custom-audiences.md) and [Lead Gen Forms](./lead-gen-forms.md) carry its ID as `ad_account_id`.

  The `currency` field holds the ISO 4217 code of the currency used. There is no separate table of businesses, so `business_id` stays a plain column.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Account endpoint (`ad-account`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/Get%20Ad%20Account"
    title: "Reddit Ads API reference — Get%20Ad%20Account"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `ad-account`
- **Default destination table:** `reddit_ads_ad_account`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `admin_approval` | STRING | Describes an employee set state for the account. |
| `attribution_type` | STRING | The attribution type. Only valid for CPA bid types. |
| `business_id` | STRING | The ID of the business that this account belongs to. |
| `click_attribution_window` | STRING | Configures the window to use when querying reporting for click attributions. |
| `created_at` | STRING | The time that this entity was created, represented in ISO 8601. |
| `currency` | STRING | The ISO4217 currency symbol for the currency used. |
| `id` | STRING | PK. The ID of the ad account. |
| `modified_at` | STRING | The last time that this entity was modified, represented in ISO 8601. |
| `name` | STRING | The ad account name. |
| `pixel_partner_preferences` | STRING | A list of pixel partners allowed by the advertiser. |
| `primary_contact_member_id` | STRING | The ID of the primary contact member. |
| `suspension_reason` | STRING | The reason why this ad account was suspended. |
| `time_zone_id` | STRING | The default time zone setting for this entity. |
| `type` | STRING | The type of the ad account. |
| `view_attribution_window` | STRING | Configures the window to use when querying reporting for view attributions. |
| `excluded_communities` | STRING | Account level excluded communities. |
| `excluded_keywords` | STRING | Account level excluded keywords. |

# Example Questions

- Which currency and time zone does each ad account use?
- Which click and view attribution windows are set on each ad account?
- Which ad accounts are suspended, and for what reason?
