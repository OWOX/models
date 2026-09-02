---
title: "Sessions"
description: |
  Every browsing session on the storefront, with the device it happened on, the market it came
  from, the traffic source and campaign that produced it, the page it started on, and what it
  ended in. Sessions are the hinge of the model: advertising spend attaches on one side and
  orders on the other, which is what lets acquisition cost be weighed against the revenue it
  returns.

  Conversions are recorded twice over on purpose — whether the session produced an order at all,
  and whether it started a subscription. Those are different outcomes worth very different
  amounts, and a channel that produces plenty of the first and none of the second is exactly what
  the distinction is there to expose.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:21:30.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `session_id` | STRING | Session ID | PK. Unique identifier of the browsing session. |
| `date` | DATE | Date | Date the session took place. FK to [Ad Spend](./ad-spend.md) |
| `visitor_id` | STRING | Visitor ID | Visitor who ran the session. FK to [Visitors](./visitors.md) |
| `customer_id` | STRING | Customer ID | Customer the session belongs to, when the visitor was recognised. |
| `traffic_source_id` | STRING | Traffic Source ID | Traffic source that produced the session. FK to [Traffic Sources](./traffic-sources.md) |
| `landing_page_id` | STRING | Landing Page ID | First page of the session. FK to [Pages](./pages.md) |
| `device_category` | STRING | Device Category | Type of device used during the session, such as mobile, desktop or tablet. |
| `country` | STRING | Country | Country the session came from. |
| `session_count` | INTEGER | Session Count | Always one, so sessions can be summed without counting distinct identifiers. |
| `pageview_count` | INTEGER | Pageview Count | Number of pages viewed during the session. |
| `is_conversion` | BOOLEAN | Is Conversion | Whether the session ended in an order of any kind. |
| `is_subscription_conversion` | BOOLEAN | Is Subscription Conversion | Whether a subscription was started during the session. |
| `source` | STRING | Source | Platform or site the traffic came from, used to align sessions with advertising spend. FK to [Ad Spend](./ad-spend.md) |
| `medium` | STRING | Medium | Channel type of the traffic, such as cost-per-click or organic. FK to [Ad Spend](./ad-spend.md) |
| `campaign` | STRING | Campaign | Marketing campaign that produced the session; empty for traffic that runs no campaign, such as organic, direct and referral. FK to [Ad Spend](./ad-spend.md) |

# Example Questions

- Which channels and campaigns produce sessions that start `subscriptions`, not just sessions that convert once?
- How does conversion differ across devices, markets and `landing pages`?
- What does a `subscription sign-up` cost by channel, compared with a `one-time order`?

## Joins

- [Ad Spend](./ad-spend.md) — `date = date`, `source = source`, `medium = medium`, `campaign = campaign` — Spend on the same day and channel — a cohort match, not this visit's cost.
- [Pages](./pages.md) — `landing_page_id = page_id` — The page the visit landed on.
- [Traffic Sources](./traffic-sources.md) — `traffic_source_id = traffic_source_id` — The channel that drove this visit.
- [Visitors](./visitors.md) — `visitor_id = visitor_id` — The visitor who browsed.
