---
title: "Visitors"
description: |
  Everyone who has visited the storefront, whether they ever bought or not: when they first and
  last appeared, how many sessions they ran, the channel that originally acquired them, the month
  they belong to, and — where they later bought — the customer they became. This is where
  anonymous traffic and known customers meet.

  Because the acquisition channel is recorded on the visitor rather than only on the session,
  every later order and subscription can be credited back to what first brought that person to
  the site, even when they returned through a different channel.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-08-07T18:21:12.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `visitor_id` | STRING | Visitor ID | PK. Unique identifier of the website visitor. |
| `linked_customer_id` | STRING | Linked Customer ID | Customer account this visitor was later recognised as, when they bought. |
| `first_seen_date` | DATE | First Seen Date | Date the visitor first interacted with the site. |
| `last_seen_date` | DATE | Last Seen Date | Date of the visitor's most recent interaction. |
| `total_sessions` | INTEGER | Total Sessions | Number of sessions the visitor has run in total. |
| `acquisition_source` | STRING | Acquisition Source | Platform or site that originally referred the visitor. |
| `acquisition_medium` | STRING | Acquisition Medium | Channel type the visitor was originally acquired through. |
| `acquisition_campaign` | STRING | Acquisition Campaign | Marketing campaign that originally brought the visitor to the site. |
| `cohort_month` | DATE | Cohort Month | First day of the month of the visitor's first visit, used for retention analysis. |
| `visitor_segment` | STRING | Visitor Segment | Engagement band the visitor falls into, such as One-off, Occasional or Frequent. |
| `country` | STRING | Country | Country the visitor browses from. |

# Example Questions

- What share of visitors ever return, and how does that repeat rate differ by acquisition channel?
- How do monthly visitor cohorts convert into `customers`, and how long does that take?
- Which acquisition channels produce visitors who eventually subscribe rather than buy once?
