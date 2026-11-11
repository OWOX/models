---
title: "Statistics"
description: |
  Daily campaign statistics: displays, clicks, advertiser cost, visits, reach, and sales, revenue, average cart, conversion rate, cost of sale, cost per order and ROAS under each attribution model and lookback window, plus app install and omnichannel metrics. One row per `Day` and combination of the dimensions the connector is set to request, which at least are campaign, adset, ad and advertiser.

  The columns are of two kinds. Dimensions are the identifiers and names (`Day`, `Campaign`, `CampaignId`, `Adset`, `AdsetId`, `Ad`, `AdId`, `Advertiser`, `AdvertiserId`, `Currency`) and the optional segments `Device`, `Os`, `Channel`, `Category`, `Coupon` and `MarketingObjective`. Metrics are the rest. Percentages are decimals between 0 and 1. `Currency` is the currency of the advertiser cost.

  Metric names follow Criteo's pattern [Measurement][Devices][AttributionModel][LookbackWindow], for example `SalesAllPc30d`. `All` adds cross-device sales, those made on a different device than the one where the click happened; without it a metric counts same-device sales only. The attribution model is `Pc` (post-click), `Pv` (post-view) or `ClientAttribution`, the advertiser's own attribution, which has data only if the advertiser sends Criteo its attribution data for sales. The lookback window is `30d`, `7d`, `1d` or `24h`, and `Pc30dPv24h` pairs a 30-day post-click with a 24-hour post-view window. The connector's descriptions repeat one sentence for every model and window, so the column name is what tells two metrics apart. Per Criteo, the 1-day and 7-day post-click windows return 0 for dates before 1 January 2020.
tags: ["owox", "connector", "criteo-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/5f70df30299b26819765a8c69131738403f0add0/packages/connectors/src/Sources/CriteoAds/CriteoAdsAPIReference/adStatisticsFields.js"
    title: "OWOX Data Marts Criteo Ads connector — Statistics endpoint (`statistics`)"
    last_modified: 2026-06-16
  - id: "vendor-reference"
    resource: "https://developers.criteo.com/marketing-solutions/docs/campaign-statistics"
    title: "Criteo Marketing Solutions API reference — Statistics"
---

## Connector endpoint

- **Endpoint:** Criteo Ads · `statistics`
- **Default destination table:** `criteo_ads_statistics`
- **Last updated:** 2026-06-16 — last change to this endpoint's entry in the connector's fields schema, or to the file that declares its fields ([25b43f6d8](https://github.com/OWOX/owox-data-marts/commit/25b43f6d816a96843bfe44759b2ef83226aa9506))
- **Criteo Marketing Solutions API version:** 2026-01
- **Unique keys:** `CampaignId`, `AdvertiserId`, `AdsetId`, `AdId`, `Day`
- **Time series:** yes, loaded by date range

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `Clicks` | INTEGER | Clicks | The number of clicks driven by your ads. |
| `Displays` | INTEGER | Displays | The number of ad impressions served on publishers via Criteo. |
| `ViewableDisplays` | INTEGER | Viewable Displays | The number of ads that have been viewed. A display is considered viewed if at least 50% of the ad appears on the screen for at least one second. |
| `NonViewableDisplays` | INTEGER | Non Viewable Displays | The number of ads that have not been viewed |
| `UntrackableDisplays` | INTEGER | Untrackable Displays | The number of untracked displays. Some displays cannot be tracked because of the display environment (for instance, native banner). |
| `AdvertiserCost` | FLOAT | Advertiser Cost | Total money spent on Criteo advertising. |
| `QualifiedVisits` | INTEGER | Qualified Visits | The number of users on the target website or app for which at least two events or one sale event occurred within the hour following a click. |
| `Visits` | INTEGER | Visits | The number of users on the target website or app for which at least one event occurred within the hour following a click. |
| `CostPerVisit` | FLOAT | Cost Per Visit | The amount of money spent per visit to your website or app. |
| `BounceRate` | FLOAT | Bounce Rate | The proportion of website visitors leaving after only viewing one page. |
| `PotentialDisplays` | INTEGER | Potential Displays | The number of display opportunities, or the number of bid requests received. |
| `OverallCompetitionWin` | FLOAT | Overall Competition Win | The number of displays divided by the total number of display opportunities. |
| `ExposedUsers` | INTEGER | Exposed Users | The number of users who have been served an ad. |
| `Audience` | INTEGER | Audience | Potential users who could be served an ad. |
| `Reach` | FLOAT | Reach | Share of potential users who have been served an ad. |
| `ClickThroughRate` | FLOAT | Click Through Rate | Percentage of users served an ad who clicked. |
| `Cpc` | FLOAT | CPC | Cost per click. |
| `ECpm` | FLOAT | ECPM | Cost per 1000 impressions. |
| `PostInstallSales` | INTEGER | Post Install Sales | The number of your completed events after an app install. |
| `AppInstalls` | INTEGER | App Installs | The number of installations of your app. |
| `PostInstallConversionRate` | FLOAT | Post Install Conversion Rate | Percentage of post-install sales compared to the clicks that occurred. |
| `PostInstallCostOfSale` | FLOAT | Post Install Cost Of Sale | The cost of sale for app install campaigns. |
| `PostInstallOrderValue` | FLOAT | Post Install Order Value | The amount of money generated by sales after an app install. |
| `CostPerInstall` | FLOAT | Cost Per Install | The ad cost per app install. |
| `InstallRate` | FLOAT | Install Rate | The percentage of completed app installs compared to the number of clicks. |
| `PostInstallCostPerOrder` | FLOAT | Post Install Cost Per Order | The cost per order for sales after an app install. |
| `PostInstallRoas` | FLOAT | Post Install ROAS | The return on ad spend for sales after an app install. |
| `SalesClientAttribution` | INTEGER | Sales Client Attribution | The number of transactions or conversions resulting from Criteo ads. |
| `SalesAllClientAttribution` | INTEGER | Sales All Client Attribution | The number of transactions or conversions resulting from Criteo ads. |
| `SalesPc30d` | INTEGER | Sales Post-Click 30d | The number of transactions or conversions resulting from Criteo ads. |
| `SalesAllPc30d` | INTEGER | Sales All Post-Click 30d | The number of transactions or conversions resulting from Criteo ads. |
| `SalesPv24h` | INTEGER | Sales Post-View 24h | The number of transactions or conversions resulting from Criteo ads. |
| `SalesAllPv24h` | INTEGER | Sales All Post-View 24h | The number of transactions or conversions resulting from Criteo ads. |
| `SalesPc30dPv24h` | INTEGER | Sales Post-Click 30d Post-View 24h | The number of transactions or conversions resulting from Criteo ads. |
| `SalesAllPc30dPv24h` | INTEGER | Sales All Post-Click 30d Post-View 24h | The number of transactions or conversions resulting from Criteo ads. |
| `SalesPc1d` | INTEGER | Sales Post-Click 1d | The number of transactions or conversions resulting from Criteo ads. |
| `SalesAllPc1d` | INTEGER | Sales All Post-Click 1d | The number of transactions or conversions resulting from Criteo ads. |
| `SalesPc7d` | INTEGER | Sales Post-Click 7d | The number of transactions or conversions resulting from Criteo ads. |
| `SalesAllPc7d` | INTEGER | Sales All Post-Click 7d | The number of transactions or conversions resulting from Criteo ads. |
| `RevenueGeneratedClientAttribution` | FLOAT | Revenue Generated Client Attribution | The amount of money generated by online sales. |
| `RevenueGeneratedAllClientAttribution` | FLOAT | Revenue Generated All Client Attribution | The amount of money generated by online sales. |
| `RevenueGeneratedPc30d` | FLOAT | Revenue Generated Post-Click 30d | The amount of money generated by online sales. |
| `RevenueGeneratedAllPc30d` | FLOAT | Revenue Generated All Post-Click 30d | The amount of money generated by online sales. |
| `RevenueGeneratedPv24h` | FLOAT | Revenue Generated Post-View 24h | The amount of money generated by online sales. |
| `RevenueGeneratedAllPv24h` | FLOAT | Revenue Generated All Post-View 24h | The amount of money generated by online sales. |
| `RevenueGeneratedPc30dPv24h` | FLOAT | Revenue Generated Post-Click 30d Post-View 24h | The amount of money generated by online sales. |
| `RevenueGeneratedAllPc30dPv24h` | FLOAT | Revenue Generated All Post-Click 30d Post-View 24h | The amount of money generated by online sales. |
| `RevenueGeneratedPc1d` | FLOAT | Revenue Generated Post-Click 1d | The amount of money generated by online sales. |
| `RevenueGeneratedAllPc1d` | FLOAT | Revenue Generated All Post-Click 1d | The amount of money generated by online sales. |
| `RevenueGeneratedPc7d` | FLOAT | Revenue Generated Post-Click 7d | The amount of money generated by online sales. |
| `RevenueGeneratedAllPc7d` | FLOAT | Revenue Generated All Post-Click 7d | The amount of money generated by online sales. |
| `AverageCartClientAttribution` | FLOAT | Average Cart Client Attribution | Average revenue generated by a conversion or sale. |
| `AverageCartAllClientAttribution` | FLOAT | Average Cart All Client Attribution | Average revenue generated by a conversion or sale. |
| `AverageCartPc30d` | FLOAT | Average Cart Post-Click 30d | Average revenue generated by a conversion or sale. |
| `AverageCartAllPc30d` | FLOAT | Average Cart All Post-Click 30d | Average revenue generated by a conversion or sale. |
| `AverageCartPv24h` | FLOAT | Average Cart Post-View 24h | Average revenue generated by a conversion or sale. |
| `AverageCartAllPv24h` | FLOAT | Average Cart All Post-View 24h | Average revenue generated by a conversion or sale. |
| `AverageCartPc30dPv24h` | FLOAT | Average Cart Post-Click 30d Post-View 24h | Average revenue generated by a conversion or sale. |
| `AverageCartAllPc30dPv24h` | FLOAT | Average Cart All Post-Click 30d Post-View 24h | Average revenue generated by a conversion or sale. |
| `AverageCartPc1d` | FLOAT | Average Cart Post-Click 1d | Average revenue generated by a conversion or sale. |
| `AverageCartAllPc1d` | FLOAT | Average Cart All Post-Click 1d | Average revenue generated by a conversion or sale. |
| `AverageCartPc7d` | FLOAT | Average Cart Post-Click 7d | Average revenue generated by a conversion or sale. |
| `AverageCartAllPc7d` | FLOAT | Average Cart All Post-Click 7d | Average revenue generated by a conversion or sale. |
| `ConversionRateClientAttribution` | FLOAT | Conversion Rate Client Attribution | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRateAllClientAttribution` | FLOAT | Conversion Rate All Client Attribution | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRatePc30d` | FLOAT | Conversion Rate Post-Click 30d | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRateAllPc30d` | FLOAT | Conversion Rate All Post-Click 30d | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRatePv24h` | FLOAT | Conversion Rate Post-View 24h | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRateAllPv24h` | FLOAT | Conversion Rate All Post-View 24h | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRatePc30dPv24h` | FLOAT | Conversion Rate Post-Click 30d Post-View 24h | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRateAllPc30dPv24h` | FLOAT | Conversion Rate All Post-Click 30d Post-View 24h | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRatePc1d` | FLOAT | Conversion Rate Post-Click 1d | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRateAllPc1d` | FLOAT | Conversion Rate All Post-Click 1d | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRatePc7d` | FLOAT | Conversion Rate Post-Click 7d | Percentage of conversions or sales compared to the clicks that occurred. |
| `ConversionRateAllPc7d` | FLOAT | Conversion Rate All Post-Click 7d | Percentage of conversions or sales compared to the clicks that occurred. |
| `ECosClientAttribution` | FLOAT | ECOS Client Attribution | Advertising cost per conversion or sale. |
| `ECosAllClientAttribution` | FLOAT | ECOS All Client Attribution | Advertising cost per conversion or sale. |
| `ECosPc30d` | FLOAT | ECOS Post-Click 30d | Advertising cost per conversion or sale. |
| `ECosAllPc30d` | FLOAT | ECOS All Post-Click 30d | Advertising cost per conversion or sale. |
| `ECosPv24h` | FLOAT | ECOS Post-View 24h | Advertising cost per conversion or sale. |
| `ECosAllPv24h` | FLOAT | ECOS All Post-View 24h | Advertising cost per conversion or sale. |
| `ECosPc30dPv24h` | FLOAT | ECOS Post-Click 30d Post-View 24h | Advertising cost per conversion or sale. |
| `ECosAllPc30dPv24h` | FLOAT | ECOS All Post-Click 30d Post-View 24h | Advertising cost per conversion or sale. |
| `ECosPc1d` | FLOAT | ECOS Post-Click 1d | Advertising cost per conversion or sale. |
| `ECosAllPc1d` | FLOAT | ECOS All Post-Click 1d | Advertising cost per conversion or sale. |
| `ECosPc7d` | FLOAT | ECOS Post-Click 7d | Advertising cost per conversion or sale. |
| `ECosAllPc7d` | FLOAT | ECOS All Post-Click 7d | Advertising cost per conversion or sale. |
| `CostPerOrderClientAttribution` | FLOAT | Cost Per Order Client Attribution | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderAllClientAttribution` | FLOAT | Cost Per Order All Client Attribution | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderPc30d` | FLOAT | Cost Per Order Post-Click 30d | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderAllPc30d` | FLOAT | Cost Per Order All Post-Click 30d | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderPv24h` | FLOAT | Cost Per Order Post-View 24h | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderAllPv24h` | FLOAT | Cost Per Order All Post-View 24h | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderPc30dPv24h` | FLOAT | Cost Per Order Post-Click 30d Post-View 24h | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderAllPc30dPv24h` | FLOAT | Cost Per Order All Post-Click 30d Post-View 24h | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderPc1d` | FLOAT | Cost Per Order Post-Click 1d | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderAllPc1d` | FLOAT | Cost Per Order All Post-Click 1d | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderPc7d` | FLOAT | Cost Per Order Post-Click 7d | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `CostPerOrderAllPc7d` | FLOAT | Cost Per Order All Post-Click 7d | The price you pay for each order. Calculated as total cost divided by the total number of orders. |
| `RoasClientAttribution` | FLOAT | ROAS Client Attribution | The ratio between revenue generated and the cost. |
| `RoasAllClientAttribution` | FLOAT | ROAS All Client Attribution | The ratio between revenue generated and the cost. |
| `RoasPc30d` | FLOAT | ROAS Post-Click 30d | The ratio between revenue generated and the cost. |
| `RoasAllPc30d` | FLOAT | ROAS All Post-Click 30d | The ratio between revenue generated and the cost. |
| `RoasPv24h` | FLOAT | ROAS Post-View 24h | The ratio between revenue generated and the cost. |
| `RoasAllPv24h` | FLOAT | ROAS All Post-View 24h | The ratio between revenue generated and the cost. |
| `RoasPc30dPv24h` | FLOAT | ROAS Post-Click 30d Post-View 24h | The ratio between revenue generated and the cost. |
| `RoasAllPc30dPv24h` | FLOAT | ROAS All Post-Click 30d Post-View 24h | The ratio between revenue generated and the cost. |
| `RoasPc1d` | FLOAT | ROAS Post-Click 1d | The ratio between revenue generated and the cost. |
| `RoasAllPc1d` | FLOAT | ROAS All Post-Click 1d | The ratio between revenue generated and the cost. |
| `RoasPc7d` | FLOAT | ROAS Post-Click 7d | The ratio between revenue generated and the cost. |
| `RoasAllPc7d` | FLOAT | ROAS All Post-Click 7d | The ratio between revenue generated and the cost. |
| `AdvertiserValue` | FLOAT | Advertiser Value | The revenue generated by each product, considering margin (if provided in your product catalog). |
| `AdvertiserAllValue` | FLOAT | Advertiser All Value | The revenue generated by each product, considering margin (if provided in your product catalog). |
| `CostOfAdvertiserValue` | FLOAT | Cost Of Advertiser Value | The ratio between the advertiser value generated by sales and the cost of the campaign(s), given as a percentage. |
| `CostOfAdvertiserValueAll` | FLOAT | Cost Of Advertiser Value All | The ratio between the advertiser value generated by sales and the cost of the campaign(s), given as a percentage. |
| `OmnichannelRoasClientAttribution` | FLOAT | Omnichannel ROAS Client Attribution | The ratio between revenue generated online and offline, and the cost. |
| `OmnichannelRoasPc30d` | FLOAT | Omnichannel ROAS Post-Click 30d | The ratio between revenue generated online and offline, and the cost. |
| `OmnichannelRoasAllPc30d` | FLOAT | Omnichannel ROAS All Post-Click 30d | The ratio between revenue generated online and offline, and the cost. |
| `OmnichannelRoasPv24h` | FLOAT | Omnichannel ROAS Post-View 24h | The ratio between revenue generated online and offline, and the cost. |
| `OmnichannelRoasAllPv24h` | FLOAT | Omnichannel ROAS All Post-View 24h | The ratio between revenue generated online and offline, and the cost. |
| `OmnichannelRevenueClientAttribution` | FLOAT | Omnichannel Revenue Client Attribution | The revenue generated by online and offline sales. |
| `OmnichannelRevenuePc30d` | FLOAT | Omnichannel Revenue Post-Click 30d | The revenue generated by online and offline sales. |
| `OmnichannelRevenueAllPc30d` | FLOAT | Omnichannel Revenue All Post-Click 30d | The revenue generated by online and offline sales. |
| `OmnichannelRevenuePv24h` | FLOAT | Omnichannel Revenue Post-View 24h | The revenue generated by online and offline sales. |
| `OmnichannelRevenueAllPv24h` | FLOAT | Omnichannel Revenue All Post-View 24h | The revenue generated by online and offline sales. |
| `OmnichannelsalesClientAttribution` | INTEGER | Omnichannelsales Client Attribution | The number of online and offline transactions or conversions resulting from Criteo ads. |
| `OmnichannelSalesPc30d` | INTEGER | Omnichannel Sales Post-Click 30d | The number of online and offline transactions or conversions resulting from Criteo ads. |
| `OmnichannelSalesAllPc30d` | INTEGER | Omnichannel Sales All Post-Click 30d | The number of online and offline transactions or conversions resulting from Criteo ads. |
| `OmnichannelSalesPv24h` | INTEGER | Omnichannel Sales Post-View 24h | The number of online and offline transactions or conversions resulting from Criteo ads. |
| `OmnichannelSalesAllPv24h` | INTEGER | Omnichannel Sales All Post-View 24h | The number of online and offline transactions or conversions resulting from Criteo ads. |
| `RoasOfflinePc30d` | FLOAT | ROAS Offline Post-Click 30d | The ratio between the revenue generated offline and the cost. |
| `RoasOfflinePv24h` | FLOAT | ROAS Offline Post-View 24h | The ratio between the revenue generated offline and the cost. |
| `SalesOfflinePc30d` | INTEGER | Sales Offline Post-Click 30d | The number of completed in-store transactions or purchases. |
| `SalesOfflinePv24h` | INTEGER | Sales Offline Post-View 24h | The number of completed in-store transactions or purchases. |
| `RevenueGeneratedOfflinePc30d` | FLOAT | Revenue Generated Offline Post-Click 30d | The amount of revenue generated by in-store sales. |
| `RevenueGeneratedOfflinePv24h` | FLOAT | Revenue Generated Offline Post-View 24h | The amount of revenue generated by in-store sales. |
| `Day` | DATE | Day | PK. The day of the statistics data (YYYY-MM-DD format). |
| `Campaign` | STRING | Campaign | The campaign name. |
| `CampaignId` | STRING | Campaign ID | PK. The unique identifier for the campaign. |
| `AdvertiserId` | STRING | Advertiser ID | PK. The unique identifier for the advertiser. |
| `Advertiser` | STRING | Advertiser | The advertiser name. |
| `Adset` | STRING | Adset | The adset name. |
| `AdsetId` | STRING | Adset ID | PK. The unique identifier for the adset. |
| `Ad` | STRING | Ad | The ad name. |
| `AdId` | STRING | Ad ID | PK. The unique identifier for the ad. |
| `Currency` | STRING | Currency | The currency of the advertiser cost. |
| `Device` | STRING | Device | The device type on which the ad was served (e.g., Desktop, Tablet, Mobile). |
| `Os` | STRING | OS | The operating system of the device on which the ad was served. |
| `Channel` | STRING | Channel | The channel name through which the ad was served. |
| `ChannelId` | STRING | Channel ID | The unique identifier of the channel through which the ad was served. |
| `Category` | STRING | Category | The product category name. |
| `CategoryId` | STRING | Category ID | The unique identifier for the product category. |
| `Coupon` | STRING | Coupon | The coupon or promotion name. |
| `CouponId` | STRING | Coupon ID | The unique identifier for the coupon or promotion. |
| `MarketingObjective` | STRING | Marketing Objective | The marketing objective name (e.g., awareness, consideration, conversion). |
| `MarketingObjectiveId` | STRING | Marketing Objective ID | The unique identifier for the marketing objective. |

# Example Questions

- What did each campaign spend and how many displays and clicks did it get per day?
- Which adsets have the best 30-day post-click ROAS, and what do they cost?
- How do post-click 30-day sales and post-view 24-hour sales compare per campaign?
