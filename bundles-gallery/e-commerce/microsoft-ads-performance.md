---
type: "OWOX Data Mart"
title: "Microsoft Ads Performance"
description: "OWOX data mart 'Microsoft Ads Performance'."
tags: ["owox"]
timestamp: 2026-05-26T20:07:10.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `AccountId` | STRING | PK. The Microsoft Advertising assigned identifier of an account. |
| `CampaignId` | STRING | PK. The Microsoft Advertising assigned identifier of a campaign. |
| `AdGroupId` | STRING | PK. The Microsoft Advertising assigned identifier of an ad group. |
| `AdId` | STRING | PK. The Microsoft Advertising assigned identifier of an ad. |
| `TimePeriod` | DATE | PK. The time period of each report row. |
| `CurrencyCode` | STRING | PK. The account currency type. |
| `AdDistribution` | STRING | PK. The network where you want your ads to show. |
| `DeviceType` | STRING | PK. The type of device which showed ads. |
| `DeviceOS` | STRING | PK. The operating system of the device reported in the DeviceType column. |
| `Network` | STRING | PK. The entire Microsoft Advertising Network made up of Microsoft sites and select traffic, and only partner traffic. |
| `TopVsOther` | STRING | PK. Indicates whether the ad impression appeared in a top position or elsewhere. |
| `BidMatchType` | STRING | PK. The keyword bid match type. |
| `DeliveredMatchType` | STRING | PK. The match type used to deliver an ad. |
| `Language` | STRING | PK. The language of the publisher where the ad was shown. |
| `CampaignType` | STRING | PK. The campaign type. |
| `AccountName` | STRING | The account name. |
| `CampaignName` | STRING | The campaign name. |
| `AdTitle` | STRING | The ad title. |
| `Impressions` | INTEGER | The number of times an ad has been displayed on search results pages. |
| `Clicks` | INTEGER | Clicks are what you pay for. |
| `Ctr` | FLOAT | The click-through rate (CTR) is the number of times an ad was clicked, divided by the number of times the ad was shown. |
| `Spend` | FLOAT | The cost per click (CPC) summed for each click. |
| `Conversions` | INTEGER | The number of conversions. |
| `AdStatus` | STRING | The ad status. |
| `CampaignStatus` | STRING | The campaign status. |
| `FinalUrl` | STRING | The Final URL of the ad. |
| `VideoViews` | INTEGER | The number of times the video was played and watched for at least two continuous seconds with more than 50% of the screen in view. |
| `VideoCompletionRate` | INTEGER | The number of completed video views divided by the total number of impressions, multiplied by 100. |
| `BusinessName` | STRING | Depending on your responsive ad's placement, your business's name may appear in your ad. |
| `Revenue` | STRING | The revenue optionally reported by the advertiser as a result of conversions. |
| `CostPerConversion` | FLOAT | The cost per conversion. |
| `AdType` | STRING | The ad type. |
| `AdGroupName` | STRING | The ad group name. |
