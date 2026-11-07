---
title: "All Cards"
description: |
  One row per card with its full creative detail: card type, title, website URL, destination URL and display URL, call to action, app store IDs, and the video URLs, poster and sizes. The connector fetches it by card URI, taking the URIs from the `card_uri` column of the tweets it loaded, so it holds the cards attached to those tweets, deleted ones included.

  A card URI is not this table's key (`id` is), which is why Tweets does not join here on `card_uri`. Fields that do not apply to a card type are empty.
tags: ["owox", "connector", "x-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/XAds/XAdsAPIReference/XAdsFieldsSchema.js"
    title: "OWOX Data Marts X Ads connector — All Cards endpoint (`cards_all`)"
  - id: "vendor-reference"
    resource: "https://developer.twitter.com/en/docs/twitter-ads-api/cards"
    title: "X Ads API reference — cards"
---

## Connector endpoint

- **Endpoint:** X Ads · `cards_all`
- **Default destination table:** `x_ads_cards_all`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. The unique identifier for the card |
| `name` | STRING | The name of the card |
| `card_type` | STRING | Type of the card (e.g. IMAGE_APP_DOWNLOAD, VIDEO_WEBSITE) |
| `card_uri` | STRING | URI of the card |
| `created_at` | DATETIME | ISO-8601 timestamp when the card was created |
| `updated_at` | DATETIME | ISO-8601 timestamp when the card was last updated |
| `deleted` | BOOLEAN | Whether the card is deleted |
| `googleplay_app_id` | STRING | Google Play application ID |
| `country_code` | STRING | Country code associated with the app or destination |
| `wide_app_image` | STRING | URL to the wide-aspect-ratio image used by the app card |
| `image_display_width` | STRING | Width (in pixels) of the primary image displayed with the card |
| `image_display_height` | STRING | Height (in pixels) of the primary image displayed with the card |
| `app_cta` | STRING | Call-to-action used on the app card (e.g. INSTALL, OPEN) |
| `title` | STRING | Title shown on the card |
| `website_url` | STRING | Canonical website URL |
| `website_dest_url` | STRING | Destination URL used for clicks |
| `website_display_url` | STRING | Display URL shown on the card |
| `website_shortened_url` | STRING | Shortened (t.co) URL placed in the card |
| `video_url` | STRING | URL of the video file or VMAP |
| `video_hls_url` | STRING | HLS streaming URL |
| `video_poster_url` | STRING | Poster image displayed before video playback |
| `video_content_id` | STRING | Internal content identifier of the video |
| `video_owner_id` | STRING | User ID of the video owner |
| `content_duration_seconds` | STRING | Video duration in seconds |
| `video_width` | STRING | Original width of the video |
| `video_height` | STRING | Original height of the video |
| `video_poster_width` | STRING | Width of the video poster image |
| `video_poster_height` | STRING | Height of the video poster image |

# Example Questions

- Which cards use each call to action?
- Which destination URLs do the cards send clicks to?
- How many cards are video cards, and how long are their videos?
