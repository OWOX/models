---
title: "Time-Bound Follower Statistics"
description: |
  Followers gained in each time range: `time_range_start` and `time_range_end`, `organic_follower_gain` and `paid_follower_gain`, one row per page and range. The seven `follower_counts_by_*` columns are JSON columns that LinkedIn leaves empty in time-bound answers, because it does not split time-bound counts by segment.

  Use it for growth over time and for how much of the growth is paid. LinkedIn serves these counts from 12 months before the request date to 2 days before it, so older days cannot be loaded. For who the followers are, use Follower Statistics.
tags: ["owox", "connector", "linkedin-pages"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInPages/LinkedInPagesAPIReference/followerStatisticsTimeBoundFields.js"
    title: "OWOX Data Marts LinkedIn Pages connector — Time-Bound Follower Statistics endpoint (`follower_statistics_time_bound`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/follower-statistics"
    title: "LinkedIn Community Management API reference — Time-Bound Follower Statistics"
---

## Connector endpoint

- **Endpoint:** LinkedIn Pages · `follower_statistics_time_bound`
- **Default destination table:** `linkedin_pages_follower_statistics_time_bound`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
- **LinkedIn Community Management API version:** 202607
- **Unique keys:** `organization_urn`, `time_range_start`, `time_range_end`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `organization_urn` | STRING | Organization URN | PK. The LinkedIn organization page the counts belong to, as a URN of the form `urn:li:organization:{id}`. |
| `time_range_start` | TIMESTAMP | Time Range Start | PK. Start of the day the gains are counted for, inclusive; the connector asks LinkedIn for one row per day. |
| `time_range_end` | TIMESTAMP | Time Range End | PK. End of that day, exclusive: the start of the next day. |
| `organic_follower_gain` | INTEGER | Organic Follower Gain | Number of organic followers gained during the time period |
| `paid_follower_gain` | INTEGER | Paid Follower Gain | Number of paid followers gained during the time period |
| `follower_counts_by_association_type` | STRING | Follower Counts By Association Type | Followers segmented by association type (empty in time-bound responses). Stored as a JSON string. |
| `follower_counts_by_seniority` | STRING | Follower Counts By Seniority | Followers segmented by seniority (empty in time-bound responses). Stored as a JSON string. |
| `follower_counts_by_industry` | STRING | Follower Counts By Industry | Followers segmented by industry (empty in time-bound responses). Stored as a JSON string. |
| `follower_counts_by_function` | STRING | Follower Counts By Function | Followers segmented by function (empty in time-bound responses). Stored as a JSON string. |
| `follower_counts_by_staff_count_range` | STRING | Follower Counts By Staff Count Range | Followers segmented by staff count range (empty in time-bound responses). Stored as a JSON string. |
| `follower_counts_by_geo_country` | STRING | Follower Counts By Geo Country | Followers segmented by country (empty in time-bound responses). Stored as a JSON string. |
| `follower_counts_by_geo` | STRING | Follower Counts By Geo | Followers segmented by geographic area (empty in time-bound responses). Stored as a JSON string. |

# Example Questions

- How many followers did the page gain per week, organic and paid?
- On which days did the page gain the most paid followers?
- What share of the growth over the last quarter was organic?
