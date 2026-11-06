---
title: "Public Holidays"
description: |
  One row per holiday of one country: the holiday `id`, its `date`, its `name` in the configured language, its `type`, whether it applies nationwide, and its regional and temporal scope. The API's types are Public, Bank, Optional, School, BackToSchool and EndOfLessons, its regional scope is National, Regional or Local, and its temporal scope is FullDay or HalfDay.

  `date` is the holiday's start date. A holiday that lasts several days has one row, and its end date is not loaded. Join the table to a daily table on `date` to flag holidays.
tags: ["owox", "connector", "open-holidays"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8976dca754f46df2f1d938a421ea18bb8ce04ba2/packages/connectors/src/Sources/OpenHolidays/OpenHolidaysAPIReference/OpenHolidaysFieldsSchema.js"
    title: "OWOX Data Marts Open Holidays connector — Public Holidays endpoint (`publicHolidays`)"
  - id: "vendor-reference"
    resource: "https://www.openholidaysapi.org/en/"
    title: "OpenHolidays API reference — en"
---

## Connector endpoint

- **Endpoint:** Open Holidays · `publicHolidays`
- **Default destination table:** `open_holidays_public_holidays`
- **Unique keys:** `id`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. Unique identifier for the holiday |
| `date` | DATE | Date of the holiday |
| `name` | STRING | Name of the holiday in the specified language |
| `type` | STRING | Type of holiday (public, school, etc.) |
| `regionalScope` | STRING | Regional scope of the holiday |
| `temporalScope` | STRING | Temporal scope of the holiday |
| `nationwide` | BOOLEAN | Whether the holiday is nationwide |

# Example Questions

- Which holidays fall on a weekday next month?
- How many holidays of each type does the country have in the year?
- Which holidays are not nationwide, and what is their regional scope?
