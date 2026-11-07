---
title: "Repository Statistics"
description: |
  One row per run: the `date` the connector ran, the number of stars (`stars`) and the number of contributors (`contributors`) the repository had that day. GitHub does not return a history of these counts, so the history exists only for the days the connector has run; a day it did not run has no row.

  The `contributors` count is the length of the first page of contributors the API returns, at most 100, so it stops at 100.
tags: ["owox", "connector", "github"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub/GitHubAPIReference/GitHubFieldsSchema.js"
    title: "OWOX Data Marts GitHub connector — Repository Statistics endpoint (`repositoryStats`)"
  - id: "vendor-reference"
    resource: "https://docs.github.com/en/rest/repos/repos"
    title: "GitHub REST API reference — repos"
---

## Connector endpoint

- **Endpoint:** GitHub · `repositoryStats`
- **Default destination table:** `github_repository_stats`
- **Unique keys:** `date`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | PK. Date of the data snapshot |
| `stars` | INTEGER | Number of stars for the repository |
| `contributors` | INTEGER | Number of contributors to the repository |

# Example Questions

- How many stars did the repository gain per week?
- On which days did the contributor count change?
- What is the star growth over the last 90 days?
