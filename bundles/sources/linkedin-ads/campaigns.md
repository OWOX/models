---
title: "Campaigns"
description: |
  One row per campaign: its name, status, objective type, campaign type, ad format, cost type, unit cost, daily and total budget, run schedule, targeting criteria and locale, with the account and campaign group it belongs to as URNs. It holds settings, not results; daily numbers are in Ad Analytics.

  `dailyBudget`, `totalBudget`, `unitCost`, `runSchedule`, `locale` and `targetingCriteria` are JSON objects. Budget amounts are strings and use the currency of the account. `servingStatuses` says whether the service lets the campaign serve, while `status` is the status the user set.
tags: ["owox", "connector", "linkedin-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInAds/LinkedInAdsAPIReference/LinkedInAdsFieldsSchema.js"
    title: "OWOX Data Marts LinkedIn Ads connector — Campaigns endpoint (`adCampaigns`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-campaigns"
    title: "LinkedIn Marketing API reference — create-and-manage-campaigns"
---

## Connector endpoint

- **Endpoint:** LinkedIn Ads · `adCampaigns`
- **Default destination table:** `linkedin_ads_ad_campaigns`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `id` | STRING | ID | PK. Unique internal ID representing the campaign |
| `account` | STRING | Account | URN identifying the advertising account associated with the campaign. This value is immutable once set. For example, urn:li:sponsoredAccount:{id} |
| `accountInfo` | JSON | AccountInfo | Information about the advertising account associated with the campaign. This is a read only field. Please refer to Additional Info Fields to learn how to access this field. |
| `associatedEntity` | STRING | AssociatedEntity | An URN identifying the intended beneficiary of the advertising campaign such as a specific company or member |
| `associatedEntityInfo` | JSON | AssociatedEntityInfo | Information about the associatedEntity. If the entity is an organization, an OrganizationInfo object is returned. If the entity is a person, a PersonInfo object is returned. For all other entity types an empty record will be returned. This is a read only field. Please refer to Additional Info Fields to learn how to access this field. |
| `audienceExpansionEnabled` | BOOLEAN | AudienceExpansionEnabled | Enable Audience Expansion for the campaign provides query expansion for certain targeting criteria. |
| `campaignGroup` | STRING | CampaignGroup | URN identifying the campaign group associated with the campaign. The campaign group URN must be specified for campaign creation starting October 30, 2020. |
| `campaignGroupInfo` | JSON | CampaignGroupInfo | Information about the Campaign Group associated with the campaign. This is a read only filed. Please refer to Additional Info Fields to learn how to access this field. |
| `costType` | STRING | CostType | CPM- Cost per thousand advertising impressions. If type=SPONSORED_INMAILS; cost per send(CPS) is measured as CPM x 1000. |
| `creativeSelection` | STRING | CreativeSelection | ROUND_ROBIN - Rotate through available creatives to serve them as evenly as possible. |
| `dailyBudget` | JSON | DailyBudget | Maximum amount to spend per day UTC. The amount of money as a real number string. ISO currency code. The currency must match that of the parent account. |
| `locale` | JSON | Locale | Locale of the campaign. An uppercase two-letter country code as defined by ISO-3166 and a lowercase two-letter language code as defined by ISO-639. The country and language combination must match one of the supported locales. |
| `name` | STRING | Name | The name of the campaign; primarily used to make it easier to reference a campaign and to recall its purpose. |
| `objectiveType` | STRING | ObjectiveType | Campaign Objective type values. Click here for Campaign Objective descriptionsBRAND_AWARENESS |
| `offsiteDeliveryEnabled` | BOOLEAN | OffsiteDeliveryEnabled | Allows your campaign to be served on the LinkedIn Audience Network to extend the reach of the campaign by delivering ads beyond the LinkedIn feed to members on third-party apps and sites. There is no default set. |
| `offsitePreferences` | JSON | OffsitePreferences | Offsite preferences that an advertiser specifies for this campaign. An example OffsitePreference is an object that contains App Categories, App Store URLs, Web Domain Names for which this campaign should be included/excluded. See the OffsitePreferences object for more details and examples. |
| `runSchedule` | JSON | RunSchedule | Scheduled date range to run associated creatives. Object with start (inclusive) and end (exclusive) timestamp fields. The start date must be non-null. The end date is optional and if unset, it indicates an open range. |
| `targetingCriteria` | JSON | TargetingCriteria | Specifies targeting criteria that the member should match. This is a more advanced boolean expression than the previous targeting field. It provides a generic AND/OR construct to include and exclude different targeting facets when defining audiences for campaigns. |
| `totalBudget` | JSON | TotalBudget | Maximum amount to spend over the life of the campaign. The amount of money as a real number string. ISO currency code. The currency must match that of the account. Deprecated for campaigns not using lifetime pacing. |
| `type` | STRING | Type | TEXT_AD - Text-based ads that show up in the right column or top of the page on LinkedIn. |
| `unitCost` | JSON | UnitCost | Amount to bid per click, impression, or other event depending on the pricing model. The amount of money as a real number string. The amount should be non-negative if the bidding strategy is manual, target cost, or cost cap bidding. The default is 0 with the currency code set to match that of the associated account. ISO currency code. |
| `status` | STRING | Status | ACTIVE - Denotes that the campaign is fully servable. |
| `optimizationTargetType` | STRING | OptimizationTargetType | Determines how this campaign is optimized for spending. If this is not set, there is no optimization. Refer to the documentation here. |
| `format` | STRING | Format | The ad format on campaign level. |
| `pacingStrategy` | STRING | PacingStrategy | Identifies the pacing option used for the campaign. |
| `test` | BOOLEAN | Test | Flag showing whether this campaign is a test campaign, i.e., belongs to a test account. This is a read-only and immutable field that is set implicitly during creation based on whether the account is a Test Account or not. |
| `servingStatuses` | JSON | ServingStatuses | Array of enums that determine whether or not a campaign may be served; unlike 'status', which is user-managed, the values are controlled by the service. This is a read-only field. Possible values are:RUNNABLE Campaign is eligible for serving. |
| `connectedTelevisionOnly` | BOOLEAN | ConnectedTelevisionOnly | Flag showing whether this campaign is a Connected Television Only campaign. Allow advertisers to specify when they're creating a CTV campaign. Not specifying the boolean can be considered false. When 'connectedTelevisionOnly = true', offsiteDeliveryEnabled should be set to true. Note: Applicable only from versions 202408 and above. |
| `optimizationPreference` | JSON | OptimizationPreference | Allows granular optimization customization on this campaign on top of optimizationTargetType. FrequencyOptimizationPreference is the first type of optimizationPreference we support now. Note: Applicable only from versions 202408 and above. |

# Example Questions

- Which campaigns are active, and which objective type does each pursue?
- Which cost type does each campaign use, and what is its unit cost?
- Which campaigns have offsite delivery enabled?

## Joins

- [Ad Accounts](./ad-accounts.md) — `account = id` [N:1] — The ad account the campaign belongs to; the value is a URN such as urn:li:sponsoredAccount:{id}. The column holds the URN, so it matches the id inside it, not the whole string.
  - Description: The ad account the campaign belongs to; the value is a URN such as urn:li:sponsoredAccount:{id}. The column holds the URN, so it matches the id inside it, not the whole string.
- [Campaign Groups](./campaign-groups.md) — `campaignGroup = id` [N:1] — The campaign group the campaign sits in; the value is a URN such as urn:li:sponsoredCampaignGroup:{id}. The column holds the URN, so it matches the id inside it, not the whole string.
  - Description: The campaign group the campaign sits in; the value is a URN such as urn:li:sponsoredCampaignGroup:{id}. The column holds the URN, so it matches the id inside it, not the whole string.
