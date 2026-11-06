---
title: "Tweets"
description: |
  One row per tweet used as a creative: its text (`full_text`), language, type, name, created time, like and repost counts, entities such as hashtags, links and mentions, and the URI of the card attached to it (`card_uri`). The connector requests published tweets of the promoted-only kind (nullcast), so organic tweets are not loaded.

  The key is `id`, a number; `tweet_id` and `id_str` hold the same ID as text. Promoted Tweets points here through its `tweet_id`.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — Tweets endpoint (`tweets`)"
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/tweets"
    title: "X Ads API reference — tweets"
---

## Connector endpoint

- **Endpoint:** X Ads · `tweets`
- **Default destination table:** `x_ads_tweets`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `coordinates` | JSON | The geographic coordinates (latitude/longitude) of the tweet, if available. |
| `retweeted` | BOOLEAN | Whether this tweet is a retweet of another tweet. |
| `name` | STRING | A custom name or label for the tweet. |
| `conversation_settings` | STRING | Who can reply or interact with the tweet (e.g. EVERYONE). |
| `source` | STRING | HTML markup indicating the client or interface used to post the tweet. |
| `entities` | JSON | Parsed entities in the tweet (mentions, hashtags, URLs, media, etc.). |
| `display_text_range` | JSON | Start/end indices for which portion of the tweet text to display. |
| `favorite_count` | INTEGER | Number of times the tweet has been liked. |
| `in_reply_to_status_id_str` | STRING | ID (as string) of the tweet this one is replying to. |
| `geo` | JSON | Deprecated geographic information, if present. |
| `id_str` | STRING | The tweet’s unique identifier, as a string. |
| `scopes` | JSON | Visibility scopes (e.g. { followers: false }). |
| `in_reply_to_user_id` | INTEGER | Numeric ID of the user this tweet is replying to. |
| `truncated` | BOOLEAN | Whether the tweet text has been truncated. |
| `retweet_count` | INTEGER | Number of times this tweet has been retweeted. |
| `scheduled_status` | STRING | Scheduled status (e.g. pending scheduling), if any. |
| `id` | INTEGER | PK. The tweet’s unique identifier, as a number. |
| `in_reply_to_status_id` | INTEGER | Numeric ID of the tweet this one is replying to. |
| `possibly_sensitive` | BOOLEAN | Whether the tweet may contain sensitive content. |
| `nullcast` | BOOLEAN | Whether the tweet is nullcast (not shown on timeline). |
| `created_at` | STRING | Creation timestamp of the tweet. |
| `place` | JSON | Place (location) associated with the tweet, if any. |
| `scheduled_at` | STRING | When the tweet was scheduled for posting. |
| `tweet_type` | STRING | Type of tweet (e.g. PUBLISHED). |
| `favorited` | BOOLEAN | Whether the authenticated user has liked the tweet. |
| `card_uri` | STRING | URI of the associated Twitter Card. |
| `full_text` | STRING | The full text content of the tweet. |
| `lang` | STRING | Language code of the tweet (e.g. en). |
| `contributors` | JSON | Array of contributors to the tweet, if any. |
| `in_reply_to_screen_name` | STRING | Screen name of the user this tweet is replying to. |
| `in_reply_to_user_id_str` | STRING | ID (as string) of the user this tweet is replying to. |
| `user` | JSON | The user object of the author (contains id, id_str, etc.). |
| `tweet_id` | STRING | Duplicate of id_str (the tweet’s ID as a string). |
| `extended_entities` | JSON | Extended media entities (e.g. video variants, additional media info). |

# Example Questions

- Which promoted-only tweets carry a card, and which do not?
- Which tweets have the most likes and reposts?
- In which languages are the promoted tweets written?
