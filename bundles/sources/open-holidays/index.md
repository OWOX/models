---
title: "Open Holidays"
description: |
  What the OWOX Data Marts Open Holidays connector loads: the public holidays of one country, in one table. The connector asks the OpenHolidays API for the holidays of the configured country and language between the start and end dates and writes one row per holiday.

  There is nothing to join: the table carries no country or language column, because one run loads one country in one language, and it has no key that points at another table. Join it to your own data on `date`, for example to tell a working day from a public holiday in a daily sales or traffic table.
tags: ["owox", "index", "connector", "open-holidays"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/8976dca754f46df2f1d938a421ea18bb8ce04ba2/packages/connectors/src/Sources/OpenHolidays"
    title: "OWOX Data Marts — Open Holidays connector source"
---

1 tables, 7 fields, 0 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Public Holidays](./public-holidays.md) | 7 | Contains public holidays data for different countries and languages |

# Example Questions

- Which days of the year are public holidays in the configured country?
- How do daily orders on public holidays compare with the days around them?
- Which holidays apply only in some regions and not nationwide?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/open-holidays)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![Open Holidays model diagram](../../res/screens/sources/open-holidays.svg)
