---
title: "Time-Bound Follower Statistics"
description: |
  Followers gained in each time range: `time_range_start` and `time_range_end`, `organic_follower_gain` and `paid_follower_gain`, one row per page and range. The seven `follower_counts_by_*` columns are JSON columns that LinkedIn leaves empty in time-bound answers, because it does not split time-bound counts by segment.

  Use it for growth over time and for how much of the growth is paid. For who the followers are, use Follower Statistics.
tags: ["owox", "connector", "linkedin-pages"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInPages/LinkedInPagesAPIReference/LinkedInPagesFieldsSchema.js"
    title: "OWOX Data Marts LinkedIn Pages connector — Time-Bound Follower Statistics endpoint (`follower_statistics_time_bound`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/follower-statistics"
    title: "LinkedIn Community Management API reference — follower-statistics"
---

## Connector endpoint

- **Endpoint:** LinkedIn Pages · `follower_statistics_time_bound`
- **Default destination table:** `linkedin_pages_follower_statistics_time_bound`
- **Unique keys:** `organization_urn`, `time_range_start`, `time_range_end`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `organization_urn` | STRING | PK. Organization URN |
| `time_range_start` | TIMESTAMP | PK. Start timestamp of the time range |
| `time_range_end` | TIMESTAMP | PK. End timestamp of the time range |
| `organic_follower_gain` | INTEGER | Number of organic followers gained during the time period |
| `paid_follower_gain` | INTEGER | Number of paid followers gained during the time period |
| `follower_counts_by_association_type` | JSON | Followers segmented by association type (empty in time-bound responses) |
| `follower_counts_by_seniority` | JSON | Followers segmented by seniority (empty in time-bound responses) |
| `follower_counts_by_industry` | JSON | Followers segmented by industry (empty in time-bound responses) |
| `follower_counts_by_function` | JSON | Followers segmented by function (empty in time-bound responses) |
| `follower_counts_by_staff_count_range` | JSON | Followers segmented by staff count range (empty in time-bound responses) |
| `follower_counts_by_geo_country` | JSON | Followers segmented by country (empty in time-bound responses) |
| `follower_counts_by_geo` | JSON | Followers segmented by geographic area (empty in time-bound responses) |

# Example Questions

- How many followers did the page gain per week, organic and paid?
- On which days did the page gain the most paid followers?
- What share of the growth over the last quarter was organic?
