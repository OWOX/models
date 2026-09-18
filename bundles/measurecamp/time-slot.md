---
title: "Time Slot"
tags: ["owox", "sql"]
type: "OWOX Data Mart"
---

# Time Slot

## Overview

- **ID:** `87132070-7335-4fd4-b34e-5aaf362da285`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `time_slot_id` | STRING | PK. |
| `session_board_id` | STRING | FK to [Session Board](./session-board.md) |
| `name` | STRING |  |
| `type` | STRING | Values: Session, Morning Break, Lunch, Afternoon Break, Closing, Party |
| `start_time` | TIMESTAMP |  |
| `end_time` | TIMESTAMP |  |

## Joins

- [Session Board](./session-board.md) — `session_board_id = session_board_id`
