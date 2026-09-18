---
title: "Sponsor"
tags: ["owox", "sql"]
type: "OWOX Data Mart"
---

# Sponsor

## Overview

- **ID:** `7a601de9-88c3-421f-a768-27da446f8dab`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `sponsor_id` | STRING | PK. |
| `event_id` | STRING | FK to [Event](./event.md) |
| `organization_name` | STRING |  |
| `tier` | STRING | Values: Gold, Silver, Bronze |
| `status` | STRING | Values: Prospect, Confirmed, Paid |

## Joins

- [Event](./event.md) — `event_id = event_id`
