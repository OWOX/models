---
title: "Sessions"
description: |
  Every visit to the broker's site and app, one row per session, from the anonymous first
  click on an ad to the return visit of a client who is already trading. A row records where
  the visit came from — its own last-touch source, medium and campaign alongside the
  first-touch channel that originally acquired the visitor — where it landed, what device and
  country it came from, and how engaged it was in pages viewed and seconds spent. Once a
  visitor registers, the session carries the client identifier, which is what turns raw
  traffic into something you can follow all the way to a deposit.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:05:11.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | Calendar date of the session. FK to [Attribution](./attribution.md) |
| `session_id` | STRING | Session ID | PK. Unique identifier for a single session. Don't COUNT this to get session totals — SUM the `count_sessions` field below instead, it is purpose-built for that. |
| `source` | STRING | Source | This session's own (last-touch) traffic source. If you need the channel that FIRST acquired the visitor (not just this visit), use `user_source` instead. FK to [Attribution](./attribution.md) |
| `medium` | STRING | Medium | This session's own (last-touch) traffic medium. See `user_medium` for the first-touch equivalent. FK to [Attribution](./attribution.md) |
| `campaign` | STRING | Campaign | This session's own (last-touch) UTM campaign. See `user_campaign` for the first-touch equivalent. FK to [Attribution](./attribution.md) |
| `ad_content` | STRING | Ad Content | UTM ad content — identifies the specific ad creative shown. Only populated for paid sessions. |
| `ad_group` | STRING | Ad Group | Ad group within the campaign. Only populated for paid sessions. |
| `channel_grouping` | STRING | Channel Grouping | Simplified channel bucket: `Paid Search`, `Paid Social`, `Organic`, `Direct`, `Referral`, `Affiliate`, `Video`, `Display`. Use this for a high-level channel-mix chart instead of raw source/medium. |
| `keyword` | STRING | Keyword | Search keyword that triggered the session. Only populated for search (cpc/organic) sessions. |
| `landing_page` | STRING | Landing Page | Path of the first page viewed in the session (e.g. `/open-account`, `/promo/welcome-bonus`), without UTM parameters. Use to answer "which landing page converts best" — join to Leads on `session_id` to compute a conversion rate per landing page. Note: there is no cost breakdown by landing page (ad platforms only report cost per campaign), so CPA/CPL by landing page cannot be computed, only conversion rate/counts. |
| `landing_host_name` | STRING | Landing Host Name | Landing hostname for web sessions, or the app identifier for App sessions. |
| `url` | STRING | URL | Full first-hit URL including UTM parameters, for web sessions. |
| `started_at` | TIMESTAMP | Started At | Timestamp the session began. Use MIN/MAX only — not a metric to SUM or AVG. |
| `consent_at` | TIMESTAMP | Consent At | Timestamp of first recorded (GDPR-style) consent. NULL if no consent was recorded in this session. |
| `ga_client_id` | STRING | Ga Client ID | Browser/device analytics cookie id, used only to link anonymous sessions to the same device across visits. This is NOT the CRM client — do not confuse with `client_id` below. |
| `country` | STRING | Country | Visitor's country from IP geolocation — this is where the visitor actually is, not the ad targeting country (see Ad Spend.targeting_country). |
| `region` | STRING | Region | Business-region roll-up of the visitor's country: `SEA`, `ME`, `EU`, `LATAM`, `AFRICA`, `CA`, `UK`, `AU`, `ANZ`, `Other`. |
| `city` | STRING | City | Visitor's city. |
| `device_category` | STRING | Device Category | `Desktop`, `Mobile` or `Tablet`. |
| `is_first_visitor_session` | BOOLEAN | Is First Visitor Session | `"true"`/`"false"` boolean flag — whether this is the visitor's very first ever session. |
| `traffic_platform` | STRING | Traffic Platform | `App` or `Web` — which surface the session happened on. Use for "app vs web" traffic-split questions. |
| `unique_users` | INTEGER | Unique Users | Always `1` on every row; SUM to count unique users in a report, do not AVG or use as a real per-row metric. |
| `pages_per_session` | FLOAT | Pages Per Session | Number of pages viewed in this specific session. Engagement/quality-of-traffic signal. |
| `avg_session_duration` | FLOAT | Average Session Duration | Duration of this specific session, in seconds. Engagement signal. |
| `client_id` | STRING | Client ID | Set only once the visitor is an identified, registered client — NULL for anonymous, not-yet-registered visitors. Use to join session behaviour to CRM/deposit data. FK to [Clients](./clients.md) |
| `count_sessions` | INTEGER | Count Sessions | Always `1` on every row; SUM this field to answer "how many sessions" — this is the standard sessions-count metric. |
| `user_source` | STRING | User Source | First-touch acquisition source for this visitor — the channel that originally brought them in, which may differ from this particular session's own `source`. Use when the question is about acquisition/attribution rather than this specific visit. |
| `user_medium` | STRING | User Medium | First-touch acquisition medium. See `user_source`. |
| `user_campaign` | STRING | User Campaign | First-touch acquisition campaign. See `user_source`. |

# Example Questions

- Which landing pages pull in the most first-ever visitors yet lose them fastest, going by pages viewed and time on site?
- How far apart are first-touch and last-touch credit — which sources are closing visits that a different channel originally acquired?
- Are app visitors more engaged than web visitors, and does that gap hold once you separate identified `clients` from still-anonymous traffic?

## Joins

- [Attribution](./attribution.md) — `date = date`, `source = source`, `medium = medium`, `campaign = campaign`
- [Clients](./clients.md) — `client_id = client_id`
