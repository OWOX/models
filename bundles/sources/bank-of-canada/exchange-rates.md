---
title: "Exchange Rates"
description: |
  Daily foreign exchange rates published by the Bank of Canada, one row per currency pair per `date`. `label` is the pair as the connector names it: the Valet series name without its leading `FX`, for example `USDCAD` from the series `FXUSDCAD`. `rate` is Canadian dollars per one unit of the foreign currency.

  The Bank publishes on business days, so weekends and holidays have no rows. Join it to your own data on `date` and the currency in `label`, and fill the gaps with the last earlier rate.
tags: ["owox", "connector", "bank-of-canada"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/85b150c4b17b90310a8588793ebdc2c3f9b19faf/packages/connectors/src/Sources/BankOfCanada/BankOfCanadaAPIReference/BankOfCanadaFieldsSchema.js"
    title: "OWOX Data Marts Bank of Canada connector — Exchange Rates endpoint (`observations/group`)"
  - id: "vendor-reference"
    resource: "https://www.bankofcanada.ca/valet/docs"
    title: "Bank of Canada Valet API reference — docs"
---

## Connector endpoint

- **Endpoint:** Bank of Canada · `observations/group`
- **Default destination table:** `bank_of_canada_exchange_rates`
- **Unique keys:** `date`, `label`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The date for which the exchange rate was recorded. |
| `label` | STRING | Label | PK. The currency code (e.g., USD, EUR, GBP). |
| `rate` | NUMERIC | Rate | The exchange rate value. |

# Example Questions

- What was the rate of each currency against the Canadian dollar on a given day?
- How did the US dollar rate change from one month to the next over the last year?
- Which dates in the last month have no rate, and what was the last published rate before each?
