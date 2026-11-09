---
title: "Creatives"
description: |
  One row per creative: the content it sponsors, the campaign and account it belongs to as URNs, who created and last modified it and when, its intended status, whether it is serving now, its review state, and the reasons it is held from serving.

  `createdAt` and `lastModifiedAt` are timestamps in milliseconds. `intendedStatus` is what the advertiser wants; `isServing` is what is happening, and `servingHoldReasons` explains the gap. Daily performance is in Ad Analytics, which holds the creative only inside `pivotValues`.
tags: ["owox", "connector", "linkedin-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInAds/LinkedInAdsAPIReference/LinkedInAdsFieldsSchema.js"
    title: "OWOX Data Marts LinkedIn Ads connector — Creatives endpoint (`creatives`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-creatives"
    title: "LinkedIn Marketing API reference — create-and-manage-creatives"
---

## Connector endpoint

- **Endpoint:** LinkedIn Ads · `creatives`
- **Default destination table:** `linkedin_ads_creatives`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `account` | STRING | Account | URN identifying the advertising account associated with the creative. This field is read-only. |
| `campaign` | STRING | Campaign | URN identifying the campaign associated with the creative |
| `content` | STRING | Content | Content sponsored in the creative. On creation, it can be dynamic Ad content (follower, job, spotlight), text, document, or a reference to InMail Content or post (image, video, article, carousel). Content can also be extended and specified as inline content instead of an URN. A reference must be a adInMailContent{id}, share{id}, or ugcPost{id}. |
| `createdAt` | NUMERIC | CreatedAt | Creation time |
| `createdBy` | STRING | CreatedBy | Entity (e.g., a person URN) that developed the creative |
| `id` | STRING | ID | PK. Unique ID for a creative (e.g.,SponsoredCreativeUrn). Read-only |
| `intendedStatus` | STRING | IntendedStatus | Creative user intended status. The creative intended status is set independently from parent entity status, but parent entity status overrides creative intended status in effect. For example, parent entity status may be PAUSED while creative status is ACTIVE, in which case the creative's effective status is PAUSED, and not served.ACTIVE - Creative development is complete and the creative is available for review and can be served. |
| `isServing` | BOOLEAN | IsServing | This indicates whether the creative is currently being served or not. This field is read-only. |
| `lastModifiedAt` | INTEGER | LastModifiedAt | Time at which the creative was last modified in milliseconds since epoch. |
| `lastModifiedBy` | STRING | LastModifiedBy | The entity (e.g., person URN) who modified the creative |
| `leadgenCallToAction` | JSON | LeadgenCallToAction | The field is needed for call to action. This currently only applies if the campaign objective is LEAD_GENERATION. |
| `review` | JSON | Review | Creative review status. The review status cannot be set/updated via the API but is started when the creative is activated (i.e., moves from draft state to active state). Hence, the review is absent (null) when the creative is in DRAFT state. Read-only. |
| `servingHoldReasons` | JSON | ServingHoldReasons | Array that contains all the reasons why the creative is not serving. In the case a creative is being served, this field will be null and not present in the response. |
| `name` | STRING | Name | The name of the creative that can be set by advertiser; primarily used to make it easier to reference a Creative and to recall its purpose. |

# Example Questions

- Which creatives are intended to be active but are not serving, and what holds them back?
- Which creatives were modified most recently, and by whom?
- How many creatives does each campaign URN have?
