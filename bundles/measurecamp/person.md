---
title: "Person"
description: |
  The individuals behind everything else in the model: one row per human, held once and
  reused across editions. A person becomes a ticket holder when they register, an attendee
  when they turn up and an organiser when they take a seat on a committee — so the same row
  can play all three roles, in the same year or in different ones. The professional
  attributes here — the organisation someone works for and what they do there — are what
  turn "how many people came" into a picture of who the community actually is.
tags: ["owox"]
type: "OWOX Data Mart"
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `person_id` | STRING | Person ID | PK. Unique person identifier. |
| `name` | STRING | Full Name | The person's name. |
| `email` | STRING | Email | Email address the person registers under. |
| `organization` | STRING | Organization | The company or organisation they work for. |
| `job_title` | STRING | Job Title | What they do — analyst, developer, marketer and so on. The mix of job titles is the closest thing the model has to a profile of the room. |

# Example Questions

- Which job titles and organisations fill the room, and has that mix shifted across editions?
- How many people come back — how many hold `tickets` for more than one edition, and how many for three or more?
- Do the people who lead `sessions` come from different organisations than those who only attend?
