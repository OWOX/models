---
title: "Bank of Canada"
description: |
  What the OWOX Data Marts Bank of Canada connector loads: the daily exchange rates the Bank of Canada publishes, in one table. The connector reads the Valet API group of daily foreign exchange rates (`FX_RATES_DAILY`) and writes one row per currency pair per day.

  The rate is the number of Canadian dollars for one unit of the foreign currency, so `USDCAD` is Canadian dollars per US dollar. There is nothing to join: the table carries no key that points at another table, and a rate is joined to your own data by `date` and the currency in `label`.
tags: ["owox", "index", "connector", "bank-of-canada"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/85b150c4b17b90310a8588793ebdc2c3f9b19faf/packages/connectors/src/Sources/BankOfCanada"
    title: "OWOX Data Marts — Bank of Canada connector source"
---

1 tables, 3 fields, 0 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Exchange Rates](./exchange-rates.md) | 3 | Daily foreign exchange rates from Bank of Canada. |

# Example Questions

- What was the US dollar worth in Canadian dollars on each day of the last year?
- Which currencies moved the most against the Canadian dollar this month?
- How would last quarter's foreign-currency sales look converted to Canadian dollars at the rate of each sale's date?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/bank-of-canada)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![Bank of Canada model diagram](../../res/screens/sources/bank-of-canada.svg)
