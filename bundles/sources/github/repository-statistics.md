---
title: "Repository Statistics"
description: |
  One row per run: the `date` the connector ran, the number of stars (`stars`) and the number of contributors (`contributors`) the repository had that day. GitHub does not return a history of these counts, so the history exists only for the days the connector has run; a day it did not run has no row.

  The `contributors` count is the length of the first page of contributors the API returns, at most 100, so it stops at 100.
tags: ["owox", "connector", "github"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub/GitHubAPIReference/RepositoryStatsFields.js"
    title: "OWOX Data Marts GitHub connector — Repository Statistics endpoint (`repositoryStats`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://docs.github.com/en/rest/repos/repos"
    title: "GitHub REST API reference — Repository Statistics"
---

## Connector endpoint

- **Endpoint:** GitHub · `repositoryStats`
- **Default destination table:** `github_repository_stats`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
- **Unique keys:** `date`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `date` | DATE | Date | PK. The day the connector ran and read the counts; a day it did not run has no row. |
| `stars` | INTEGER | Stars | Stars the repository had on the run day, GitHub's `stargazers_count`. |
| `contributors` | INTEGER | Contributors | Contributors on the first page GitHub returned on the run day, so never more than 100. |

# Example Questions

- How many stars did the repository gain per week?
- On which days did the contributor count change?
- What is the star growth over the last 90 days?
