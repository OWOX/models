---
type: "OWOX Data Mart"
title: "Room"
tags: ["owox", "sql"]
---

# Room

## Overview

- **ID:** `f9926aa2-52ca-4492-99c4-77c404736b45`
- **Status:** PUBLISHED
- **Definition type:** SQL
- **Storage:** a1eb7e48-10e7-4507-9932-0ae4c886214b
# Schema

| Column | Type | Description |
|--------|------|-------------|
| `room_id` | STRING | PK. |
| `session_board_id` | STRING | FK to [Session Board](./session-board.md) |
| `sponsor_id` | STRING | FK to [Sponsor](./sponsor.md) |
| `name` | STRING |  |
| `capacity` | INTEGER |  |
| `style` | STRING | Values: Boardroom, Theatre |

## Joins

- [Session Board](./session-board.md) — `session_board_id = session_board_id`
- [Sponsor](./sponsor.md) — `sponsor_id = sponsor_id`
