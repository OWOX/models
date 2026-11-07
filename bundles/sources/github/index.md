---
title: "GitHub"
description: |
  What the OWOX Data Marts GitHub connector loads about one repository: its details, a daily count of stars and contributors, and its contributors. The connector is configured with one repository in the form `owner/repo`, so every table describes that single repository.

  The three tables share no key. [Repository Information](./repository-information.md) holds the repository's own `id`, but neither [Repository Statistics](./repository-statistics.md) nor [Repository Contributors](./repository-contributors.md) repeats it, so the tables are not joined here. To follow several repositories, load each into its own tables and combine them in the data warehouse. Contributors are read in one request, and GitHub returns at most 100 per page, so for a repository with more than 100 contributors the list and the count stop at 100.
tags: ["owox", "index", "connector", "github"]
type: "index"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/tree/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub"
    title: "OWOX Data Marts — GitHub connector source"
---

3 tables, 54 fields, 0 joins.

| Data Mart | Fields | Description |
|-----------|--------|-------------|
| [Repository Contributors](./repository-contributors.md) | 9 | Contains list of contributors to the repository with their contribution counts |
| [Repository Information](./repository-information.md) | 42 | Contains detailed repository information and statistics |
| [Repository Statistics](./repository-statistics.md) | 3 | Contains daily repository statistics including stars and contributors count |

# Example Questions

- How have stars and contributors grown, day by day?
- Who contributes most to the repository, and are they people or bots?
- Which license, language and default branch does the repository have, and how active is it (open issues, last push)?

# Explore this model

**[▶ Explore on canvas](https://model.owox.com/?okf=https://github.com/OWOX/models/tree/main/bundles/sources/github)**

One click opens this model in a free OWOX canvas you can poke around in — no account needed.

## Model preview

![GitHub model diagram](../../res/screens/sources/github.svg)
