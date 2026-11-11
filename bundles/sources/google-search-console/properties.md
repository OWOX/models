---
title: "Properties"
description: |
  The Search Console properties the connected Google account can read, with its permission level. One row per property; the anchor every other table joins to on site_url, and the place to copy the exact siteUrl string the connector needs.
tags: ["owox", "connector", "google-search-console"]
type: "OWOX Data Mart"
sources:
  - id: "vendor-reference"
    resource: "https://developers.google.com/webmaster-tools/v1/sites/list"
    title: "Google Search Console API reference — Properties"
---

## Connector endpoint

- **Endpoint:** Google Search Console · `sites`
- **Default destination table:** `search_console_sites`
- **Manifest version:** 1.0
- **Unique keys:** `site_url`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `site_url` | STRING | Site URL | PK. Property identifier: sc-domain:example.com for a Domain property, the full URL with trailing slash for a URL-prefix property. Primary key. |
| `permission_level` | STRING | Permission Level | siteOwner, siteFullUser, siteRestrictedUser or siteUnverifiedUser for the connected account. |

# Example Questions

- Which Search Console properties can this account read, and is the one we load a Domain property or a URL-prefix property?
- Does the connected account own the property or only read it?
