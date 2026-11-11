---
title: "X Ads"
description: |
  What the OWOX Data Marts X Ads connector loads, and how the pieces fit together. An X advertising account holds campaigns, campaigns hold line items (the X name for ad groups), and line items hold promoted tweets: references that attach a tweet to a line item. The connector loads each level as a current-state table ([Accounts](./accounts.md), [Campaigns](./campaigns.md), [Line Items](./line-items.md), [Promoted Tweets](./promoted-tweets.md)), the tweets and cards used as creatives ([Tweets](./tweets.md), [Cards](./cards.md), [All Cards](./all-cards.md)), a reference table of countries ([Targeting Locations](./targeting-locations.md)), and the daily performance of promoted tweets as two time-series tables: [Ad Performance](./ad-performance.md) and [Ad Performance by Country](./ad-performance-by-country.md).

  Each level carries the ID of its parent, so the chain joins on plain IDs: [Promoted Tweets](./promoted-tweets.md) to [Line Items](./line-items.md) on `line_item_id`, [Line Items](./line-items.md) to [Campaigns](./campaigns.md) on `campaign_id`, and [Campaigns](./campaigns.md) to [Accounts](./accounts.md) on `account_id`, a column the connector adds to each campaign row when it is selected. Both performance tables report on promoted tweets, so their `id` joins to [Promoted Tweets](./promoted-tweets.md), and a promoted tweet reaches its tweet through `tweet_id`, matched to the text column `tweet_id` in [Tweets](./tweets.md) rather than to the numeric `id`, which can arrive rounded. A tweet reaches its card through `card_uri` in [All Cards](./all-cards.md), and [Cards](./cards.md) is the same cards seen through the plain cards list, matched on `id`. [Ad Performance by Country](./ad-performance-by-country.md) holds a location ID in `country`, which matches `targeting_value` in [Targeting Locations](./targeting-locations.md).

  Two cautions apply. Amounts ending in `_micro` are in micros: the X Ads docs write 5.50 USD as 5500000, so divide by 1,000,000. And the performance tables are built only for the promoted tweets the connector has loaded, so line items that were deleted drop out of them.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`a3766e5bc`](https://github.com/OWOX/owox-data-marts/commit/a3766e5bc1053780a65b259d9515bedec3c9d782).
tags: ["owox", "index", "connector", "x-ads"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds"
    title: "OWOX Data Marts — X Ads connector source"
    last_modified: 2026-09-28
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Accounts](./accounts.md) | 12 | 2026-05-29 | One row per advertising account listed in the connector's Account IDs: its name and business name, country code, timezone, industry type, business ID, approval status, created and updated times, and whether it is deleted. |
| [Ad Performance](./ad-performance.md) | 20 | 2026-05-29 | Daily performance of promoted tweets: impressions, clicks, URL clicks, engagements, billed engagements, billed charge (`billed_charge_local_micro`, spend in micros), and social actions such as likes, reposts, replies and follows. |
| [Ad Performance by Country](./ad-performance-by-country.md) | 21 | 2026-05-29 | Daily performance of promoted tweets split by country: the same impressions, clicks, URL clicks, engagements, billed charge and social actions as Ad Performance, with `country` added to the key. |
| [All Cards](./all-cards.md) | 30 | 2026-09-28 | One row per card with its full creative detail: card type, title, website URL, destination URL and display URL, call to action, app store IDs, and the video URLs, poster and sizes. |
| [Campaigns](./campaigns.md) | 19 | 2026-05-29 | One row per campaign: its name, entity status and effective status, whether it is servable and why not, budget optimization, daily and total budget, duration in days, frequency cap, currency, funding instrument, purchase order number, and created and updated times. |
| [Cards](./cards.md) | 8 | 2026-05-29 | One row per website or app card: its ID, name, card type, card URI, created and updated times, whether it is deleted, and its components (media and buttons) as JSON. |
| [Line Items](./line-items.md) | 33 | 2026-05-29 | One row per line item, the X name for an ad group: its name and the campaign it sits in (`campaign_id`), goal and objective, product type, placements, bid strategy and bid amount, target CPA, daily and total budget, start and end time, payment basis (`pay_by`), currency, frequency cap and entity status. |
| [Promoted Tweets](./promoted-tweets.md) | 8 | 2026-05-29 | One row per promoted tweet: the link that attaches a tweet to a line item. |
| [Targeting Locations](./targeting-locations.md) | 4 | 2026-05-29 | A reference table of X targeting locations: the location's hex ID (`targeting_value`), its name, location type and two-letter ISO country code. |
| [Tweets](./tweets.md) | 34 | 2026-05-29 | One row per tweet used as a creative: its text (`full_text`), language, type, name, created time, like and repost counts, entities such as hashtags, links and mentions, and the URI of the card attached to it (`card_uri`). |

# Example Questions

- Which `campaigns` spend the most for the fewest clicks, once spend is divided by clicks?
- How do impressions, clicks and engagements change from `campaign` to `line item` to `promoted tweet`?
- Which countries do `promoted tweets` reach, and which of them engage?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/x-ads)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
