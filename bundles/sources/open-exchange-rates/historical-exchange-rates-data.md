---
title: "Historical exchange rates data"
description: |
  Historical exchange rates: one row per `date`, `base` currency and target `currency`, with the `rate` of one unit of the base in that currency. The base is repeated on every row because it can be changed, so a table loaded with several bases keeps them apart.

  Open Exchange Rates publishes the last value of each UTC day; a request for today's date returns the most recent rate rather than an end-of-day value. Which currencies are loaded depends on the symbols the connector is configured with.
tags: ["owox", "connector", "open-exchange-rates"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/85b150c4b17b90310a8588793ebdc2c3f9b19faf/packages/connectors/src/Sources/OpenExchangeRates/OpenExchangeRatesAPIReference/OpenExchangeRatesFieldsSchema.js"
    title: "OWOX Data Marts Open Exchange Rates connector — Historical exchange rates data endpoint (`historical`)"
  - id: "vendor-reference"
    resource: "https://docs.openexchangerates.org/reference/historical-json"
    title: "Open Exchange Rates API reference — historical-json"
---

## Connector endpoint

- **Endpoint:** Open Exchange Rates · `historical`
- **Default destination table:** `open_exchange_rates_historical`
- **Unique keys:** `date`, `base`, `currency`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | PK. Date of exchange rate |
| `base` | STRING | PK. Base currency |
| `currency` | STRING | PK. Target currency |
| `rate` | NUMERIC | Exchange rate |

# Example Questions

- What was the rate between the base currency and a given currency on each day of a month?
- Which currency had the largest percentage change against the base over the last quarter?
- What was the average monthly rate for each currency over the last year?
