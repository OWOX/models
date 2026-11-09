---
title: "Ad Creatives"
description: |
  One row per creative in the ad account's library: its name, body text, title, call to action, destination link, image and video references, the Page post it uses, URL tags and status. A creative is reusable, since one creative can define the `creative` of several ads, and the ads that run it are in [Ads](./ads.md) on `creative_id`.

  It holds content, not results. Performance is in the insights tables, which reach a creative through Ads.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad Creatives endpoint (`ad-account/adcreatives`)"
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account/adcreatives"
    title: "Meta Marketing API reference — adcreatives"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account/adcreatives`
- **Default destination table:** `facebook_ads_ad_account_adcreatives`
- **Unique keys:** `id`
- **Last updated:** 2026-05-18 — last change to this endpoint's fields in the connector ([8a33aca18](https://github.com/OWOX/owox-data-marts/commit/8a33aca183b6dbff95532a723e27803026ba94d9))
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Unique ID for an ad creative, numeric string. |
| `account_id` | STRING | Account ID | Ad account ID for the account this ad creative belongs to. |
| `actor_id` | STRING | Actor ID | The actor ID (Page ID or User ID) of this creative |
| `ad_disclaimer_spec` | STRING | Ad Disclaimer Spec | Ad disclaimer data on creative for additional information on ads. |
| `adlabels` | JSON | Ad Labels | Ad Labels associated with this creative. Used to group it with related ad objects. |
| `applink_treatment` | STRING | App Link Treatment | Used for Dynamic Ads. Specify what action should occur if a person clicks a link in the ad, but the business' app is not installed on their device. For example, open a webpage displaying the product, or open the app in an app store on the person's mobile device. |
| `asset_feed_spec` | STRING | Asset Feed Spec | Used for Dynamic Creative to automatically experiment and deliver different variations of an ad's creative. Specifies an asset feed with multiple images, text and other assets used to generate variations of an ad. Formatted as a JSON string. |
| `authorization_category` | STRING | Authorization Category | Specifies whether ad was configured to be labeled as a political ad or not. See Facebook Advertising Policies. This field cannot be used for Dynamic Ads. |
| `body` | STRING | Body | The body of the ad. Not supported for video post creatives |
| `branded_content` | STRING | Branded Content | branded_content |
| `branded_content_sponsor_page_id` | STRING | Branded Content Sponsor Page ID | ID for page representing business which runs Branded Content ads. See Creating Branded Content Ads. |
| `bundle_folder_id` | STRING | Bundle Folder ID | The Dynamic Ad's bundle folder ID |
| `call_to_action_type` | STRING | Call to Action Type | Type of call to action button in your ad. This determines the button text and header text for your ad. See Ads Guide for campaign objectives and permitted call to action types. |
| `categorization_criteria` | STRING | Categorization Criteria | The Dynamic Category Ad's categorization field, e.g. brand |
| `category_media_source` | STRING | Category Media Source | The Dynamic Ad's rendering mode for category ads |
| `collaborative_ads_lsb_image_bank_id` | STRING | Collaborative Ads LSB Image Bank ID | Used for CPAS local delivery image bank |
| `contextual_multi_ads` | STRING | Contextual Multi Ads | contextual_multi_ads |
| `creative_sourcing_spec` | STRING | Creative Sourcing Spec | creative_sourcing_spec |
| `degrees_of_freedom_spec` | STRING | Degrees of Freedom Spec | Specifies the types of transformations that are enabled for the given creative |
| `destination_set_id` | STRING | Destination Set ID | The ID of the Product Set for a Destination Catalog that will be used to link with Travel Catalogs |
| `dynamic_ad_voice` | STRING | Dynamic Ad Voice | Used for Store Traffic Objective inside Dynamic Ads. Allows you to control the voice of your ad. If set to DYNAMIC, page name and profile picture in your ad post come from the nearest page location. If set to STORY_OWNER, page name and profile picture in your ad post come from the main page location. |
| `effective_authorization_category` | STRING | Effective Authorization Category | Specifies whether ad is a political ad or not. See Facebook Advertising Policies. This field cannot be used for Dynamic Ads. |
| `effective_instagram_media_id` | STRING | Effective Instagram Media ID | The ID of an Instagram post to use in an ad |
| `effective_object_story_id` | STRING | Effective Object Story ID | The ID of a page post to use in an ad, regardless of whether it's an organic or unpublished page post |
| `enable_direct_install` | BOOLEAN | Enable Direct Install | Whether Direct Install should be enabled on supported devices |
| `enable_launch_instant_app` | BOOLEAN | Enable Launch Instant App | Whether Instant App should be enabled on supported devices |
| `facebook_branded_content` | STRING | Facebook Branded Content | Stores fields for Facebook Branded Content |
| `image_crops` | STRING | Image Crops | A JSON object defining crop dimensions for the image specified. See image crop reference for more details |
| `image_hash` | STRING | Image Hash | Image hash for ad creative. If provided, do not add image_url. See image library for more details. |
| `image_url` | STRING | Image URL | A URL for the image for this creative. We save the image at this URL to the ad account's image library. If provided, do not include image_hash. |
| `instagram_permalink_url` | STRING | Instagram Permalink URL | URL for a post on Instagram you want to run as an ad. Also known as Instagram media. |
| `instagram_user_id` | STRING | Instagram User ID | Instagram actor ID |
| `interactive_components_spec` | STRING | Interactive Components Spec | Specification for all the interactive components that would show up on the ad |
| `link_destination_display_url` | STRING | Link Destination Display URL | Overwrites the display URL for link ads when object_url is set to a click tag |
| `link_og_id` | STRING | Link OG ID | The Open Graph (OG) ID for the link in this creative if the landing page has OG tags |
| `link_url` | STRING | Link URL | Identify a specific landing tab on your Facebook page by the Page tab's URL. See connection objects for retrieving Page tab URLs. You can add app_data parameters to the URL to pass data to a Page's tab. |
| `messenger_sponsored_message` | STRING | Messenger Sponsored Message | Used for Messenger sponsored message. JSON string with message for this ad creative. See Messenger Platform, Send API Reference. |
| `name` | STRING | Name | Name of this ad creative as seen in the ad account's library. This field has a limit of 100 characters. |
| `object_id` | STRING | Object ID | ID for Facebook object being promoted with ads or relevant to the ad or ad type. For example a page ID if you are running ads to generate Page Likes. See promoted_object. |
| `object_store_url` | STRING | Object Store URL | iTunes or Google Play of the destination of an app ad |
| `object_story_id` | STRING | Object Story ID | ID of a Facebook Page post to use in an ad. You can get this ID by querying the posts of the page. If this post includes an image, it should not exceed 8 MB. Facebook will upload the image from the post to your ad account's image library. If you create an unpublished page post via object_story_spec at the same time as creating the ad, this ID will be null. However, the effective_object_story_id will be the ID of the page post regardless of whether it's an organic or unpublished page post. |
| `object_story_spec` | STRING | Object Story Spec | Use if you want to create a new unpublished page post and turn the post into an ad. The Page ID and the content to create a new unpublished page post. Specify link_data, photo_data, video_data, text_data or template_data with the content. |
| `object_type` | STRING | Object Type | The type of Facebook object you want to advertise. Allowed values are: |
| `object_url` | STRING | Object URL | URL that opens if someone clicks your link on a link ad. This URL is not connected to a Facebook page. |
| `page_welcome_message` | STRING | Page Welcome Message | Page welcome message for CTM ads |
| `photo_album_source_object_story_id` | STRING | Photo Album Source Object Story ID | photo_album_source_object_story_id |
| `place_page_set_id` | STRING | Place Page Set ID | The ID of the page set for this creative. See theLocal Awareness guide |
| `platform_customizations` | STRING | Platform Customizations | Use this field to specify the exact media to use on different Facebook placements. You can currently use this setting for images and videos. Facebook replaces the media originally defined in ad creative with this media when the ad displays in a specific placements. For example, if you define a media here for instagram, Facebook uses that media instead of the media defined in the ad creative when the ad appears on Instagram. |
| `playable_asset_id` | STRING | Playable Asset ID | The ID of the playable asset in this creative |
| `portrait_customizations` | STRING | Portrait Customizations | This field describes the rendering customizations selected for portrait mode ads like IG Stories, FB Stories, IGTV, etc |
| `product_data` | JSON | Product Data | product_data |
| `product_set_id` | STRING | Product Set ID | Used for Dynamic Ad. An ID for a product set, which groups related products or other items being advertised. |
| `recommender_settings` | STRING | Recommender Settings | Used for Dynamic Ads. Settings to display Dynamic ads based on product recommendations. |
| `source_instagram_media_id` | STRING | Source Instagram Media ID | The ID of an Instagram post for creating ads |
| `status` | STRING | Status | The status of the creative. WITH_ISSUES and IN_PROCESS are available for 4.0 or higher |
| `template_url` | STRING | Template URL | Used for Dynamic Ads when you want to use third-party click tracking. See Dynamic Ads, Click Tracking and Templates. |
| `template_url_spec` | STRING | Template URL Spec | Used for Dynamic Ads when you want to use third-party click tracking. See Dynamic Ads, Click Tracking and Templates. |
| `thumbnail_id` | STRING | Thumbnail ID | thumbnail_id |
| `thumbnail_url` | STRING | Thumbnail URL | URL for a thumbnail image for this ad creative. You can provide dimensions for this with thumbnail_width and thumbnail_height. See example. |
| `title` | STRING | Title | Title for link ad, which does not belong to a page. |
| `url_tags` | STRING | URL Tags | A set of query string parameters which will replace or be appended to urls clicked from page post ads, message of the post, and canvas app install creatives only |
| `use_page_actor_override` | BOOLEAN | Use Page Actor Override | Used for App Ads. If true, we display the Facebook page associated with the app ads. |
| `video_id` | STRING | Video ID | Facebook object ID for video in this ad creative. |

# Example Questions

- Which call to action types are used by the most creatives?
- Which creatives share the same Page post (`effective_object_story_id`)?
- Which creatives are not in an active status?

## Joins

- [Ad Account](./ad-account.md) — `account_id = account_id` [N:1] — The account whose library holds the creative.
  - Description: The account whose library holds the creative.
