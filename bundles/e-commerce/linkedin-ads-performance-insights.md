---
type: "OWOX Data Mart"
title: "Linkedin Ads Performance Insights"
description: "Linkedin Ads Performance Insights with ad-level granularity."
tags: ["owox"]
timestamp: 2026-05-26T20:08:10.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `dateRangeStart` | DATE | PK. Start date of the report data point. Date is specified in UTC format (YYYY-MM-DD). |
| `dateRangeEnd` | DATE | PK. End date of the report data point. Date is specified in UTC format (YYYY-MM-DD). |
| `pivotValues` | STRING | PK. The value of the pivots for a specific record returned. For example, supplying pivots of CREATIVE and CONVERSION results in a list of records, one for each creative/conversion combination. The pivotValues contain serialized URNs for the specific creative and conversion for a record. To resolve these URNs to their corresponding entities, refer to LinkedIn Marketing API URN Resolution. |
| `actionClicks` | FLOAT | The count of clicks on the action button of the Sponsored Messaging ad. |
| `adUnitClicks` | FLOAT | The count of clicks on the ad unit displayed alongside the Sponsored Messaging ad. |
| `cardClicks` | FLOAT | Non-demographic pivots only (i.e. not MEMBER_). The number of clicks for each card of a carousel ad. The first card click of the carousel ad results in an immediate cardClick and click, whereas scrolling to other cards and clicking will count as additional cardClick. |
| `cardImpressions` | FLOAT | Non-demographic pivots only (i.e. not MEMBER_). The number of impressions shown for each card of a carousel ad. The first card of the carousel ad results in an immediate cardImpression and impression, whereas scrolling to other cards will count as additional cardImpressions. |
| `clicks` | FLOAT | The count of chargeable clicks. Despite not charging for clicks for CPM campaigns, this field still represents those clicks for which we would otherwise charge advertisers based on objective (for example, clicks to view the landing page or company page). |
| `comments` | FLOAT | The count of comments. Sponsored Content only. |
| `costInUsd` | FLOAT | Cost in USD based on the pivot and timeGranularity. For example, this would be spend by campaign on a given day if the pivot is CAMPAIGN and timeGranularity is DAILY. Cost is not adjusted for over delivery when a member professional demographic pivot is specified in the request. |
| `follows` | FLOAT | The count of follows. Sponsored Content and Follower ads only. |
| `impressions` | FLOAT | This is the count of impressions for Sponsored Content and sends for Sponsored Messaging. |
| `landingPageClicks` | FLOAT | The count of clicks which take the user to the creative landing page. |
| `likes` | FLOAT | The count of likes. Sponsored Content only. |
| `opens` | FLOAT | The count of opens of Sponsored Messaging ads. |
| `reactions` | FLOAT | The count of positive reactions on Sponsored Content which can capture, like, interest, praise, and other responses. |
| `sends` | FLOAT | The count of sends of Sponsored Messaging ads. |
| `shares` | FLOAT | The count of shares. Sponsored Content only. |
