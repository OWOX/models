---
title: "Patients"
description: |
  Who the network is treating, and what each patient is worth: one row per patient, combining the
  identity and contact details the clinics hold with the value metrics built on top of their visit
  history — lifetime value, average value per visit, how many times they have attended, when they
  first and last came, and how long it has been since. The distinction between a new and an
  established patient runs through everything here, because the two behave differently on almost
  every measure that matters, from how much treatment they accept to how likely they are to attend.
  `has_unused_plan` and `unused_plan_revenue` make the recall opportunity explicit: treatment that
  was planned and paid attention to but never delivered is revenue already earned and still sitting
  on the table.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:02:24.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `patient_id` | STRING | Patient ID | PK. Unique identifier for this patient. |
| `lead_id` | STRING | Acquisition Lead ID | Enquiry that first brought this patient in. First touch only — a patient who enquired more than once keeps just the earliest here. Denormalised, not a declared relationship; the full history is in Leads. |
| `session_id` | STRING | First Session ID | Website session the patient was first captured in, where one could be matched. |
| `source_ehr` | STRING | Source EHR | Practice-management system this patient record originated in. |
| `external_ehr_id` | STRING | External EHR ID | Identifier for this patient in the originating system. |
| `first_name` | STRING | First Name | Patient's given name. |
| `last_name` | STRING | Last Name | Patient's family name. |
| `phone` | STRING | Phone Number | Primary contact number for the patient. |
| `email` | STRING | Email Address | Primary email address for the patient. |
| `date_of_birth` | DATE | Date of Birth | Patient's date of birth, the basis for any age banding. |
| `gender` | STRING | Gender | Patient's recorded gender. |
| `country` | STRING | Country | Patient's country of residence. |
| `language` | STRING | Language | Preferred language for communication: `en`, `fr` or `es`. |
| `patient_type` | STRING | Patient Type | `new` for a first-time patient, `established` for a returning one. Control for this before comparing acceptance, attendance or value. |
| `rfm_label` | STRING | RFM Segment | Recency, frequency and monetary segment: `new`, `promising`, `loyal`, `champions`, `at_risk` or `lost`. |
| `recency_score` | INTEGER | Recency Score | Score for how recently the patient last attended. Kept so segment boundaries can be re-cut. |
| `frequency_score` | INTEGER | Frequency Score | Score for how often the patient attends. |
| `monetary_score` | INTEGER | Monetary Score | Score for how much the patient has spent. |
| `ltv` | NUMERIC | Lifetime Value | Total revenue from this patient to date, in USD. |
| `avg_visit_value` | NUMERIC | Average Visit Value | Average revenue per attended visit for this patient, in USD. |
| `total_visits` | INTEGER | Total Visits | Number of visits this patient has attended. Reconciles with the attended rows in Visits. |
| `first_visit_date` | DATE | First Visit Date | Date of the patient's first visit. |
| `last_visit_date` | DATE | Last Visit Date | Date of the patient's most recent visit. |
| `days_since_last_visit` | INTEGER | Days Since Last Visit | Whole days between the last visit and the reporting date. The recall trigger. |
| `has_unused_plan` | BOOLEAN | Has Unused Plan | True when the patient has planned treatment that has not been delivered. |
| `unused_plan_revenue` | NUMERIC | Unused Plan Revenue | Value of planned but undelivered treatment for this patient, in USD. |
| `created_at` | TIMESTAMP | Created At | When the patient record was first created. |
| `count_patients` | INTEGER | Patient Count | Always `1` on every row; SUM to count patients. |

# Example Questions

- How much planned treatment is sitting unused, which patients is it concentrated in, and what is that worth if we recall them?
- Do patients acquired through paid channels reach the same lifetime value as those who arrived by referral, and how long does the gap take to close?
- Which patients have slipped from loyal into at-risk on recency alone, and how much revenue does that segment represent?
