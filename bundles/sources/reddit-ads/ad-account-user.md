---
title: "Ad Account User"
description: |
  The Reddit Ads user the connector authenticates as: the member ID, first and last name, email, phone, and the linked Reddit user ID and username. The connector loads it from the Get Me operation, so it holds the authenticated user, not every member of the account.

  [Ad Account](./ad-account.md) joins here on `primary_contact_member_id`, which the API reference describes as the primary contact member's ID. This table holds only the authenticated member, so a primary contact who is anyone else finds no row.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/ad-account-user.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Account User endpoint (`ad-account-user`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/Get%20Me"
    title: "Reddit Ads API reference — Ad Account User"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `ad-account-user`
- **Default destination table:** `reddit_ads_ad_account_user`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Reddit Ads API version:** v3
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `email` | STRING | Email | Email address of the member. |
| `firstname` | STRING | Firstname | The first name of the member. |
| `id` | STRING | ID | PK. The unique identifier of the member. |
| `lastname` | STRING | Lastname | The last name of the member. |
| `phone` | STRING | Phone | The phone number of the member. |
| `reddit_user_id` | STRING | Reddit User ID | ID that maps to the Reddit user. |
| `reddit_username` | STRING | Reddit Username | The Reddit username of the member. |

# Example Questions

- Which Reddit username is the connector authenticated as?
- Which email address belongs to the authenticated member?
- What is the member ID behind this connection?
