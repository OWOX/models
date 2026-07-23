---
type: "OWOX Data Mart"
title: "Support Tickets"
description: |
  Every support interaction — priority, topic, satisfaction score, time to first response, and
  resolution time. Support experience is an early churn-risk signal: unhappy, slow-to-resolve
  accounts are the ones that quietly leave.
tags: ["owox"]
timestamp: 2026-07-23T12:51:28.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ticket_id` | STRING | PK. Unique support-ticket identifier. |
| `account_id` | STRING | Account that opened the ticket. FK to [Account](./account.md) |
| `user_id` | STRING | User who opened the ticket, if attributable. FK to [User](./user.md) |
| `opened_at` | TIMESTAMP | When the ticket was opened. |
| `closed_at` | TIMESTAMP | When the ticket was closed. |
| `priority` | STRING | Ticket priority level. |
| `category` | STRING | Ticket topic/category. |
| `csat_score` | INTEGER | Customer satisfaction rating for the ticket. |
| `first_response_mins` | INTEGER | Minutes to first agent response. |

# Example Questions

- How do satisfaction scores and response times relate to whether an account later churns?
- Which ticket categories drive the most dissatisfaction and the heaviest support load?
- Do accounts that raise many high-priority tickets expand less than smoother ones?

## Joins

- [Account](./account.md) — `account_id = account_id`
- [User](./user.md) — `user_id = user_id`
