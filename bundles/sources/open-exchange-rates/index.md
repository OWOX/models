---
title: "Open Exchange Rates"
description: |
  What the OWOX Data Marts Open Exchange Rates connector loads: historical exchange rates, one row per day, base currency and target currency, in one table. For each day in the requested range the connector calls the historical endpoint and writes the `rates` object it returns as one row per currency.

  All rates on a row are relative to one unit of its `base` currency (US dollars unless another base is set, which Open Exchange Rates allows only on its Developer, Enterprise and Unlimited plans). There is nothing to join: the table carries no key that points at another table. Join it to your own data on `date` and the currency code.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`85b150c4b`](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf).
tags: ["owox", "index", "connector", "open-exchange-rates"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/85b150c4b17b90310a8588793ebdc2c3f9b19faf/packages/connectors/src/Sources/OpenExchangeRates"
    title: "OWOX Data Marts — Open Exchange Rates connector source"
    last_modified: 2026-05-21
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Historical exchange rates data](./historical-exchange-rates-data.md) | 4 | 2026-05-21 | Historical exchange rates: one row per `date`, `base` currency and target `currency`, with the `rate` of one unit of the base in that currency. |

# Example Questions

- What was one US dollar worth in euros on each day of the last year?
- Which currencies changed the most against the base currency over the last 30 days?
- How would last quarter's orders look converted to a single currency at the rate of each order's date?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/open-exchange-rates)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
