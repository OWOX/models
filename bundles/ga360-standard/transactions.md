---
title: "Transactions"
description: |
  One row per purchase, deduplicated by transaction ID: when the export records the same ID
  more than once within the deduplication window (7 days in the runbook's setup), only the
  earliest is kept, so there is at most one row per ID per deduplication window. `transactionRevenue`
  is in millionths, as Google's export stores it: divide by 1,000,000. `status` is always
  empty and `touchpoint` is always `WEB`; both are slots. Join to Sessions on `date` and
  `sessionId` for the source, device and location behind each order. The purchase counts on
  Sessions are deduplicated the same way.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 06 · [06_transactions.sql](./references/sql-transformation/06_transactions.sql)
- **Destination table:** `transactions`
- **Write mode:** Append
- **Built from:** `_temp_transactions` (staging), including the `{{tdw}}` days before the window

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day of the export table the purchase was read from, in the property's time zone. |
| `sessionId` | STRING | Session ID | PK. The session the purchase was made in: the full visitor ID and the visit ID, joined by `_`. Join to Sessions on this and `date` together. FK to [Sessions](./sessions.md) |
| `transactionId` | STRING | Transaction ID | PK. The order ID the site sent with the purchase. At most one row per ID per deduplication window: the earliest. |
| `transactionRevenue` | FLOAT | Revenue (millionths) | Revenue of the purchase, multiplied by 1,000,000 as Google's export stores it; divide by 1,000,000 for the amount. |
| `status` | STRING | Status | Always empty. A slot for an order status from another source. |
| `touchpoint` | STRING | Touchpoint | Always `WEB`. |

# Example Questions

- Which campaigns bring the most purchase revenue?
- What is the average order value by `device` category?
- Which countries do our buyers come from?

## Joins

- [Sessions](./sessions.md) — `date = date` AND `sessionId = sessionId` [N:1] — The session the purchase was made in.
  - [Session Device](./devices.md) — The device the purchase was made on.
  - [Session Geo](./geo.md) — Where the buyer was when the purchase was made.
  - [Session Traffic Source](./traffic-sources.md) — The source and campaign of the session the purchase was made in.
  - [Session User](./users.md) — The browser that made the purchase; one shared user when the export has no client ID.
