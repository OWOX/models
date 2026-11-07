---
title: "Ad Accounts"
description: |
  One row per LinkedIn ad account the connector is configured for: its name, currency code, status and type, the entity it advertises on behalf of (`reference`), its serving statuses, and which notification contacts are switched on. It is the top of the hierarchy: campaign groups, campaigns and creatives all sit under an account.

  The connector reads each account by its ID, so this table has exactly the accounts listed in the connector's Account URNs setting. The `test` flag marks test accounts, which can only be set when an account is created. Campaigns and Campaign Groups hold their account as a URN in `account`.
tags: ["owox", "connector", "linkedin-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInAds/LinkedInAdsAPIReference/LinkedInAdsFieldsSchema.js"
    title: "OWOX Data Marts LinkedIn Ads connector — Ad Accounts endpoint (`adAccounts`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-accounts"
    title: "LinkedIn Marketing API reference — create-and-manage-accounts"
---

## Connector endpoint

- **Endpoint:** LinkedIn Ads · `adAccounts`
- **Default destination table:** `linkedin_ads_ad_accounts`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `currency` | STRING | The 3 character standard currency code such as USD for United States Dollar. Refer to the list of supported currencies for the full list. |
| `id` | STRING | PK. Unique internal ID representing the account |
| `name` | STRING | A label for the account |
| `notifiedOnCampaignOptimization` | BOOLEAN | Indicates if the campaign contact is notified about campaign optimization opportunities |
| `notifiedOnCreativeApproval` | BOOLEAN | Indicates if the creative contact is notified when a creative has been reviewed and approved |
| `notifiedOnCreativeRejection` | BOOLEAN | Indicates if the creative contact is notified when a creative has been rejected due to content |
| `notifiedOnEndOfCampaign` | BOOLEAN | Indicates if the campaign contact is notified when an associated campaign has been completed |
| `notifiedOnNewFeaturesEnabled` | BOOLEAN | Indicates if the account owner is notified about new Campaign Manager features |
| `reference` | STRING | The entity on whose behalf the account is advertised. Must either be in the format urn:li:person:{id} or urn:li:organization:{id} |
| `referenceInfo` | JSON | Information about the entity associated with the reference. If the entity is an organization, an Organizationinfo object is returned. If the entity is a person, a Personinfo object is returned. For all other entity types an empty record will be returned. This is a read only field. Please refer to Additional Info Fields to learn how to access this field. |
| `servingStatuses` | JSON | An array of enums with information about the account's system serving statuses. If an account is eligible for serving, then the array has a single element:RUNNABLE Otherwise, the array contains one or more reasons why the account is not servable: |
| `status` | STRING | ACTIVE - Account is active; this is the default state |
| `type` | STRING | BUSINESS – This is the only value allowed when creating accounts through the API. |
| `test` | BOOLEAN | Flag showing whether this account is marked as a test account. An account can be marked as test only during creation. This is an immutable field. |

# Example Questions

- Which currency code does each ad account use?
- Which ad accounts are active, and which are test accounts?
- Which accounts advertise on behalf of an organization, and which on behalf of a person?
