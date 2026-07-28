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
timestamp: 2026-07-28T16:51:42.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | STRING | PK. Unique identifier of the browsing session. |
| `date` | DATE | Date the session took place. FK to [Ad Spend](./ad-spend.md) |
| `visitor_id` | STRING | Visitor who ran the session. FK to [Visitors](./visitors.md) |
| `customer_id` | STRING | Customer the session belongs to, when the visitor was recognised. |
| `traffic_source_id` | STRING | Traffic source that produced the session. FK to [Traffic Sources](./traffic-sources.md) |
| `landing_page_id` | STRING | First page of the session. FK to [Pages](./pages.md) |
| `device_category` | STRING | Type of device used during the session, such as mobile, desktop or tablet. |
| `country` | STRING | Country the session came from. |
| `session_count` | INTEGER | Always one, so sessions can be summed without counting distinct identifiers. |
| `pageview_count` | INTEGER | Number of pages viewed during the session. |
| `is_conversion` | BOOLEAN | Whether the session ended in an order of any kind. |
| `is_subscription_conversion` | BOOLEAN | Whether a subscription was started during the session. |
| `source` | STRING | Platform or site the traffic came from, used to align sessions with advertising spend. FK to [Ad Spend](./ad-spend.md) |
| `medium` | STRING | Channel type of the traffic, such as cost-per-click or organic. FK to [Ad Spend](./ad-spend.md) |
| `campaign` | STRING | Marketing campaign that produced the session. |

# Example Questions

- Which channels and campaigns produce sessions that start `subscriptions`, not just sessions that convert once?
- How does conversion differ across devices, markets and landing `pages`?
- What does a `subscription` sign-up cost by channel, compared with a one-time `order`?

## Joins

- [Ad Spend](./ad-spend.md) — `date = date`, `source = source`, `medium = medium`
- [Pages](./pages.md) — `landing_page_id = page_id`
- [Traffic Sources](./traffic-sources.md) — `traffic_source_id = traffic_source_id`
- [Visitors](./visitors.md) — `visitor_id = visitor_id`
