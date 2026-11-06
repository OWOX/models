---
title: "Ad Account User"
description: |
  The Reddit Ads user the connector authenticates as: the member ID, first and last name, email, phone, and the linked Reddit user ID and username. The connector loads it from the Get Me operation, so it holds the authenticated user, not every member of the account.

  It joins to no other table here: the Ad Account table carries a `primary_contact_member_id`, but the API reference does not state that it refers to the authenticated user, so the two stay unjoined.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Ad Account User endpoint (`ad-account-user`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/Get%20Me"
    title: "Reddit Ads API reference — Get%20Me"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `ad-account-user`
- **Default destination table:** `reddit_ads_ad_account_user`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `email` | STRING | Email address of the member. |
| `firstname` | STRING | The first name of the member. |
| `id` | STRING | PK. The unique identifier of the member. |
| `lastname` | STRING | The last name of the member. |
| `phone` | STRING | The phone number of the member. |
| `reddit_user_id` | STRING | ID that maps to the Reddit user. |
| `reddit_username` | STRING | The Reddit username of the member. |

# Example Questions

- Which Reddit username is the connector authenticated as?
- Which email address belongs to the authenticated member?
- What is the member ID behind this connection?
