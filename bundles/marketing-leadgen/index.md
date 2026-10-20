---
title: "Marketing Leadgen"
description: |
  A B2B demand-generation and revenue-operations business modeled end to end — from ad spend
  and marketing campaigns, through web traffic and multi-touch attribution, to leads, sales
  opportunities and the pipeline stages that carry them to close. Campaigns anchor everything,
  paid and non-paid alike: every dollar of ad spend, every paid visit and every touch on the
  path to conversion ties back to a [campaign](./campaign.md), so channel performance can be
  traced from a click to a closed-won deal. Deals are won or lost at the account level, so
  [Account](./account.md) carries the firmographics and the ABM target-list flag.

  **How this business is managed**
  - **Marketing** — turns paid and organic traffic into marketing-qualified leads at a cost the business can sustain.
  - **Sales** — converts qualified leads into closed-won revenue, focused on the accounts most likely to buy.
  - **Finance** — makes sure ad spend is matched by the pipeline and revenue the business brings in.

  **Key metrics**
  - MQLs — [Lead · MQLs](./lead.md?field=mqls) by [Lead · Became MQL At](./lead.md?field=became_mql_at).
  - Ad spend — [Ad Spend · Cost](./ad-spend.md?field=cost).
  - Pipeline — [Opportunities · Amount](./opportunities.md?field=amount) by [Opportunities · Created At](./opportunities.md?field=created_at); per $1 of spend, [Campaign Performance · Pipeline per $ of Spend](./campaign-performance.md?field=pipeline_per_dollar).
  - Closed-won revenue — [Opportunities · Closed-Won Revenue](./opportunities.md?field=won_revenue) by [Opportunities · Close Date](./opportunities.md?field=close_date).

  **Key Data Marts**
  - [Lead](./lead.md) — every contact, with the dated milestones of its way through the funnel.
  - [Opportunities](./opportunities.md) — the deals, their size and their outcome.
  - [Ad Spend](./ad-spend.md) — what each channel and campaign costs, day by day.
  - [Touchpoints](./touchpoints.md) — the multi-touch credit behind every lead and deal.
tags: ["owox", "index"]
type: "index"
timestamp: 2026-10-20T17:57:40Z
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Vlad Flaks](https://github.com/vladflaks), [Rus Obolonsky](https://github.com/Obolrus)

| Data Mart | Fields |
|-----------|--------|
| [Account](./account.md) | 6 |
| [Ad Spend](./ad-spend.md) | 8 |
| [Campaign](./campaign.md) | 9 |
| [Campaign Performance](./campaign-performance.md) | 11 |
| [Lead](./lead.md) | 11 |
| [Opportunities](./opportunities.md) | 11 |
| [Stage Transitions](./stage-transitions.md) | 6 |
| [Touchpoints](./touchpoints.md) | 10 |
| [Web Sessions](./web-sessions.md) | 9 |

# Example Questions

- Which channels and `campaigns` generate the most pipeline and revenue once `ad spend`, attribution credit and win rates are accounted for?
- Where does the funnel leak most — awareness to `lead`, lead to MQL/SQL, or `opportunity` to close — and does that differ by channel?
- Do target (ABM) `accounts` convert, close and win at a higher rate than the rest of the book?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/marketing-leadgen)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->

## Model preview

![Marketing Leadgen model diagram](../res/screens/marketing-leadgen.svg)
