---
title: "Ad Analytics"
description: |
  Daily performance of the ad account: impressions, clicks, cost in local currency and in USD, engagements, video and document completions, conversions and lead metrics, plus the same metrics on viral impressions, those that come from users sharing sponsored content (`viral...` fields). One row per `dateRangeStart`, `dateRangeEnd` and `pivotValues` combination.

  The connector asks LinkedIn for daily figures grouped by creative, campaign, campaign group and account, so `pivotValues` is a JSON array of the URNs of those entities, and the table has no separate campaign or creative column. The connector fetches the metrics in several requests and merges them on the date range and `pivotValues`. Many metrics apply only to some ad formats and are empty for the rest.
tags: ["owox", "connector", "linkedin-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInAds/LinkedInAdsAPIReference/LinkedInAdsFieldsSchema.js"
    title: "OWOX Data Marts LinkedIn Ads connector — Ad Analytics endpoint (`adAnalytics`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads-reporting/ads-reporting"
    title: "LinkedIn Marketing API reference — ads-reporting"
---

## Connector endpoint

- **Endpoint:** LinkedIn Ads · `adAnalytics`
- **Default destination table:** `linkedin_ads_ad_analytics`
- **Unique keys:** `dateRangeStart`, `dateRangeEnd`, `pivotValues`
- **Time series:** yes, one row per key per `date`

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `actionClicks` | NUMERIC | ActionClicks | The count of clicks on the action button of the Sponsored Messaging ad. |
| `adUnitClicks` | NUMERIC | AdUnitClicks | The count of clicks on the ad unit displayed alongside the Sponsored Messaging ad. |
| `approximateMemberReach` | NUMERIC | ApproximateMemberReach | Non-demographic pivots only (i.e. not MEMBER\_). The estimated number of unique member accounts with at least one impression. This metric is an updated and more accurate version of legacy metric approximateUniqueImpressions. This metric is only available when the number of days in the date range is less than or equal to 92 days. This metric is fully launched in Jan 2024. |
| `averageDwellTime` | NUMERIC | AverageDwellTime | Average user dwell time (in seconds). It measures the duration for which more than 50% of the ad's pixels remain visible in the viewport. |
| `audiencePenetration` | NUMERIC | AudiencePenetration | The approximate number of unique members reached by the advertiser divided by the approximate total target audience size. The field will be null if the date range has more than 92 days. This metric only supports the CAMPAIGN pivot. |
| `cardClicks` | NUMERIC | CardClicks | Non-demographic pivots only (i.e. not MEMBER\_). The number of clicks for each card of a carousel ad. The first card click of the carousel ad results in an immediate cardClick and click, whereas scrolling to other cards and clicking will count as additional cardClick. |
| `cardImpressions` | NUMERIC | CardImpressions | Non-demographic pivots only (i.e. not MEMBER\_). The number of impressions shown for each card of a carousel ad. The first card of the carousel ad results in an immediate cardImpression and impression, whereas scrolling to other cards will count as additional cardImpressions. |
| `clicks` | NUMERIC | Clicks | The count of chargeable clicks. Despite not charging for clicks for CPM campaigns, this field still represents those clicks for which we would otherwise charge advertisers based on objective (for example, clicks to view the landing page or company page). |
| `commentLikes` | NUMERIC | CommentLikes | The count of likes of a comment. Sponsored Content only. |
| `comments` | NUMERIC | Comments | The count of comments. Sponsored Content only. |
| `companyPageClicks` | NUMERIC | CompanyPageClicks | The count of clicks to view the company page. |
| `conversionValueInLocalCurrency` | NUMERIC | ConversionValueInLocalCurrency | Non-demographic pivots only (i.e. not MEMBER\_). Value of the conversions in the account's local currency based on rules defined by the advertiser. Conversion value is set by the advertiser at a per conversion level, and aggregated across the query time range. |
| `costInLocalCurrency` | NUMERIC | CostInLocalCurrency | Cost in the account's local currency based on the pivot and timeGranularity. For example, this would be spend by member company size per month if the pivot is MEMBER_COMPANY_SIZE and timeGranularity is MONTHLY. Cost is not adjusted for over delivery when a member professional demographic pivot is specified in the request. |
| `costInUsd` | NUMERIC | CostInUsd | Cost in USD based on the pivot and timeGranularity. For example, this would be spend by campaign on a given day if the pivot is CAMPAIGN and timeGranularity is DAILY. Cost is not adjusted for over delivery when a member professional demographic pivot is specified in the request. |
| `costPerQualifiedLead` | NUMERIC | CostPerQualifiedLead | How much money was spent per qualified lead. Ratio is costInLocalCurrency / qualifiedLeads. |
| `dateRangeStart` | DATE | DateRangeStart | PK. Start date of the report data point. Date is specified in UTC format (YYYY-MM-DD). |
| `dateRangeEnd` | DATE | DateRangeEnd | PK. End date of the report data point. Date is specified in UTC format (YYYY-MM-DD). |
| `documentCompletions` | NUMERIC | DocumentCompletions | The number of times users reached 100% of the document's length, including those that skipped to this point. This metric is only available for document ads and not all dimensions. |
| `documentFirstQuartileCompletions` | NUMERIC | DocumentFirstQuartileCompletions | The number of times users reached the first quartile of the document's length, including those that skipped to this point. This metric is only available for document ads and not all dimensions. |
| `documentMidpointCompletions` | NUMERIC | DocumentMidpointCompletions | The number of times users reached the second quartile of the document's length, including those that skipped to this point. This metric is only available for document ads and not all dimensions. |
| `documentThirdQuartileCompletions` | NUMERIC | DocumentThirdQuartileCompletions | The number of times users reached the third quartile of the document's length, including those that skipped to this point. This metric is only available for document ads and not all dimensions. |
| `downloadClicks` | NUMERIC | DownloadClicks | The number of times users have indicated the intent to download the media in an ad by clicking the download icon. This may or may not result in an actual download (e.g. if the user rejects a browser download prompt). This metric is only available for ad formats supporting media downloads. |
| `externalWebsiteConversions` | NUMERIC | ExternalWebsiteConversions | Total number of times users took a desired action after clicking on or seeing your ad. When conversions cannot be attributed to individual users, group level attribution or estimation may be used. |
| `externalWebsitePostClickConversions` | NUMERIC | ExternalWebsitePostClickConversions | Total number of times users took a desired action after clicking on your ad. When conversions cannot be attributed to individual users, group level attribution or estimation may be used. |
| `externalWebsitePostViewConversions` | NUMERIC | ExternalWebsitePostViewConversions | Total number of times users took a desired action after seeing your ad. When conversions cannot be attributed to individual users, group level attribution or estimation may be used. |
| `follows` | NUMERIC | Follows | The count of follows. Sponsored Content and Follower ads only. |
| `fullScreenPlays` | NUMERIC | FullScreenPlays | Number of times members click on the full screen button or on the video(mobile only) to go into full screen mode. |
| `headlineClicks` | NUMERIC | HeadlineClicks | The number of times members clicked on the headline of conversation ads. |
| `headlineImpressions` | NUMERIC | HeadlineImpressions | The number of times members were shown the headline of conversation ads. |
| `impressions` | NUMERIC | Impressions | This is the count of impressions for Sponsored Content and sends for Sponsored Messaging. |
| `jobApplications` | NUMERIC | JobApplications | The number of times a member completed a job application after viewing or clicking on an ad. Currently, this metric is broken down into postViewJobApplications (if the member applied after viewing the ad) and postClickJobApplications (if the member applied after clicking the ad). |
| `jobApplyClicks` | NUMERIC | JobApplyClicks | The number of times a member clicked on the job's apply button on an LinkedIn jobs page after viewing or clicking on an ad which has a LinkedIn job landing page. Currently, this metric is broken down into postViewJobApplyClicks (if the member performed the action after viewing the ad) and postClickJobApplyClicks (if the member performed the action after clicking the ad). |
| `landingPageClicks` | NUMERIC | LandingPageClicks | The count of clicks which take the user to the creative landing page. |
| `leadGenerationMailContactInfoShares` | NUMERIC | LeadGenerationMailContactInfoShares | The number of times users shared contact info through the One Click Lead Gen for Sponsored Messaging ads. |
| `leadGenerationMailInterestedClicks` | NUMERIC | LeadGenerationMailInterestedClicks | The count of Sponsored Messaging ad recipients who clicked to demonstrate interest. |
| `likes` | NUMERIC | Likes | The count of likes. Sponsored Content only. |
| `oneClickLeadFormOpens` | NUMERIC | OneClickLeadFormOpens | The count of times users opened the lead form for a One Click Lead Gen campaign. |
| `oneClickLeads` | NUMERIC | OneClickLeads | The count of leads generated through One Click Lead Gen. |
| `opens` | NUMERIC | Opens | The count of opens of Sponsored Messaging ads. |
| `otherEngagements` | NUMERIC | OtherEngagements | The count of user interactions with the ad unit that do not fit into any other more specific category. |
| `pivotValues` | JSON | PivotValues | PK. The value of the pivots for a specific record returned. For example, supplying pivots of CREATIVE and CONVERSION results in a list of records, one for each creative/conversion combination. The pivotValues contain serialized URNs for the specific creative and conversion for a record. To resolve these URNs to their corresponding entities, refer to LinkedIn Marketing API URN Resolution. |
| `postClickJobApplications` | NUMERIC | PostClickJobApplications | The number of times a member completed a job application after clicking on an ad. See also jobApplications. |
| `postClickJobApplyClicks` | NUMERIC | PostClickJobApplyClicks | The number of times a member clicked on the job's apply button on an LinkedIn jobs page after clicking on an ad which has a LinkedIn job landing page. See also jobApplyClicks. |
| `postClickRegistrations` | NUMERIC | PostClickRegistrations | The number of times a member has registered for an event or seminar after clicking on an ad which has a LinkedIn landing page. This includes gross registrations and does not account for a user unregistering. |
| `postViewJobApplications` | NUMERIC | PostViewJobApplications | The number of times a member completed a job application after viewing an ad. See also jobApplications. |
| `postViewJobApplyClicks` | NUMERIC | PostViewJobApplyClicks | The number of times a member clicked on the job's apply button on an LinkedIn jobs page after clicking an ad which has a LinkedIn job landing page. See also jobApplyClicks. |
| `postViewRegistrations` | NUMERIC | PostViewRegistrations | The number of times a member has registered for an event or seminar after viewing an ad which has a LinkedIn event landing page. This includes gross registrations and does not account for a user unregistering. See also registrations. |
| `qualifiedLeads` | NUMERIC | QualifiedLeads | The count of qualified leads shared by the advertiser. Qualified lead is a lead that has been deemed more likely to become a customer compared to other leads, based on their engagement and fit. |
| `reactions` | NUMERIC | Reactions | The count of positive reactions on Sponsored Content which can capture, like, interest, praise, and other responses. |
| `registrations` | NUMERIC | Registrations | The number of times a member has registered for an event or seminar after viewing or clicking on an ad which has a LinkedIn event landing page. This includes gross registrations and does not account for a user unregistering. |
| `sends` | NUMERIC | Sends | The count of sends of Sponsored Messaging ads. |
| `shares` | NUMERIC | Shares | The count of shares. Sponsored Content only. |
| `subscriptionClicks` | NUMERIC | SubscriptionClicks | The count of clicks to subscribe to a series, such as a Newsletter. |
| `talentLeads` | NUMERIC | TalentLeads | Number of leads captured through a talent media campaign. |
| `textUrlClicks` | NUMERIC | TextUrlClicks | The count of clicks on any links (anchor tags) that were included in the body of the Sponsored Messaging ad. |
| `totalEngagements` | NUMERIC | TotalEngagements | The count of all user interactions with the ad unit. |
| `validWorkEmailLeads` | NUMERIC | ValidWorkEmailLeads | The count of leads with a valid work email that does not use an established free or personal email domain. |
| `videoCompletions` | NUMERIC | VideoCompletions | The count of video ads that played 97-100% of the video. This includes watches that skipped to this point if the serving location is ON_SITE. |
| `videoFirstQuartileCompletions` | NUMERIC | VideoFirstQuartileCompletions | The count of video ads that played through the first quartile of the video. This includes watches that skipped to this point if the serving location is ON_SITE. |
| `videoMidpointCompletions` | NUMERIC | VideoMidpointCompletions | The count of video ads that played through the midpoint of the video. This includes watches that skipped to this point if the serving location is ON_SITE. |
| `videoStarts` | NUMERIC | VideoStarts | The count of video ads that were started by users. |
| `videoThirdQuartileCompletions` | NUMERIC | VideoThirdQuartileCompletions | The count of video ads that played through the third quartile of the video. This includes watches that skipped to this point if the serving location is ON_SITE. |
| `videoViews` | INTEGER | VideoViews | A video ad playing for at least 2 continuous seconds 50% in-view, or a click on the CTA, whichever comes first. An interaction with the video (like going to fullscreen mode) does not count as a view. |
| `viralCardClicks` | NUMERIC | ViralCardClicks | Non-demographic pivots only (i.e. not MEMBER\_). The number of viralClicks for each card of a carousel ad. The first viralCardClick of the carousel ad results in an immediate viralCardClick and viralClick, whereas scrolling to other cards and clicking will count as additional viralCardClick. |
| `viralCardImpressions` | NUMERIC | ViralCardImpressions | Non-demographic pivots only (i.e. not MEMBER\_). The number of viralImpressions shown for each card of a carousel ad. The first card of the carousel ad results in an immediate viralCardImpression and viralImpression, whereas scrolling to other cards will count as additional viralCardImpressions. |
| `viralClicks` | NUMERIC | ViralClicks | The count of clicks on viral impressions. See viral impressions definition. Sponsored Content only. |
| `viralCommentLikes` | NUMERIC | ViralCommentLikes | The count of likes on comments from viral impressions for this activity. See viral impressions definition. Sponsored Content only. |
| `viralComments` | NUMERIC | ViralComments | The count of comments from viral impressions for this activity. See viral impressions definition. Sponsored Content only. |
| `viralCompanyPageClicks` | NUMERIC | ViralCompanyPageClicks | The count of clicks to view the company page from viral impressions for this activity. See viral impressions definition. Sponsored Content only. |
| `viralDocumentCompletions` | NUMERIC | ViralDocumentCompletions | The number of times users reached 100% of the document's length on a viral post, including those that skipped to this point. This metric is only available for document ads. |
| `viralDocumentFirstQuartileCompletions` | NUMERIC | ViralDocumentFirstQuartileCompletions | The number of times users reached the first quartile of the document's length on a viral post, including those that skipped to this point. This metric is only available for document ads. |
| `viralDocumentMidpointCompletions` | NUMERIC | ViralDocumentMidpointCompletions | The number of times users reached the second quartile of the document's length on a viral post, including those that skipped to this point. This metric is only available for document ads. |
| `viralDocumentThirdQuartileCompletions` | NUMERIC | ViralDocumentThirdQuartileCompletions | The number of times users reached the third quartile of the document's length on a viral post, including those that skipped to this point. This metric is only available for document ads. |
| `viralDownloadClicks` | NUMERIC | ViralDownloadClicks | The number of times users have indicated the intent to download the media in a viral ad by clicking the download icon. This may or may not result in an actual download (e.g. if the user rejects a browser download prompt). Only available for ads supporting media downloads. |
| `viralExternalWebsiteConversions` | NUMERIC | ViralExternalWebsiteConversions | The count of conversions that are attributed to your ads driven by a viral event. See viral impressions definition. |
| `viralExternalWebsitePostClickConversions` | NUMERIC | ViralExternalWebsitePostClickConversions | The count of post-click conversions that are attributed to your ads driven by a viral click. See viral impressions definition. |
| `viralExternalWebsitePostViewConversions` | NUMERIC | ViralExternalWebsitePostViewConversions | The count of post-view conversions that are attributed to your ads driven by a viral impression. See viral impressions definition. |
| `viralFollows` | NUMERIC | ViralFollows | The count of follows from viral impressions for this activity. See viral impressions definition. Sponsored Content only. |
| `viralFullScreenPlays` | NUMERIC | ViralFullScreenPlays | Number of times members click on the full screen button or on the video(mobile only) to go into full screen mode. See viralImpressions definition. |
| `viralImpressions` | NUMERIC | ViralImpressions | The count of viral impressions for this activity. Viral impressions are those resulting from users sharing sponsored content to their own network of connections. Viral impressions are not counted as regular impressions. Sponsored Content only. |
| `viralJobApplications` | NUMERIC | ViralJobApplications | The number of times a member completed a job application after viewing or clicking on a viral ad. Currently, this metric is broken down into viralPostViewJobApplications (if the member performed the action after viewing the viral ad) and viralPostClickJobApplications (if the member performed the action after clicking the viral ad). |
| `viralJobApplyClicks` | NUMERIC | ViralJobApplyClicks | The number of times a member clicked on the job's apply button on an LinkedIn jobs page after viewing or clicking on a viral ad which has a LinkedIn job landing page during the date range.Currently, this metric is broken down into viralPostViewJobApplyClicks (if the member performed the action after viewing the viral ad) and viralPostClickJobApplyClicks (if the member performed the action after clicking the viral ad). |
| `viralLandingPageClicks` | NUMERIC | ViralLandingPageClicks | The count of clicks on viral impressions to take the user to the creative landing page. See viral impressions definition. Sponsored Content only. |
| `viralLikes` | NUMERIC | ViralLikes | The count of likes from viral impressions for this activity. See viral impressions definition. Sponsored Content only. |
| `viralOneClickLeadFormOpens` | NUMERIC | ViralOneClickLeadFormOpens | The count of times users opened the lead form for viral impressions from a Lead Gen campaign. See viral impressions definition. |
| `viralOneClickLeads` | NUMERIC | ViralOneClickLeads | The count of leads generated through One Click Lead Gen from viral impressions for this activity. See viral impressions definition. |
| `viralOtherEngagements` | NUMERIC | ViralOtherEngagements | The count of user interactions with viral impressions that do not fit into any other more specific category. See viral impressions definition. Sponsored Content only. |
| `viralPostClickJobApplications` | NUMERIC | ViralPostClickJobApplications | The number of times a member completed a job application after clicking on a viral ad. |
| `viralPostClickJobApplyClicks` | NUMERIC | ViralPostClickJobApplyClicks | The number of times a member clicked on the job's apply button on an LinkedIn jobs page after clicking on a viral ad which has a LinkedIn job landing page. |
| `viralPostClickRegistrations` | NUMERIC | ViralPostClickRegistrations | The number of times a member has registered for an event or seminar after clicking on a viral ad which has a LinkedIn landing page. See viralImpressions definition. This includes gross registrations and does not account for a user unregistering. |
| `viralPostViewJobApplications` | NUMERIC | ViralPostViewJobApplications | The number of times a member completed a job application after viewing a viral ad. |
| `viralPostViewJobApplyClicks` | NUMERIC | ViralPostViewJobApplyClicks | The number of times a member clicked on the job's apply button on an LinkedIn jobs page after viewing a viral ad which has a LinkedIn job landing page. |
| `viralPostViewRegistrations` | NUMERIC | ViralPostViewRegistrations | The number of times a member has registered for an event or seminar after viewing a viral ad which has a LinkedIn event landing page. See viralImpressions definition. This includes gross registrations and does not account for a user unregistering. |
| `viralReactions` | NUMERIC | ViralReactions | The count of positive reactions on viral Sponsored Content which can capture like, interest, praise, and other responses. See viral impressions definition for details on viral engagements. |
| `viralRegistrations` | NUMERIC | ViralRegistrations | The number of times a member has registered for an event or seminar after viewing or clicking on a viral ad which has a LinkedIn event landing page. See viralImpressions definition. This includes gross registrations and does not account for a user unregistering. |
| `viralShares` | NUMERIC | ViralShares | The count of shares from viral impressions for this activity. See viral impressions definition. Sponsored Content only. |
| `viralSubscriptionClicks` | NUMERIC | ViralSubscriptionClicks | The count of viral clicks to subscribe to a series, such as a Newsletter. |
| `viralTotalEngagements` | NUMERIC | ViralTotalEngagements | The count of all user interactions with a viral ad unit. See viral impressions definition. Sponsored Content only. |
| `viralVideoCompletions` | NUMERIC | ViralVideoCompletions | The count of viral video ads that played 97-100% of the video. This includes watches that skipped to this point. See viralImpressions definition. |
| `viralVideoFirstQuartileCompletions` | NUMERIC | ViralVideoFirstQuartileCompletions | The count of viral video ads that played through the first quartile of the video. This includes watches that skipped to this point. See viralImpressions definition. |
| `viralVideoMidpointCompletions` | NUMERIC | ViralVideoMidpointCompletions | The count of viral video ads that played through the midpoint of the video. This includes watches that skipped to this point. See viralImpressions definition. |
| `viralVideoStarts` | NUMERIC | ViralVideoStarts | The count of viral video ads that were started by users. See viralImpressions definition. Since viral videos are automatically played for ON_SITE, this will be the same as viralImpressions if the servingLocation is ON_SITE. |
| `viralVideoThirdQuartileCompletions` | NUMERIC | ViralVideoThirdQuartileCompletions | The count of viral video ads that played through the third quartile of the video. This includes watches that skipped to this point. See viralImpressions definition |
| `viralVideoViews` | NUMERIC | ViralVideoViews | A viral video ad playing for at least 2 continuous seconds 50% in-view, or a click on the CTA, whichever comes first. An interaction with the video (like going to full screen mode) does not count as a view. See viralImpressions definition. |

# Example Questions

- What did the account spend in local currency, and how many impressions and clicks did it get, per day?
- On which days did external website conversions peak, and what was the cost on those days?
- How do paid clicks compare with viral clicks per day?

## Joins

- [Creatives](./creatives.md) — `pivotValues = id` [N:1] — The creative of rows grouped by creative: pivotValues is an array of URNs, one per pivot of the row, and the URN of the creative is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
  - Description: The creative of rows grouped by creative: pivotValues is an array of URNs, one per pivot of the row, and the URN of the creative is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
- [Campaigns](./campaigns.md) — `pivotValues = id` [N:1] — The campaign of rows grouped by campaign: pivotValues is an array of URNs, one per pivot of the row, and the URN of the campaign is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
  - Description: The campaign of rows grouped by campaign: pivotValues is an array of URNs, one per pivot of the row, and the URN of the campaign is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
- [Campaign Groups](./campaign-groups.md) — `pivotValues = id` [N:1] — The campaign group of rows grouped by campaign group: pivotValues is an array of URNs, one per pivot of the row, and the URN of the campaign group is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
  - Description: The campaign group of rows grouped by campaign group: pivotValues is an array of URNs, one per pivot of the row, and the URN of the campaign group is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
- [Ad Accounts](./ad-accounts.md) — `pivotValues = id` [N:1] — The ad account of rows grouped by ad account: pivotValues is an array of URNs, one per pivot of the row, and the URN of the ad account is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
  - Description: The ad account of rows grouped by ad account: pivotValues is an array of URNs, one per pivot of the row, and the URN of the ad account is the one that matches the id. The array holds the whole URN, so match the id inside it. A row grouped by another entity holds that entity's URN instead and matches none here.
