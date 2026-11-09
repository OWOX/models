---
title: "Repository Contributors"
description: |
  One row per contributor the GitHub API lists for the repository: login, user `id`, profile and avatar URLs, `type` (User or Bot), whether the person is a site admin and the number of `contributions`. It lists the first page the API returns, at most 100 contributors, ordered by GitHub.

  The table does not repeat the repository, so it describes the one repository the connector is configured for.
tags: ["owox", "connector", "github"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub/GitHubAPIReference/GitHubFieldsSchema.js"
    title: "OWOX Data Marts GitHub connector — Repository Contributors endpoint (`contributors`)"
  - id: "vendor-reference"
    resource: "https://docs.github.com/en/rest/repos/repos#list-repository-contributors"
    title: "GitHub REST API reference — repos#list-repository-contributors"
---

## Connector endpoint

- **Endpoint:** GitHub · `contributors`
- **Default destination table:** `github_contributors`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `login` | STRING | Login | Contributor login name |
| `id` | STRING | ID | PK. Contributor ID |
| `node_id` | STRING | Node ID | Contributor node ID |
| `avatar_url` | STRING | Avatar URL | Contributor avatar URL |
| `gravatar_id` | STRING | Gravatar ID | Contributor gravatar ID |
| `html_url` | STRING | Html URL | Contributor HTML URL |
| `type` | STRING | Type | Contributor type (User/Bot) |
| `site_admin` | BOOLEAN | Site Admin | Whether the contributor is a site admin |
| `contributions` | INTEGER | Contributions | Number of contributions to the repository |

# Example Questions

- Who are the top ten contributors by contributions?
- What share of contributions comes from bots?
- How many contributors have made only one contribution?
