---
title: "Ad Performance Report"
description: |
  Daily performance of each ad: impressions, clicks, spend, conversions, revenue, assists and return on ad spend, plus the ad's text, type, status and URLs, and for video ads the view and completion counts. The connector requests the report one day at a time for each account, with the aggregation set in its settings (Daily by default), so `TimePeriod` is a day by default.

  The report is segmented by device type and OS, network, top versus other position, bid and delivered match type, language, ad distribution and campaign type, and each combination is its own row. All of these are part of the key, together with `CurrencyCode`, the account currency. The vendor reference marks `Conversions`, `AllConversions`, `ViewThroughConversions` and `AveragePosition` as deprecated and returning zero going forward; use `ConversionsQualified`, `AllConversionsQualified` and `ViewThroughConversionsQualified` for conversion counts. The `All` columns include goals excluded from bidding; the others count only the goals bidding uses.
tags: ["owox", "connector", "microsoft-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/8ac4b37c386647fabc621066a7db9a3daeb839f1/packages/connectors/src/Sources/MicrosoftAds/MicrosoftAdsAPIReference/adPerformanceReportFields.js"
    title: "OWOX Data Marts Microsoft Ads connector — Ad Performance Report endpoint (`ad_performance_report`)"
    last_modified: 2026-09-28
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/advertising/reporting-service/adperformancereportrequest"
    title: "Microsoft Advertising API reference — Ad Performance Report"
---

## Connector endpoint

- **Endpoint:** Microsoft Ads · `ad_performance_report`
- **Default destination table:** `microsoft_ads_ad_performance_report`
- **Last updated:** 2026-09-28 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([3de731ea8](https://github.com/OWOX/owox-data-marts/commit/3de731ea89fa5701d5f45624a3fa5789e2df3e53))
- **Microsoft Advertising API version:** v13
- **Unique keys:** `AccountId`, `CampaignId`, `AdGroupId`, `AdId`, `TimePeriod`, `CurrencyCode`, `AdDistribution`, `DeviceType`, `DeviceOS`, `Network`, `TopVsOther`, `BidMatchType`, `DeliveredMatchType`, `Language`, `CampaignType`
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
| `AdId` | STRING | Ad ID | PK. The Microsoft Advertising assigned identifier of an ad. |
| `AdGroupId` | STRING | Ad Group ID | PK. The Microsoft Advertising assigned identifier of an ad group. |
| `AdTitle` | STRING | Ad Title | Title text of the ad. |
| `AdDescription` | STRING | Ad Description | The first ad description that appears below the path in your ad. |
| `AdDescription2` | STRING | Ad Description2 | The second ad description that appears below the path in your ad. |
| `AdType` | STRING | Ad Type | Type of the ad the row reports on. |
| `CurrencyCode` | STRING | Currency Code | PK. The account currency type. |
| `AdDistribution` | STRING | Ad Distribution | PK. The network where you want your ads to show. |
| `Impressions` | INTEGER | Impressions | The number of times an ad has been displayed on search results pages. |
| `Clicks` | INTEGER | Clicks | Clicks are what you pay for. |
| `Ctr` | FLOAT | CTR | The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown. |
| `AverageCpc` | FLOAT | Average CPC | The average cost per click (CPC). |
| `Spend` | FLOAT | Spend | The cost per click (CPC) summed for each click. |
| `AveragePosition` | FLOAT | Average Position | The average position of the ad on a webpage. |
| `Conversions` | INTEGER | Conversions | Conversions for goals counted in bidding (ExcludeFromBidding off). Deprecated by Microsoft in 2022: it returns 0 going forward, so use `ConversionsQualified`. |
| `ConversionRate` | FLOAT | Conversion Rate | Conversions divided by clicks, times 100, for goals counted in bidding (ExcludeFromBidding off); `AllConversionRate` covers all goals. |
| `CostPerConversion` | FLOAT | Cost Per Conversion | Spend divided by conversions, for goals counted in bidding (ExcludeFromBidding off); only campaigns with conversion tracking add conversions. |
| `DestinationUrl` | STRING | Destination URL | The destination URL attribute of the ad. |
| `DestinationUrlParsed` | STRING | Destination URL Parsed | DestinationUrl resolved to its landing page when it is a short link; otherwise the same value. Requires DestinationUrl and Process Short Links. |
| `DeviceType` | STRING | Device Type | PK. The type of device which showed ads. |
| `Language` | STRING | Language | PK. The language of the publisher where the ad was shown. |
| `DisplayUrl` | STRING | Display URL | The ad display URL. |
| `AdStatus` | STRING | Ad Status | Status of the ad the row reports on. |
| `Network` | STRING | Network | PK. The entire Microsoft Advertising Network made up of Microsoft sites and select traffic, and only partner traffic. |
| `TopVsOther` | STRING | Top Vs Other | PK. Indicates whether the ad impression appeared in a top position or elsewhere. |
| `BidMatchType` | STRING | Bid Match Type | PK. The keyword bid match type. |
| `DeliveredMatchType` | STRING | Delivered Match Type | PK. The match type used to deliver an ad. |
| `DeviceOS` | STRING | Device OS | PK. The operating system of the device reported in the DeviceType column. |
| `Assists` | STRING | Assists | The number of conversions from other ads within the same account that were preceded by one or more clicks from this ad. |
| `Revenue` | STRING | Revenue | Revenue the advertiser reports for conversions of goals counted in bidding (ExcludeFromBidding off); `AllRevenue` covers all goals. |
| `ReturnOnAdSpend` | FLOAT | Return On Ad Spend | Revenue divided by spend (ROAS), for goals counted in bidding (ExcludeFromBidding off). |
| `CostPerAssist` | FLOAT | Cost Per Assist | Spend divided by `Assists`. |
| `RevenuePerConversion` | STRING | Revenue Per Conversion | `Revenue` divided by conversions, for goals counted in bidding (ExcludeFromBidding off). |
| `RevenuePerAssist` | STRING | Revenue Per Assist | `Revenue` divided by `Assists`. |
| `TrackingTemplate` | STRING | Tracking Template | The current tracking template of the ad. |
| `CustomParameters` | STRING | Custom Parameters | The current custom parameters set of the ad. |
| `FinalUrl` | STRING | Final URL | The Final URL of the ad. |
| `FinalUrlParsed` | STRING | Final URL Parsed | FinalUrl resolved to its landing page when it is a short link; otherwise the same value. Requires FinalUrl and Process Short Links. |
| `FinalMobileUrl` | STRING | Final Mobile URL | The Final Mobile URL of the ad. |
| `FinalMobileUrlParsed` | STRING | Final Mobile URL Parsed | FinalMobileUrl resolved to its landing page when it is a short link; otherwise the same value. Requires FinalMobileUrl and Process Short Links. |
| `FinalAppUrl` | STRING | Final App URL | Reserved for future use. |
| `AccountStatus` | STRING | Account Status | Status of the ad account the row reports on. |
| `CampaignStatus` | STRING | Campaign Status | Status of the campaign the row reports on. |
| `AdGroupStatus` | STRING | Ad Group Status | Status of the ad group the row reports on. |
| `TitlePart1` | STRING | Title Part1 | The title part 1 attribute of an ad. |
| `TitlePart2` | STRING | Title Part2 | The title part 2 attribute of an ad. |
| `TitlePart3` | STRING | Title Part3 | The title part 3 attribute of an ad. |
| `Headline` | STRING | Headline | The shorter of two possible responsive ad headlines. |
| `LongHeadline` | STRING | Long Headline | The longer of two possible responsive ad headlines. |
| `BusinessName` | STRING | Business Name | Depending on your responsive ad's placement, your business's name may appear in your ad. |
| `Path1` | STRING | Path1 | The path 1 attribute of an ad. |
| `Path2` | STRING | Path2 | The path 2 attribute of an ad. |
| `AdLabels` | STRING | Ad Labels | The labels applied to the ad. |
| `CustomerId` | INTEGER | Customer ID | The Microsoft Advertising assigned identifier of a customer. |
| `CustomerName` | STRING | Customer Name | Name of the Microsoft Advertising customer that owns the account. |
| `CampaignType` | STRING | Campaign Type | PK. Type of the campaign; Microsoft lists values such as Audience, Dynamic search, Search & content and Shopping. |
| `BaseCampaignId` | INTEGER | Base Campaign ID | The Microsoft Advertising assigned identifier of an experiment campaign. |
| `AllConversions` | INTEGER | All Conversions | Conversions for all goals, including those excluded from bidding. Deprecated by Microsoft in 2022: it returns 0 going forward, so use `AllConversionsQualified`. |
| `AllRevenue` | STRING | All Revenue | Revenue the advertiser reports for conversions of all goals, including those excluded from bidding. |
| `AllConversionRate` | FLOAT | All Conversion Rate | Conversions divided by clicks, times 100, for all goals, including those excluded from bidding. |
| `AllCostPerConversion` | FLOAT | All Cost Per Conversion | Spend divided by conversions, for all goals, including those excluded from bidding; only campaigns with conversion tracking add conversions. |
| `AllReturnOnAdSpend` | FLOAT | All Return On Ad Spend | Revenue divided by spend (ROAS), for all goals, including those excluded from bidding. |
| `AllRevenuePerConversion` | STRING | All Revenue Per Conversion | `AllRevenue` divided by conversions, for all goals, including those excluded from bidding. |
| `FinalUrlSuffix` | STRING | Final URL Suffix | A place in your final URL where you can add parameters that will be attached to the end of your landing page URL. |
| `ViewThroughConversions` | INTEGER | View Through Conversions | Conversions by people who saw but did not click an ad, counted only for Microsoft Audience network ads. Deprecated by Microsoft in 2022: it returns 0 going forward, so use `ViewThroughConversionsQualified`. |
| `Goal` | STRING | Goal | The name of the goal you set for the conversions you want. |
| `GoalType` | STRING | Goal Type | The type of conversion goal. |
| `AbsoluteTopImpressionRatePercent` | FLOAT | Absolute Top Impression Rate Percent | How often your ad was in the first position of all results, as a percentage of your total impressions. |
| `TopImpressionRatePercent` | FLOAT | Top Impression Rate Percent | The percentage of times your ad showed in the mainline, the top placement where ads appear above the search results. |
| `AverageCpm` | FLOAT | Average CPM | The total advertising cost divided by the number of impressions (in thousands). |
| `ConversionsQualified` | INTEGER | Conversions Qualified | Conversions for goals counted in bidding (ExcludeFromBidding off); the column to use instead of the deprecated `Conversions`. Microsoft returns it as a decimal number. |
| `AllConversionsQualified` | INTEGER | All Conversions Qualified | Conversions for all goals, including those excluded from bidding; the column to use instead of the deprecated `AllConversions`. Microsoft returns it as a decimal number. |
| `ViewThroughConversionsQualified` | INTEGER | View Through Conversions Qualified | Conversions by people who saw but did not click an ad, counted only for Microsoft Audience network ads; the column to use instead of the deprecated `ViewThroughConversions`. |
| `ViewThroughRevenue` | STRING | View Through Revenue | The revenue optionally reported by the advertiser as a result of view-through conversions. |
| `VideoViews` | INTEGER | Video Views | The number of times the video was played and watched for at least two continuous seconds with more than 50% of the screen in view. |
| `ViewThroughRate` | FLOAT | View Through Rate | The number of video views divided by the number of impressions. |
| `AverageCPV` | FLOAT | Average CPV | Average total spend divided by video views. |
| `VideoViewsAt25Percent` | INTEGER | Video Views At 25 Percent | The number of times a person completed at least 25% of a video. |
| `VideoViewsAt50Percent` | INTEGER | Video Views At 50 Percent | The number of times a person completed at least 50% of a video. |
| `VideoViewsAt75Percent` | INTEGER | Video Views At 75 Percent | The number of times a person completed at least 75% of a video. |
| `CompletedVideoViews` | INTEGER | Completed Video Views | Number of times a person watched the entire video to completion. |
| `VideoCompletionRate` | INTEGER | Video Completion Rate | The number of completed video views divided by the total number of impressions, multiplied by 100. |
| `TotalWatchTimeInMS` | DATE | Total Watch Time In MS | Total amount of time a person spent watching the video in milliseconds. |
| `AverageWatchTimePerVideoView` | INTEGER | Average Watch Time Per Video View | Total watch time divided by the number of video views. |
| `AverageWatchTimePerImpression` | FLOAT | Average Watch Time Per Impression | Total watch time, in milliseconds, divided by the number of impressions. |
| `AdStrength` | STRING | Ad Strength | The ad strength score of responsive search ads. |
| `AdStrengthActionItems` | STRING | Ad Strength Action Items | The suggestion based on ad strength of your responsive search ads. |
| `GoalId` | INTEGER | Goal ID | The Microsoft Advertising assigned identifier of a conversion goal. |

# Example Questions

- Which ads have the lowest click-through rate, and what do they spend?
- How do spend and qualified conversions compare between device types and networks?
- Which delivered match types return the most qualified conversions for the same spend?

## Joins

- [Campaigns](./campaigns.md) — `CampaignId = Id` [N:1] — The campaign the row reports on; only Campaigns rows of Type Campaign match.
