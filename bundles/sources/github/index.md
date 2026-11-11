---
title: "GitHub"
description: |
  What the OWOX Data Marts GitHub connector loads about one repository: its details, a daily count of stars and contributors, and its contributors. The connector is configured with one repository in the form `owner/repo`, so every table describes that single repository.

  The three tables share no key. [Repository Information](./repository-information.md) holds the repository's own `id`, but neither [Repository Statistics](./repository-statistics.md) nor [Repository Contributors](./repository-contributors.md) repeats it, so the tables are not joined here. To follow several repositories, load each into its own tables and combine them in the data warehouse. Contributors are read in one request, and GitHub returns at most 100 per page, so for a repository with more than 100 contributors the list and the count stop at 100.

  Each table is dated: its **Last updated** is the last change to that endpoint's entry in the connector's fields schema, or to the file that declares its fields. Definitions below are current as of connector commit [`9e0434a72`](https://github.com/OWOX/owox-data-marts/commit/9e0434a7274ad704f6f26e07d88aca7d83298450).
tags: ["owox", "index", "connector", "github"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub"
    title: "OWOX Data Marts — GitHub connector source"
    last_modified: 2026-05-21
---

<!-- OWOX:GENERATED:START — regenerated on export, do not edit inside this block -->

**Authors:** [Ievgen Krasovytskyi](https://github.com/ikrasovytskyi)

| Data Mart | Fields | Last updated | Description |
|-----------|--------|--------------|-------------|
| [Repository Contributors](./repository-contributors.md) | 9 | 2026-05-21 | One row per contributor the GitHub API lists for the repository: login, user `id`, profile and avatar URLs, `type` (User or Bot), whether the person is a site admin and the number of `contributions`. |
| [Repository Information](./repository-information.md) | 42 | 2026-05-21 | One row for the repository: its `id`, name, full name (`owner/repo`), URLs, description, language, visibility, default branch, feature switches (issues, wiki, pages, discussions, projects), flags (private, fork, archived, disabled, template) and counters: stars, watchers, forks, open issues, network count, subscribers and size. |
| [Repository Statistics](./repository-statistics.md) | 3 | 2026-05-21 | One row per run: the `date` the connector ran, the number of stars (`stars`) and the number of contributors (`contributors`) the repository had that day. |

# Example Questions

- How have stars and contributors grown, day by day?
- Who contributes most to the repository, and are they people or bots?
- Which language and default branch does the repository have, and how active is it (open issues, last push)?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/github)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

<!-- OWOX:GENERATED:END -->
