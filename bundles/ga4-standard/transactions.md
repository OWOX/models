---
title: "Transactions"
description: |
  One row per purchase, deduplicated by its transaction ID: when GA4 records the same order
  more than once within the deduplication window (7 days in the runbook's setup), only the
  first is kept. Revenue is in the currency the site reported. Per deduplication window, at
  most one purchase with the ID `(not set)` and one with an empty ID are kept, so their
  revenue is understated. Purchases on events without a `user_pseudo_id` are missing.
  `status` is always empty and `touchpoint` is always `WEB`; both are slots. Join to
  Sessions on `date` and `pseudo_session_id` for the source and device behind each order.
  Totals here can differ from the purchase counts on Sessions, which are not deduplicated.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 05 · [05_transactions.sql](./references/sql-transformation/05_transactions.sql)
- **Destination table:** `transactions`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging), including the `{{tdw}}` days before the window

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the purchase's session. |
| `pseudo_session_id` | STRING | Session Key | PK. The session the purchase was made in: the GA4 pseudo user ID plus the session's number on that day. Join to Sessions on this and `date` together. FK to [Sessions](./sessions.md) |
| `transactionId` | STRING | Transaction ID | PK. The order ID the site sent with the `purchase` event. `(not set)` and empty IDs each stand for many purchases collapsed into one. |
| `transactionRevenue` | FLOAT | Revenue | Revenue of the purchase, in the currency the site reported it in. |
| `status` | STRING | Status | Always empty. A slot for an order status from another source. |
| `touchpoint` | STRING | Touchpoint | Always `WEB`. |

# Example Questions

- Which campaigns bring the most purchase revenue?
- What is the average order value by `device` category?
- How much revenue comes from customers on their first visit?

## Joins

- [Sessions](./sessions.md) — `date = date` AND `pseudo_session_id = pseudo_sessionId` [N:1] — The session the purchase was made in.
  - [Session Device](./devices.md) — The device the purchase was made on.
  - [Session Geo](./geo.md) — Where the buyer was when the purchase was made.
  - [Session Traffic Source](./traffic-sources.md) — The source and campaign of the session the purchase was made in.
  - [Session User Traffic Source](./user-traffic-sources.md) — How the buyer was first acquired.
  - [Session User](./users.md) — The browser or app instance that made the purchase.
