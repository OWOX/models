---
title: "Follower Statistics"
description: |
  The page's lifetime followers, split by one segment at a time. `category_type` names the split (association type, seniority, industry, function, staff count range, geo country, geo), `segment_name` the facet and `segment_value` the segment, usually a LinkedIn URN such as `urn:li:seniority:3` or a value such as `EMPLOYEE`. One row per page, category and segment.

  For the demographic splits LinkedIn puts the total of organic and paid followers into `organic_follower_count` and says not to read `paid_follower_count`, so read the audience from `organic_follower_count` and treat the paid column as meaningful only where LinkedIn fills it. It is a snapshot of lifetime counts, not a history.
tags: ["owox", "connector", "linkedin-pages"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInPages/LinkedInPagesAPIReference/LinkedInPagesFieldsSchema.js"
    title: "OWOX Data Marts LinkedIn Pages connector — Follower Statistics endpoint (`follower_statistics`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/community-management/organizations/follower-statistics"
    title: "LinkedIn Community Management API reference — follower-statistics"
---

## Connector endpoint

- **Endpoint:** LinkedIn Pages · `follower_statistics`
- **Default destination table:** `linkedin_pages_follower_statistics`
- **Unique keys:** `organization_urn`, `category_type`, `segment_name`, `segment_value`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `organization_urn` | STRING | Organization Urn | PK. Organization URN |
| `category_type` | STRING | Category Type | PK. Type of follower category (followerCountsByAssociationType, followerCountsBySeniority, etc.) |
| `segment_name` | STRING | Segment Name | PK. Name of the segment identifier (associationType, seniority, industry, function, staffCountRange, geo) |
| `segment_value` | STRING | Segment Value | PK. Value of the segment identifier (e.g., urn:li:seniority:3, EMPLOYEE, etc.) |
| `organic_follower_count` | INTEGER | Organic Follower Count | Count of organic followers in this segment |
| `paid_follower_count` | INTEGER | Paid Follower Count | Count of paid followers in this segment |

# Example Questions

- What share of followers has each seniority level?
- Which industries and countries have the most followers?
- How many followers fall in each company-size range?
