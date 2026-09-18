---
type: "OWOX Data Mart"
title: "Session"
tags: ["owox", "sql"]
---

# Session

## Overview

- **ID:** `86364a18-4161-49b5-bed7-ce59b3904a06`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b
# Schema

| Column | Type | Description |
|--------|------|-------------|
| `session_id` | STRING | PK. |
| `session_board_id` | STRING | FK to [Session Board](./session-board.md) |
| `room_id` | STRING | FK to [Room](./room.md) |
| `time_slot_id` | STRING | FK to [Time Slot](./time-slot.md) |
| `speaker_attendee_id` | STRING | FK to [Attendee](./attendee.md) |
| `name` | STRING |  |
| `description` | STRING |  |
| `type` | STRING | Values: Presentation, Discussion |
| `level` | STRING | Values: Beginner, Intermediate, Advanced |
| `language` | STRING |  |
| `audience` | STRING | Values: Analytical, Business, Technical |

## Joins

- [Session Board](./session-board.md) — `session_board_id = session_board_id`
- [Room](./room.md) — `room_id = room_id`
- [Time Slot](./time-slot.md) — `time_slot_id = time_slot_id`
- [Attendee](./attendee.md) — `speaker_attendee_id = attendee_id`
