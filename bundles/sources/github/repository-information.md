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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Repository ID |
| `node_id` | STRING | Node ID | Repository node ID |
| `name` | STRING | Name | Repository name |
| `full_name` | STRING | Full Name | Full repository name (owner/repo) |
| `private` | BOOLEAN | Private | Whether the repository is private |
| `owner_login` | STRING | Owner Login | Repository owner login |
| `owner_id` | STRING | Owner ID | Repository owner ID |
| `owner_type` | STRING | Owner Type | Repository owner type (User/Organization) |
| `html_url` | STRING | Html URL | Repository HTML URL |
| `description` | STRING | Description | Repository description |
| `fork` | BOOLEAN | Fork | Whether the repository is a fork |
| `created_at` | DATE | Created at | Repository creation date |
| `updated_at` | DATE | Updated at | Repository last update date |
| `pushed_at` | DATE | Pushed at | Repository last push date |
| `homepage` | STRING | Homepage | Repository homepage URL |
| `size` | INTEGER | Size | Repository size in KB |
| `stargazers_count` | INTEGER | Stargazers Count | Number of stars |
| `watchers_count` | INTEGER | Watchers Count | Number of watchers |
| `language` | STRING | Language | Primary programming language |
| `has_issues` | BOOLEAN | Has Issues | Whether the repository has issues enabled |
| `has_projects` | BOOLEAN | Has Projects | Whether the repository has projects enabled |
| `has_downloads` | BOOLEAN | Has Downloads | Whether the repository has downloads enabled |
| `has_wiki` | BOOLEAN | Has Wiki | Whether the repository has wiki enabled |
| `has_pages` | BOOLEAN | Has Pages | Whether the repository has pages enabled |
| `has_discussions` | BOOLEAN | Has Discussions | Whether the repository has discussions enabled |
| `forks_count` | INTEGER | Forks Count | Number of forks |
| `archived` | BOOLEAN | Archived | Whether the repository is archived |
| `disabled` | BOOLEAN | Disabled | Whether the repository is disabled |
| `open_issues_count` | INTEGER | Open Issues Count | Number of open issues |
| `license_key` | STRING | License Key | Repository license key |
| `license_name` | STRING | License Name | Repository license name |
| `allow_forking` | BOOLEAN | Allow Forking | Whether forking is allowed |
| `is_template` | BOOLEAN | Is Template | Whether the repository is a template |
| `web_commit_signoff_required` | BOOLEAN | Web Commit Signoff Required | Whether web commit signoff is required |
| `topics` | STRING | Topics | Repository topics (comma-separated) |
| `visibility` | STRING | Visibility | Repository visibility (public/private) |
| `forks` | INTEGER | Forks | Number of forks |
| `open_issues` | INTEGER | Open Issues | Number of open issues |
| `watchers` | INTEGER | Watchers | Number of watchers |
| `default_branch` | STRING | Default Branch | Default branch name |
| `network_count` | INTEGER | Network Count | Network count |
| `subscribers_count` | INTEGER | Subscribers Count | Number of subscribers |

# Example Questions

- What are the repository's language, license, visibility and default branch?
- How many stars, forks, watchers and open issues does it have now?
- When was it created, last updated and last pushed to, and is it archived?
