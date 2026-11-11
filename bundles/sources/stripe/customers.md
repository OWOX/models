---
title: "Customers"
description: |
  Every customer: identity, billing country, delinquency and account balance. The join to orders, CRM and ad-platform conversions by email or stored ids.
tags: ["owox", "connector", "stripe"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://docs.stripe.com/api"
    title: "OWOX Data Marts — Stripe custom connector (Stripe, 14 nodes) on the Stripe REST API, Stripe-Version 2024-06-20"
  - id: "vendor-reference"
    resource: "https://docs.stripe.com/api/customers"
    title: "Stripe API reference — Customers"
---

## Connector endpoint

- **Endpoint:** Stripe · `customers`
- **Default destination table:** `stripe_customers`
- **Unique keys:** `id`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Stripe object id, unique across the account. |
| `account_id` | STRING | Account ID | Your Stripe account id (acct_…) as entered in the connector; lets several Stripe accounts share one table. |
| `livemode` | BOOLEAN | Livemode | true for live-mode objects, false for test mode. |
| `created` | TIMESTAMP | Created | When Stripe created the object (UTC). The field the daily window filters on. |
| `email` | STRING | Email | Customer email. |
| `name` | STRING | Name | Customer or company name. |
| `description` | STRING | Description | Free-text description. |
| `currency` | STRING | Currency | Currency the customer is billed in, set after the first invoice. |
| `delinquent` | BOOLEAN | Delinquent | true when the latest invoice is unpaid past its due date. |
| `balance` | INTEGER | Balance | Account balance in the smallest currency unit (cents for USD): negative means credit the next invoice applies, positive means owed. |
| `default_payment_method` | STRING | Default Payment Method | Default payment method id for invoices. |
| `default_source` | STRING | Default Source | Legacy default source id. |
| `address_country` | STRING | Address Country | Two-letter country of the billing address. |
| `address_city` | STRING | Address City | Billing city. |
| `tax_exempt` | STRING | Tax Exempt | none, exempt or reverse. |
| `invoice_prefix` | STRING | Invoice Prefix | Prefix Stripe uses for this customer's invoice numbers. |
| `metadata` | JSON | Metadata | Metadata object your systems attached as a JSON string. |

# Example Questions

- How many paying customers do we have, and how many are delinquent?
- Which customers were created this month, and which ad campaign brought them (joined on email or metadata)?
