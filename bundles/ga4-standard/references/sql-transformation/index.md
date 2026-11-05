---
type: Reference
title: "GA4 Standard Data Model — SQL Transformation runbook"
description: |
  How to build the GA4 Standard Data Model's tables from a GA4 BigQuery export: the
  Variables every Operation reads, the eleven Operations in run order, how to load history
  and then run daily, and the limits a reader of the tables has to know about.
tags: ["owox", "ga4", "reference"]
---

# GA4 Standard Data Model — SQL Transformation runbook

The SQL in this folder is written for the
[OWOX Transformations plugin](https://github.com/OWOX/transformations-plugin), in the
BigQuery (GoogleSQL) dialect. Adapt it to your needs. Each `.sql` file is one Operation,
and its header comment names the destination table, the write mode and the Variables it
reads.

The model reads the GA4 export (`events_*` tables) and writes eleven tables into one
dataset of yours: a staging table, `_temp_sessions`, and the ten tables the data marts of
this model describe.

## Variables

Every input is a Variable. The text of a Variable is pasted into the SQL as it is, so a
date Variable must hold a SQL expression that returns a `YYYYMMDD` string.
A bare date such as `20230101` fails, because BigQuery reads it as a number.
Write a fixed date as `CAST('20230101' AS STRING)`.

| Variable | Type | Example | Meaning |
|----------|------|---------|---------|
| `{{source_project_id}}` | String | `my-company-analytics` | The Google Cloud project that holds the GA4 export. |
| `{{source_dataset_id}}` | String | `analytics_123456789` | The dataset of the GA4 export, the one with the `events_YYYYMMDD` tables. |
| `{{project_id}}` | String | `my-company-dwh` | The Google Cloud project where this model's tables live. |
| `{{dataset_id}}` | String | `ga4_standard` | The dataset where this model's tables live, staging included. |
| `{{start_suffix}}` | String | `FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))` | First day of the window, inclusive. For a fixed day: `CAST('20230101' AS STRING)`. |
| `{{end_suffix}}` | String | `FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))` | Last day of the window, inclusive. For a fixed day: `CAST('20230131' AS STRING)`. |
| `{{session_time}}` | Integer | `30` | Minutes without an event after which the next event starts a new session. |
| `{{tdw}}` | Integer | `7` | Transaction deduplication window, in days: how far back a purchase ID is looked up so that a repeated purchase is loaded once. |

## Operations

Run them in this order, all in one Transformation. Operation 01 builds the staging table
for the window; every other Operation reads it.

| # | SQL file | Destination table | Write mode | Variables |
|---|----------|-------------------|------------|-----------|
| 01 | [01_temp_sessions.sql](./01_temp_sessions.sql) | `_temp_sessions` (staging) | Append | `{{source_project_id}}`, `{{source_dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}`, `{{session_time}}` |
| 02 | [02_sessions.sql](./02_sessions.sql) | `sessions` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 03 | [03_events.sql](./03_events.sql) | `events` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 04 | [04_pageviews.sql](./04_pageviews.sql) | `pageviews` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 05 | [05_transactions.sql](./05_transactions.sql) | `transactions` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}`, `{{tdw}}` |
| 06 | [06_trafficsources.sql](./06_trafficsources.sql) | `trafficsources` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 07 | [07_usertrafficsources.sql](./07_usertrafficsources.sql) | `usertrafficsources` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 08 | [08_eventstrafficsources.sql](./08_eventstrafficsources.sql) | `eventstrafficsources` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 09 | [09_devices.sql](./09_devices.sql) | `devices` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 10 | [10_geo.sql](./10_geo.sql) | `geo` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |
| 11 | [11_users.sql](./11_users.sql) | `users` | Append | `{{project_id}}`, `{{dataset_id}}`, `{{start_suffix}}`, `{{end_suffix}}` |

## Choose the daily window

Choose it before the first run. A change later loads some days twice or skips them.

GA4 keeps rewriting a day's export table for up to 72 hours after the day ends.

- `D-1` loads yesterday: `FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))`.
  It is the fastest, but it misses events that arrive late.
- `D-3` loads the day three days ago: `FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 3 DAY))`.
  Its days are nearly complete, at three days' delay: the day ended only 48 to 72 hours
  before the run, so late events can still arrive after it.

A day whose `events_YYYYMMDD` table is not in the export yet when the run starts is not
loaded, and the next daily run does not come back for it. Schedule the daily run after the
export of the day has landed.

The window expressions call `CURRENT_DATE()`, which every Operation evaluates when it
starts, so a run that crosses 00:00 UTC can stage one day and build the tables from
another. Schedule the run well away from midnight UTC.

## First run: load the history

Start from empty tables. The first run must end on the same day as the chosen daily window,
so that the first daily run continues it without overlap.

1. Create the dataset `{{dataset_id}}` in the same location as the GA4 export.
2. Set `{{source_project_id}}`, `{{source_dataset_id}}`, `{{project_id}}` and `{{dataset_id}}`.
3. Set `{{session_time}}` to `30` and `{{tdw}}` to `7`, unless you have a reason to differ.
4. Set `{{start_suffix}}` to the first day of history, for example `CAST('20230101' AS STRING)`.
5. Set `{{end_suffix}}` to the expression of the chosen daily window, `D-1` or `D-3`.
6. Run Operations 01 to 11 once, in order.

A long history scans the whole export in one run. To load it in parts, use consecutive
windows that do not overlap, oldest first: purchase deduplication reads the days before
each window from `_temp_sessions`. The last part ends as in step 5.

## Daily run

Each daily run loads one day.

1. Set `{{start_suffix}}` and `{{end_suffix}}` both to the expression of the chosen daily
   window, `D-1` or `D-3`.
2. Keep every other Variable as it was for the first run.
3. Start the daily runs on the day after the first run. A daily run on the same day as the
   first run loads its last day again.
4. Run Operations 01 to 11 once a day, in order, after the export of that day has landed.

## Limits

These come from the 2022 design of the model and are kept on purpose.

- **A rerun duplicates.** Every Operation appends. A window loaded twice, in full or in part,
  is in every table twice. To redo a window, delete its rows first: by `date` in
  `_temp_sessions`, `sessions`, `events`, `pageviews` and `transactions`. The dimension
  tables cannot be cleaned by date; read them deduplicated, as below.
- **Dimension hashes repeat across runs.** `trafficsources`, `usertrafficsources`,
  `eventstrafficsources`, `devices`, `geo` and `users` have no date column. Each run
  appends every combination it saw, so a hash repeats once per run (once per day for daily
  runs). Count distinct hashes. In your own SQL over these tables, deduplicate a dimension
  before you join to it, or the join multiplies rows; OWOX Data Marts reports collapse
  joined fields per source row.
- **Purchase deduplication depends on staging.** Operation 05 reads the `{{tdw}}` days before
  the window from `_temp_sessions`. It works only while staging still holds those days, so do
  not expire or truncate `_temp_sessions` to less than `{{tdw}}` days.
- **Staging grows with every run, and so does the cost.** `_temp_sessions` is appended on
  every run and never cleaned, and Operations 02 to 11 read it on every run. The model needs
  only the last `{{tdw}}` days of it before the next run's window. Delete older rows
  regularly, by `date`, to keep the daily cost flat.
- **Purchases without a real ID are deduplicated together.** Per deduplication window, at
  most one purchase with the ID `(not set)` and one with an empty ID are kept.
- **A session row is often a fragment of a GA4 session.** The model builds its own
  sessions: a new session starts at a `session_start` event, after `{{session_time}}`
  minutes without events, on every event that carries a `source` or `medium` parameter or a
  gclid, and at midnight. Those parameters hold UTM tags or GA4's own attribution, such as
  `organic` or `referral`, so an untagged event that carries them starts a session too. So
  `sessions` can hold several times more rows than GA4 counts sessions; on Google's sample,
  about six times. Count sessions with `SUM(sessions)`, which tracks GA4's count closely
  (within about 1% on that sample). `bounces` is set per row, so a bounce rate built on it
  is not comparable to GA4's.
- **Events without a `user_pseudo_id` are lost.** Operation 01 gathers a session's events by
  matching `user_pseudo_id`, and a missing one never matches. Such events, for example
  cookieless pings under consent mode, collapse into one session row per day with no key
  and no hits. They are missing from `events`, `pageviews`, `transactions` and session
  revenue.
- **Session purchase counts are not deduplicated.** `sessions.transactions` and
  `sessions.transactionRevenue` count purchases per session, so their totals can differ from
  `transactions`.
- **A session that crosses midnight depends on the window.** Its source and campaign are
  read across the window, so a backfill and daily runs can attribute it differently.
- **`hitId` is stable for a rerun of the same window, not across different windows.**
- **Events and page views number their hits separately**, so one `hitId` value can appear in
  both `events` and `pageviews`.
- **Time is in microseconds.** `sessions.timeOnSite` is a duration in microseconds.
  `sessions.visitStartTime` and the `time` of events and page views are timestamps in
  microseconds since 1970-01-01 UTC.
- **Cost columns are empty.** `cost`, `impressions` and `clicks` in `sessions` are always 0,
  slots for ad cost data blended in later.
- **Hashes are fingerprints of joined text.** Each `*Hash` is the `FARM_FINGERPRINT` of its
  attributes concatenated without a separator, with an empty value in place of NULL.
- **`users` carries the GA4 pseudo user ID only.** Its other identifier columns are empty.

## Do not

- Do not run two windows that overlap.
- Do not run Operations 02 to 11 for a window before Operation 01 has run for that window.
- Do not edit the SQL to set a window, a project or a dataset: every input is a Variable.
