---
title: "Tweets"
description: |
  One row per tweet used as a creative: its text (`full_text`), language, type, name, created time, like and repost counts, entities such as hashtags, links and mentions, and the URI of the card attached to it (`card_uri`). The connector requests published tweets of the promoted-only kind (nullcast), so organic tweets are not loaded.

  The key is `id`, a number. Tweet IDs are longer than 15 digits, so the numeric `id` can arrive rounded; `tweet_id` and `id_str` hold the same ID as text and are the columns to match on. Promoted Tweets points here through its `tweet_id`, which is matched to this table's `tweet_id` (or `id_str`) rather than its `id`; `tweet_id` also identifies a tweet on its own, so the join is drawn on it. The card attached to a tweet is in [All Cards](./all-cards.md), matched on `card_uri`.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/a3766e5bc1053780a65b259d9515bedec3c9d782/packages/connectors/src/Sources/XAds/XAdsAPIReference/tweetFields.js"
    title: "OWOX Data Marts X Ads connector — Tweets endpoint (`tweets`)"
    last_modified: 2026-05-29
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/tweets"
    title: "X Ads API reference — Tweets"
---

## Connector endpoint

- **Endpoint:** X Ads · `tweets`
- **Default destination table:** `x_ads_tweets`
- **Last updated:** 2026-05-29 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([353810d2b](https://github.com/OWOX/owox-data-marts/commit/353810d2bc085efba2a026bc9840d95dc1a360f4))
- **Unique keys:** `id`
- **Also unique on its own:** `tweet_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `coordinates` | STRING | Coordinates | The geographic coordinates (latitude/longitude) of the tweet, if available. Stored as a JSON string. |
| `retweeted` | BOOLEAN | Retweeted | Whether this tweet is a retweet of another tweet. |
| `name` | STRING | Name | A custom name or label for the tweet. |
| `conversation_settings` | STRING | Conversation Settings | Who can reply or interact with the tweet (e.g. EVERYONE). |
| `source` | STRING | Source | HTML markup indicating the client or interface used to post the tweet. |
| `entities` | STRING | Entities | Parsed entities in the tweet (mentions, hashtags, URLs, media, etc.). Stored as a JSON string. |
| `display_text_range` | STRING | Display Text Range | Start/end indices for which portion of the tweet text to display. Stored as a JSON string. |
| `favorite_count` | INTEGER | Favorite Count | Number of times the tweet has been liked. |
| `in_reply_to_status_id_str` | STRING | In Reply To Status ID String | ID (as string) of the tweet this one is replying to. |
| `geo` | STRING | Geo | Deprecated geographic information, if present. Stored as a JSON string. |
| `id_str` | STRING | ID String | The tweet’s unique identifier, as a string. |
| `scopes` | STRING | Scopes | Visibility scopes (e.g. { followers: false }). Stored as a JSON string. |
| `in_reply_to_user_id` | INTEGER | In Reply To User ID | Numeric ID of the user this tweet is replying to. |
| `truncated` | BOOLEAN | Truncated | Whether the tweet text has been truncated. |
| `retweet_count` | INTEGER | Retweet Count | Number of times this tweet has been retweeted. |
| `scheduled_status` | STRING | Scheduled Status | Scheduled status (e.g. pending scheduling), if any. |
| `id` | INTEGER | ID | PK. The tweet’s unique identifier, as a number. |
| `in_reply_to_status_id` | INTEGER | In Reply To Status ID | Numeric ID of the tweet this one is replying to. |
| `possibly_sensitive` | BOOLEAN | Possibly Sensitive | Whether the tweet may contain sensitive content. |
| `nullcast` | BOOLEAN | Nullcast | Whether the tweet is nullcast (not shown on timeline). |
| `created_at` | STRING | Created At | Creation timestamp of the tweet. |
| `place` | STRING | Place | Place (location) associated with the tweet, if any. Stored as a JSON string. |
| `scheduled_at` | STRING | Scheduled At | When the tweet was scheduled for posting. |
| `tweet_type` | STRING | Tweet Type | Type of tweet (e.g. PUBLISHED). |
| `favorited` | BOOLEAN | Favorited | Whether the authenticated user has liked the tweet. |
| `card_uri` | STRING | Card URI | URI of the associated Twitter Card. FK to [All Cards](./all-cards.md) |
| `full_text` | STRING | Full Text | The full text content of the tweet. |
| `lang` | STRING | Lang | Language code of the tweet (e.g. en). |
| `contributors` | STRING | Contributors | Array of contributors to the tweet, if any. Stored as a JSON string. |
| `in_reply_to_screen_name` | STRING | In Reply To Screen Name | Screen name of the user this tweet is replying to. |
| `in_reply_to_user_id_str` | STRING | In Reply To User ID String | ID (as string) of the user this tweet is replying to. |
| `user` | STRING | User | The user object of the author (contains id, id_str, etc.). Stored as a JSON string. |
| `tweet_id` | STRING | Tweet ID | Duplicate of id_str (the tweet’s ID as a string). |
| `extended_entities` | STRING | Extended Entities | Extended media entities (e.g. video variants, additional media info). Stored as a JSON string. |

# Example Questions

- Which promoted-only tweets carry a `card`, and which do not?
- Which tweets have the most likes and reposts?
- In which languages are the `promoted tweets` written?

## Joins

- [All Cards](./all-cards.md) — `card_uri = card_uri` [N:1] — The card attached to the tweet.
