---
title: "LinkedIn Ads"
description: |
  What the OWOX Data Marts LinkedIn Ads connector loads, and how the pieces fit together. A LinkedIn ad account holds campaign groups, campaign groups hold campaigns, and campaigns hold creatives. The connector loads the settings of the account, its campaign groups, campaigns and creatives as current-state tables, one row per entity, and the daily performance as time-series tables: [Ad Analytics](./ad-analytics.md), grouped by creative, and [Ad Analytics by Country](./ad-analytics-by-country.md), [Ad Analytics by Region](./ad-analytics-by-region.md) and [Ad Analytics by County](./ad-analytics-by-county.md), each split by campaign and by the location of the members reached.

  LinkedIn refers to its entities by URN, not by the plain ID in each table's own `id` column. [Campaigns](./campaigns.md) hold their account in `account` and their group in `campaignGroup`, and [Creatives](./creatives.md) hold their campaign in `campaign`, each as a URN such as `urn:li:sponsoredAccount:{id}`. [Ad Analytics](./ad-analytics.md) goes one step further: it has no campaign or creative column at all, only `pivotValues`, an array of the URNs the row is grouped by. Because a URN is not the same string as an `id`, this bundle draws no joins between the tables: a join on the columns as they are matches nothing. Strip the prefix first. The part after the last colon is the identifier, which is what the target's `id` holds (both are text), for example in BigQuery:

  ```sql
  SELECT cr.id AS creative_id, c.name AS campaign_name, g.name AS campaign_group_name
  FROM creatives AS cr
  JOIN campaigns AS c
    ON REGEXP_EXTRACT(cr.campaign, r'[^:]+$') = c.id
  JOIN campaign_groups AS g
    ON REGEXP_EXTRACT(c.campaignGroup, r'[^:]+$') = g.id
  ```

  The same `REGEXP_EXTRACT(account, r'[^:]+$')` links `account` on Campaigns, Campaign Groups and Creatives to `id` in Ad Accounts, and `campaign` on the three location tables links to `id` in Campaigns the same way. The strip is the only step; the table names above are the destination tables you chose in the data warehouse.

  Two caution notes apply. Budget and unit cost fields in Campaigns and Campaign Groups are JSON objects, and the amounts in them are strings. In Ad Analytics the `viral` fields count the same metric on viral impressions, those that come from users sharing sponsored content with their own network, and viral impressions are not counted as regular impressions.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`6b104bfa5`](https://github.com/OWOX/owox-data-marts/commit/6b104bfa5980750dc37865eae15712577f42f307), on LinkedIn Marketing API 202609.
tags: ["owox", "index", "connector", "linkedin-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/6b104bfa5980750dc37865eae15712577f42f307/packages/connectors/src/Sources/LinkedInAds"
    title: "OWOX Data Marts — LinkedIn Ads connector source"
    last_modified: 2026-11-03
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Ad Accounts](./ad-accounts.md) | 14 | 2026-05-29 | One row per LinkedIn ad account the connector is configured for: its name, currency code, status and type, the entity it advertises on behalf of (`reference`), its serving statuses, and which notification contacts are switched on. |
| [Ad Analytics](./ad-analytics.md) | 104 | 2026-11-03 | Daily performance of the ad account: impressions, clicks, cost in local currency and in USD, engagements, video and document completions, conversions and lead metrics, plus the same metrics on viral impressions, those that come from users sharing sponsored content (`viral...` fields). |
| [Ad Analytics by Country](./ad-analytics-by-country.md) | 100 | 2026-11-03 | Daily performance of each campaign split by the country of the LinkedIn members who saw or clicked its ads: impressions, clicks, cost in local currency and in USD, engagements, video and document completions, conversions and lead metrics. |
| [Ad Analytics by County](./ad-analytics-by-county.md) | 100 | 2026-11-03 | Daily performance of each campaign split by the county of the LinkedIn members who saw or clicked its ads: impressions, clicks, cost in local currency and in USD, engagements, video and document completions, conversions and lead metrics. |
| [Ad Analytics by Region](./ad-analytics-by-region.md) | 100 | 2026-11-03 | Daily performance of each campaign split by the region of the LinkedIn members who saw or clicked its ads: impressions, clicks, cost in local currency and in USD, engagements, video and document completions, conversions and lead metrics. |
| [Campaign Groups](./campaign-groups.md) | 14 | 2026-05-29 | One row per campaign group: its name, status and serving statuses, the account URN it belongs to, its objective type, the campaign types it allows, a run schedule, and its total and daily budget. |
| [Campaigns](./campaigns.md) | 29 | 2026-05-29 | One row per campaign: its name, status, objective type, campaign type, ad format, cost type, unit cost, daily and total budget, run schedule, targeting criteria and locale, with the account and campaign group it belongs to as URNs. |
| [Creatives](./creatives.md) | 14 | 2026-05-29 | One row per creative: the content it sponsors, the campaign and account it belongs to as URNs, who created and last modified it and when, its intended status, whether it is serving now, its review state, and the reasons it is held from serving. |

# Example Questions

- Which `campaigns` are active, and which objective type does each pursue?
- How do impressions, clicks and cost in local currency move day by day across the account?
- Which `creatives` are meant to be active but are not serving, and why?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/linkedin-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
