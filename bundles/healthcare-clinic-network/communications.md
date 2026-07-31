---
title: "Communications"
description: |
  Every attempt to reach a patient, and every time one reached us: one row per interaction, with the
  channel it used, which direction it went, whether it succeeded, and which agent handled it. Calls
  dominate, because that is how most people still choose a clinician, and the honest measure of a
  contact centre lives here rather than in the enquiry record — how many attempts it takes before
  someone answers, which enquiries are given up on, and whether persistence actually changes the
  outcome. `is_first` and `is_last` bracket each conversation, and `is_scheduling` separates the
  interactions that were about getting an appointment in the diary from reminders, follow-ups and
  automated replies.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:25:48.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `communication_id` | STRING | Communication ID | PK. Unique identifier for this interaction. |
| `lead_id` | STRING | Lead ID | Enquiry this interaction concerns. FK to [Leads](./leads.md) |
| `patient_id` | STRING | Patient ID | Patient this interaction concerns, once the enquiry has converted. FK to [Patients](./patients.md) |
| `agent_id` | STRING | Agent ID | Agent who handled the interaction. FK to [Patient Access Agent](./patient-access-agent.md) |
| `type` | STRING | Communication Type | Channel used: `call`, `sms`, `email`, `web_chat`, `portal_message`. |
| `direction` | STRING | Direction | `inbound` when the patient contacted us, `outbound` when we contacted them. |
| `status` | STRING | Status | Outcome of the attempt: `successful` or `unsuccessful`. Counting unsuccessful outbound attempts is how the cost of chasing is measured. |
| `subject` | STRING | Subject | Short label describing what the interaction was about. |
| `message_text` | STRING | Message Text | Body of the message sent or received. |
| `is_autoreply` | BOOLEAN | Is Auto Reply | True when the interaction was generated automatically rather than sent by a person. |
| `creation_date` | DATE | Creation Date | Date the interaction took place. |
| `is_first` | BOOLEAN | Is First Communication | True for the first interaction recorded against the enquiry. |
| `is_last` | BOOLEAN | Is Last Communication | True for the most recent interaction recorded against the enquiry. |
| `is_scheduling` | BOOLEAN | Is Scheduling Interaction | True when the interaction was about getting an appointment into the diary, as opposed to a reminder or follow-up. |
| `is_last_scheduling` | BOOLEAN | Is Last Scheduling Interaction | True for the most recent scheduling interaction on the enquiry. |
| `count_communications` | INTEGER | Communication Count | Always `1` on every row; SUM to count interactions. |

# Example Questions

- How many attempts do we make before an enquiry is reached, at what point do we give up, and does one more attempt still pay for itself?
- Do enquiries handled entirely by automated replies convert at a materially different rate than those a person actually spoke to?
- Which channels do `patients` answer on rather than merely receive, and has that shifted over the period?

## Joins

- [Leads](./leads.md) — `lead_id = lead_id`
- [Patient Access Agent](./patient-access-agent.md) — `agent_id = agent_id`
- [Patients](./patients.md) — `patient_id = patient_id`
