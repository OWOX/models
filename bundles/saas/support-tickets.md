---
title: "Support Tickets"
description: |
  Every support interaction — priority, topic, satisfaction score, time to first response, and
  resolution time. Support experience is an early churn-risk signal: unhappy, slow-to-resolve
  accounts are the ones that quietly leave.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-09-02T16:01:59.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `ticket_id` | STRING | Ticket ID | PK. Unique support-ticket identifier. |
| `account_id` | STRING | Account ID | Account that opened the ticket. FK to [Account](./account.md) |
| `user_id` | STRING | User ID | User who opened the ticket, if attributable. FK to [User](./user.md) |
| `opened_at` | TIMESTAMP | Opened At | When the ticket was opened. |
| `closed_at` | TIMESTAMP | Closed At | When the ticket was closed. |
| `priority` | STRING | Priority | Ticket priority level. |
| `category` | STRING | Category | Ticket topic/category. |
| `csat_score` | INTEGER | Csat Score | Customer satisfaction rating for the ticket. |
| `first_response_mins` | INTEGER | First Response Mins | Minutes to first agent response. |

# Example Questions

- How do satisfaction scores and response times relate to whether an `account` later churns?
- Which ticket categories drive the most dissatisfaction and the heaviest support load?
- Do `accounts` that raise many high-priority tickets expand less than smoother ones?

## Joins

- [Account](./account.md) — `account_id = account_id` — The account that opened the ticket.
- [User](./user.md) — `user_id = user_id` — The seat that opened the ticket, when known.
  - [Account](./account.md) — The account of the seat that opened the ticket.
