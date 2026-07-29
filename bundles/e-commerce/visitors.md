---
title: "Visitors"
description: |
  Everyone who has visited the storefront, registered or not: when they first and last
  appeared, how many sessions they ran, the channel that originally acquired them, the cohort
  month they belong to, and — where they later signed up — the customer account they became.
  This is where anonymous traffic and known customers meet, which makes cohort retention
  answerable.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-29T00:40:32.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `visitor_id` | STRING | Visitor ID | PK. Unique identifier for the website visitor. |
| `linked_customer_id` | INTEGER | Linked Customer ID | Identifier of the registered customer account associated with this visitor, if applicable. |
| `first_seen_date` | DATE | First Seen Date | The date when the visitor first interacted with the website. |
| `last_seen_date` | DATE | Last Seen Date | The date of the most recent recorded interaction from this visitor. |
| `total_sessions` | INTEGER | Total Sessions | Total number of distinct browsing sessions initiated by the visitor. |
| `acquisition_source` | STRING | Acquisition Source | The specific platform or site that referred the visitor to the website. |
| `acquisition_medium` | STRING | Acquisition Medium | The high-level channel type used to acquire the visitor, such as organic or paid search. |
| `acquisition_campaign` | STRING | Acquisition Campaign | The name of the marketing campaign that originally brought the visitor to the site. |
| `cohort_month` | DATE | Cohort Month | The month and year of the visitor's first visit, used for retention analysis. |
| `visitor_segment` | STRING | Visitor Segment | Classification of the visitor based on their engagement behavior or frequency. |
| `country_id` | INTEGER | Country ID | Numeric identifier representing the country where the visitor is located. |

# Example Questions

- What share of visitors ever return, and how does that repeat rate differ by acquisition channel?
- How do monthly cohorts retain over time, and which acquisition source produces the stickiest ones?
- How many visitors go on to register as `customers`, and how long does that take?
