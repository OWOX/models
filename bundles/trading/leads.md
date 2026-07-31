---
title: "Leads"
description: |
  The moment a visitor stops being anonymous: one row per short-form submission, the handful
  of contact details someone leaves on a landing page before anyone has spoken to them. Each
  row keeps the page and the session that produced it, the email and phone the desk will call,
  the system that captured it — a website form, the app, a chatbot or an affiliate — and the
  stage the lead has reached since, from contacted through the full registration to a first
  deposit and a first trade, or else no answer and rejection with a stated reason. This is the
  top of the sales funnel, and the only place where the leads that were never reached at all
  are visible next to the ones that converted.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:05:12.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `lead_id` | STRING | Lead ID | PK. Unique identifier for this short-form submission. |
| `session_id` | STRING | Session ID | The session during which this form was submitted. NULL if no session could be matched (e.g. affiliate-referred leads entered outside the web funnel). FK to [Sessions](./sessions.md) |
| `client_id` | STRING | Client ID | Set only once this lead converts into a registered client. NULL until then — use `IS NOT NULL` to filter "converted leads". FK to [Clients](./clients.md) |
| `short_form_submitted_at` | TIMESTAMP | Short Form Submitted At | Timestamp the form was submitted. Use for lead-volume trends over time. |
| `landing_page` | STRING | Landing Page | Landing page path where the form was filled. Matches Sessions.landing_page for the same session. |
| `country` | STRING | Country | Country of the lead, from IP geolocation or form input. |
| `language` | STRING | Language | Browser / form language of the lead. |
| `email` | STRING | Email | Email entered in the form — identity bridge key that later matches Clients.email. |
| `phone` | STRING | Phone | Phone entered in the form. |
| `status` | STRING | Status | Current funnel stage of this lead: `contacted`, `long_form`, `ftd`, `ntc`, `no_answer`, `rejected`. Use this to answer "how many leads reached X stage" without needing to join Clients — though `ftd`/`ntc` status here should match `Clients.is_ftd`/`is_ntc` for the linked client_id. |
| `rejection_reason` | STRING | Rejection Reason | Why the lead was rejected. NULL unless `status = 'rejected'`. |
| `form_type` | STRING | Form Type | Always `"short"` in this mart — it only captures short-form submissions (the fuller registration is tracked as Clients.registration_date / the `long_form` status, not a separate row here). |
| `source_system` | STRING | Source System | System that captured this lead: `website_form`, `app_form`, `affiliate`, `chatbot`. |
| `is_manual_entry` | BOOLEAN | Is Manual Entry | True if a staff member entered this lead manually rather than it being captured automatically from a form. |
| `created_at` | TIMESTAMP | Created At | Record creation timestamp in the warehouse. |
| `count_leads` | INTEGER | Count Leads | Always `1` on every row; SUM to count leads — this is the "Short Form" / "Profile Short Form" metric seen in dashboards. |

# Example Questions

- What share of the leads we buy is the desk never able to reach, and does that dead share depend on the country or the system that captured them?
- Which landing pages produce leads that go all the way to a funded, `trading account` rather than just volume at the top?
- Why do we reject leads, and are the ones staff enter by hand rejected more often than the ones captured automatically from a form?

## Joins

- [Clients](./clients.md) — `client_id = client_id`
- [Sessions](./sessions.md) — `session_id = session_id`
