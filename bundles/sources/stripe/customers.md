---
title: "Customers"
description: |
  Every customer: identity, billing country, delinquency and account balance. The join to orders, CRM and ad-platform conversions by email or stored ids.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/customers"
    title: "Stripe API reference — Customers"
---

## Connector endpoint

- **Endpoint:** Stripe · `customers`
- **Default destination table:** `stripe_customers`
- **Manifest version:** 1.0
- **Stripe API version:** 2024-06-20
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `name` | STRING | Name | Customer or company name. |
| `email` | STRING | Email | Customer email. |
| `balance` | INTEGER | Balance | Account balance in the smallest currency unit (cents for USD): negative means credit the next invoice applies, positive means owed. |
| `created` | INTEGER | Created | When Stripe created the object, as Unix time in seconds (UTC); TIMESTAMP_SECONDS(created) in SQL. The field the daily window filters on. |
| `currency` | STRING | Currency | Three-letter ISO code of the currency the customer can be charged in for recurring billing; null when none is set. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `metadata` | STRING | Metadata | Metadata object your systems attached as a JSON string. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `delinquent` | BOOLEAN | Delinquent | True after an automatic payment failure or a passed due date on one of the customer's invoices; paying an invoice or marking it uncollectible sets it back to false, so it reflects the latest invoice change, not every open invoice. |
| `tax_exempt` | STRING | Tax Exempt | none, exempt or reverse. |
| `description` | STRING | Description | Free-text description. |
| `address_city` | STRING | Address City | Billing city. |
| `default_source` | STRING | Default Source | Legacy default source id. |
| `invoice_prefix` | STRING | Invoice Prefix | Prefix Stripe uses for this customer's invoice numbers. |
| `address_country` | STRING | Address Country | Two-letter country of the billing address. |
| `default_payment_method` | STRING | Default Payment Method | Default payment method id for invoices. |

# Example Questions

- How many paying customers do we have, and how many are delinquent?
- Which customers were created this month, and which ad campaign brought them (joined on email or metadata)?
