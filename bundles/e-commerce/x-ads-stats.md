---
type: "OWOX Data Mart"
title: "X Ads Stats"
description: "OWOX data mart 'X Ads Stats'."
tags: ["owox"]
timestamp: 2026-04-20T15:49:56.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. The unique identifier for the stats record. |
| `date` | STRING | PK. The date for which the statistics were collected. |
| `placement` | STRING | PK. The placement type (ALL_ON_TWITTER or PUBLISHER_NETWORK). |
| `impressions` | INTEGER | Number of impressions. |
| `tweets_send` | INTEGER | Number of tweets sent. |
| `likes` | INTEGER | Number of likes. |
| `unfollows` | INTEGER | Number of unfollows. |
| `retweets` | INTEGER | Number of retweets. |
| `app_clicks` | INTEGER | Number of app clicks. |
| `follows` | INTEGER | Number of follows. |
| `qualified_impressions` | INTEGER | Number of qualified impressions. |
| `billed_charge_local_micro` | INTEGER | Billed amount in micros. |
