---
title: "Attribution"
description: |
  The whole acquisition funnel already assembled on one row: for each day, source, medium,
  campaign and targeting country, the money spent and the impressions and clicks it bought,
  then the sessions that arrived, the short forms submitted, the long forms completed, the
  clients who cleared KYC, the first time deposits and finally the new trading clients who
  placed a real trade — with the deposit volume those clients went on to generate. Cost per
  lead, cost per FTD and return on ad spend are ratios between two columns of the same row,
  and because every step is carried side by side, the stage where a channel actually loses
  people is visible without joining anything.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T07:25:28.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | Calendar date of the funnel activity. Part of the join grain shared with Ad Spend (plus targeting_country). |
| `source` | STRING | Source | Traffic source. Part of the join grain. |
| `medium` | STRING | Medium | Traffic medium. Part of the join grain. |
| `campaign` | STRING | Campaign | UTM campaign name. Part of the join grain. |
| `targeting_country` | STRING | Targeting Country | Country the ad budget was targeted at (for organic/direct rows, the country traffic actually came from). Part of the join grain; joins to Ad Spend.targeting_country. |
| `cost_normalized` | FLOAT | Cost Normalized | Ad spend in USD for this row. `0` for organic/direct/affiliate rows (they have no matching Ad Spend row). SUM this for total spend by any slice; divide by short_forms/ftd_count/ntc_count for CPA-style metrics. |
| `cost` | FLOAT | Cost | Ad spend in the original billing currency. `0` for organic/direct/affiliate rows. Prefer `cost_normalized` for any cross-currency total. |
| `impressions` | INTEGER | Impressions | Ad impressions for this row. `0` for unpaid rows. |
| `clicks` | INTEGER | Clicks | Ad clicks for this row. `0` for unpaid rows. |
| `ad_platform` | STRING | Ad Platform | Ad platform, e.g. `Google Ads`, `Meta Ads`, `TikTok Ads`. `"Organic/Direct"` for unpaid rows. |
| `sessions` | INTEGER | Sessions | Web/app sessions attributed to this row — funnel step 1. SUM for total traffic; divide short_forms by sessions for the session→lead conversion rate. |
| `unique_users` | INTEGER | Unique Users | Unique users attributed to this row. |
| `pages_per_session` | FLOAT | Pages Per Session | Average pages viewed per session for this row — an engagement/traffic-quality signal, not a funnel step. |
| `avg_session_duration` | FLOAT | Average Session Duration | Average session duration in seconds for this row — engagement signal. |
| `short_forms` | INTEGER | Short Forms | Short-form submissions (leads) attributed to this row — funnel step 2, "Profile Short Form" in dashboards. Divide by `sessions` for session→lead conversion; divide `cost_normalized` by this for CPA per lead. |
| `long_forms` | INTEGER | Long Forms | Long-form / full registrations attributed to this row — funnel step 3, "Profile Long Form" in dashboards. |
| `registrations` | INTEGER | Registrations | Completed account registrations attributed to this row. Equal to `long_forms` in this model (registration = completing the long form). |
| `kyc_verified` | INTEGER | KYC Verified | Clients who passed KYC verification, attributed to this row. |
| `ftd_count` | INTEGER | Ftd Count | First Time Depositors attributed to this row — funnel step 4, "Profile FTD" in dashboards. Divide `cost_normalized` by this for cost-per-FTD (CPA), the primary acquisition-efficiency metric. |
| `ntc_count` | INTEGER | Ntc Count | New Trading Clients (placed a first real trade) attributed to this row — funnel step 5, "Profile NTC". Always ≤ `ftd_count` for the same row (a client must fund before trading). |
| `deposit_volume_normalized` | FLOAT | Deposit Volume Normalized | Total deposit amount in USD from clients attributed to this row (cumulative, not just their first deposit). This is the "revenue" field — divide by `cost_normalized` for ROAS. |
| `client_country` | STRING | Client Country | Country of the clients who actually converted (from Clients.country). May differ from `targeting_country` — e.g. ads targeted at country A but the client registered from country B. |
| `targeting_region` | STRING | Targeting Region | Business-region roll-up of `targeting_country`. |
| `region` | STRING | Region | Business region — equal to `targeting_region` in this mart; use either. |
| `traffic_platform` | STRING | Traffic Platform | `App` or `Web`. |
| `attribution_id` | STRING | Attribution ID | PK. Unique internal identifier for this attribution row (the row's own surrogate key, not a business dimension). |
| `user_source` | STRING | User Source | First-touch acquisition source (mirrors `source` in this already-aggregated mart; the first/last-touch distinction matters more at the Sessions grain). |
| `user_medium` | STRING | User Medium | First-touch acquisition medium. |
| `user_campaign` | STRING | User Campaign | First-touch acquisition campaign. |

# Example Questions

- What does a funded trader really cost by channel, and how much does that cost rise once we require them to actually trade rather than just `deposit`?
- Where does the funnel leak — which campaigns turn `sessions` into `leads` well but then lose people between the long form and KYC verification?
- Which regions return more `deposit volume` than they consume in budget, and where do the countries we target differ from the countries our `converting clients` live in?
