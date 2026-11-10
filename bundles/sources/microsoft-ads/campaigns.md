---
title: "Campaigns"
description: |
  The Bulk download of the account structure, as one table. Each row is one record, and `Type` says which: a campaign, an ad group, an asset group, a keyword. `Id` is the identifier of that record, and `ParentId` is the identifier of the record above it (for a campaign, the account; for an ad group, the campaign).

  The columns that apply to a record type are the ones filled for it, for example `BidStrategyType` and `Budget` for a campaign, or `Keyword`, `MatchType` and `Bid` for a keyword. Names such as `Campaign` and `AdGroup` repeat the names of the parents. The table holds settings; daily results are in the two report tables. Filter on `Type` before counting or matching IDs. [Ad Performance Report](./ad-performance-report.md) and [User Location Performance Report](./user-location-performance-report.md) join here on `CampaignId`; their `AdGroupId` (and `AssetGroupId` in the location report) matches `Id` the same way, on the rows of those types.
tags: ["owox", "connector", "microsoft-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9375f07a09a2be2007a8a3a3d620acea174c7c3c/packages/connectors/src/Sources/MicrosoftAds/MicrosoftAdsAPIReference/MicrosoftAdsFieldsSchema.js"
    title: "OWOX Data Marts Microsoft Ads connector — Campaigns endpoint (`campaigns`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/advertising/bulk-service/bulk-service-reference"
    title: "Microsoft Advertising API reference — bulk-service-reference"
---

## Connector endpoint

- **Endpoint:** Microsoft Ads · `campaigns`
- **Default destination table:** `microsoft_ads_campaigns`
- **Unique keys:** `Id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `Type` | STRING | Type | Row type: Account, Campaign, Ad Group, Keyword, etc. |
| `Status` | STRING | Status | Status of the entity (Active, Paused, Deleted, etc.) |
| `Id` | STRING | ID | PK. Unique ID for the entity (Campaign, Ad Group, etc.) |
| `ParentId` | STRING | ParentId | Parent entity ID (e.g., Account for Campaign, Campaign for Ad Group) |
| `CampaignId` | STRING | CampaignId | Campaign unique ID |
| `Campaign` | STRING | Campaign | Campaign name |
| `CampaignType` | STRING | CampaignType | Type of campaign (Search, Shopping, Audience, etc.) |
| `CampaignSubType` | STRING | CampaignSubType | Sub-type of the campaign |
| `StartDate` | STRING | StartDate | Start date for the campaign or ad group (YYYY-MM-DD) |
| `EndDate` | STRING | EndDate | End date for the campaign or ad group (YYYY-MM-DD) |
| `Budget` | NUMERIC | Budget | Campaign budget |
| `BudgetType` | STRING | BudgetType | Type of budget (Daily, Monthly, etc.) |
| `BidStrategyName` | STRING | BidStrategyName | Name of the bid strategy |
| `BidStrategyType` | STRING | BidStrategyType | Type of bid strategy (Manual CPC, Target CPA, etc.) |
| `Language` | STRING | Language | Language targeting |
| `AdGroup` | STRING | AdGroup | Ad group name |
| `AdGroupType` | STRING | AdGroupType | Type of ad group (e.g., Standard, Hotel) |
| `AssetGroup` | STRING | AssetGroup | Asset group name (if using Asset Groups/PMax) |
| `AssetGroupId` | STRING | AssetGroupId | Asset group unique ID |
| `Keyword` | STRING | Keyword | Keyword text |
| `MatchType` | STRING | MatchType | Keyword match type (Broad, Phrase, Exact) |
| `Bid` | NUMERIC | Bid | Bid amount for the keyword/ad group/campaign |
| `DeviceType` | STRING | DeviceType | Device type (Computer, Mobile, Tablet) |
| `OSNames` | STRING | OSNames | Device operating systems targeted |
| `CountryCode` | STRING | CountryCode | Country code (e.g., US, GB) |
| `StateOrProvinceCode` | STRING | StateOrProvinceCode | State or province code |
| `City` | STRING | City | City name |
| `Clicks` | NUMERIC | Clicks | Number of clicks received |
| `Impressions` | NUMERIC | Impressions | Number of times the ad was shown |
| `Spend` | NUMERIC | Spend | Total cost or spend |
| `CurrencyCode` | STRING | CurrencyCode | Currency used for reporting |
| `AvgCPC` | NUMERIC | AvgCPC | Average cost per click |
| `AvgCPM` | NUMERIC | AvgCPM | Average cost per thousand impressions |
| `CTR` | NUMERIC | CTR | Click-through rate |
| `Avgposition` | NUMERIC | Avgposition | Average ad position |
| `QualityScore` | NUMERIC | QualityScore | Quality score (if available) |
| `Conversions` | NUMERIC | Conversions | Number of conversions |
| `CPA` | NUMERIC | CPA | Cost per acquisition/conversion |
| `TrackingTemplate` | STRING | TrackingTemplate | URL tracking template for this entity |
| `FinalUrlSuffix` | STRING | FinalUrlSuffix | Suffix appended to the final URL for tracking |
| `FinalUrl` | STRING | FinalUrl | The actual landing page URL |
| `MobileFinalUrl` | STRING | MobileFinalUrl | Mobile-specific landing page URL |
| `DisplayUrl` | STRING | DisplayUrl | Display URL shown in the ad |
| `Domain` | STRING | Domain | Domain of the landing page |
| `Promotion` | STRING | Promotion | Promotion details (if any) |
| `DevicePreference` | STRING | DevicePreference | Device preference setting (All, Mobile only, etc.) |
| `EditorialStatus` | STRING | EditorialStatus | Editorial status for compliance (e.g., Approved, Disapproved) |
| `EditorialReasonCode` | STRING | EditorialReasonCode | Code describing editorial review reason |
| `FeedId` | STRING | FeedId | Feed ID if used with product ads |
| `SitelinkExtensionLinkText` | STRING | SitelinkExtensionLinkText | Sitelink extension visible text |
| `BusinessName` | STRING | BusinessName | Name of the business |
| `PhoneNumber` | STRING | PhoneNumber | Phone number associated with the ad |

# Example Questions

- Which campaigns are active, and which bid strategy type and budget does each have?
- How many ad groups does each campaign have, counting the ad group rows by ParentId?
- Which keywords and match types are defined, and with which bids?
