---
title: "Events"
description: |
  The audit trail: every change Stripe recorded, typed, with the id of the object it concerns. Stripe keeps 30 days; the daily load keeps history.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/events"
    title: "Stripe API reference — Events"
---

## Connector endpoint

- **Endpoint:** Stripe · `events`
- **Default destination table:** `stripe_events`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `type` | STRING | Type | Event type, e.g. invoice.paid, charge.succeeded, customer.subscription.deleted. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `object_id` | STRING | Object ID | Id of the object the event concerns. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `request_id` | STRING | Request ID | Id of the API request that caused the event; null for automatic events. |
| `api_version` | STRING | API Version | API version the event payload is rendered in. |
| `object_type` | STRING | Object Type | Type of that object: invoice, charge, subscription, … |
| `idempotency_key` | STRING | Idempotency Key | Idempotency key of that request. |
| `pending_webhooks` | INTEGER | Pending Webhooks | Webhooks still to be delivered for this event. |

# Example Questions

- What changed on `subscription` sub_… and when?
- How many invoice.payment_failed events fired this week?
