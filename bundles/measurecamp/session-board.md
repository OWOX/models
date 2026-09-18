---
type: "OWOX Data Mart"
title: "Session Board"
tags: ["owox", "sql"]
---

# Session Board

## Overview

- **ID:** `ad8e3b82-e194-4a03-83b6-5aaab6f236fd`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b
# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_board_id` | STRING | PK. |
| `event_id` | STRING | FK to [Event](./event.md) |
| `number_of_rooms` | INTEGER |  |
| `number_of_session_slots` | INTEGER |  |
| `session_length_minutes` | INTEGER |  |

## Joins

- [Event](./event.md) — `event_id = event_id`
