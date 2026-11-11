---
title: "User Location Performance Report"
description: |
  Daily performance by the physical location of the user: impressions, clicks, spend, conversions, revenue and assists, with the country, state, metro area, city, county and postal code where the user was physically located when they clicked, and the `QueryIntent` columns for the location the search was about. One row per account, campaign, ad group, location, day and segment.

  The report is segmented by campaign type, bid and delivered match type, asset group, ad distribution, device type and OS, and top versus other position, and all of these are part of the key together with `LocationId` and `CurrencyCode`. A row is not an ad: the table has no ad ID. For results per ad use Ad Performance Report. As in the ad report, the vendor reference marks `Conversions`, `AllConversions` and `ViewThroughConversions` as deprecated and returning zero; use their `Qualified` columns.
tags: ["owox", "connector", "microsoft-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8ac4b37c386647fabc621066a7db9a3daeb839f1/packages/connectors/src/Sources/MicrosoftAds/MicrosoftAdsAPIReference/userLocationPerformanceReportFields.js"
    title: "OWOX Data Marts Microsoft Ads connector — User Location Performance Report endpoint (`user_location_performance_report`)"
    last_modified: 2026-05-21
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/advertising/reporting-service/userlocationperformancereportrequest"
    title: "Microsoft Advertising API reference — User Location Performance Report"
---

## Connector endpoint

- **Endpoint:** Microsoft Ads · `user_location_performance_report`
- **Default destination table:** `microsoft_ads_user_location_performance_report`
- **Last updated:** 2026-05-21 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([85b150c4b](https://github.com/OWOX/owox-data-marts/commit/85b150c4b17b90310a8588793ebdc2c3f9b19faf))
- **Microsoft Advertising API version:** v13
- **Unique keys:** `AccountId`, `CampaignId`, `TimePeriod`, `AdGroupId`, `LocationId`, `CampaignType`, `BidMatchType`, `DeliveredMatchType`, `AssetGroupId`, `CurrencyCode`, `AdDistribution`, `DeviceType`, `DeviceOS`, `TopVsOther`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `AccountName` | STRING | Account Name | Name of the ad account the row reports on. |
| `AccountNumber` | STRING | Account Number | The Microsoft Advertising assigned number of an account. |
| `AccountId` | STRING | Account ID | PK. The Microsoft Advertising assigned identifier of an account. |
| `TimePeriod` | DATE | Time Period | PK. The time period of each report row. |
| `CampaignName` | STRING | Campaign Name | Name of the campaign the row reports on. |
| `CampaignId` | STRING | Campaign ID | PK. The Microsoft Advertising assigned identifier of a campaign. FK to [Campaigns](./campaigns.md) |
| `AdGroupName` | STRING | Ad Group Name | Name of the ad group the row reports on. |
| `AdGroupId` | STRING | Ad Group ID | PK. The Microsoft Advertising assigned identifier of an ad group. |
| `Country` | STRING | Country | The country where the user was located when they clicked the ad. |
| `State` | STRING | State | The state where the user was located when they clicked the ad. |
| `MetroArea` | STRING | Metro Area | The metro area where the user was located when they clicked the ad. |
| `CurrencyCode` | STRING | Currency Code | PK. The account currency type. |
| `AdDistribution` | STRING | Ad Distribution | PK. The network where you want your ads to show. |
| `Impressions` | INTEGER | Impressions | The number of times an ad has been displayed on search results pages. |
| `Clicks` | INTEGER | Clicks | Clicks are what you pay for. |
| `Ctr` | FLOAT | CTR | The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown. |
| `AverageCpc` | FLOAT | Average CPC | The average cost per click (CPC). |
| `Spend` | FLOAT | Spend | The cost per click (CPC) summed for each click. |
| `AveragePosition` | FLOAT | Average Position | The average position of the ad on a webpage. |
| `ProximityTargetLocation` | STRING | Proximity Target Location | The location being targeted. |
| `Radius` | STRING | Radius | The radius of the location target. |
| `Language` | STRING | Language | The language of the publisher where the ad was shown. |
| `City` | STRING | City | The city where the user was located when they clicked the ad. |
| `QueryIntentCountry` | STRING | Query Intent Country | The country that the user was searching for. |
| `QueryIntentState` | STRING | Query Intent State | The state that the user was searching for. |
| `QueryIntentCity` | STRING | Query Intent City | The city that the user was searching for. |
| `QueryIntentDMA` | STRING | Query Intent DMA | The DMA that the user was searching for. |
| `BidMatchType` | STRING | Bid Match Type | PK. The keyword bid match type. |
| `DeliveredMatchType` | STRING | Delivered Match Type | PK. The match type used to deliver an ad. |
| `Network` | STRING | Network | The entire Microsoft Advertising Network made up of Microsoft sites and select traffic, and only partner traffic. |
| `TopVsOther` | STRING | Top Vs Other | PK. Indicates whether the ad impression appeared in a top position or elsewhere. |
| `DeviceType` | STRING | Device Type | PK. The type of device which showed ads. |
| `DeviceOS` | STRING | Device OS | PK. The operating system of the device reported in the DeviceType column. |
| `Assists` | STRING | Assists | The number of conversions from other ads within the same account that were preceded by one or more clicks from this ad. |
| `Conversions` | INTEGER | Conversions | Conversions for goals counted in bidding (ExcludeFromBidding off). Deprecated by Microsoft in 2022: it returns 0 going forward, so use `ConversionsQualified`. |
| `ConversionRate` | FLOAT | Conversion Rate | Conversions divided by clicks, times 100, for goals counted in bidding (ExcludeFromBidding off); `AllConversionRate` covers all goals. |
| `Revenue` | STRING | Revenue | Revenue the advertiser reports for conversions of goals counted in bidding (ExcludeFromBidding off); `AllRevenue` covers all goals. |
| `ReturnOnAdSpend` | FLOAT | Return On Ad Spend | Revenue divided by spend (ROAS), for goals counted in bidding (ExcludeFromBidding off). |
| `CostPerConversion` | FLOAT | Cost Per Conversion | Spend divided by conversions, for goals counted in bidding (ExcludeFromBidding off); only campaigns with conversion tracking add conversions. |
| `CostPerAssist` | FLOAT | Cost Per Assist | Spend divided by `Assists`. |
| `RevenuePerConversion` | STRING | Revenue Per Conversion | `Revenue` divided by conversions, for goals counted in bidding (ExcludeFromBidding off). |
| `RevenuePerAssist` | STRING | Revenue Per Assist | `Revenue` divided by `Assists`. |
| `County` | STRING | County | The county where the user was located when they clicked the ad. |
| `PostalCode` | STRING | Postal Code | The postal code where the user was located when they clicked the ad. |
| `QueryIntentCounty` | STRING | Query Intent County | The county that the user was searching for. |
| `QueryIntentPostalCode` | STRING | Query Intent Postal Code | The postal code that the user was searching for. |
| `LocationId` | STRING | Location ID | PK. The Microsoft Advertising identifier of the location where the user was physically located when they clicked the ad. |
| `QueryIntentLocationId` | INTEGER | Query Intent Location ID | The Microsoft Advertising identifier of the location that the user was searching for. |
| `AllConversions` | INTEGER | All Conversions | Conversions for all goals, including those excluded from bidding. Deprecated by Microsoft in 2022: it returns 0 going forward, so use `AllConversionsQualified`. |
| `AllRevenue` | STRING | All Revenue | Revenue the advertiser reports for conversions of all goals, including those excluded from bidding. |
| `AllConversionRate` | FLOAT | All Conversion Rate | Conversions divided by clicks, times 100, for all goals, including those excluded from bidding. |
| `AllCostPerConversion` | FLOAT | All Cost Per Conversion | Spend divided by conversions, for all goals, including those excluded from bidding; only campaigns with conversion tracking add conversions. |
| `AllReturnOnAdSpend` | FLOAT | All Return On Ad Spend | Revenue divided by spend (ROAS), for all goals, including those excluded from bidding. |
| `AllRevenuePerConversion` | STRING | All Revenue Per Conversion | `AllRevenue` divided by conversions, for all goals, including those excluded from bidding. |
| `ViewThroughConversions` | INTEGER | View Through Conversions | Conversions by people who saw but did not click an ad, counted only for Microsoft Audience network ads. Deprecated by Microsoft in 2022: it returns 0 going forward, so use `ViewThroughConversionsQualified`. |
| `Goal` | STRING | Goal | The name of the goal you set for the conversions you want. |
| `GoalType` | STRING | Goal Type | The type of conversion goal. |
| `AbsoluteTopImpressionRatePercent` | FLOAT | Absolute Top Impression Rate Percent | How often your ad was in the first position of all results, as a percentage of your total impressions. |
| `TopImpressionRatePercent` | FLOAT | Top Impression Rate Percent | The percentage of times your ad showed in the mainline, the top placement where ads appear above the search results. |
| `AverageCpm` | FLOAT | Average CPM | The total advertising cost divided by the number of impressions (in thousands). |
| `ConversionsQualified` | INTEGER | Conversions Qualified | Conversions for goals counted in bidding (ExcludeFromBidding off); the column to use instead of the deprecated `Conversions`. Microsoft returns it as a decimal number. |
| `AllConversionsQualified` | INTEGER | All Conversions Qualified | Conversions for all goals, including those excluded from bidding; the column to use instead of the deprecated `AllConversions`. Microsoft returns it as a decimal number. |
| `ViewThroughConversionsQualified` | INTEGER | View Through Conversions Qualified | Conversions by people who saw but did not click an ad, counted only for Microsoft Audience network ads; the column to use instead of the deprecated `ViewThroughConversions`. |
| `Neighborhood` | STRING | Neighborhood | The neighborhood where the user was located when they clicked the ad. |
| `QueryIntentNeighborhood` | STRING | Query Intent Neighborhood | The neighborhood that the user was searching for. |
| `ViewThroughRevenue` | STRING | View Through Revenue | The revenue optionally reported by the advertiser as a result of view-through conversions. |
| `CampaignType` | STRING | Campaign Type | PK. Type of the campaign; Microsoft lists values such as Audience, Dynamic search, Search & content and Shopping. |
| `AssetGroupId` | STRING | Asset Group ID | PK. The Microsoft Advertising assigned identifier of an asset group. |
| `AssetGroupName` | STRING | Asset Group Name | Name of the asset group the row reports on. |
| `Downloads` | INTEGER | Downloads | The number of times customers downloaded apps through the ads. |
| `PostClickDownloadRate` | FLOAT | Post Click Download Rate | The download rate after click. |
| `CostPerDownload` | FLOAT | Cost Per Download | Spend divided by `Downloads`: the average amount charged each time the ad led to a download. |
| `AppInstalls` | INTEGER | App Installs | The number of times customers installed apps through the ads. |
| `PostClickInstallRate` | FLOAT | Post Click Install Rate | The install rate after click. |
| `CPI` | FLOAT | CPI | Cost per install. |
| `Purchases` | INTEGER | Purchases | The number of times customers used the ads to make a purchase in the app. |
| `PostInstallPurchaseRate` | FLOAT | Post Install Purchase Rate | The purchase rate after install. |
| `CPP` | FLOAT | CPP | Cost per purchase. |
| `Subscriptions` | INTEGER | Subscriptions | The number of times customers used the ads to buy a subscription in a game. |
| `PostInstallSubscriptionRate` | FLOAT | Post Install Subscription Rate | The subscription rate after install. |
| `CPS` | FLOAT | CPS | Cost per subscription. |

# Example Questions

- Which countries bring the most clicks, and at what spend?
- Which cities have the most qualified conversions, and what is the spend there?
- Which states and metro areas inside a country receive most of a `campaign`'s impressions?

## Joins

- [Campaigns](./campaigns.md) — `CampaignId = Id` [N:1] — The campaign the row reports on; only Campaigns rows of Type Campaign match.
