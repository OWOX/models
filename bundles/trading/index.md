---
title: "Trading"
description: |
  The client acquisition and funding side of a retail forex and CFD brokerage: budget bought
  across platforms and targeting countries, the visits it produces, the short lead-capture
  forms those visits leave behind, the sales desk that calls them, the identity checks that
  decide who is allowed in at all, and the deposits that determine whether any of it paid for
  itself. The funnel is deliberately long — a click becomes a lead, a lead becomes a
  registration, a registration becomes a verified client, and only then a first deposit and a
  first real trade — and every step of it is measurable here, alongside the lifetime value,
  the withdrawals and the lifecycle segments that say what happened after.

  **Scope:** this model ends where trading begins. It covers acquisition, verification,
  funding and client lifecycle up to the first trade. Trading activity itself — executed
  trades, instruments, volumes, and the spread and commission a broker earns on them — is
  not part of it, so questions about trading revenue or volume by symbol have no answer
  here. What it does answer is what a funded client costs, where they come from, and what
  they are worth once they arrive.

  **How this business is managed**
  - **Marketing** — buys traffic in the markets the brokerage serves and turns it into first-time depositors at a cost the client book can pay back.
  - **Sales** — reaches the leads that traffic produces and takes them through registration, identity checks and a first deposit.
  - **Finance** — grows net deposits: the money clients fund, less what they withdraw.

  **Key metrics**
  - Ad spend — [Ad Spend · Cost Normalized](./ad-spend.md?field=cost_normalized).
  - Leads — [Leads · Count Leads](./leads.md?field=count_leads) by [Leads · Short Form Submitted At](./leads.md?field=short_form_submitted_at).
  - First-time depositors (FTDs) — clients where [Clients · Is FTD](./clients.md?field=is_ftd), by [Clients · FTD Date](./clients.md?field=ftd_date).
  - Net deposits — [Deposits · Net Deposits](./deposits.md?field=net_deposits) by [Deposits · Deposit Datetime](./deposits.md?field=deposit_datetime): completed deposits minus completed withdrawals.

  **Key Data Marts**
  - [Clients](./clients.md) — every registered client, with the milestones from registration to first trade and the money each one brought.
  - [Deposits](./deposits.md) — every deposit and withdrawal, settled or not.
  - [Attribution](./attribution.md) — the whole acquisition funnel per day, campaign and country on one row.
  - [Leads](./leads.md) — every short form, and how far it has got since.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T20:05:44Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Ad Spend](./ad-spend.md) | 11 |
| [Attribution](./attribution.md) | 29 |
| [Clients](./clients.md) | 39 |
| [Communications](./communications.md) | 16 |
| [Deposits](./deposits.md) | 16 |
| [Leads](./leads.md) | 16 |
| [Sessions](./sessions.md) | 29 |
| [Trading Accounts](./trading-accounts.md) | 12 |

# Example Questions

- Which channels buy traders worth keeping rather than merely cheap ones — do the campaigns with the lowest cost per `first deposit` produce the `clients` who end up as champions with real lifetime value, or the ones who deposit once and go dormant?
- Does the desk change the outcome — do the `leads` someone managed to reach `deposit` more often, and sooner, than the ones that were never answered?
- Which acquisition regions return more `deposit volume` than they consume in budget, and how much of that money is withdrawn again within a few months?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/trading)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Trading model diagram](../res/screens/trading.svg)
