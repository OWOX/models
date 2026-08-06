---
title: "Promotion"
description: |
  Every offer the chain ran, and the four things that decide whether it was worth running: the
  mechanic it used, the channel it reached shoppers through, the categories it covered, and — the
  one most promotional reporting leaves out — who actually paid for the discount. A vendor-funded
  deal costs the chain nothing but shelf space and can be judged on volume alone; a retailer-funded
  one comes straight out of margin and has to earn it back in incremental units, not units that
  would have sold at full price anyway. `start_date` and `end_date` bound the window a promotion
  can be credited for, which is what any pre-period, promo-period and post-period read is built on,
  and `category_scope` is what lets an offer be set against the categories it was supposed to move
  rather than against total sales.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T00:46:49.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `promotion_id` | STRING | Promotion ID | PK. Unique identifier for this promotion. |
| `name` | STRING | Promotion Name | Name of the offer as it appears in the promotional calendar. |
| `promo_type` | STRING | Promotion Type | Mechanic used: `discount`, `bogo` (buy one get one), `loyalty_points`, `bundle`. Mechanics are not comparable on discount depth alone. |
| `promo_channel` | STRING | Promotion Channel | How the offer reached shoppers: `weekly_circular`, `app_offer`, `in_store_display`, `loyalty_targeted`. Separates broad reach from targeted precision. |
| `funding_source` | STRING | Funding Source | Who paid for the discount: `vendor_funded` when the supplier covered it, `retailer_funded` when the chain absorbed it. This is what decides whether a promotion made money. |
| `category_scope` | STRING | Category Scope | Part of the assortment the offer covered. Measure uplift against these categories, not against total store sales. |
| `start_date` | DATE | Start Date | First day the offer was live. |
| `end_date` | DATE | End Date | Last day the offer was live. Sales outside this window were not on this deal. |
| `discount_pct` | FLOAT | Discount % | Headline depth of the offer as a percentage off the shelf price. |

# Example Questions

- Which promotions grew margin rather than moving volume we would have sold anyway, once vendor-funded and retailer-funded offers are judged on different bars?
- Do app offers and loyalty-targeted deals earn more per discount dollar than the weekly circular, and in which categories?
- How deep does a discount have to go before the category's uplift stops covering the margin given away?
