---
title: "Exchange Rates"
description: |
  Daily foreign exchange rates published by the Bank of Canada, one row per currency pair per `date`. `label` is the pair as the connector names it: the Valet series name without its leading `FX`, for example `USDCAD` from the series `FXUSDCAD`. `rate` is Canadian dollars per one unit of the foreign currency.

  The Bank publishes on business days, so weekends and holidays have no rows. Join it to your own data on `date` and the currency in `label`, and fill the gaps with the last earlier rate.
tags: ["owox", "connector", "bank-of-canada"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/85b150c4b17b90310a8588793ebdc2c3f9b19faf/packages/connectors/src/Sources/BankOfCanada/BankOfCanadaAPIReference/ObservationsFields.js"
    title: "OWOX Data Marts Bank of Canada connector — Exchange Rates endpoint (`observations/group`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://www.bankofcanada.ca/valet/docs"
    title: "Bank of Canada Valet API reference — Exchange Rates"
---

## Connector endpoint

- **Endpoint:** Bank of Canada · `observations/group`
- **Default destination table:** `bank_of_canada_exchange_rates`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
- **Unique keys:** `date`, `label`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The date for which the exchange rate was recorded. |
| `label` | STRING | Label | PK. The currency pair, written as the Valet series name without its leading `FX`, such as `USDCAD` for the US dollar; it is not a bare currency code. |
| `rate` | FLOAT | Rate | The Bank of Canada's daily average rate in Canadian dollars per one unit of the foreign currency; an indicative rate averaged from financial institutions' quotes. |

# Example Questions

- What was the rate of each currency against the Canadian dollar on a given day?
- How did the US dollar rate change from one month to the next over the last year?
- Which dates in the last month have no rate, and what was the last published rate before each?
