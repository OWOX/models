---
title: "Sessions"
description: |
  Every visit to the website, before anyone has identified themselves: one row per session, with
  the campaign, keyword and ad creative that brought it, the page it landed on, the device it came
  from and the city it came from. This is the widest mart in the model and the top of the
  acquisition funnel — most sessions never become an enquiry, which is the point, because the ratio
  between sessions and enquiries by landing page and channel is where wasted spend shows up. It
  also records `consent_at`, so sessions that predate tracking consent can be separated from those
  that carry it, and `patient_id` on the small minority of sessions the network could later tie
  back to a known patient.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T13:47:16.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `session_id` | STRING | Session ID | PK. Unique identifier for this website session. |
| `date` | DATE | Date | Calendar date the session occurred. The series to plot for traffic volume. Part of the join grain shared with Attribution. FK to [Attribution](./attribution.md) |
| `source` | STRING | Source | Origin of the traffic, such as a search engine or social network. Part of the join grain shared with Attribution. FK to [Attribution](./attribution.md) |
| `medium` | STRING | Medium | Traffic type, such as `cpc`, `organic`, `referral` or `(none)`. Part of the join grain shared with Attribution. FK to [Attribution](./attribution.md) |
| `campaign` | STRING | Campaign | Marketing campaign that produced the session. Part of the join grain shared with Attribution. FK to [Attribution](./attribution.md) |
| `ad_content` | STRING | Ad Content | Specific creative or ad variant the visitor clicked. |
| `ad_group` | STRING | Ad Group | Ad group within the campaign. |
| `channel_grouping` | STRING | Channel Grouping | Pre-rolled channel classification: `Paid Search`, `Paid Social`, `Organic Search`, `Direct`, `Referral`. The default grouping for channel reporting. |
| `keyword` | STRING | Keyword | Search term that triggered the ad or organic result. |
| `landing_page` | STRING | Landing Page | Page path the visitor first arrived on. Compare enquiry rates across these to find pages that attract volume but convert poorly. |
| `landing_host_name` | STRING | Landing Host Name | Domain or subdomain the session started on. |
| `url` | STRING | URL | Full web address of the landing page, including protocol and domain. |
| `session_start` | TIMESTAMP | Session Start | Exact moment the session began. |
| `consent_at` | TIMESTAMP | Consent Time | When the visitor granted tracking consent. NULL when no consent was recorded. |
| `client_id` | STRING | Client ID | Browser-level identifier, used to tell devices apart. |
| `user_id` | STRING | User ID | Known-user identifier, stable across sessions once the visitor is recognised. |
| `country` | STRING | Country | Country the session originated from. Part of the join grain shared with Attribution, which is why including it makes each session resolve to exactly one attribution row rather than one per country. FK to [Attribution](./attribution.md) |
| `region` | STRING | Region | State or province the visitor was in. |
| `city` | STRING | City | City the visitor was in. |
| `device_category` | STRING | Device Category | Hardware used: `Mobile`, `Desktop` or `Tablet`. |
| `is_first_visitor_session` | BOOLEAN | Is First Visitor Session | True when this is the first session recorded for that visitor. |
| `patient_id` | STRING | Patient ID | Always NULL. Sessions stay anonymous here by design — resolving one to a patient would need this mart to read Patients, closing a cycle back through Visits and Leads. The linkage lives on `Patients.session_id` and `Leads.session_id` instead, so join from those. |
| `count_sessions` | INTEGER | Session Count | Always `1` on every row; SUM to count sessions. |

# Example Questions

- Which landing pages attract volume but produce almost no enquiries, and which quietly convert far above their share of traffic?
- Does the mix of device and channel differ between the markets we operate in enough to change where the next dollar of spend should go?
- What share of traffic arrives without tracking consent, and does excluding it change the channel picture we report?

## Joins

- [Attribution](./attribution.md) — `date = date`, `source = source`, `medium = medium`, `campaign = campaign`, `country = country`
