---
type: "OWOX Data Mart"
title: "Google Ads Ad Group Stats BQ"
description: |
  Google Ads Ad Group Stats. 
  Ad group granularity.
tags: ["owox"]
timestamp: 2026-05-26T20:09:19.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `ad_group_id` | STRING | PK. Ad Group ID |
| `date` | STRING | PK. Date for time series data |
| `ad_group_name` | STRING | Ad Group Name |
| `ad_group_status` | STRING | Ad Group Status (ENABLED, PAUSED, REMOVED) |
| `campaign_id` | STRING | Campaign ID |
| `clicks` | FLOAT | Number of Clicks |
| `cost_micros` | FLOAT | Cost in Micros |
| `conversions` | FLOAT | Number of Conversions |
| `ctr` | FLOAT | Click-Through Rate |
| `average_cpc` | FLOAT | Average Cost Per Click |
| `impressions` | FLOAT | Number of Impressions |
| `conversion_rate` | FLOAT | Conversion Rate |
| `cost_per_conversion` | FLOAT | Cost Per Conversion |
| `conversions_value` | FLOAT | Total Conversion Value |
| `all_conversions` | FLOAT | All Conversions |
| `all_conversions_value` | FLOAT | All Conversions Value |
| `cost_per_all_conversions` | FLOAT | Cost Per All Conversions |
| `average_cpm` | FLOAT | Average CPM |
| `average_cost` | FLOAT | Average Cost |
