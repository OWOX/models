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

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `AccountName` | STRING | AccountName | The account name. |
| `AccountNumber` | STRING | AccountNumber | The Microsoft Advertising assigned number of an account. |
| `AccountId` | STRING | AccountId | PK. The Microsoft Advertising assigned identifier of an account. |
| `TimePeriod` | DATE | TimePeriod | PK. The time period of each report row. |
| `CampaignName` | STRING | CampaignName | The campaign name. |
| `CampaignId` | STRING | CampaignId | PK. The Microsoft Advertising assigned identifier of a campaign. |
| `AdGroupName` | STRING | AdGroupName | The ad group name. |
| `AdGroupId` | STRING | AdGroupId | PK. The Microsoft Advertising assigned identifier of an ad group. |
| `Country` | STRING | Country | The country where the user was located when they clicked the ad. |
| `State` | STRING | State | The state where the user was located when they clicked the ad. |
| `MetroArea` | STRING | MetroArea | The metro area where the user was located when they clicked the ad. |
| `CurrencyCode` | STRING | CurrencyCode | PK. The account currency type. |
| `AdDistribution` | STRING | AdDistribution | PK. The network where you want your ads to show. |
| `Impressions` | INTEGER | Impressions | The number of times an ad has been displayed on search results pages. |
| `Clicks` | INTEGER | Clicks | Clicks are what you pay for. |
| `Ctr` | NUMERIC | CTR | The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown. |
| `AverageCpc` | NUMERIC | AverageCpc | The average cost per click (CPC). |
| `Spend` | NUMERIC | Spend | The cost per click (CPC) summed for each click. |
| `AveragePosition` | NUMERIC | AveragePosition | The average position of the ad on a webpage. |
| `ProximityTargetLocation` | STRING | ProximityTargetLocation | The location being targeted. |
| `Radius` | STRING | Radius | The radius of the location target. |
| `Language` | STRING | Language | The language of the publisher where the ad was shown. |
| `City` | STRING | City | The city where the user was located when they clicked the ad. |
| `QueryIntentCountry` | STRING | QueryIntentCountry | The country that the user was searching for. |
| `QueryIntentState` | STRING | QueryIntentState | The state that the user was searching for. |
| `QueryIntentCity` | STRING | QueryIntentCity | The city that the user was searching for. |
| `QueryIntentDMA` | STRING | QueryIntentDMA | The DMA that the user was searching for. |
| `BidMatchType` | STRING | BidMatchType | PK. The keyword bid match type. |
| `DeliveredMatchType` | STRING | DeliveredMatchType | PK. The match type used to deliver an ad. |
| `Network` | STRING | Network | The entire Microsoft Advertising Network made up of Microsoft sites and select traffic, and only partner traffic. |
| `TopVsOther` | STRING | TopVsOther | PK. Indicates whether the ad impression appeared in a top position or elsewhere. |
| `DeviceType` | STRING | DeviceType | PK. The type of device which showed ads. |
| `DeviceOS` | STRING | DeviceOS | PK. The operating system of the device reported in the DeviceType column. |
| `Assists` | STRING | Assists | The number of conversions from other ads within the same account that were preceded by one or more clicks from this ad. |
| `Conversions` | INTEGER | Conversions | The number of conversions. |
| `ConversionRate` | NUMERIC | ConversionRate | The conversion rate as a percentage. |
| `Revenue` | STRING | Revenue | The revenue optionally reported by the advertiser as a result of conversions. |
| `ReturnOnAdSpend` | NUMERIC | ReturnOnAdSpend | The return on ad spend (ROAS). |
| `CostPerConversion` | NUMERIC | CostPerConversion | The cost per conversion. |
| `CostPerAssist` | NUMERIC | CostPerAssist | The cost per assist. |
| `RevenuePerConversion` | STRING | RevenuePerConversion | The revenue per conversion. |
| `RevenuePerAssist` | STRING | RevenuePerAssist | The revenue per assist. |
| `County` | STRING | County | The county where the user was located when they clicked the ad. |
| `PostalCode` | STRING | PostalCode | The postal code where the user was located when they clicked the ad. |
| `QueryIntentCounty` | STRING | QueryIntentCounty | The county that the user was searching for. |
| `QueryIntentPostalCode` | STRING | QueryIntentPostalCode | The postal code that the user was searching for. |
| `LocationId` | STRING | LocationId | PK. The Microsoft Advertising identifier of the location where the user was physically located when they clicked the ad. |
| `QueryIntentLocationId` | INTEGER | QueryIntentLocationId | The Microsoft Advertising identifier of the location that the user was searching for. |
| `AllConversions` | INTEGER | AllConversions | The number of conversions. |
| `AllRevenue` | STRING | AllRevenue | The revenue optionally reported by the advertiser as a result of conversions. |
| `AllConversionRate` | NUMERIC | AllConversionRate | The conversion rate as a percentage. |
| `AllCostPerConversion` | NUMERIC | AllCostPerConversion | The cost per conversion. |
| `AllReturnOnAdSpend` | NUMERIC | AllReturnOnAdSpend | The return on ad spend (ROAS). |
| `AllRevenuePerConversion` | STRING | AllRevenuePerConversion | The revenue per conversion. |
| `ViewThroughConversions` | INTEGER | ViewThroughConversions | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `Goal` | STRING | Goal | The name of the goal you set for the conversions you want. |
| `GoalType` | STRING | GoalType | The type of conversion goal. |
| `AbsoluteTopImpressionRatePercent` | NUMERIC | AbsoluteTopImpressionRatePercent | How often your ad was in the first position of all results, as a percentage of your total impressions. |
| `TopImpressionRatePercent` | NUMERIC | TopImpressionRatePercent | The percentage of times your ad showed in the mainline, the top placement where ads appear above the search results. |
| `AverageCpm` | NUMERIC | AverageCpm | The total advertising cost divided by the number of impressions (in thousands). |
| `ConversionsQualified` | INTEGER | ConversionsQualified | The number of conversions. |
| `AllConversionsQualified` | INTEGER | AllConversionsQualified | The number of conversions. |
| `ViewThroughConversionsQualified` | INTEGER | ViewThroughConversionsQualified | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `Neighborhood` | STRING | Neighborhood | The neighborhood where the user was located when they clicked the ad. |
| `QueryIntentNeighborhood` | STRING | QueryIntentNeighborhood | The neighborhood that the user was searching for. |
| `ViewThroughRevenue` | STRING | ViewThroughRevenue | The revenue optionally reported by the advertiser as a result of view-through conversions. |
| `CampaignType` | STRING | CampaignType | PK. The campaign type. |
| `AssetGroupId` | STRING | AssetGroupId | PK. The Microsoft Advertising assigned identifier of an asset group. |
| `AssetGroupName` | STRING | AssetGroupName | The asset group name. |
| `Downloads` | INTEGER | Downloads | The number of downloads. |
| `PostClickDownloadRate` | NUMERIC | PostClickDownloadRate | The download rate after click. |
| `CostPerDownload` | NUMERIC | CostPerDownload | The cost per download. |
| `AppInstalls` | INTEGER | AppInstalls | The number of app installs. |
| `PostClickInstallRate` | NUMERIC | PostClickInstallRate | The install rate after click. |
| `CPI` | NUMERIC | CPI | Cost per install. |
| `Purchases` | INTEGER | Purchases | The number of purchases. |
| `PostInstallPurchaseRate` | NUMERIC | PostInstallPurchaseRate | The purchase rate after install. |
| `CPP` | NUMERIC | CPP | Cost per purchase. |
| `Subscriptions` | INTEGER | Subscriptions | The number of subscriptions. |
| `PostInstallSubscriptionRate` | NUMERIC | PostInstallSubscriptionRate | The subscription rate after install. |
| `CPS` | NUMERIC | CPS | Cost per subscription. |

# Example Questions

- Which countries bring the most clicks, and at what spend?
- Which cities have the most qualified conversions, and what is the spend there?
- Which states and metro areas inside a country receive most of a campaign's impressions?
