---
title: "QuickBooks Online"
description: |
  What the OWOX Data Marts QuickBooks Online connector loads from Intuit, and how the tables fit together.
  Everything belongs to one company file: every table carries `realm_id`, Intuit's company id, and joins to
  [Company info](./company-info.md) on it.
  
  The chart of accounts is the spine. Sales transactions ([Invoices](./invoices.md), [Sales receipts](./sales-receipts.md),
  [Credit memos](./credit-memos.md), [Refund receipts](./refund-receipts.md)) hang off [Customers](./customers.md) and settle
  through [Payments](./payments.md) and [Deposits](./deposits.md); purchase transactions ([Bills](./bills.md), [Bill payments](./bill-payments.md),
  [Purchases](./purchases.md)) hang off [Vendors](./vendors.md); both sides post to [Accounts](./accounts.md). [Items](./items.md)
  carry the income and expense accounts that turn line items into margin. Line arrays stay as JSON (`line`) and unnest in SQL.
  
  The eight report tables are dated snapshots of what QuickBooks itself computes (Profit and Loss, Balance Sheet, Cash Flow,
  A/R and A/P aging, vendor expenses, general ledger detail, sales by customer). Their value is the reconciliation: rebuild
  the P&L from the transaction tables and compare it with the report for the same period. [Invoice changes](./invoice-changes-cdc-incl-deletes.md)
  is the change-data-capture feed that also surfaces hard deletes, which the query endpoint never returns.
  
  Definitions follow connector version 3 (2026-11-05) on the Intuit Accounting API v3, minorversion 75.
tags: ["owox", "index", "connector", "quickbooks"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://developer.intuit.com/app/developer/qbo/docs/api/accounting/all-entities/account"
    title: "OWOX Data Marts — QuickBooks Online custom connector (QuickBooksOnline, 26 nodes) on the Intuit Accounting API v3, minorversion 75"
    last_modified: 2026-11-06
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Accounts](./accounts.md) | 20 | The chart of accounts: every bank, receivable, payable, income, expense and equity account with its type, classification, parent and current balance. |
| [Customers](./customers.md) | 28 | Everyone the company sells to, including sub-customers and projects, with open balance, terms, currency and billing address. |
| [Invoices](./invoices.md) | 36 | Sales on credit: one row per invoice with customer, dates, total, open balance and the line items as JSON. |
| [Payments](./payments.md) | 21 | Money received from customers and how it was applied to invoices. |
| [Sales receipts](./sales-receipts.md) | 27 | Sales paid at the time of sale, without an invoice: customer, items, total and the account the money went to. |
| [Items](./items.md) | 25 | Products and services sold or bought, with price, cost, quantity on hand and the income and expense accounts each one posts to. |
| [Vendors](./vendors.md) | 19 | Everyone the company buys from, with open payable balance, terms and currency. |
| [Bills](./bills.md) | 25 | What the company owes vendors: one row per bill with vendor, dates, total, open balance and expense or item lines as JSON. |
| [Purchases](./purchases.md) | 26 | Expenses paid directly, without a bill: cash, check or card purchases with the account paid from and the payee. |
| [Bill payments](./bill-payments.md) | 23 | Payments made against bills, by check or credit card, with the vendor and the accounts involved. |
| [Credit memos](./credit-memos.md) | 23 | Credit given back to a customer, to be applied against invoices. |
| [Refund receipts](./refund-receipts.md) | 26 | Money returned to a customer from a bank or credit-card account. |
| [Journal entries](./journal-entries.md) | 15 | Manual accounting entries: adjusting, accrual and reclassification postings, with their debit and credit lines as JSON. |
| [Deposits](./deposits.md) | 21 | Bank deposits, including the ones that group undeposited customer payments, with the account deposited to. |
| [Transfers](./transfers.md) | 16 | Money moved between the company's own accounts, bank to bank or bank to credit card. |
| [Company info](./company-info.md) | 15 | The company file itself: legal and trading name, country, base currency and fiscal-year start. |
| [Preferences](./preferences.md) | 17 | How the company keeps its books: accrual or cash basis, whether classes, departments and multicurrency are on, default accounts and terms. |
| [Invoice changes (CDC, incl. deletes)](./invoice-changes-cdc-incl-deletes.md) | 9 | Change feed for invoices: every invoice created, updated or deleted since the last run, with deleted ones marked. |
| [Profit and Loss report](./profit-and-loss-report.md) | 12 | The Profit and Loss report as QuickBooks computes it, one dated snapshot per period with the report rows as JSON. |
| [Balance Sheet report](./balance-sheet-report.md) | 12 | The Balance Sheet as QuickBooks computes it: assets, liabilities and equity at each period end, one snapshot per period. |
| [Cash Flow report](./cash-flow-report.md) | 12 | The Statement of Cash Flows as QuickBooks computes it, one snapshot per period. |
| [A/R Aging Summary report](./a-r-aging-summary-report.md) | 11 | A/R Aging Summary: what each customer owes, split into current, 1–30, 31–60, 61–90 and over-90-day buckets, as of the report date. |
| [A/P Aging Summary report](./a-p-aging-summary-report.md) | 11 | A/P Aging Summary: what the company owes each vendor, split into aging buckets, as of the report date. |
| [Vendor Expenses report](./vendor-expenses-report.md) | 12 | Spend per vendor for the period, as QuickBooks reports it. |
| [General Ledger Detail report](./general-ledger-detail-report.md) | 12 | Every posting to every account in the period, as QuickBooks reports it. |
| [Sales by Customer report](./sales-by-customer-report.md) | 12 | Sales per customer for the period, as QuickBooks reports it. |

# Example Questions

- How much cash is on hand against the bills due this month, once bank `accounts`, open `bills` and overdue `invoices` are joined?
- Which `customers` are overdue, by how much and for how long, and how long do they usually take to pay?
- Does the profit and loss rebuilt from `invoices`, `bills` and `purchases` match the report QuickBooks produces for the same months, and where does it differ?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/quickbooks)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![QuickBooks Online model diagram](../../res/screens/sources/quickbooks.svg)
