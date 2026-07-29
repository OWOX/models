---
title: "Plan"
description: |
  The price book: every sellable plan and price point — four tiers (Starter, Pro, Business,
  Enterprise), each offered monthly or annually, with its list price and whether it is
  currently sellable. The reference that gives every subscription its list pricing.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-23T12:51:26.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `plan_id` | STRING | Plan ID | PK. Unique plan/price-point identifier. |
| `plan_name` | STRING | Plan Name | Human-readable plan name (tier + billing interval). |
| `tier` | STRING | Tier | Product tier: Starter / Pro / Business / Enterprise. |
| `billing_interval` | STRING | Billing Interval | Billing cadence: monthly / annual. |
| `list_price` | NUMERIC | List Price | Published list price for this plan at this interval. |
| `currency` | STRING | Currency | Currency of the list price. |
| `is_active` | BOOLEAN | Is Active | Whether the plan is currently sellable. |

# Example Questions

- How does list pricing step up across tiers, and what is the effective saving for paying annually?
- Which tiers and billing intervals are actually being sold the most?
- How much revenue sits on plans that are no longer offered to new customers?
