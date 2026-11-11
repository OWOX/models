---
title: "Facebook Ads"
description: |
  What the OWOX Data Marts Facebook Ads connector loads from Meta, and how the pieces fit
  together. Every table belongs to one ad account. Under it, ads sit in ad sets and campaigns
  and each ad runs one creative from the account's library; the performance tables report
  each ad day by day, either whole or split by audience, place, device, product or link.

  The account is the anchor. The entity tables [Ads](./ads.md) and
  [Ad Creatives](./ad-creatives.md) and the three unsplit performance tables
  ([Ad Insights](./ad-insights.md), [Ad Insights by Ad Set](./ad-insights-by-ad-set.md) and
  [Ad Insights by Campaign](./ad-insights-by-campaign.md)) carry `account_id`, the bare
  account number, and join to [Ad Account](./ad-account.md) on it. The breakdown tables reach
  the account through Ad Insights, [Ad](./ad.md) through Ads, and
  [Ad Account User](./ad-account-user.md) joins it on `id`, the `act_` form it carries.
  Performance reaches an ad's name, status and creative through [Ads](./ads.md) on `ad_id`.
  Campaigns and ad sets have no table of their own in this connector — their IDs and names
  travel on every performance row, and their deduplicated reach comes from the two
  level-specific tables.

  Two cautions matter more than any single field. **Reach and frequency do not add up**:
  summing them across ads, days or breakdown values counts the same person several times;
  take them from [Ad Insights by Ad Set](./ad-insights-by-ad-set.md) or
  [Ad Insights by Campaign](./ad-insights-by-campaign.md). And **the ad tables are snapshots of what
  exists now**: Meta omits deleted and archived ads, so older performance rows can point at
  an ad that is no longer listed.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`a3766e5bc`](https://github.com/OWOX/owox-data-marts/commit/a3766e5bc1053780a65b259d9515bedec3c9d782), on Meta Marketing API v26.0.
tags: ["owox", "index", "connector", "facebook-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/FacebookMarketing"
    title: "OWOX Data Marts — Facebook Ads connector source"
    last_modified: 2026-09-28
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Ad](./ad.md) | 32 | 2026-05-29 | The older view of the same ads (Meta's API still calls an ad an "ad group"). |
| [Ad Account](./ad-account.md) | 61 | 2026-05-18 | The ad account itself: its name, currency, time zone, status, spend cap and the business that owns it. |
| [Ad Account User](./ad-account-user.md) | 2 | 2026-05-18 | Named in the connector for the users assigned to an ad account. |
| [Ad Creatives](./ad-creatives.md) | 65 | 2026-09-28 | The creatives in the account's library: body text, title, image and video, call to action, destination link, URL tags and the Page post the ad is built on. |
| [Ad Insights](./ad-insights.md) | 100 | 2026-09-16 | The base performance table: no breakdown, so each ad-day appears once. |
| [Ad Insights by Ad Set](./ad-insights-by-ad-set.md) | 92 | 2026-09-16 | Daily performance at the ad-set level, requested from Meta at that level so that reach and frequency are deduplicated across the ad set's ads — these numbers match Meta Ads Manager. |
| [Ad Insights by Age and Gender](./ad-insights-by-age-and-gender.md) | 102 | 2026-09-16 | The same ad-day, split by the age band and gender Meta attributes to the people reached. |
| [Ad Insights by Campaign](./ad-insights-by-campaign.md) | 89 | 2026-09-16 | Daily performance at the campaign level, requested from Meta at that level so that reach and frequency are deduplicated across the campaign's ad sets and ads — these numbers match Meta Ads Manager. |
| [Ad Insights by Country](./ad-insights-by-country.md) | 101 | 2026-09-16 | The same ad-day, split by the country the people reached are in. |
| [Ad Insights by Device Platform](./ad-insights-by-device-platform.md) | 101 | 2026-09-16 | The same ad-day, split by the device the ad was shown on — mobile or desktop. |
| [Ad Insights by Link URL Asset](./ad-insights-by-link-url-asset.md) | 101 | 2026-09-28 | The same ad-day, split by the destination URL asset the ad used. |
| [Ad Insights by Product ID](./ad-insights-by-product-id.md) | 101 | 2026-09-16 | The same ad-day, split by catalog product. |
| [Ad Insights by Publisher Platform and Position](./ad-insights-by-publisher-platform-and-position.md) | 102 | 2026-09-16 | The same ad-day, split by where the ad appeared: the platform (Facebook, Instagram, Messenger, Audience Network, Threads) and the placement inside it (Feed, Stories, Reels, in-stream video and so on). |
| [Ad Insights by Region](./ad-insights-by-region.md) | 101 | 2026-09-16 | The same ad-day, split by region within a country — a state, province or similar division. |
| [Ads](./ads.md) | 24 | 2026-05-18 | One row per ad, with its name, status, the campaign and ad set it sits in, the creative it currently runs, and when it was created and last updated. |

# Example Questions

- Which creatives drive the cheapest conversions, once performance is joined to the creative each ad runs?
- How does cost per result differ between placements, devices and countries for the same campaign?
- How many unique people did each campaign reach, and how often did they see our ads?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/facebook-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Facebook Ads model diagram](../../res/screens/sources/facebook-ads.svg)
