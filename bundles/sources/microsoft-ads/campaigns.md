---
title: "Campaigns"
description: |
  The Bulk download of the account structure, as one table. Each row is one record, and `Type` says which: a campaign, an ad group, an asset group, a keyword. `Id` is the identifier of that record, and `ParentId` is the identifier of the record above it (for a campaign, the account; for an ad group, the campaign).

  The columns that apply to a record type are the ones filled for it, for example `BidStrategyType` and `Budget` for a campaign, or `Keyword`, `MatchType` and `Bid` for a keyword. Names such as `Campaign` and `AdGroup` repeat the names of the parents. The table holds settings; daily results are in the two report tables. Filter on `Type` before counting or matching IDs.
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

| Column | Type | Description |
|--------|------|-------------|
| `Type` | STRING | Row type: Account, Campaign, Ad Group, Keyword, etc. |
| `Status` | STRING | Status of the entity (Active, Paused, Deleted, etc.) |
| `Id` | STRING | PK. Unique ID for the entity (Campaign, Ad Group, etc.) |
| `ParentId` | STRING | Parent entity ID (e.g., Account for Campaign, Campaign for Ad Group) |
| `CampaignId` | STRING | Campaign unique ID |
| `Campaign` | STRING | Campaign name |
| `CampaignType` | STRING | Type of campaign (Search, Shopping, Audience, etc.) |
| `CampaignSubType` | STRING | Sub-type of the campaign |
| `StartDate` | STRING | Start date for the campaign or ad group (YYYY-MM-DD) |
| `EndDate` | STRING | End date for the campaign or ad group (YYYY-MM-DD) |
| `Budget` | NUMERIC | Campaign budget |
| `BudgetType` | STRING | Type of budget (Daily, Monthly, etc.) |
| `BidStrategyName` | STRING | Name of the bid strategy |
| `BidStrategyType` | STRING | Type of bid strategy (Manual CPC, Target CPA, etc.) |
| `Language` | STRING | Language targeting |
| `AdGroup` | STRING | Ad group name |
| `AdGroupType` | STRING | Type of ad group (e.g., Standard, Hotel) |
| `AssetGroup` | STRING | Asset group name (if using Asset Groups/PMax) |
| `AssetGroupId` | STRING | Asset group unique ID |
| `Keyword` | STRING | Keyword text |
| `MatchType` | STRING | Keyword match type (Broad, Phrase, Exact) |
| `Bid` | NUMERIC | Bid amount for the keyword/ad group/campaign |
| `DeviceType` | STRING | Device type (Computer, Mobile, Tablet) |
| `OSNames` | STRING | Device operating systems targeted |
| `CountryCode` | STRING | Country code (e.g., US, GB) |
| `StateOrProvinceCode` | STRING | State or province code |
| `City` | STRING | City name |
| `Clicks` | NUMERIC | Number of clicks received |
| `Impressions` | NUMERIC | Number of times the ad was shown |
| `Spend` | NUMERIC | Total cost or spend |
| `CurrencyCode` | STRING | Currency used for reporting |
| `AvgCPC` | NUMERIC | Average cost per click |
| `AvgCPM` | NUMERIC | Average cost per thousand impressions |
| `CTR` | NUMERIC | Click-through rate |
| `Avgposition` | NUMERIC | Average ad position |
| `QualityScore` | NUMERIC | Quality score (if available) |
| `Conversions` | NUMERIC | Number of conversions |
| `CPA` | NUMERIC | Cost per acquisition/conversion |
| `TrackingTemplate` | STRING | URL tracking template for this entity |
| `FinalUrlSuffix` | STRING | Suffix appended to the final URL for tracking |
| `FinalUrl` | STRING | The actual landing page URL |
| `MobileFinalUrl` | STRING | Mobile-specific landing page URL |
| `DisplayUrl` | STRING | Display URL shown in the ad |
| `Domain` | STRING | Domain of the landing page |
| `Promotion` | STRING | Promotion details (if any) |
| `DevicePreference` | STRING | Device preference setting (All, Mobile only, etc.) |
| `EditorialStatus` | STRING | Editorial status for compliance (e.g., Approved, Disapproved) |
| `EditorialReasonCode` | STRING | Code describing editorial review reason |
| `FeedId` | STRING | Feed ID if used with product ads |
| `SitelinkExtensionLinkText` | STRING | Sitelink extension visible text |
| `BusinessName` | STRING | Name of the business |
| `PhoneNumber` | STRING | Phone number associated with the ad |

# Example Questions

- Which campaigns are active, and which bid strategy type and budget does each have?
- How many ad groups does each campaign have, counting the ad group rows by ParentId?
- Which keywords and match types are defined, and with which bids?
