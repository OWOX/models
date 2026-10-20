---
title: "Attribution"
description: |
  The funnel on one row: for every day, channel, campaign and country, what was spent and what came
  back — sessions, enquiries, new patients, completed visits, revenue and the lifetime value now
  attached to the patients that channel produced. This is the mart that answers what a patient
  costs to acquire, and it is deliberately built on completed visits rather than on bookings,
  because a booking that turns into a no-show has not acquired anyone. Having spend and outcome
  side by side at the same grain is what makes cost per new patient comparable across channels
  without stitching marts together first. Its enquiries and new patients are only those matched to
  a website session; offline ones (physician referrals, untracked calls, records keyed in by staff,
  about a quarter of all enquiries) are counted in Leads alone.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:55:34.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `attribution_id` | STRING | Attribution ID | PK. Unique identifier for this day, channel, campaign and country combination. |
| `date` | DATE | Date | Calendar date the spend and outcomes are attributed to. |
| `source` | STRING | Traffic Source | Origin of the traffic, such as a search engine or social network. |
| `medium` | STRING | Traffic Medium | Traffic type, such as `cpc`, `organic` or `referral`. |
| `campaign` | STRING | Campaign Name | Marketing campaign the spend and outcomes belong to. |
| `country` | STRING | Country | Country the activity is attributed to. |
| `cost` | FLOAT | Raw Cost | Advertising spend in the original billing currency. |
| `cost_normalized` | FLOAT | Normalized Cost | Advertising spend converted to USD. Use this for any cross-country comparison. |
| `impressions` | INTEGER | Impressions | Times the advertising was displayed. |
| `clicks` | INTEGER | Clicks | Times the advertising was clicked. |
| `sessions` | INTEGER | Sessions | Website sessions attributed to this row. |
| `leads` | INTEGER | Leads | Session-matched enquiries attributed to this row. Offline enquiries with no website session are not here, so the total is below the Leads mart's count. |
| `new_patients` | INTEGER | New Patients | First-time patients attributed to this row, from session-matched enquiries only. The usual denominator for acquisition cost. |
| `completed_visits` | INTEGER | Completed Visits | Visits that were actually attended. The stricter acquisition denominator, since a booking lost to a no-show acquires nobody. |
| `revenue_normalized` | FLOAT | Early Revenue (USD) | Revenue the attributed patients billed within 90 days of their first attended visit, in USD — how fast the acquisition cost on this row started coming back. Deliberately narrower than `ltv`: measured over the full relationship the two would be the same number. |
| `ltv` | FLOAT | Lifetime Value | Total revenue the patients on this row have billed to date, in USD. Read against `revenue_normalized` to see how far eventual value runs ahead of the first 90 days. |

## Calculated fields

### `cost_per_lead` · FLOAT · Metric

- **Alias:** Cost per Lead (Paid)

Paid spend per attributed enquiry, in USD — calls and forms alike. Counts only session-matched enquiries on rows that carried spend, so organic, referral, direct and offline enquiries do not dilute it; empty for unpaid channels.

```sql
SAFE_DIVIDE(SUM(cost_normalized), SUM(IF(cost_normalized > 0, leads, 0)))
```

### `cost_per_new_patient` · FLOAT · Metric

- **Alias:** Cost per New Patient (Paid)

Paid spend per new patient booked, in USD — the patient acquisition cost. A new patient is a converted enquiry with an appointment; organic, referral and direct patients are left out of the base.

```sql
SAFE_DIVIDE(SUM(cost_normalized), SUM(IF(cost_normalized > 0, new_patients, 0)))
```

### `romi` · FLOAT · Metric

- **Alias:** ROMI (Paid, Revenue to Date)

Return on paid ad spend, as a share: revenue to date from patients that paid ads acquired, minus spend, over spend. Revenue, not profit; rises as recent cohorts keep billing.

```sql
SAFE_DIVIDE(SUM(IF(cost_normalized > 0, ltv, 0)) - SUM(cost_normalized), SUM(cost_normalized))
```

# Example Questions

- What do we pay per new `patient` by channel and country, and which channels look cheap on cost per enquiry but expensive once only completed `visits` are counted?
- How far apart are acquisition cost and the lifetime value that follows it, and which channel has the widest gap in our favour?
- Where does the funnel leak hardest — `sessions` to enquiries, enquiries to new `patients`, or new patients to a completed `visit`?
