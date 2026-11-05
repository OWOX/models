---
type: Reference
title: "GA 360 Standard Data Model — SQL Transformation runbook"
description: |
  How to build the GA 360 Standard Data Model's tables from a Google Analytics 360 BigQuery
  export: the Variables every Operation reads, the twelve Operations in run order, how to
  load history and then run daily, and the limits a reader of the tables has to know about.
tags: ["owox", "ga360", "reference"]
---

# GA 360 Standard Data Model — SQL Transformation runbook

The SQL in this folder is written for the
[OWOX Transformations plugin](https://github.com/OWOX/transformations-plugin), in the
BigQuery (GoogleSQL) dialect. Adapt it to your needs. Each `.sql` file is one Operation,
and its header comment names the destination table, the write mode and the Variables it
reads.

The model reads the Google Analytics 360 export (`ga_sessions_*` tables) and writes twelve
tables into one dataset of yours: two staging tables, `_temp_objects` and
`_temp_transactions`, and the ten tables the data marts of this model describe.

## Variables

Every input is a Variable. The text of a Variable is pasted into the SQL as it is, so a
date Variable must hold a SQL expression that returns a `YYYYMMDD` string.
A bare date such as `20230101` fails, because BigQuery reads it as a number.
Write a fixed date as `CAST('20230101' AS STRING)`.

| Variable | Type | Example | Meaning |
|----------|------|---------|---------|
| `{{source_project_id}}` | String | `my-company-analytics` | The Google Cloud project that holds the GA 360 export. |
| `{{source_dataset_id}}` | String | `123456789` | The dataset of the GA 360 export, the one with the `ga_sessions_YYYYMMDD` tables. |
| `{{project_id}}` | String | `my-company-dwh` | The Google Cloud project where this model's tables live. |
| `{{dataset_id}}` | String | `ga360_standard` | The dataset where this model's tables live, staging included. |
| `{{start_suffix}}` | String | `FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))` | First day of the window, inclusive. For a fixed day: `CAST('20230101' AS STRING)`. |
| `{{end_suffix}}` | String | `FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))` | Last day of the window, inclusive. For a fixed day: `CAST('20230131' AS STRING)`. |
| `{{tdw}}` | Integer | `7` | Transaction deduplication window, in days: how far back a transaction ID is looked up so that a repeated purchase is loaded once. |

## Operations

Run them in this order, all in one Transformation. Operation 01 replaces `_temp_objects`
with the window's page views, pages, events, event details and purchases. Operation 02
appends the window's purchases to `_temp_transactions`. The table Operations read these two
staging tables or the export itself.

| # | SQL file | Destination table | Write mode | Variables |
|---|----------|-------------------|------------|-----------|
| 01 | [01_temp_objects.sql](./01_temp_objects.sql) | `_temp_objects` (staging) | Overwrite | `{{source_project_id}}`, `{{source_dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 02 | [02_temp_transactions.sql](./02_temp_transactions.sql) | `_temp_transactions` (staging) | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 03 | [03_sessions.sql](./03_sessions.sql) | `sessions` | Append | `{{source_project_id}}`, `{{source_dataset_id}}`, `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}`, `{{tdw}}` |
| 04 | [04_pageviews.sql](./04_pageviews.sql) | `pageviews` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 05 | [05_events.sql](./05_events.sql) | `events` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 06 | [06_transactions.sql](./06_transactions.sql) | `transactions` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}`, `{{tdw}}` |
| 07 | [07_geo.sql](./07_geo.sql) | `geo` | Append | `{{source_project_id}}`, `{{source_dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 08 | [08_devices.sql](./08_devices.sql) | `devices` | Append | `{{source_project_id}}`, `{{source_dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 09 | [09_trafficsources.sql](./09_trafficsources.sql) | `trafficsources` | Append | `{{source_project_id}}`, `{{source_dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 10 | [10_users.sql](./10_users.sql) | `users` | Append | `{{source_project_id}}`, `{{source_dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 11 | [11_page.sql](./11_page.sql) | `page` | Append | `{{project_id}}`, `{{dataset_id}}` |
| 12 | [12_eventinfo.sql](./12_eventinfo.sql) | `eventinfo` | Append | `{{project_id}}`, `{{dataset_id}}` |

Operations 11 and 12 take no date Variables: they read the whole of `_temp_objects`, which
holds only the window of the current run.

## The daily window

Choose it before the first run. A change later loads some days twice or skips them.

The daily window is one day, `D-1`, yesterday:
`FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))`.
Use the same expression to end the first run and in every daily run.

A day whose `ga_sessions_YYYYMMDD` table is not in the export yet when the run starts is
not loaded, and the next daily run does not come back for it. Schedule the daily run after
the export of the day has landed.

The window expression calls `CURRENT_DATE()`, which every Operation evaluates when it
starts, so a run that crosses 00:00 UTC can stage one day and build the tables from
another. Schedule the run well away from midnight UTC.

## First run: load the history

Start from empty tables. The first run must end on the same day as the daily window, so
that the first daily run continues it without overlap.

1. Create the dataset `{{dataset_id}}` in the same location as the GA 360 export.
2. Set `{{source_project_id}}`, `{{source_dataset_id}}`, `{{project_id}}` and `{{dataset_id}}`.
3. Set `{{tdw}}` to `7`, unless you have a reason to differ.
4. Set `{{start_suffix}}` to the first day of history, for example `CAST('20230101' AS STRING)`.
5. Set `{{end_suffix}}` to the expression of the daily window, `D-1`.
6. Run Operations 01 to 12 once, in order.

A long history scans the whole export in one run. To load it in parts, use consecutive
windows that do not overlap, oldest first: purchase deduplication reads the days before
each window from `_temp_transactions`. Run all twelve Operations for one part before you
start the next, because Operation 01 replaces `_temp_objects`. The last part ends as in
step 5.

## Daily run

Each daily run loads one day.

1. Set `{{start_suffix}}` and `{{end_suffix}}` both to the expression of the daily window,
   `D-1`.
2. Keep every other Variable as it was for the first run.
3. Start the daily runs on the day after the first run. A daily run on the same day as the
   first run loads its last day again.
4. Run Operations 01 to 12 once a day, in order, after the export of that day has landed.

## Limits

These come from the 2022 design of the model and are kept on purpose.

- **A rerun duplicates.** Every Operation except 01 appends. A window loaded twice, in full
  or in part, is in every table twice. To redo a window, delete its rows first: by `date`
  in `_temp_transactions`, `sessions`, `pageviews`, `events` and `transactions`. The
  dimension tables cannot be cleaned by date; read them deduplicated, as below.
- **Dimension hashes repeat across runs.** `geo`, `devices`, `trafficsources`, `users`,
  `page` and `eventinfo` have no date column. Each run appends every combination its window
  holds, so a hash repeats once per run (once per day for daily runs). Count distinct
  hashes. In your own SQL over these tables, deduplicate a dimension before you join to it,
  or the join multiplies rows; OWOX Data Marts reports collapse joined fields per source
  row.
- **Purchase deduplication depends on staging.** Operations 03 and 06 read the `{{tdw}}`
  days before the window from `_temp_transactions`, and keep the earliest purchase of each
  transaction ID: at most one per ID per deduplication window. It works only while staging
  still holds those days, so do not expire or truncate `_temp_transactions` to less than
  `{{tdw}}` days.
- **`_temp_transactions` grows with every run, and so does the cost.** Operation 02 appends
  to it on every run and nothing cleans it, and Operations 03 and 06 read it on every run.
  The model needs only the last `{{tdw}}` days of it before the next run's window. Delete
  older rows regularly, by `date`, to keep the daily cost flat.
- **`hitId` is stable for a rerun of the same window, not across different windows.**
- **Page views and events number their hits separately.** `hitId` identifies a row within
  `pageviews` or within `events`, not across the two.
- **`events.pageHash` holds the event hash.** Despite its name, it joins
  `eventinfo.eventHash`, not `page`.
- **`users` is built from the client ID alone.** Its other identifier columns are empty.
  Where the export carries no `clientId`, as in Google's public sample, every session gets
  the same `userHash`, and `users` holds one row per run.
- **Time units differ by column.** `sessions.visitStartTime` is in seconds since 1970-01-01
  UTC. The `time` of page views and events is in milliseconds since 1970-01-01 UTC.
  `sessions.timeOnSite` is in whole seconds with the fraction cut off, so a session with
  one hit shows 0.
- **Revenue is in millionths.** `transactionRevenue` in `sessions` and `transactions` is
  the value multiplied by 1,000,000, as Google's export stores it. Divide by 1,000,000.
- **Cost columns are empty.** `cost`, `impressions` and `clicks` in `sessions` are always 0,
  slots for ad cost data blended in later.
- **Hashes are fingerprints of joined text.** Each `*Hash` is the `FARM_FINGERPRINT` of its
  attributes concatenated without a separator, with an empty value in place of NULL.

## Do not

- Do not run two windows that overlap.
- Do not run Operations 02 to 12 for a window before Operation 01 has run for that window.
- Do not run Operations 03 and 06 for a window before Operation 02 has run for that window.
- Do not start Operation 01 for a new window before Operations 02 to 12 have run for the
  previous one: it replaces `_temp_objects`.
- Do not edit the SQL to set a window, a project or a dataset: every input is a Variable.
