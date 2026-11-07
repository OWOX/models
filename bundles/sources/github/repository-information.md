---
title: "Repository Information"
description: |
  One row for the repository: its `id`, name, full name, owner, URLs, description, language, license, visibility, default branch, feature switches (issues, wiki, pages, discussions, projects), flags (private, fork, archived, disabled, template) and counters: stars, watchers, forks, open issues, network count, subscribers and size.

  The counters are as of the run, not a history; the daily history of stars and contributors is in Repository Statistics. `forks`, `open_issues` and `watchers` repeat `forks_count`, `open_issues_count` and `watchers_count`, as GitHub returns them.
tags: ["owox", "connector", "github"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub/GitHubAPIReference/GitHubFieldsSchema.js"
    title: "OWOX Data Marts GitHub connector — Repository Information endpoint (`repository`)"
  - id: "vendor-reference"
    resource: "https://docs.github.com/en/rest/repos/repos"
    title: "GitHub REST API reference — repos"
---

## Connector endpoint

- **Endpoint:** GitHub · `repository`
- **Default destination table:** `github_repository`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. Repository ID |
| `node_id` | STRING | Repository node ID |
| `name` | STRING | Repository name |
| `full_name` | STRING | Full repository name (owner/repo) |
| `private` | BOOLEAN | Whether the repository is private |
| `owner_login` | STRING | Repository owner login |
| `owner_id` | STRING | Repository owner ID |
| `owner_type` | STRING | Repository owner type (User/Organization) |
| `html_url` | STRING | Repository HTML URL |
| `description` | STRING | Repository description |
| `fork` | BOOLEAN | Whether the repository is a fork |
| `created_at` | DATE | Repository creation date |
| `updated_at` | DATE | Repository last update date |
| `pushed_at` | DATE | Repository last push date |
| `homepage` | STRING | Repository homepage URL |
| `size` | INTEGER | Repository size in KB |
| `stargazers_count` | INTEGER | Number of stars |
| `watchers_count` | INTEGER | Number of watchers |
| `language` | STRING | Primary programming language |
| `has_issues` | BOOLEAN | Whether the repository has issues enabled |
| `has_projects` | BOOLEAN | Whether the repository has projects enabled |
| `has_downloads` | BOOLEAN | Whether the repository has downloads enabled |
| `has_wiki` | BOOLEAN | Whether the repository has wiki enabled |
| `has_pages` | BOOLEAN | Whether the repository has pages enabled |
| `has_discussions` | BOOLEAN | Whether the repository has discussions enabled |
| `forks_count` | INTEGER | Number of forks |
| `archived` | BOOLEAN | Whether the repository is archived |
| `disabled` | BOOLEAN | Whether the repository is disabled |
| `open_issues_count` | INTEGER | Number of open issues |
| `license_key` | STRING | Repository license key |
| `license_name` | STRING | Repository license name |
| `allow_forking` | BOOLEAN | Whether forking is allowed |
| `is_template` | BOOLEAN | Whether the repository is a template |
| `web_commit_signoff_required` | BOOLEAN | Whether web commit signoff is required |
| `topics` | STRING | Repository topics (comma-separated) |
| `visibility` | STRING | Repository visibility (public/private) |
| `forks` | INTEGER | Number of forks |
| `open_issues` | INTEGER | Number of open issues |
| `watchers` | INTEGER | Number of watchers |
| `default_branch` | STRING | Default branch name |
| `network_count` | INTEGER | Network count |
| `subscribers_count` | INTEGER | Number of subscribers |

# Example Questions

- What are the repository's language, license, visibility and default branch?
- How many stars, forks, watchers and open issues does it have now?
- When was it created, last updated and last pushed to, and is it archived?
