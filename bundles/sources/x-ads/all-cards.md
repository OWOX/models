---
title: "All Cards"
description: |
  One row per card with its full creative detail: card type, title, website URL, destination URL and display URL, call to action, app store IDs, and the video URLs, poster and sizes. The connector fetches it by card URI, taking the URIs from the `card_uri` column of the tweets it loaded, so it holds the cards attached to those tweets, deleted ones included.

  The table is keyed by `id`, and a card URI (`card://` plus the card's `id`) identifies a card on its own, so Tweets joins here on `card_uri`. Fields that do not apply to a card type are empty.
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
- **Also unique on its own:** `card_uri`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. The unique identifier for the card |
| `name` | STRING | Name | The name of the card |
| `card_type` | STRING | Card Type | Type of the card (e.g. IMAGE_APP_DOWNLOAD, VIDEO_WEBSITE) |
| `card_uri` | STRING | Card Uri | URI of the card |
| `created_at` | DATETIME | Created at | ISO-8601 timestamp when the card was created |
| `updated_at` | DATETIME | Updated at | ISO-8601 timestamp when the card was last updated |
| `deleted` | BOOLEAN | Deleted | Whether the card is deleted |
| `googleplay_app_id` | STRING | Googleplay App ID | Google Play application ID |
| `country_code` | STRING | Country Code | Country code associated with the app or destination |
| `wide_app_image` | STRING | Wide App Image | URL to the wide-aspect-ratio image used by the app card |
| `image_display_width` | STRING | Image Display Width | Width (in pixels) of the primary image displayed with the card |
| `image_display_height` | STRING | Image Display Height | Height (in pixels) of the primary image displayed with the card |
| `app_cta` | STRING | App Cta | Call-to-action used on the app card (e.g. INSTALL, OPEN) |
| `title` | STRING | Title | Title shown on the card |
| `website_url` | STRING | Website URL | Canonical website URL |
| `website_dest_url` | STRING | Website Dest URL | Destination URL used for clicks |
| `website_display_url` | STRING | Website Display URL | Display URL shown on the card |
| `website_shortened_url` | STRING | Website Shortened URL | Shortened (t.co) URL placed in the card |
| `video_url` | STRING | Video URL | URL of the video file or VMAP |
| `video_hls_url` | STRING | Video Hls URL | HLS streaming URL |
| `video_poster_url` | STRING | Video Poster URL | Poster image displayed before video playback |
| `video_content_id` | STRING | Video Content ID | Internal content identifier of the video |
| `video_owner_id` | STRING | Video Owner ID | User ID of the video owner |
| `content_duration_seconds` | STRING | Content Duration Seconds | Video duration in seconds |
| `video_width` | STRING | Video Width | Original width of the video |
| `video_height` | STRING | Video Height | Original height of the video |
| `video_poster_width` | STRING | Video Poster Width | Width of the video poster image |
| `video_poster_height` | STRING | Video Poster Height | Height of the video poster image |

# Example Questions

- Which cards use each call to action?
- Which destination URLs do the cards send clicks to?
- How many cards are video cards, and how long are their videos?
