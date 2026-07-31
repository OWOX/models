---
title: "Patient Access Agent"
description: |
  The people who answer the phone. Patient access is the function that handles inbound enquiries
  and books them into a clinician's diary, and since the overwhelming majority of new patients
  arrive by phone rather than by form, this small team sits directly on the network's growth. One
  row per agent, with the role they hold — front-line representative, senior representative or
  supervisor — and the country they work in. On its own the mart is a short staff list; joined to
  the interaction history it is what makes contact-centre performance answerable at all, because
  every call, message and booking attempt is attributed to the agent who handled it.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-31T11:02:27.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `agent_id` | STRING | Agent ID | PK. Unique identifier for this contact-centre agent. |
| `first_name` | STRING | First Name | Agent's given name. |
| `last_name` | STRING | Last Name | Agent's family name. |
| `role` | STRING | Role | Position on the team: `patient_access_rep`, `senior_rep` or `supervisor`. Use this to ask whether experience changes booking rates. |
| `country` | STRING | Country | Two-letter country code the agent works in. |
| `email` | STRING | Email Address | Work email address for the agent. |
| `is_active` | BOOLEAN | Is Active | True while the agent is still on the team. |

# Example Questions

- Does an enquiry handled by a senior representative end up booked more often than one handled by a front-line agent, and by enough to justify how calls are routed?
- Which agents are reaching enquiries that others give up on, and how many attempts do they make before they succeed?
- Is contact-centre capacity spread evenly across the countries we operate in, or is one market being served by a handful of people?
