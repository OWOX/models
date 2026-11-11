---
title: "Repository Information"
description: |
  One row for the repository: its `id`, name, full name (`owner/repo`), URLs, description, language, visibility, default branch, feature switches (issues, wiki, pages, discussions, projects), flags (private, fork, archived, disabled, template) and counters: stars, watchers, forks, open issues, network count, subscribers and size.

  The counters are as of the run, not a history; the daily history of stars and contributors is in Repository Statistics. `forks`, `open_issues` and `watchers` repeat `forks_count`, `open_issues_count` and `watchers_count`, as GitHub returns them. Two traps: GitHub's `watchers` and `watchers_count` count stars, and the people watching the repository are `subscribers_count`; open issues include open pull requests. The owner and license columns stay empty, because GitHub nests them in objects the connector does not unpack.
tags: ["owox", "connector", "github"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9e0434a7274ad704f6f26e07d88aca7d83298450/packages/connectors/src/Sources/GitHub/GitHubAPIReference/RepositoryFields.js"
    title: "OWOX Data Marts GitHub connector — Repository Information endpoint (`repository`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://docs.github.com/en/rest/repos/repos"
    title: "GitHub REST API reference — Repository Information"
---

## Connector endpoint

- **Endpoint:** GitHub · `repository`
- **Default destination table:** `github_repository`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
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
| `owner_login` | STRING | Owner Login | Meant for the owner's login, but GitHub returns the owner as an object the connector does not unpack, so the column stays empty; `full_name` starts with the owner's login. |
| `owner_id` | STRING | Owner ID | Meant for the owner's ID, but GitHub returns the owner as an object the connector does not unpack, so the column stays empty. |
| `owner_type` | STRING | Owner Type | Meant for the owner's type (User or Organization), but GitHub returns the owner as an object the connector does not unpack, so the column stays empty. |
| `html_url` | STRING | HTML URL | Repository HTML URL |
| `description` | STRING | Description | Repository description |
| `fork` | BOOLEAN | Fork | Whether the repository is a fork |
| `created_at` | DATE | Created At | Repository creation date |
| `updated_at` | DATE | Updated At | Repository last update date |
| `pushed_at` | DATE | Pushed At | Repository last push date |
| `homepage` | STRING | Homepage | Repository homepage URL |
| `size` | INTEGER | Size | Repository size in KB |
| `stargazers_count` | INTEGER | Stargazers Count | Number of users who starred the repository. |
| `watchers_count` | INTEGER | Watchers Count (Stars) | Number of users who starred the repository, the same as `stargazers_count`: GitHub kept the old name; people watching the repository are in `subscribers_count`. |
| `language` | STRING | Language | Primary programming language |
| `has_issues` | BOOLEAN | Has Issues | Whether the repository has issues enabled |
| `has_projects` | BOOLEAN | Has Projects | Whether the repository has projects enabled |
| `has_downloads` | BOOLEAN | Has Downloads | Whether the repository has downloads enabled |
| `has_wiki` | BOOLEAN | Has Wiki | Whether the repository has wiki enabled |
| `has_pages` | BOOLEAN | Has Pages | Whether the repository has pages enabled |
| `has_discussions` | BOOLEAN | Has Discussions | Whether the repository has discussions enabled |
| `forks_count` | INTEGER | Forks Count | Number of forks of the repository. |
| `archived` | BOOLEAN | Archived | Whether the repository is archived |
| `disabled` | BOOLEAN | Disabled | Whether the repository is disabled |
| `open_issues_count` | INTEGER | Open Issues Count | Open issues of the repository, open pull requests included: GitHub's REST API counts every pull request as an issue. |
| `license_key` | STRING | License Key | Meant for the license key, but GitHub returns the license as an object the connector does not unpack, so the column stays empty. |
| `license_name` | STRING | License Name | Meant for the license name, but GitHub returns the license as an object the connector does not unpack, so the column stays empty. |
| `allow_forking` | BOOLEAN | Allow Forking | Whether forking is allowed |
| `is_template` | BOOLEAN | Is Template | Whether the repository is a template |
| `web_commit_signoff_required` | BOOLEAN | Web Commit Signoff Required | Whether web commit signoff is required |
| `topics` | STRING | Topics | Meant as comma-separated topics, but GitHub returns an array the connector passes through unchanged, so the column holds JSON array text such as `["a","b"]`. |
| `visibility` | STRING | Visibility | Repository visibility (public/private) |
| `forks` | INTEGER | Forks | Same value as `forks_count`; GitHub returns both. |
| `open_issues` | INTEGER | Open Issues | Same value as `open_issues_count`, so it includes open pull requests. |
| `watchers` | INTEGER | Watchers (Stars) | Same value as `watchers_count`: the number of stars, not of watchers. |
| `default_branch` | STRING | Default Branch | Default branch name |
| `network_count` | INTEGER | Network Count | A count GitHub returns next to `forks_count` without defining it in its REST reference; for the number of forks use `forks_count`. |
| `subscribers_count` | INTEGER | Watchers (Subscribers) | Number of users watching the repository, that is, getting its notifications; GitHub's `watchers` fields count stars instead. |

# Example Questions

- What are the repository's language, visibility and default branch?
- How many stars, forks, watchers and open issues does it have now?
- When was it created, last updated and last pushed to, and is it archived?
