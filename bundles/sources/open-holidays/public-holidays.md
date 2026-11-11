---
title: "Public Holidays"
description: |
  One row per holiday of one country: the holiday `id`, its `date`, its `name` in the configured language, its `type`, whether it applies nationwide, and its regional and temporal scope. This endpoint returns public holidays; `type` takes its value from the API's type list (Public, Bank, Optional and the school types, which its separate school-holiday endpoint uses); the regional scope is National, Regional or Local and the temporal scope is FullDay or HalfDay. `name` is the name in the configured language, or `Unknown` when the API has none in that language.

  `date` is the holiday's start date. A holiday that lasts several days has one row, and its end date is not loaded. Join the table to a daily table on `date` to flag holidays.
tags: ["owox", "connector", "open-holidays"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8976dca754f46df2f1d938a421ea18bb8ce04ba2/packages/connectors/src/Sources/OpenHolidays/OpenHolidaysAPIReference/PublicHolidaysFields.js"
    title: "OWOX Data Marts Open Holidays connector — Public Holidays endpoint (`publicHolidays`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://www.openholidaysapi.org/en/"
    title: "OpenHolidays API reference — Public Holidays"
---

## Connector endpoint

- **Endpoint:** Open Holidays · `publicHolidays`
- **Default destination table:** `open_holidays_public_holidays`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
- **Unique keys:** `id`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Unique identifier for the holiday |
| `date` | DATE | Date | The holiday's start date; the API's end date is not loaded, so a holiday that lasts several days shows only its first day. |
| `name` | STRING | Name | The holiday's name in the configured language, or `Unknown` when the API has no name in that language. |
| `type` | STRING | Type | The holiday type from the OpenHolidays list (Public, Bank, Optional, School, BackToSchool, EndOfLessons); `Unknown` when the API returns none. |
| `regionalScope` | STRING | Regional Scope | Where the holiday applies: National, Regional or Local; `Unknown` when the API returns none. |
| `temporalScope` | STRING | Temporal Scope | How much of the day the holiday covers: FullDay or HalfDay; `Unknown` when the API returns none. |
| `nationwide` | BOOLEAN | Nationwide | True when the holiday applies in the whole country; false when only some subdivisions observe it, and the connector does not load which ones. |

# Example Questions

- Which holidays fall on a weekday next month?
- How many holidays of each type does the country have in the year?
- Which holidays are not nationwide, and what is their regional scope?
