---
title: "User Location Performance Report"
description: |
  Daily performance by the physical location of the user: impressions, clicks, spend, conversions, revenue and assists, with the country, state, metro area, city, county and postal code where the user was physically located when they clicked, and the `QueryIntent` columns for the location the search was about. One row per account, campaign, ad group, location, day and segment.

  The report is segmented by campaign type, bid and delivered match type, asset group, ad distribution, device type and OS, and top versus other position, and all of these are part of the key together with `LocationId` and `CurrencyCode`. A row is not an ad: the table has no ad ID. For results per ad use Ad Performance Report. As in the ad report, the vendor reference marks `Conversions` as deprecated and returning zero; use `ConversionsQualified`.
tags: ["owox", "connector", "microsoft-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9375f07a09a2be2007a8a3a3d620acea174c7c3c/packages/connectors/src/Sources/MicrosoftAds/MicrosoftAdsAPIReference/MicrosoftAdsFieldsSchema.js"
    title: "OWOX Data Marts Microsoft Ads connector — User Location Performance Report endpoint (`user_location_performance_report`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/advertising/reporting-service/userlocationperformancereportrequest"
    title: "Microsoft Advertising API reference — userlocationperformancereportrequest"
---

## Connector endpoint

- **Endpoint:** Microsoft Ads · `user_location_performance_report`
- **Default destination table:** `microsoft_ads_user_location_performance_report`
- **Unique keys:** `AccountId`, `CampaignId`, `TimePeriod`, `AdGroupId`, `LocationId`, `CampaignType`, `BidMatchType`, `DeliveredMatchType`, `AssetGroupId`, `CurrencyCode`, `AdDistribution`, `DeviceType`, `DeviceOS`, `TopVsOther`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `AccountName` | STRING | The account name. |
| `AccountNumber` | STRING | The Microsoft Advertising assigned number of an account. |
| `AccountId` | STRING | PK. The Microsoft Advertising assigned identifier of an account. |
| `TimePeriod` | DATE | PK. The time period of each report row. |
| `CampaignName` | STRING | The campaign name. |
| `CampaignId` | STRING | PK. The Microsoft Advertising assigned identifier of a campaign. |
| `AdGroupName` | STRING | The ad group name. |
| `AdGroupId` | STRING | PK. The Microsoft Advertising assigned identifier of an ad group. |
| `Country` | STRING | The country where the user was located when they clicked the ad. |
| `State` | STRING | The state where the user was located when they clicked the ad. |
| `MetroArea` | STRING | The metro area where the user was located when they clicked the ad. |
| `CurrencyCode` | STRING | PK. The account currency type. |
| `AdDistribution` | STRING | PK. The network where you want your ads to show. |
| `Impressions` | INTEGER | The number of times an ad has been displayed on search results pages. |
| `Clicks` | INTEGER | Clicks are what you pay for. |
| `Ctr` | NUMERIC | The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown. |
| `AverageCpc` | NUMERIC | The average cost per click (CPC). |
| `Spend` | NUMERIC | The cost per click (CPC) summed for each click. |
| `AveragePosition` | NUMERIC | The average position of the ad on a webpage. |
| `ProximityTargetLocation` | STRING | The location being targeted. |
| `Radius` | STRING | The radius of the location target. |
| `Language` | STRING | The language of the publisher where the ad was shown. |
| `City` | STRING | The city where the user was located when they clicked the ad. |
| `QueryIntentCountry` | STRING | The country that the user was searching for. |
| `QueryIntentState` | STRING | The state that the user was searching for. |
| `QueryIntentCity` | STRING | The city that the user was searching for. |
| `QueryIntentDMA` | STRING | The DMA that the user was searching for. |
| `BidMatchType` | STRING | PK. The keyword bid match type. |
| `DeliveredMatchType` | STRING | PK. The match type used to deliver an ad. |
| `Network` | STRING | The entire Microsoft Advertising Network made up of Microsoft sites and select traffic, and only partner traffic. |
| `TopVsOther` | STRING | PK. Indicates whether the ad impression appeared in a top position or elsewhere. |
| `DeviceType` | STRING | PK. The type of device which showed ads. |
| `DeviceOS` | STRING | PK. The operating system of the device reported in the DeviceType column. |
| `Assists` | STRING | The number of conversions from other ads within the same account that were preceded by one or more clicks from this ad. |
| `Conversions` | INTEGER | The number of conversions. |
| `ConversionRate` | NUMERIC | The conversion rate as a percentage. |
| `Revenue` | STRING | The revenue optionally reported by the advertiser as a result of conversions. |
| `ReturnOnAdSpend` | NUMERIC | The return on ad spend (ROAS). |
| `CostPerConversion` | NUMERIC | The cost per conversion. |
| `CostPerAssist` | NUMERIC | The cost per assist. |
| `RevenuePerConversion` | STRING | The revenue per conversion. |
| `RevenuePerAssist` | STRING | The revenue per assist. |
| `County` | STRING | The county where the user was located when they clicked the ad. |
| `PostalCode` | STRING | The postal code where the user was located when they clicked the ad. |
| `QueryIntentCounty` | STRING | The county that the user was searching for. |
| `QueryIntentPostalCode` | STRING | The postal code that the user was searching for. |
| `LocationId` | STRING | PK. The Microsoft Advertising identifier of the location where the user was physically located when they clicked the ad. |
| `QueryIntentLocationId` | INTEGER | The Microsoft Advertising identifier of the location that the user was searching for. |
| `AllConversions` | INTEGER | The number of conversions. |
| `AllRevenue` | STRING | The revenue optionally reported by the advertiser as a result of conversions. |
| `AllConversionRate` | NUMERIC | The conversion rate as a percentage. |
| `AllCostPerConversion` | NUMERIC | The cost per conversion. |
| `AllReturnOnAdSpend` | NUMERIC | The return on ad spend (ROAS). |
| `AllRevenuePerConversion` | STRING | The revenue per conversion. |
| `ViewThroughConversions` | INTEGER | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `Goal` | STRING | The name of the goal you set for the conversions you want. |
| `GoalType` | STRING | The type of conversion goal. |
| `AbsoluteTopImpressionRatePercent` | NUMERIC | How often your ad was in the first position of all results, as a percentage of your total impressions. |
| `TopImpressionRatePercent` | NUMERIC | The percentage of times your ad showed in the mainline, the top placement where ads appear above the search results. |
| `AverageCpm` | NUMERIC | The total advertising cost divided by the number of impressions (in thousands). |
| `ConversionsQualified` | INTEGER | The number of conversions. |
| `AllConversionsQualified` | INTEGER | The number of conversions. |
| `ViewThroughConversionsQualified` | INTEGER | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `Neighborhood` | STRING | The neighborhood where the user was located when they clicked the ad. |
| `QueryIntentNeighborhood` | STRING | The neighborhood that the user was searching for. |
| `ViewThroughRevenue` | STRING | The revenue optionally reported by the advertiser as a result of view-through conversions. |
| `CampaignType` | STRING | PK. The campaign type. |
| `AssetGroupId` | STRING | PK. The Microsoft Advertising assigned identifier of an asset group. |
| `AssetGroupName` | STRING | The asset group name. |
| `Downloads` | INTEGER | The number of downloads. |
| `PostClickDownloadRate` | NUMERIC | The download rate after click. |
| `CostPerDownload` | NUMERIC | The cost per download. |
| `AppInstalls` | INTEGER | The number of app installs. |
| `PostClickInstallRate` | NUMERIC | The install rate after click. |
| `CPI` | NUMERIC | Cost per install. |
| `Purchases` | INTEGER | The number of purchases. |
| `PostInstallPurchaseRate` | NUMERIC | The purchase rate after install. |
| `CPP` | NUMERIC | Cost per purchase. |
| `Subscriptions` | INTEGER | The number of subscriptions. |
| `PostInstallSubscriptionRate` | NUMERIC | The subscription rate after install. |
| `CPS` | NUMERIC | Cost per subscription. |

# Example Questions

- Which countries bring the most clicks, and at what spend?
- Which cities have the most qualified conversions, and what is the spend there?
- Which states and metro areas inside a country receive most of a campaign's impressions?
