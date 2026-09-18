---
type: "OWOX Data Mart"
title: "Attendee"
tags: ["owox", "sql"]
---

# Attendee

## Overview

- **ID:** `8a63c138-847e-4503-abb5-bc904e274109`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b
# Schema

| Column | Type | Description |
|--------|------|-------------|
| `attendee_id` | STRING | PK. |
| `ticket_id` | STRING | FK to [Ticket](./ticket.md) |
| `is_first_measurecamp` | BOOLEAN |  |
| `is_speaker` | BOOLEAN |  |

## Joins

- [Ticket](./ticket.md) — `ticket_id = ticket_id`
