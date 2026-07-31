---
title: "Communications"
description: |
  Every conversation between the sales desk and the people it is trying to convert: one row
  per contact attempt across calls, email, SMS, live chat and messengers, recording who
  handled it, whether the desk reached out or the client got in touch, and whether the attempt
  actually landed or went unanswered. Rows are flagged as the first and the most recent
  contact with a person and as sales-driven rather than servicing, so the shape of a
  relationship — how many attempts it took before someone answered, when the desk last got
  through, and whether the last thing that happened was silence — can be read without
  reconstructing the timeline. This is where the human half of the funnel lives, next to the
  forms and the deposits.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T07:56:56.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `communication_id` | STRING | Communication ID | PK. Unique communication-event identifier. |
| `client_id` | STRING | Client ID | — despite the name, this is the client the communication was with (legacy CRM field name, equivalent to `client_id` elsewhere). FK to [Clients](./clients.md) |
| `agent_id` | STRING | Agent ID | Internal identifier of the agent who handled this communication. Not a foreign key to another mart in this model. |
| `lead_id` | STRING | Lead ID | . The lead this communication relates to, if any. NULL for post-registration servicing contacts. FK to [Leads](./leads.md) |
| `channel` | STRING | Channel | Channel used: `call`, `email`, `sms`, `live_chat`, `whatsapp`, `telegram`. |
| `direction` | STRING | Direction | `inbound` (client-initiated) or `outbound` (agent-initiated). |
| `status` | STRING | Status | Outcome: `successful` or `unsuccessful` (no answer / bounced / failed). This field, combined with `is_last`, is what drives Clients.rfm_label = `lost`. |
| `subject` | STRING | Subject | Topic/subject line. NULL for phone calls. |
| `text` | STRING | Text | Message body or call notes, if recorded. |
| `autoreply` | STRING | Autoreply | Content of any triggered automated reply. NULL if none was sent. |
| `communication_date` | DATE | Communication Date | Calendar date of the communication. |
| `is_first` | BOOLEAN | Is First | `"true"`/`"false"` boolean flag — first ever communication with this client. |
| `is_last` | BOOLEAN | Is Last | `"true"`/`"false"` boolean flag — most recent communication with this client. A `"true"` row with `channel = 'call'` and `status = 'unsuccessful'` is what marks a client `lost` in Clients.rfm_label. |
| `is_sales` | BOOLEAN | Is Sales | `"true"`/`"false"` boolean flag — flagged as a sales-focused interaction. |
| `is_last_sales` | BOOLEAN | Is Last Sales | `"true"`/`"false"` boolean flag — most recent sales-flagged communication with this client. |
| `count_communications` | INTEGER | Count Communications | Always `1` on every row; SUM to count communications matching a filter. |

# Example Questions

- How many attempts does the desk make before someone answers, and which channels reach people that the phone does not?
- Where do outbound calls go unanswered most — by channel and by agent, and how does that compare with the contacts `clients` start themselves?
- How many people have gone quiet on us, in the sense that their most recent contact was an unsuccessful outbound attempt rather than a successful conversation?

## Joins

- [Clients](./clients.md) — `client_id = client_id`
- [Leads](./leads.md) — `lead_id = lead_id`
