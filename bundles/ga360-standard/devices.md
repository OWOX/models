---
title: "Devices"
description: |
  The device a session ran on: category, browser and its version, operating system and its
  version, one row per combination, as the GA 360 export records them. Sessions point here
  through `deviceHash`, a FARM_FINGERPRINT of the five values. The table has no date, so a
  hash repeats once per run (once per day for daily runs). Count distinct hashes. In your
  own SQL over these tables, deduplicate it before joining, or rows multiply; OWOX Data
  Marts reports collapse joined fields per source row.
tags: ["owox", "ga360"]
type: "OWOX Data Mart"
---

## SQL Transformation

- **Operation:** 08 · [08_devices.sql](./references/sql-transformation/08_devices.sql)
- **Destination table:** `devices`
- **Write mode:** Append
- **Built from:** the GA 360 export (`ga_sessions_*`)

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `deviceHash` | STRING | Device Hash | PK. FARM_FINGERPRINT of the five device values in the order listed here, joined without a separator, with an empty value in place of NULL. Unique within one run; repeats across daily runs. |
| `deviceCategory` | STRING | Device Category | The device category, such as `desktop`, `mobile` or `tablet`. |
| `browser` | STRING | Browser | The browser, such as `Chrome` or `Safari`. |
| `browserVersion` | STRING | Browser Version | The version of the browser. |
| `operatingSystem` | STRING | Operating System | The operating system, such as `Windows`, `iOS` or `Android`. |
| `operatingSystemVersion` | STRING | Operating System Version | The version of the operating system. |

# Example Questions

- Which browsers and browser versions appear in our traffic?
- Which operating system versions do we see on mobile devices?
- How many distinct browser and system combinations does each device category have?
