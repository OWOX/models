---
title: "Follower Statistics"
description: |
  The page's lifetime followers, split by one segment at a time. `category_type` names the split (association type, seniority, industry, function, staff count range, geo country, geo), `segment_name` the facet and `segment_value` the segment, either a LinkedIn URN such as `urn:li:seniority:3` or a value such as `EMPLOYEE`. One row per page, category and segment.

  For the demographic splits LinkedIn puts the total of organic and paid followers into `organic_follower_count` and says not to read `paid_follower_count`, so read the audience from `organic_follower_count` and treat the paid column as meaningful only where LinkedIn fills it. It is a snapshot of lifetime counts, not a history. LinkedIn returns at most the top 100 segments of each facet, so a page with followers in more than 100 countries has rows for the top 100 only.
tags: ["owox", "connector", "linkedin-pages"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInPages/LinkedInPagesAPIReference/followerStatisticsFields.js"
    title: "OWOX Data Marts LinkedIn Pages connector — Follower Statistics endpoint (`follower_statistics`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/follower-statistics"
    title: "LinkedIn Community Management API reference — Follower Statistics"
---

## Connector endpoint

- **Endpoint:** LinkedIn Pages · `follower_statistics`
- **Default destination table:** `linkedin_pages_follower_statistics`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
- **LinkedIn Community Management API version:** 202607
- **Unique keys:** `organization_urn`, `category_type`, `segment_name`, `segment_value`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `organization_urn` | STRING | Organization URN | PK. The LinkedIn organization page the counts belong to, as a URN of the form `urn:li:organization:{id}`. |
| `category_type` | STRING | Category Type | PK. Type of follower category (followerCountsByAssociationType, followerCountsBySeniority, etc.) |
| `segment_name` | STRING | Segment Name | PK. Name of the segment identifier (associationType, seniority, industry, function, staffCountRange, geo) |
| `segment_value` | STRING | Segment Value | PK. Value of the segment identifier (e.g., urn:li:seniority:3, EMPLOYEE, etc.) |
| `organic_follower_count` | INTEGER | Followers (Organic and Paid) | Followers in this segment; for these demographic facets LinkedIn rolls organic and paid followers into this one count. |
| `paid_follower_count` | INTEGER | Paid Follower Count | Paid followers in this segment; LinkedIn says not to read it for the demographic facets, whose totals are in `organic_follower_count`. |

# Example Questions

- What share of followers has each seniority level?
- Which industries and countries have the most followers?
- How many followers fall in each company-size range?
