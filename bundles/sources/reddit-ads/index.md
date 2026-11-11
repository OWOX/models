---
title: "Reddit Ads"
description: |
  What the OWOX Data Marts Reddit Ads connector loads, and how the pieces fit together. A Reddit Ads account is a hierarchy: an [Ad Account](./ad-account.md) holds [Campaigns](./campaigns.md), a campaign holds [Ad Groups](./ad-groups.md), and an ad group holds [Ads](./ads.md). Campaigns draw on a payment method in [Funding Instruments](./funding-instruments.md), and the account also owns [Custom Audiences](./custom-audiences.md) and [Lead Gen Forms](./lead-gen-forms.md). [Ad Account User](./ad-account-user.md) is the authenticated member; an account's `primary_contact_member_id` points to it, but it holds only that one member.

  Those tables hold current settings, one row per entity. The results are in ten daily report tables, all keyed by `ad_id` and `date`: [Ad Performance](./ad-performance.md) has no further breakdown, and each of the others splits the same metrics by one more dimension: [account](./ad-performance-by-account.md), [ad group](./ad-performance-by-ad-group.md), [campaign](./ad-performance-by-campaign.md), [country](./ad-performance-by-country.md), [DMA](./ad-performance-by-dma.md), [interest](./ad-performance-by-interest.md), [community](./ad-performance-by-community.md), [keyword](./ad-performance-by-keyword.md) or [placement](./ad-performance-by-placement.md). Ad Performance joins to Ads on `ad_id`, and each of the nine breakdown tables joins to Ad Performance on `ad_id` and `date`, the ungrouped row it splits, so the drawing shows them as one family. The three breakdowns that split by a table here also join to it: by account to Ad Account, by ad group to Ad Groups, by campaign to Campaigns.

  The breakdown tables are alternatives, not parts of one total: a row in Ad Performance by Country and a row in Ad Performance by Keyword can describe the same spend, so never add the tables together. The API reference describes `spend` in microcurrency; divide it by 1 million to read it in the account currency.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`a3766e5bc`](https://github.com/OWOX/owox-data-marts/commit/a3766e5bc1053780a65b259d9515bedec3c9d782), on Reddit Ads API v3.
tags: ["owox", "index", "connector", "reddit-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/RedditAds"
    title: "OWOX Data Marts — Reddit Ads connector source"
    last_modified: 2026-09-28
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Ad Account](./ad-account.md) | 17 | 2026-05-29 | One row per ad account the connector is configured for: its name, type, currency, time zone, the click and view attribution windows, the business it belongs to, the primary contact member, and the account-level excluded communities and keywords. |
| [Ad Account User](./ad-account-user.md) | 7 | 2026-05-29 | The Reddit Ads user the connector authenticates as: the member ID, first and last name, email, phone, and the linked Reddit user ID and username. |
| [Ad Groups](./ad-groups.md) | 27 | 2026-05-29 | One row per ad group: its name, the campaign and ad account it sits in, configured and effective status, bid strategy, bid type and bid value, goal type and value, optimization goal, start and end time, schedule, targeting, and whether it belongs to a campaign-budget-optimization campaign. |
| [Ad Performance](./ad-performance.md) | 55 | 2026-05-29 | Daily ad performance with no breakdown beyond the ad: one row per ad per `date`. |
| [Ad Performance by Account](./ad-performance-by-account.md) | 56 | 2026-05-29 | Daily ad performance with the ad account as the breakdown: one row per ad per `date` per `account_id`. |
| [Ad Performance by Ad Group](./ad-performance-by-ad-group.md) | 56 | 2026-05-29 | Daily ad performance with the ad group as the breakdown: one row per ad per `date` per `ad_group_id`. |
| [Ad Performance by Campaign](./ad-performance-by-campaign.md) | 57 | 2026-05-29 | Daily ad performance with the campaign as the breakdown: one row per ad per `date` per `campaign_id`. |
| [Ad Performance by Community](./ad-performance-by-community.md) | 56 | 2026-05-29 | Daily ad performance split by community (subreddit): one row per ad per `date` per `community`. |
| [Ad Performance by Country](./ad-performance-by-country.md) | 56 | 2026-05-29 | Daily ad performance split by country: one row per ad per `date` per `country`. |
| [Ad Performance by DMA](./ad-performance-by-dma.md) | 56 | 2026-05-29 | Daily ad performance split by Designated Market Area (DMA): one row per ad per `date` per `dma`. |
| [Ad Performance by Interest](./ad-performance-by-interest.md) | 56 | 2026-05-29 | Daily ad performance split by the interest the audience was targeted by: one row per ad per `date` per `interest`. |
| [Ad Performance by Keyword](./ad-performance-by-keyword.md) | 56 | 2026-05-29 | Daily ad performance split by keyword: one row per ad per `date` per `keyword`. |
| [Ad Performance by Placement](./ad-performance-by-placement.md) | 56 | 2026-05-29 | Daily ad performance split by placement of the creative: one row per ad per `date` per `placement`. |
| [Ads](./ads.md) | 24 | 2026-09-28 | One row per ad: its name, type, configured and effective status, the ad group, campaign and ad account it belongs to, the click URL, the post it promotes, a preview URL and its expiry, the rejection reason if it was rejected, event trackers and, for shopping ads, products and the creative. |
| [Campaigns](./campaigns.md) | 15 | 2026-05-29 | One row per campaign: its name, objective, configured and effective status, spend cap, goal type and value, the funding instrument paying for it, special ad categories, the app it promotes (for app install campaigns) and creation and modification times. |
| [Custom Audiences](./custom-audiences.md) | 9 | 2026-05-29 | One row per custom audience of an ad account: its name, type, processing status, the estimated size as a lower and an upper bound, and creation and modification times. |
| [Funding Instruments](./funding-instruments.md) | 9 | 2026-05-29 | One row per funding instrument, the payment method that campaigns spend against: its name, currency, credit limit, the current billable amount, start and end time, whether it can serve, and the reasons it cannot. |
| [Lead Gen Forms](./lead-gen-forms.md) | 8 | 2026-05-29 | One row per lead generation form of an ad account: its name, the prompt shown to people, the privacy policy link, the list of questions, and creation and modification times. |

# Example Questions

- Which `campaigns` spend the most for the fewest key conversions, once spend is divided by conversions?
- How does cost per click change from `campaign` to `ad group` to ad for the same budget?
- Which countries, communities or keywords bring the most clicks at the lowest cost?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/reddit-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Reddit Ads model diagram](../../res/screens/sources/reddit-ads.svg)
