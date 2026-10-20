---
title: "Leads"
description: |
  The moment someone asks for an appointment: one row per inbound enquiry, whether it arrived as a
  tracked phone call, a website form, a chat, a lead form on an ad platform, a referral from another
  physician or typed in by staff. Each enquiry carries the location it was directed to, the session
  that produced it where the two could be matched, and the state it has since reached — still new,
  being worked, converted into a patient, or one of the two dead ends: never reached, or rejected
  with a stated reason. This is the only place in the model where the enquiries that were never
  reached at all sit next to the ones that converted, which is what makes the size of that loss
  visible rather than assumed. About a quarter of enquiries have no website session (referrals,
  offline calls, records keyed in by staff), so this mart counts more enquiries than Attribution,
  which credits only session-matched ones. The attempts made on each enquiry, and who made them,
  are in [Communications](./communications.md).
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-10-20T08:55:35.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `lead_id` | STRING | Lead ID | PK. Unique identifier for this enquiry. |
| `session_id` | STRING | Session ID | Session the enquiry was submitted during. NULL when the enquiry began outside the web funnel, such as a physician referral or a direct call; those enquiries are not in Attribution. FK to [Sessions](./sessions.md) |
| `patient_id` | STRING | Patient ID | Set only once the enquiry converts into a patient. NULL until then — use `IS NOT NULL` for "converted enquiries", which is why a rejected or unreached enquiry is never counted as a patient. FK to [Patients](./patients.md) |
| `clinic_id` | STRING | Clinic ID | Location the enquiry was directed to. FK to [Clinic](./clinic.md) |
| `lead_submitted_at` | TIMESTAMP | Lead Submitted At | When the enquiry was received. The series to plot for enquiry volume. |
| `status` | STRING | Status | How far the enquiry got: `new`, `in_work`, `converted`, `no_answer`, `rejected`. |
| `source_system` | STRING | Source System | What captured the enquiry: `call_tracking`, `google_ads`, `meta_lead_form`, `web_form`, `web_chat`, `physician_referral`, `manual`. `manual` is an offline enquiry no system captured, not "typed in by staff": use Is Manual Entry for that. |
| `channel_name` | STRING | Channel | How the patient reached out: `phone`, `web_form`, `web_chat`, `patient_portal`. |
| `rejection_reason` | STRING | Rejection Reason | Why the enquiry was rejected: `insurance_not_accepted`, `cost_concern`, `chose_competitor`, `wrong_number`, `duplicate`, `not_interested`. NULL unless `status = 'rejected'`. |
| `is_manual_entry` | BOOLEAN | Is Manual Entry | True when staff typed the enquiry in by hand rather than a system capturing it. The field for hand-entered enquiries; Source System `manual` is a different label. |
| `country` | STRING | Country | Country the enquiry came from. |
| `created_at` | TIMESTAMP | Created At | When the enquiry record was created in the warehouse. |
| `count_leads` | INTEGER | Lead Count | Always `1` on every row; SUM to count enquiries. |

## Calculated fields

### `close_rate` · FLOAT · Metric

- **Alias:** Enquiry Close Rate

Share of closed enquiries that became a booked patient: converted over converted, unreached and rejected. Enquiries still `new` or `in_work` are left out of the base.

```sql
SAFE_DIVIDE(COUNTIF(status = 'converted'), COUNTIF(status IN ('converted', 'no_answer', 'rejected')))
```

# Example Questions

- What share of enquiries do we never manage to reach, and does that dead share depend on the channel that produced them or the location they went to?
- Why do enquiries fail — insurance we do not accept, cost, or a competitor — and does the mix differ between markets?
- Do enquiries staff enter by hand convert at a different rate than those captured automatically, and is the difference big enough to change how intake is run?

## Joins

- [Clinic](./clinic.md) — `clinic_id = clinic_id` [N:1] — The clinic the enquiry asked about.
- [Patients](./patients.md) — `patient_id = patient_id` [N:1] — The patient this enquiry was matched to.
- [Sessions](./sessions.md) — `session_id = session_id` [N:1] — The website visit the enquiry came from.
  - [Sessions Attribution](./attribution.md) — The acquisition funnel behind this visit.
