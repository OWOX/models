---
title: "Ad Account"
description: |
  One row per ad account the connector is set up to read: its name, status, currency, time zone, business details, amount spent, spend cap and balance. It holds the account's settings, not its results.

  `id` is the account number with the `act_` prefix and `account_id` is the bare number. Every ads, creatives and insights table in this model carries the bare number in its own `account_id`, so to put account settings next to any of them, match their `account_id` to this table's `account_id`.
tags: ["owox", "connector", "facebook-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8aff3513fdade6760a74baad9aa985167cf542ba/packages/connectors/src/Sources/FacebookMarketing/MarketingAPIReference/FieldsSchema.js"
    title: "OWOX Data Marts Facebook Ads connector — Ad Account endpoint (`ad-account`)"
  - id: "vendor-reference"
    resource: "https://developers.facebook.com/docs/marketing-api/reference/ad-account/"
    title: "Meta Marketing API reference — ad-account"
---

## Connector endpoint

- **Endpoint:** Facebook Ads · `ad-account`
- **Default destination table:** `facebook_ads_ad_account`
- **Unique keys:** `id`, `account_id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `id` | STRING | PK. The string act\_{ad_account_id}. |
| `account_id` | STRING | PK. The ID of the Ad Account. |
| `account_status` | INTEGER | Status of the account: |
| `age` | NUMERIC | Amount of time the ad account has been open, in days. |
| `agency_client_declaration` | STRING | Details of the agency advertising on behalf of this client account, if applicable. Requires Business Manager Admin privileges. |
| `amount_spent` | STRING | Current amount spent by the account with respect to spend_cap. Or total amount in the absence of spend_cap. |
| `attribution_spec` | JSON | Deprecated due to iOS 14 changes. Please visit the changelog for more information. |
| `balance` | STRING | Bill amount due for this Ad Account. |
| `brand_safety_content_filter_levels` | JSON | Brand safety content filter levels set for in-content ads (Facebook in-stream videos and Ads on Facebook Reels) and Audience Network along with feed ads (Facebook Feed, Instagram feed, Facebook Reels feed and Instagram Reels feed) if applicable. |
| `business` | STRING | The Business Manager, if this ad account is owned by one |
| `business_city` | STRING | City for business address |
| `business_country_code` | STRING | Country code for the business address |
| `business_name` | STRING | The business name for the account |
| `business_state` | STRING | State abbreviation for business address |
| `business_street` | STRING | First line of the business street address for the account |
| `business_street2` | STRING | Second line of the business street address for the account |
| `business_zip` | STRING | Zip code for business address |
| `can_create_brand_lift_study` | BOOLEAN | If we can create a new automated brand lift study under the Ad Account. |
| `capabilities` | JSON | List of capabilities an Ad Account can have. See capabilities |
| `created_time` | DATETIME | The time the account was created in ISO 8601 format. |
| `currency` | STRING | The currency used for the account, based on the corresponding value in the account settings. See supported currencies |
| `default_dsa_beneficiary` | STRING | This is the default value for creating L2 object of dsa_beneficiary |
| `default_dsa_payor` | STRING | This is the default value for creating L2 object of dsa_payor |
| `disable_reason` | INTEGER | The reason why the account was disabled. Possible reasons are: |
| `end_advertiser` | STRING | The entity the ads will target. Must be a Facebook Page Alias, Facebook Page ID or an Facebook App ID. |
| `end_advertiser_name` | STRING | The name of the entity the ads will target. |
| `existing_customers` | JSON | The custom audience ids that are used by advertisers to define their existing customers. This definition is primarily used by Automated Shopping Ads. |
| `expired_funding_source_details` | STRING | ID = ID of the payment method |
| `extended_credit_invoice_group` | STRING | The extended credit invoice group that the ad account belongs to |
| `failed_delivery_checks` | JSON | Failed delivery checks |
| `fb_entity` | INTEGER | fb_entity |
| `funding_source` | STRING | ID of the payment method. If the account does not have a payment method it will still be possible to create ads but these ads will get no delivery. Not available if the account is disabled |
| `funding_source_details` | STRING | ID = ID of the payment method |
| `has_migrated_permissions` | BOOLEAN | Whether this account has migrated permissions |
| `io_number` | STRING | The Insertion Order (IO) number. |
| `is_attribution_spec_system_default` | BOOLEAN | If the attribution specification of ad account is generated from system default values |
| `is_direct_deals_enabled` | BOOLEAN | Whether the account is enabled to run Direct Deals |
| `is_in_3ds_authorization_enabled_market` | BOOLEAN | If the account is in a market requiring to go through payment process going through 3DS authorization |
| `is_notifications_enabled` | BOOLEAN | Get the notifications status of the user for this ad account. This will return true or false depending if notifications are enabled or not |
| `is_personal` | INTEGER | Indicates if this ad account is being used for private, non-business purposes. This affects how value-added tax (VAT) is assessed. Note: This is not related to whether an ad account is attached to a business. |
| `is_prepay_account` | BOOLEAN | If this ad account is a prepay. Other option would be a postpay account. |
| `is_tax_id_required` | BOOLEAN | If tax id for this ad account is required or not. |
| `line_numbers` | JSON | The line numbers |
| `media_agency` | STRING | The agency, this could be your own business. Must be a Facebook Page Alias, Facebook Page ID or an Facebook App ID. In absence of one, you can use NONE or UNFOUND. |
| `min_campaign_group_spend_cap` | STRING | The minimum required spend cap of Ad Campaign. |
| `min_daily_budget` | INTEGER | The minimum daily budget for this Ad Account |
| `name` | STRING | Name of the account. If not set, the name of the first admin visible to the user will be returned. |
| `offsite_pixels_tos_accepted` | BOOLEAN | Indicates whether the offsite pixel Terms Of Service contract was signed. This feature can be accessible before v2.9 |
| `owner` | STRING | The ID of the account owner |
| `partner` | STRING | This could be Facebook Marketing Partner, if there is one. Must be a Facebook Page Alias, Facebook Page ID or an Facebook App ID. In absence of one, you can use NONE or UNFOUND. |
| `rf_spec` | JSON | Reach and Frequency limits configuration. See Reach and Frequency |
| `spend_cap` | STRING | The maximum amount that can be spent by this Ad Account. When the amount is reached, all delivery stops. A value of 0 means no spending-cap. Setting a new spend cap only applies to spend AFTER the time at which you set it. Value specified in basic unit of the currency, for example 'cents' for USD. |
| `tax_id` | STRING | Tax ID |
| `tax_id_status` | INTEGER | VAT status code for the account. |
| `tax_id_type` | STRING | Type of Tax ID |
| `timezone_id` | INTEGER | The timezone ID of this ad account |
| `timezone_name` | STRING | Name for the time zone |
| `timezone_offset_hours_utc` | NUMERIC | Time zone difference from UTC (Coordinated Universal Time). |
| `tos_accepted` | JSON | Checks if this specific ad account has signed the Terms of Service contracts. Returns 1, if terms were accepted. |
| `user_tasks` | JSON | user_tasks |
| `user_tos_accepted` | JSON | Checks if a user has signed the Terms of Service contracts related to the Business that contains a specific ad account. Must include user's access token to get information. This verification is not valid for system users. |

# Example Questions

- Which accounts are close to their spend cap?
- What currency and time zone does each account use?
- Which business does each account belong to, and what is its status?
