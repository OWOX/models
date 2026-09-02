---
title: "Loyalty Members"
description: |
  Everyone enrolled in the loyalty program, and what each of them is worth to the chain: the store
  they treat as home, the tier they have reached, when they joined and how they have shopped since
  — lifetime spend, how many baskets it took, the average basket behind it, and how long it has
  been since the last one. This is the only place a shopper exists as a person rather than as an
  anonymous basket, which makes it the entry point for every question about retention, frequency
  and share of wallet. The RFM block turns that history into segments that can be acted on: who is
  shopping most, who is spending most, and who has quietly stopped coming. `home_store_id` matters
  more here than it looks — a member's value is earned at a location, so store performance and
  member value are two views of the same trade, and a store losing gold members is in trouble long
  before its sales line shows it.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-06T04:38:08.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `member_id` | STRING | Member ID | PK. Unique identifier for this loyalty account. |
| `home_store_id` | STRING | Home Store ID | Location the member shops most often, which is where their value is earned. FK to [Store](./store.md) |
| `enrolled_at` | DATE | Enrolled Date | Date the member joined the loyalty program. The gap to `first_purchase_date` shows how long enrolment takes to turn into trade. |
| `tier` | STRING | Loyalty Tier | Program tier earned on spend: `base`, `silver` or `gold`. Tier is partly a result of basket size, so treat it as a segment rather than a cause. |
| `city` | STRING | City | City the member lives in, which need not be the city of their home store. |
| `state` | STRING | State | US state the member lives in, e.g. `TX`, `OH`, `FL`. |
| `age_band` | STRING | Age Band | Banded age group the member falls into. Banding keeps the cut usable without holding a date of birth. |
| `email_opt_in` | BOOLEAN | Email Opt-In | True when the member has agreed to receive email offers. The reachable base for any mailed campaign. |
| `is_app_user` | BOOLEAN | Is App User | True when the member uses the mobile app, which is what makes an offer targetable in the moment rather than a week ahead. |
| `rfm_label` | STRING | RFM Segment | Segment summarising the three scores below into one label, e.g. champions, loyal, at risk, lapsed. The everyday cut for campaign selection. |
| `recency_score` | INTEGER | Recency Score | 1 to 5, where 5 is a member who shopped most recently. |
| `frequency_score` | INTEGER | Frequency Score | 1 to 5, where 5 is a member who shops most often. |
| `monetary_score` | INTEGER | Monetary Score | 1 to 5, where 5 is a member who has spent the most. |
| `lifetime_spend` | NUMERIC | Lifetime Spend | Total spend by this member since enrolment, in USD. |
| `lifetime_baskets` | INTEGER | Lifetime Baskets | Number of separate shopping trips the member has made. Divides into `lifetime_spend` to give `avg_basket_value`. |
| `avg_basket_value` | NUMERIC | Average Basket Value | Average spend per shopping trip for this member, in USD. |
| `first_purchase_date` | DATE | First Purchase Date | Date of the member's first purchase on the program. |
| `last_purchase_date` | DATE | Last Purchase Date | Date of the member's most recent purchase. |
| `days_since_last_purchase` | INTEGER | Days Since Last Purchase | Whole days between the last purchase and the reporting date. The lapse trigger behind any recall campaign. |
| `is_active` | BOOLEAN | Is Active | True while the member is still shopping within the program's activity window. Exclude the dormant tail before comparing per-member averages. |
| `count_members` | INTEGER | Member Count | Always `1` on every row; SUM to count members. |

# Example Questions

- Which `stores` are losing their most valuable members, and how much annual spend walks out with the ones who have gone quiet?
- Do members who use the app shop more often than card-only members, or do they simply spend more per visit when they do come?
- How long does it take a newly enrolled member to reach the basket size of an established one, and does that ramp differ by tier?

## Joins

- [Store](./store.md) — `home_store_id = store_id` — The member's home store.
