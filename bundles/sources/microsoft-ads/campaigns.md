---
title: "Campaigns"
description: |
  The Bulk download of the account structure, as one table. Each row is one record, and `Type` says which: a campaign, an ad group, an asset group, a keyword. `Id` is the identifier of that record, and `ParentId` is the identifier of the record above it (for a campaign, the account; for an ad group, the campaign).

  The columns that apply to a record type are the ones filled for it, for example `BidStrategyType` and `Budget` for a campaign, or `Keyword`, `MatchType` and `Bid` for a keyword. Names such as `Campaign` and `AdGroup` repeat the names of the parents. The table holds settings; daily results are in the two report tables. Filter on `Type` before counting or matching IDs. [Ad Performance Report](./ad-performance-report.md) and [User Location Performance Report](./user-location-performance-report.md) join here on `CampaignId`; their `AdGroupId` (and `AssetGroupId` in the location report) matches `Id` the same way, on the rows of those types.
tags: ["owox", "connector", "microsoft-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8ac4b37c386647fabc621066a7db9a3daeb839f1/packages/connectors/src/Sources/MicrosoftAds/MicrosoftAdsAPIReference/accountCampaignFields.js"
    title: "OWOX Data Marts Microsoft Ads connector — Campaigns endpoint (`campaigns`)"
    last_modified: 2026-09-28
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/advertising/bulk-service/bulk-service-reference"
    title: "Microsoft Advertising API reference — Campaigns"
---

## Connector endpoint

- **Endpoint:** Microsoft Ads · `campaigns`
- **Default destination table:** `microsoft_ads_campaigns`
- **Last updated:** 2026-09-28 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([3de731ea8](https://github.com/OWOX/owox-data-marts/commit/3de731ea89fa5701d5f45624a3fa5789e2df3e53))
- **Microsoft Advertising API version:** v13
- **Unique keys:** `Id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `Type` | STRING | Type | Row type: Account, Campaign, Ad Group, Keyword, etc. |
| `Status` | STRING | Status | Status of the entity (Active, Paused, Deleted, etc.) |
| `Id` | STRING | ID | PK. Unique ID for the entity (Campaign, Ad Group, etc.) |
| `ParentId` | STRING | Parent ID | Parent entity ID (e.g., Account for Campaign, Campaign for Ad Group) |
| `CampaignId` | STRING | Campaign ID | Campaign unique ID |
| `Campaign` | STRING | Campaign | Campaign name |
| `CampaignType` | STRING | Campaign Type | Type of campaign (Search, Shopping, Audience, etc.) |
| `CampaignSubType` | STRING | Campaign Sub Type | Sub-type of the campaign |
| `StartDate` | STRING | Start Date | Start date for the campaign or ad group (YYYY-MM-DD) |
| `EndDate` | STRING | End Date | End date for the campaign or ad group (YYYY-MM-DD) |
| `Budget` | FLOAT | Budget | Campaign budget |
| `BudgetType` | STRING | Budget Type | Type of budget (Daily, Monthly, etc.) |
| `BidStrategyName` | STRING | Bid Strategy Name | Name of the bid strategy |
| `BidStrategyType` | STRING | Bid Strategy Type | Type of bid strategy (Manual CPC, Target CPA, etc.) |
| `Language` | STRING | Language | Language targeting |
| `AdGroup` | STRING | Ad Group | Ad group name |
| `AdGroupType` | STRING | Ad Group Type | Type of ad group (e.g., Standard, Hotel) |
| `AssetGroup` | STRING | Asset Group | Asset group name (if using Asset Groups/PMax) |
| `AssetGroupId` | STRING | Asset Group ID | Asset group unique ID |
| `Keyword` | STRING | Keyword | Keyword text |
| `MatchType` | STRING | Match Type | Keyword match type (Broad, Phrase, Exact) |
| `Bid` | FLOAT | Bid | Bid amount for the keyword/ad group/campaign |
| `DeviceType` | STRING | Device Type | Device type (Computer, Mobile, Tablet) |
| `OSNames` | STRING | OS Names | Device operating systems targeted |
| `CountryCode` | STRING | Country Code | Country code (e.g., US, GB) |
| `StateOrProvinceCode` | STRING | State Or Province Code | Code of the state or province, next to `CountryCode` and `City`. |
| `City` | STRING | City | Name of the city. |
| `Clicks` | FLOAT | Clicks | Number of clicks received |
| `Impressions` | FLOAT | Impressions | Number of times the ad was shown |
| `Spend` | FLOAT | Spend | Total cost or spend |
| `CurrencyCode` | STRING | Currency Code | Currency used for reporting |
| `AvgCPC` | FLOAT | Average CPC | Average cost per click |
| `AvgCPM` | FLOAT | Average CPM | Average cost per thousand impressions |
| `CTR` | FLOAT | CTR | Click-through rate |
| `Avgposition` | FLOAT | Avgposition | Average ad position |
| `QualityScore` | FLOAT | Quality Score | Quality score (if available) |
| `Conversions` | FLOAT | Conversions | A Bulk performance-data column that stays empty: the connector downloads entity data only (DataScope EntityData). Conversions are in the two report tables. |
| `CPA` | FLOAT | CPA | Cost per acquisition/conversion |
| `TrackingTemplate` | STRING | Tracking Template | URL tracking template for this entity |
| `FinalUrlSuffix` | STRING | Final URL Suffix | Suffix appended to the final URL for tracking |
| `FinalUrl` | STRING | Final URL | The actual landing page URL |
| `FinalUrlParsed` | STRING | Final URL Parsed | FinalUrl resolved to its landing page when it is a short link; otherwise the same value. Requires FinalUrl and Process Short Links. |
| `MobileFinalUrl` | STRING | Mobile Final URL | Mobile-specific landing page URL |
| `MobileFinalUrlParsed` | STRING | Mobile Final URL Parsed | MobileFinalUrl resolved to its landing page when it is a short link; otherwise the same value. Requires MobileFinalUrl and Process Short Links. |
| `DisplayUrl` | STRING | Display URL | Display URL shown in the ad |
| `Domain` | STRING | Domain | Domain of the landing page |
| `Promotion` | STRING | Promotion | Promotion details (if any) |
| `DevicePreference` | STRING | Device Preference | Device preference setting (All, Mobile only, etc.) |
| `EditorialStatus` | STRING | Editorial Status | Editorial status for compliance (e.g., Approved, Disapproved) |
| `EditorialReasonCode` | STRING | Editorial Reason Code | Code describing editorial review reason |
| `FeedId` | STRING | Feed ID | Feed ID if used with product ads |
| `SitelinkExtensionLinkText` | STRING | Sitelink Extension Link Text | Sitelink extension visible text |
| `BusinessName` | STRING | Business Name | Name of the business |
| `PhoneNumber` | STRING | Phone Number | Phone number associated with the ad |

# Example Questions

- Which campaigns are active, and which bid strategy type and budget does each have?
- How many ad groups does each campaign have, counting the ad group rows by ParentId?
- Which keywords and match types are defined, and with which bids?
