---
title: "Repository Contributors"
description: |
  One row per contributor the GitHub API lists for the repository: login, user `id`, profile and avatar URLs, `type` (User or Bot), whether the person is a site admin and the number of `contributions`. It lists the first page the API returns, at most 100 contributors, sorted by number of commits from most to fewest; anonymous contributors are not included, and GitHub notes the list can be a few hours old.

  The table does not repeat the repository, so it describes the one repository the connector is configured for.
tags: ["owox", "connector", "github"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub/GitHubAPIReference/ContributorsFields.js"
    title: "OWOX Data Marts GitHub connector — Repository Contributors endpoint (`contributors`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://docs.github.com/en/rest/repos/repos#list-repository-contributors"
    title: "GitHub REST API reference — Repository Contributors"
---

## Connector endpoint

- **Endpoint:** GitHub · `contributors`
- **Default destination table:** `github_contributors`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
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
| `html_url` | STRING | HTML URL | Contributor HTML URL |
| `type` | STRING | Type | Contributor type (User/Bot) |
| `site_admin` | BOOLEAN | Site Admin | Whether the contributor is a site admin |
| `contributions` | INTEGER | Contributions | Number of contributions to the repository |

# Example Questions

- Who are the top ten contributors by contributions?
- What share of contributions comes from bots?
- How many contributors have made only one contribution?
