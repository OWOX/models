---
title: "Devices"
description: |
  The device a session ran on: category, operating system and its version, browser and its
  version, one row per combination. When a session's events disagree, the value from its
  latest event wins. Sessions point here through `deviceHash`, a FARM_FINGERPRINT of the
  five values. The table has no date, so a hash repeats once per run (once per day for daily
  runs). Count distinct hashes. In your own SQL over these tables, deduplicate it before
  joining, or rows multiply; OWOX Data Marts reports collapse joined fields per source row.
tags: ["owox", "ga4"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 09 · [09_devices.sql](./references/sql-transformation/09_devices.sql)
- **Destination table:** `devices`
- **Write mode:** Append
- **Built from:** `_temp_sessions` (staging)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `deviceHash` | STRING | Device Hash | PK. FARM_FINGERPRINT of the five device values, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `deviceCategory` | STRING | Device Category | The device category as GA4 reports it, such as `desktop`, `mobile` or `tablet`. |
| `operatingSystem` | STRING | Operating System | The operating system, such as `Windows`, `iOS` or `Android`. |
| `operatingSystemInfo` | STRING | Operating System Version | The version of the operating system. |
| `browser` | STRING | Browser | The browser, such as `Chrome` or `Safari`. Empty for app traffic. |
| `browserVersion` | STRING | Browser Version | The version of the browser. Empty for app traffic. |

# Example Questions

- How does purchase revenue on mobile compare with desktop?
- How many distinct `users` reach us from each browser?
- Which operating system versions do our buyers use most?
