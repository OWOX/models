---
title: "Clients"
description: |
  The trader profile, and the centre of the model: one row per registered client, carrying the
  four milestones the business is run on — registration, identity verification, first deposit
  and first real trade — with the dates between them, so how long a client takes to fund and
  then to trade is a stored number rather than a calculation. Each row also holds the money:
  every [deposit](./deposits.md) and withdrawal already totalled, net deposits, lifetime value,
  how recently and how often the client funded, an RFM score on all three axes, and a lifecycle segment
  that names what the client is today, from someone who registered and never deposited to an
  active trader, a dormant account or a churned one. It is the mart that answers who the
  customers are, what they are worth and which of them are slipping away.

  It holds every client ever registered, organic or paid — the same clients Attribution counts.
  A date range here goes by registration date, while Attribution dates each client by the
  visit that brought them in, so the two differ slightly at the edges of a range.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:52:44.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `client_id` | STRING | Client ID | PK. Unique client identifier. |
| `lead_id` | STRING | Lead ID | The first short-form submission that started this client's journey. |
| `session_id` | STRING | Session ID | The first-touch session that originally brought this client in. NULL if none could be matched. |
| `email` | STRING | Email | Client email — identity bridge key, matches Leads.email. |
| `phone` | STRING | Phone | Client phone — identity bridge key. |
| `first_name` | STRING | First Name | Client first name. |
| `last_name` | STRING | Last Name | Client last name. |
| `country` | STRING | Country | Client's country of residence/registration — the client's actual location, NOT the ad targeting country. Use this field (not Ad Spend.targeting_country) to answer "which country has the most clients/FTD" or "FTD by country" questions. |
| `region` | STRING | Region | Business-region roll-up of the client's country: `SEA`, `ME`, `EU`, `LATAM`, `AFRICA`, `CA`, `UK`, `AU`, `ANZ`, `Other`. Use for region-level FTD/LTV roll-ups. |
| `language` | STRING | Language | Client's preferred language. |
| `registration_date` | DATE | Registration Date | Date the client completed account registration. This corresponds to the "Long Form" / "Profile Long Form" funnel step in dashboards. |
| `kyc_status` | STRING | KYC Status | Identity-verification status: `pending`, `verified`, `rejected`, `expired`. |
| `kyc_verified_date` | DATE | KYC Verified Date | Date KYC was approved. NULL if not yet verified. |
| `account_type` | STRING | Account Type | Regulatory client classification: `retail` or `professional`. |
| `is_ftd` | BOOLEAN | Is FTD | Whether the client made at least one completed deposit (First Time Depositor). This is the "FTD" / "Profile FTD" metric — `COUNTIF(is_ftd)` gives the FTD count, the primary acquisition-efficiency metric. |
| `ftd_date` | DATE | FTD Date | Date of the client's first completed deposit. NULL if `is_ftd = false`. Use for FTD trend charts. |
| `ftd_amount_normalized` | FLOAT | FTD Amount Normalized | Amount of the first deposit, in USD. NULL if `is_ftd = false`. |
| `ftd_payment_method` | STRING | FTD Payment Method | Payment method used for the first deposit: `card`, `wire_transfer`, `crypto`, `skrill`, `neteller`, `paypal`. NULL if `is_ftd = false`. |
| `days_to_ftd` | FLOAT | Days to FTD | Days between `registration_date` and `ftd_date` — how fast a client deposits after registering. NULL if `is_ftd = false`. |
| `is_ntc` | BOOLEAN | Is NTC | Whether the client placed at least one real (non-demo) trade — New Trading Client. Always implies `is_ftd = true` (a client must fund before trading). This is the "NTC" / "Profile NTC" metric — `COUNTIF(is_ntc)` gives the NTC count. |
| `ntc_date` | DATE | NTC Date | Date of the client's first real trade. NULL if `is_ntc = false`. |
| `days_to_ntc` | FLOAT | Days to NTC | Days between `ftd_date` and `ntc_date` — how fast a depositor starts trading. NULL if `is_ntc = false`. |
| `has_open_positions` | BOOLEAN | Has Open Positions | Whether the client currently has open trading positions — a live-engagement signal. |
| `created_at` | TIMESTAMP | Created At | Record creation timestamp in the warehouse. |
| `count_clients` | INTEGER | Count Clients | Always `1` on every row; SUM to count clients matching a filter. |
| `total_deposits_normalized` | FLOAT | Total Deposits Normalized | Sum of all this client's completed deposits, in USD. SUM across clients to answer "total deposit volume" / "revenue" questions. |
| `total_withdrawals_normalized` | FLOAT | Total Withdrawals Normalized | Sum of all this client's completed withdrawals, in USD. |
| `net_deposits` | FLOAT | Net Deposits | `total_deposits_normalized` minus `total_withdrawals_normalized` — net money the client has put in. |
| `deposit_count` | INTEGER | Deposit Count | Number of completed deposit transactions made by this client — the RFM "frequency" input. |
| `last_deposit_date` | DATE | Last Deposit Date | Date of the client's most recent completed deposit. |
| `days_since_last_deposit` | FLOAT | Days Since Last Deposit | Days elapsed since `last_deposit_date` — the RFM "recency" input; also drives `client_segment` (e.g. `dormant`, `churned`). |
| `days_since_ftd` | FLOAT | Days Since FTD | Days elapsed since the client's first deposit — client "age" in the system. |
| `ltv` | FLOAT | LTV | Lifetime value in USD — equal to `total_deposits_normalized`. Use for "what is the LTV of clients acquired via X" questions. |
| `recency_score` | FLOAT | Recency Score | RFM recency score, 1-5 (5 = deposited most recently). Derived from `days_since_last_deposit`. |
| `frequency_score` | FLOAT | Frequency Score | RFM frequency score, 1-5 (5 = most deposits). Derived from `deposit_count`. |
| `monetary_score` | FLOAT | Monetary Score | RFM monetary score, 1-5 (5 = highest `net_deposits`). |
| `client_segment` | STRING | Client Segment | Lifecycle stage as of today, not at the time of any transaction. `new`: no deposit, registered in the last 30 days. `registered_no_ftd`: no deposit, registered earlier. `ftd_only`: deposited but never placed a real trade. Clients who have traded, by days since their last deposit: `active_trader` up to 60, `dormant` 61–180, `churned` 181 or more. Use this directly for "give me churned/dormant clients" questions instead of recomputing from date fields. |
| `rfm_label` | STRING | RFM Label | RFM marketing segment, already computed: `champions`, `loyal`, `at_risk`, `lost`, `new`, `promising`. `lost` specifically means the client's most recent contact (see Communications) was an unanswered/unsuccessful call. |
| `data_source` | STRING | Data Source | `App` or `Web` — the surface this client was first acquired on. |

## Calculated fields

### `kyc_approval_rate` · FLOAT · Metric

- **Alias:** KYC Approval Rate

Share of decided identity checks that were approved (0–1): verified over verified, rejected and expired. Pending checks are left out of both sides; about a quarter of every registration cohort, back to 2024, is still pending, so read pending as documents never submitted.

```sql
SAFE_DIVIDE(COUNTIF(kyc_status = 'verified'), COUNTIF(kyc_status IN ('verified', 'rejected', 'expired')))
```

### `ftd_size_band` · STRING · Column

- **Alias:** First Deposit Size

Size band of the client's first deposit in USD: Micro (under $100), Small ($100-249), Standard ($250-999), Large ($1,000+), or No deposit. A row-level formula that behaves as a dimension: group and filter by it.

```sql
CASE WHEN ftd_amount_normalized IS NULL THEN 'No deposit' WHEN ftd_amount_normalized < 100 THEN 'Micro (under $100)' WHEN ftd_amount_normalized < 250 THEN 'Small ($100-249)' WHEN ftd_amount_normalized < 1000 THEN 'Standard ($250-999)' ELSE 'Large ($1,000+)' END
```

# Example Questions

- How long does a newly registered client take to make a `first deposit` and then to place a first trade, and how does that lag differ by region and by whether they came in through the app or the web?
- Where is identity verification costing us money — how many clients sit unverified or rejected without ever depositing, and what is the lifetime value of the ones who do get through?
- How concentrated is our `deposit base` — what share of total lifetime value sits with champions rather than at-risk clients, and how large is the pool that registered but never funded?
