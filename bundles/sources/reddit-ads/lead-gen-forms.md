---
title: "Lead Gen Forms"
description: |
  One row per lead generation form of an ad account: its name, the prompt shown to people, the privacy policy link, the list of questions, and creation and modification times. It describes the form, not the leads that were submitted through it.

  It joins to [Ad Account](./ad-account.md) on `ad_account_id`. The connector loads no link between a form and the ads that use it.
tags: ["owox", "connector", "reddit-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/de49dceb6665a1c4a568fe9861aa437410d4a9e5/packages/connectors/src/Sources/RedditAds/RedditAdsAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Reddit Ads connector — Lead Gen Forms endpoint (`lead-gen-form`)"
  - id: "vendor-reference"
    resource: "https://ads-api.reddit.com/docs/v3/operations/List%20Lead%20Gen%20Forms"
    title: "Reddit Ads API reference — List%20Lead%20Gen%20Forms"
---

## Connector endpoint

- **Endpoint:** Reddit Ads · `lead-gen-form`
- **Default destination table:** `reddit_ads_lead_gen_form`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_account_id` | STRING | The ID of the ad account that the form belongs to. |
| `id` | STRING | PK. The ID of the form. |
| `name` | STRING | The name of the form. |
| `privacy_link` | STRING | The URL of the privacy policy for the form. |
| `prompt` | STRING | The prompt that is displayed to the user when they are filling out the form. |
| `questions` | STRING | A list of questions that are presented to the user to fill out. |
| `created_at` | STRING | The time that this entity was created represented in ISO 8601. |
| `modified_at` | STRING | The last time that this entity was modified represented in ISO 8601. |

# Example Questions

- Which lead gen forms exist in each ad account, and when were they created?
- Which forms link to a privacy policy, and which do not?
- Which forms were modified in the last 30 days?

## Joins

- [Ad Account](./ad-account.md) — `ad_account_id = id` [N:1] — The ad account the form belongs to.
  - Description: The ad account the form belongs to.
