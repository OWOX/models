---
title: "Ad Performance Report"
description: |
  Daily performance of each ad: impressions, clicks, spend, conversions, revenue, assists and return on ad spend, plus the ad's text, type, status and URLs, and for video ads the view and completion counts. The connector requests the report one day at a time for each account, with the aggregation set in its settings (Daily by default), so `TimePeriod` is a day by default.

  The report is segmented by device type and OS, network, top versus other position, bid and delivered match type, language, ad distribution and campaign type, and each combination is its own row. All of these are part of the key, together with `CurrencyCode`, the account currency. The vendor reference marks `Conversions`, `AllConversions` and `AveragePosition` as deprecated and returning zero going forward; use `ConversionsQualified` and `AllConversionsQualified` for conversion counts.
tags: ["owox", "connector", "microsoft-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/9375f07a09a2be2007a8a3a3d620acea174c7c3c/packages/connectors/src/Sources/MicrosoftAds/MicrosoftAdsAPIReference/MicrosoftAdsFieldsSchema.js"
    title: "OWOX Data Marts Microsoft Ads connector — Ad Performance Report endpoint (`ad_performance_report`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/advertising/reporting-service/adperformancereportrequest"
    title: "Microsoft Advertising API reference — adperformancereportrequest"
---

## Connector endpoint

- **Endpoint:** Microsoft Ads · `ad_performance_report`
- **Default destination table:** `microsoft_ads_ad_performance_report`
- **Unique keys:** `AccountId`, `CampaignId`, `AdGroupId`, `AdId`, `TimePeriod`, `CurrencyCode`, `AdDistribution`, `DeviceType`, `DeviceOS`, `Network`, `TopVsOther`, `BidMatchType`, `DeliveredMatchType`, `Language`, `CampaignType`
- **Time series:** yes, loaded by date range

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
| `AdId` | STRING | PK. The Microsoft Advertising assigned identifier of an ad. |
| `AdGroupId` | STRING | PK. The Microsoft Advertising assigned identifier of an ad group. |
| `AdTitle` | STRING | The ad title. |
| `AdDescription` | STRING | The first ad description that appears below the path in your ad. |
| `AdDescription2` | STRING | The second ad description that appears below the path in your ad. |
| `AdType` | STRING | The ad type. |
| `CurrencyCode` | STRING | PK. The account currency type. |
| `AdDistribution` | STRING | PK. The network where you want your ads to show. |
| `Impressions` | INTEGER | The number of times an ad has been displayed on search results pages. |
| `Clicks` | INTEGER | Clicks are what you pay for. |
| `Ctr` | NUMERIC | The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown. |
| `AverageCpc` | NUMERIC | The average cost per click (CPC). |
| `Spend` | NUMERIC | The cost per click (CPC) summed for each click. |
| `AveragePosition` | NUMERIC | The average position of the ad on a webpage. |
| `Conversions` | INTEGER | The number of conversions. |
| `ConversionRate` | NUMERIC | The conversion rate as a percentage. |
| `CostPerConversion` | NUMERIC | The cost per conversion. |
| `DestinationUrl` | STRING | The destination URL attribute of the ad. |
| `DeviceType` | STRING | PK. The type of device which showed ads. |
| `Language` | STRING | PK. The language of the publisher where the ad was shown. |
| `DisplayUrl` | STRING | The ad display URL. |
| `AdStatus` | STRING | The ad status. |
| `Network` | STRING | PK. The entire Microsoft Advertising Network made up of Microsoft sites and select traffic, and only partner traffic. |
| `TopVsOther` | STRING | PK. Indicates whether the ad impression appeared in a top position or elsewhere. |
| `BidMatchType` | STRING | PK. The keyword bid match type. |
| `DeliveredMatchType` | STRING | PK. The match type used to deliver an ad. |
| `DeviceOS` | STRING | PK. The operating system of the device reported in the DeviceType column. |
| `Assists` | STRING | The number of conversions from other ads within the same account that were preceded by one or more clicks from this ad. |
| `Revenue` | STRING | The revenue optionally reported by the advertiser as a result of conversions. |
| `ReturnOnAdSpend` | NUMERIC | The return on ad spend (ROAS). |
| `CostPerAssist` | NUMERIC | The cost per assist. |
| `RevenuePerConversion` | STRING | The revenue per conversion. |
| `RevenuePerAssist` | STRING | The revenue per assist. |
| `TrackingTemplate` | STRING | The current tracking template of the ad. |
| `CustomParameters` | STRING | The current custom parameters set of the ad. |
| `FinalUrl` | STRING | The Final URL of the ad. |
| `FinalMobileUrl` | STRING | The Final Mobile URL of the ad. |
| `FinalAppUrl` | STRING | Reserved for future use. |
| `AccountStatus` | STRING | The account status. |
| `CampaignStatus` | STRING | The campaign status. |
| `AdGroupStatus` | STRING | The ad group status. |
| `TitlePart1` | STRING | The title part 1 attribute of an ad. |
| `TitlePart2` | STRING | The title part 2 attribute of an ad. |
| `TitlePart3` | STRING | The title part 3 attribute of an ad. |
| `Headline` | STRING | The shorter of two possible responsive ad headlines. |
| `LongHeadline` | STRING | The longer of two possible responsive ad headlines. |
| `BusinessName` | STRING | Depending on your responsive ad's placement, your business's name may appear in your ad. |
| `Path1` | STRING | The path 1 attribute of an ad. |
| `Path2` | STRING | The path 2 attribute of an ad. |
| `AdLabels` | STRING | The labels applied to the ad. |
| `CustomerId` | INTEGER | The Microsoft Advertising assigned identifier of a customer. |
| `CustomerName` | STRING | The customer name. |
| `CampaignType` | STRING | PK. The campaign type. |
| `BaseCampaignId` | INTEGER | The Microsoft Advertising assigned identifier of an experiment campaign. |
| `AllConversions` | INTEGER | The number of conversions. |
| `AllRevenue` | STRING | The revenue optionally reported by the advertiser as a result of conversions. |
| `AllConversionRate` | NUMERIC | The conversion rate as a percentage. |
| `AllCostPerConversion` | NUMERIC | The cost per conversion. |
| `AllReturnOnAdSpend` | NUMERIC | The return on ad spend (ROAS). |
| `AllRevenuePerConversion` | STRING | The revenue per conversion. |
| `FinalUrlSuffix` | STRING | A place in your final URL where you can add parameters that will be attached to the end of your landing page URL. |
| `ViewThroughConversions` | INTEGER | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `Goal` | STRING | The name of the goal you set for the conversions you want. |
| `GoalType` | STRING | The type of conversion goal. |
| `AbsoluteTopImpressionRatePercent` | NUMERIC | How often your ad was in the first position of all results, as a percentage of your total impressions. |
| `TopImpressionRatePercent` | NUMERIC | The percentage of times your ad showed in the mainline, the top placement where ads appear above the search results. |
| `AverageCpm` | NUMERIC | The total advertising cost divided by the number of impressions (in thousands). |
| `ConversionsQualified` | INTEGER | The number of conversions. |
| `AllConversionsQualified` | INTEGER | The number of conversions. |
| `ViewThroughConversionsQualified` | INTEGER | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `ViewThroughRevenue` | STRING | The revenue optionally reported by the advertiser as a result of view-through conversions. |
| `VideoViews` | INTEGER | The number of times the video was played and watched for at least two continuous seconds with more than 50% of the screen in view. |
| `ViewThroughRate` | NUMERIC | The number of video views divided by the number of impressions. |
| `AverageCPV` | NUMERIC | Average total spend divided by video views. |
| `VideoViewsAt25Percent` | INTEGER | The number of times a person completed at least 25% of a video. |
| `VideoViewsAt50Percent` | INTEGER | The number of times a person completed at least 50% of a video. |
| `VideoViewsAt75Percent` | INTEGER | The number of times a person completed at least 75% of a video. |
| `CompletedVideoViews` | INTEGER | Number of times a person watched the entire video to completion. |
| `VideoCompletionRate` | INTEGER | The number of completed video views divided by the total number of impressions, multiplied by 100. |
| `TotalWatchTimeInMS` | DATE | Total amount of time a person spent watching the video in milliseconds. |
| `AverageWatchTimePerVideoView` | INTEGER | Total watch time divided by the number of video views. |
| `AverageWatchTimePerImpression` | NUMERIC | Total watch time, in milliseconds, divided by the number of impressions. |
| `AdStrength` | STRING | The ad strength score of responsive search ads. |
| `AdStrengthActionItems` | STRING | The suggestion based on ad strength of your responsive search ads. |
| `GoalId` | INTEGER | The Microsoft Advertising assigned identifier of a conversion goal. |

# Example Questions

- Which ads have the lowest click-through rate, and what do they spend?
- How do spend and qualified conversions compare between device types and networks?
- Which delivered match types return the most qualified conversions for the same spend?
