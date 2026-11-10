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
| `AdId` | STRING | AdId | PK. The Microsoft Advertising assigned identifier of an ad. |
| `AdGroupId` | STRING | AdGroupId | PK. The Microsoft Advertising assigned identifier of an ad group. |
| `AdTitle` | STRING | AdTitle | The ad title. |
| `AdDescription` | STRING | AdDescription | The first ad description that appears below the path in your ad. |
| `AdDescription2` | STRING | AdDescription2 | The second ad description that appears below the path in your ad. |
| `AdType` | STRING | AdType | The ad type. |
| `CurrencyCode` | STRING | CurrencyCode | PK. The account currency type. |
| `AdDistribution` | STRING | AdDistribution | PK. The network where you want your ads to show. |
| `Impressions` | INTEGER | Impressions | The number of times an ad has been displayed on search results pages. |
| `Clicks` | INTEGER | Clicks | Clicks are what you pay for. |
| `Ctr` | NUMERIC | CTR | The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown. |
| `AverageCpc` | NUMERIC | AverageCpc | The average cost per click (CPC). |
| `Spend` | NUMERIC | Spend | The cost per click (CPC) summed for each click. |
| `AveragePosition` | NUMERIC | AveragePosition | The average position of the ad on a webpage. |
| `Conversions` | INTEGER | Conversions | The number of conversions. |
| `ConversionRate` | NUMERIC | ConversionRate | The conversion rate as a percentage. |
| `CostPerConversion` | NUMERIC | CostPerConversion | The cost per conversion. |
| `DestinationUrl` | STRING | DestinationUrl | The destination URL attribute of the ad. |
| `DeviceType` | STRING | DeviceType | PK. The type of device which showed ads. |
| `Language` | STRING | Language | PK. The language of the publisher where the ad was shown. |
| `DisplayUrl` | STRING | DisplayUrl | The ad display URL. |
| `AdStatus` | STRING | AdStatus | The ad status. |
| `Network` | STRING | Network | PK. The entire Microsoft Advertising Network made up of Microsoft sites and select traffic, and only partner traffic. |
| `TopVsOther` | STRING | TopVsOther | PK. Indicates whether the ad impression appeared in a top position or elsewhere. |
| `BidMatchType` | STRING | BidMatchType | PK. The keyword bid match type. |
| `DeliveredMatchType` | STRING | DeliveredMatchType | PK. The match type used to deliver an ad. |
| `DeviceOS` | STRING | DeviceOS | PK. The operating system of the device reported in the DeviceType column. |
| `Assists` | STRING | Assists | The number of conversions from other ads within the same account that were preceded by one or more clicks from this ad. |
| `Revenue` | STRING | Revenue | The revenue optionally reported by the advertiser as a result of conversions. |
| `ReturnOnAdSpend` | NUMERIC | ReturnOnAdSpend | The return on ad spend (ROAS). |
| `CostPerAssist` | NUMERIC | CostPerAssist | The cost per assist. |
| `RevenuePerConversion` | STRING | RevenuePerConversion | The revenue per conversion. |
| `RevenuePerAssist` | STRING | RevenuePerAssist | The revenue per assist. |
| `TrackingTemplate` | STRING | TrackingTemplate | The current tracking template of the ad. |
| `CustomParameters` | STRING | CustomParameters | The current custom parameters set of the ad. |
| `FinalUrl` | STRING | FinalUrl | The Final URL of the ad. |
| `FinalMobileUrl` | STRING | FinalMobileUrl | The Final Mobile URL of the ad. |
| `FinalAppUrl` | STRING | FinalAppUrl | Reserved for future use. |
| `AccountStatus` | STRING | AccountStatus | The account status. |
| `CampaignStatus` | STRING | CampaignStatus | The campaign status. |
| `AdGroupStatus` | STRING | AdGroupStatus | The ad group status. |
| `TitlePart1` | STRING | TitlePart1 | The title part 1 attribute of an ad. |
| `TitlePart2` | STRING | TitlePart2 | The title part 2 attribute of an ad. |
| `TitlePart3` | STRING | TitlePart3 | The title part 3 attribute of an ad. |
| `Headline` | STRING | Headline | The shorter of two possible responsive ad headlines. |
| `LongHeadline` | STRING | LongHeadline | The longer of two possible responsive ad headlines. |
| `BusinessName` | STRING | BusinessName | Depending on your responsive ad's placement, your business's name may appear in your ad. |
| `Path1` | STRING | Path1 | The path 1 attribute of an ad. |
| `Path2` | STRING | Path2 | The path 2 attribute of an ad. |
| `AdLabels` | STRING | AdLabels | The labels applied to the ad. |
| `CustomerId` | INTEGER | CustomerId | The Microsoft Advertising assigned identifier of a customer. |
| `CustomerName` | STRING | CustomerName | The customer name. |
| `CampaignType` | STRING | CampaignType | PK. The campaign type. |
| `BaseCampaignId` | INTEGER | BaseCampaignId | The Microsoft Advertising assigned identifier of an experiment campaign. |
| `AllConversions` | INTEGER | AllConversions | The number of conversions. |
| `AllRevenue` | STRING | AllRevenue | The revenue optionally reported by the advertiser as a result of conversions. |
| `AllConversionRate` | NUMERIC | AllConversionRate | The conversion rate as a percentage. |
| `AllCostPerConversion` | NUMERIC | AllCostPerConversion | The cost per conversion. |
| `AllReturnOnAdSpend` | NUMERIC | AllReturnOnAdSpend | The return on ad spend (ROAS). |
| `AllRevenuePerConversion` | STRING | AllRevenuePerConversion | The revenue per conversion. |
| `FinalUrlSuffix` | STRING | FinalUrlSuffix | A place in your final URL where you can add parameters that will be attached to the end of your landing page URL. |
| `ViewThroughConversions` | INTEGER | ViewThroughConversions | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `Goal` | STRING | Goal | The name of the goal you set for the conversions you want. |
| `GoalType` | STRING | GoalType | The type of conversion goal. |
| `AbsoluteTopImpressionRatePercent` | NUMERIC | AbsoluteTopImpressionRatePercent | How often your ad was in the first position of all results, as a percentage of your total impressions. |
| `TopImpressionRatePercent` | NUMERIC | TopImpressionRatePercent | The percentage of times your ad showed in the mainline, the top placement where ads appear above the search results. |
| `AverageCpm` | NUMERIC | AverageCpm | The total advertising cost divided by the number of impressions (in thousands). |
| `ConversionsQualified` | INTEGER | ConversionsQualified | The number of conversions. |
| `AllConversionsQualified` | INTEGER | AllConversionsQualified | The number of conversions. |
| `ViewThroughConversionsQualified` | INTEGER | ViewThroughConversionsQualified | View-through conversions are conversions that people make after they have seen your ad, even though they did not click the ad. |
| `ViewThroughRevenue` | STRING | ViewThroughRevenue | The revenue optionally reported by the advertiser as a result of view-through conversions. |
| `VideoViews` | INTEGER | VideoViews | The number of times the video was played and watched for at least two continuous seconds with more than 50% of the screen in view. |
| `ViewThroughRate` | NUMERIC | ViewThroughRate | The number of video views divided by the number of impressions. |
| `AverageCPV` | NUMERIC | AverageCPV | Average total spend divided by video views. |
| `VideoViewsAt25Percent` | INTEGER | VideoViewsAt25Percent | The number of times a person completed at least 25% of a video. |
| `VideoViewsAt50Percent` | INTEGER | VideoViewsAt50Percent | The number of times a person completed at least 50% of a video. |
| `VideoViewsAt75Percent` | INTEGER | VideoViewsAt75Percent | The number of times a person completed at least 75% of a video. |
| `CompletedVideoViews` | INTEGER | CompletedVideoViews | Number of times a person watched the entire video to completion. |
| `VideoCompletionRate` | INTEGER | VideoCompletionRate | The number of completed video views divided by the total number of impressions, multiplied by 100. |
| `TotalWatchTimeInMS` | DATE | TotalWatchTimeInMS | Total amount of time a person spent watching the video in milliseconds. |
| `AverageWatchTimePerVideoView` | INTEGER | AverageWatchTimePerVideoView | Total watch time divided by the number of video views. |
| `AverageWatchTimePerImpression` | NUMERIC | AverageWatchTimePerImpression | Total watch time, in milliseconds, divided by the number of impressions. |
| `AdStrength` | STRING | AdStrength | The ad strength score of responsive search ads. |
| `AdStrengthActionItems` | STRING | AdStrengthActionItems | The suggestion based on ad strength of your responsive search ads. |
| `GoalId` | INTEGER | GoalId | The Microsoft Advertising assigned identifier of a conversion goal. |

# Example Questions

- Which ads have the lowest click-through rate, and what do they spend?
- How do spend and qualified conversions compare between device types and networks?
- Which delivered match types return the most qualified conversions for the same spend?

## Joins

- [Campaigns](./campaigns.md) — `CampaignId = Id` [N:1] — The campaign the row reports on; match the rows of Campaigns whose Type is Campaign.
  - Description: The campaign the row reports on; match the rows of Campaigns whose Type is Campaign.
- [Campaigns](./campaigns.md) — `AdGroupId = Id` [N:1] — The ad group the row reports on; match the rows of Campaigns whose Type is Ad Group.
  - Description: The ad group the row reports on; match the rows of Campaigns whose Type is Ad Group.
