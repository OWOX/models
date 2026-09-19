---
type: "OWOX Data Mart"
title: "Event"
tags: ["owox", "sql"]
---

# Event

## Overview

- **ID:** `d22e3a7f-d898-4d10-b216-b1747752ad76`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b
# Schema

| Column | Type | Description |
|--------|------|-------------|
| `event_id` | STRING | PK. |
| `city_id` | STRING | FK to [City](./city.md) |
| `name` | STRING |  |
| `date` | DATE |  |
| `location` | STRING |  |

## Joins

- [City](./city.md) — `city_id = city_id`
