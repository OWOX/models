---
title: "Facebook Ads"
description: |
  What the OWOX Data Marts Facebook Ads connector loads from Meta, and how the pieces fit
  together. Every table belongs to one ad account. Under it, ads sit in ad sets and campaigns
  and each ad runs one creative from the account's library; the performance tables report
  each ad day by day, either whole or split by audience, place, device, product or link.

  The account is the anchor: every table carries `account_id`, the bare account number, and
  joins to [Ad Account](./ad-account.md) on it. Performance reaches an ad's name, status and
  creative through [Ads](./ads.md) on `ad_id`. Campaigns and ad sets have no table of their
  own in this connector — their IDs and names travel on every performance row, and their
  deduplicated reach comes from the two level-specific tables.

  Two cautions matter more than any single field. **Reach and frequency do not add up**:
  summing them across ads, days or breakdown values counts the same person several times;
  take them from [Ad Set Insights](./ad-set-insights.md) or
  [Campaign Insights](./campaign-insights.md). And **the ad tables are snapshots of what
  exists now**: Meta omits deleted and archived ads, so older performance rows can point at
  an ad that is no longer listed.

  Each table is dated: its **Last updated** is the day the connector last changed what it
  requests from Meta for that endpoint, or how it describes it. Definitions below are current
  as of connector commit [`7703667cc`](https://github.com/OWOX/owox-data-marts/commit/7703667ccad8022f2fc89f8ddc1d27a125c219e0), on Meta Graph API v26.0.
tags: ["owox", "index", "connector", "facebook-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/7703667ccad8022f2fc89f8ddc1d27a125c219e0/packages/connectors/src/Sources/FacebookMarketing"
    title: "OWOX Data Marts — Facebook Ads connector source"
    last_modified: 2026-09-28
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Ad Account](./ad-account.md) | 61 | 2026-05-18 | The ad account itself: its name, currency, time zone, status, spend cap and the business that owns it. |
| [Ad Account User](./ad-account-user.md) | 2 | 2026-05-18 | Named in the connector for the users assigned to an ad account. |
| [Ad Creatives](./ad-creatives.md) | 65 | 2026-09-28 | The creatives in the account's library: body text, title, image and video, call to action, destination link, URL tags and the Page post the ad is built on. |
| [Ad Insights](./ad-insights.md) | 100 | 2026-09-16 | The base performance table: no breakdown, so each ad-day appears once. |
| [Ad Insights by Age and Gender](./ad-insights-by-age-and-gender.md) | 102 | 2026-09-16 | The same ad-day, split by the age band and gender Meta attributes to the people reached. |
| [Ad Insights by Country](./ad-insights-by-country.md) | 101 | 2026-09-16 | The same ad-day, split by the country the people reached are in. |
| [Ad Insights by Device Platform](./ad-insights-by-device-platform.md) | 101 | 2026-09-16 | The same ad-day, split by the device the ad was shown on — mobile or desktop. |
| [Ad Insights by Link URL Asset](./ad-insights-by-link-url-asset.md) | 101 | 2026-09-28 | The same ad-day, split by the destination URL asset the ad used. |
| [Ad Insights by Placement](./ad-insights-by-placement.md) | 102 | 2026-09-16 | The same ad-day, split by where the ad appeared: the platform (Facebook, Instagram, Messenger, Audience Network, Threads) and the placement inside it (Feed, Stories, Reels, in-stream video and so on). |
| [Ad Insights by Product ID](./ad-insights-by-product-id.md) | 101 | 2026-09-16 | The same ad-day, split by catalog product. |
| [Ad Insights by Region](./ad-insights-by-region.md) | 101 | 2026-09-16 | The same ad-day, split by region within a country — a state, province or similar division. |
| [Ad Object (formerly Ad Group)](./ad-object-formerly-ad-group.md) | 32 | 2026-05-29 | The older view of the same ads (Meta's API still calls an ad an "ad group"). |
| [Ad Set Insights](./ad-set-insights.md) | 92 | 2026-09-16 | Daily performance at the ad-set level, requested from Meta at that level so that reach and frequency are deduplicated across the ad set's ads — these numbers match Meta Ads Manager. |
| [Ads](./ads.md) | 24 | 2026-05-18 | One row per ad, with its name, status, the campaign and ad set it sits in, the creative it currently runs, and when it was created and last updated. |
| [Campaign Insights](./campaign-insights.md) | 89 | 2026-09-16 | Daily performance at the campaign level, requested from Meta at that level so that reach and frequency are deduplicated across the campaign's ad sets and ads — these numbers match Meta Ads Manager. |

# Example Questions

- Which creatives drive the cheapest conversions, once performance is joined to the creative each ad runs?
- How does cost per result differ between placements, devices and countries for the same campaign?
- How many unique people did each campaign reach, and how often did they see our ads?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/facebook-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
