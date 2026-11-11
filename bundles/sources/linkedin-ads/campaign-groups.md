---
title: "Campaign Groups"
description: |
  One row per campaign group: its name, status and serving statuses, the account URN it belongs to, its objective type, the campaign types it allows, a run schedule, and its total and daily budget. A campaign group is the top-level container of campaigns that share an objective, budget and schedule.

  `totalBudget` and `runSchedule` are JSON objects. `dailyBudget` and `budgetOptimization` apply when the group optimizes its budget across its campaigns. Campaigns point to their group through the URN in their `campaignGroup` field.
tags: ["owox", "connector", "linkedin-ads"]
type: "OWOX Data Mart"
sources:
  - id: "owox-connector"
    resource: "https://github.com/OWOX/owox-data-marts/blob/d5df95935e329451cbb627615bd723508ab3e339/packages/connectors/src/Sources/LinkedInAds/LinkedInAdsAPIReference/LinkedInAdsFieldsSchema.js"
    title: "OWOX Data Marts LinkedIn Ads connector — Campaign Groups endpoint (`adCampaignGroups`)"
  - id: "vendor-reference"
    resource: "https://learn.microsoft.com/en-us/linkedin/marketing/integrations/ads/account-structure/create-and-manage-campaign-groups"
    title: "LinkedIn Marketing API reference — create-and-manage-campaign-groups"
---

## Connector endpoint

- **Endpoint:** LinkedIn Ads · `adCampaignGroups`
- **Default destination table:** `linkedin_ads_ad_campaign_groups`
- **Unique keys:** `id`
- **Time series:** no, one current row per key

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `account` | STRING | Account | URN identifying the advertising account associated with the campaign. This value is immutable once set. For example, urn:li:SponsoredAccount:{id}. |
| `accountInfo` | JSON | AccountInfo | Information about the advertising account associated with the campaign. This is a read only field. Please refer to Additional Info Fields to learn how to access this field. |
| `backfilled` | BOOLEAN | Backfilled | Flag that denotes whether the campaign group was created organically or to backfill existing campaigns. This is a read-only field set by the system. |
| `id` | STRING | ID | PK. Numerical identifier for the campaign group. This is a read-only field set by the system. |
| `name` | STRING | Name | The name of the campaign group used to make it easier to reference a campaign group and recall its purpose. The value of this field cannot exceed 100 characters. |
| `runSchedule` | JSON | RunSchedule | Scheduled date range to run associated campaigns under this campaign group. The start date must be non-null. Represents the inclusive (greater than or equal to) value in which to start the range. The end date is optional and if unset, it indicates an open range with no end date. This field is required if totalBudget is set. |
| `servingStatuses` | JSON | ServingStatuses | Array of enums that determine whether or not campaigns within the campaign group may be served. Unlike status, which is user-managed, the values are controlled by the service. This is a read-only field. Possible values are:RUNNABLE Campaign group is currently active; billing information, budgetary constraints, or start and end dates are valid. |
| `status` | STRING | Status | Status of campaign group. Possible values are:ACTIVE - Denotes that the campaign group is capable of serving ads, subject to run date and budget limitations (as well as any other limitations at the account or campaign level). |
| `totalBudget` | JSON | TotalBudget | If budgetOptimization.budgetOptimizationStrategy is DYNAMIC, the total budget of the campaign group will be shared among all campaigns within the same campaign group. Otherwise, it represents the maximum amount to be spent over the life of the campaign group. The amount of money as a real number string. The currency must match the ISO currency code of the account. |
| `test` | BOOLEAN | Test | Flag showing whether this campaign group is a test campaign group, i.e., belongs to a test account. This is a read-only and immutable field that is set implicitly during creation based on whether the account is a Test Account or not. |
| `allowedCampaignTypes` | JSON | AllowedCampaignTypes | Array of enums that indicates allowed campaign types within the specific campaign group. Possible values are:TEXT_AD - Text-based ads that show up in the right column or top of the page on LinkedIn. |
| `objectiveType` | STRING | ObjectiveType | Campaign Group Objective type values. This field is optional and immutable. Campaigns in this group will automatically have the same objective type. Click here for Objective descriptionsBRAND_AWARENESS |
| `budgetOptimization` | JSON | BudgetOptimization | Denotes the strategy used for bidding in auction and budget optimization across campaigns under the campaign group. Campaigns under the campaign group must have the same bid strategy. Possible values for bidStrategy: MAXIMUM_DELIVERY. Possible values for budgetOptimizationStrategy: DYNAMIC. |
| `dailyBudget` | NUMERIC | DailyBudget | Daily budget for the campaign group and will be shared among all campaigns within the campaign group. This field is optional and mutable. It can only be used if budgetOptimization.budgetOptimizationStrategy is DYNAMIC Note: This field applies to API Versions starting from 202504 and later. |

# Example Questions

- Which campaign groups are active, and what objective type does each have?
- Which campaign groups have a daily budget, and how large is it?
- How many campaign groups are test groups?

## Joins

- [Ad Accounts](./ad-accounts.md) — `account = id` [N:1] — The ad account the campaign group belongs to; the value is a URN such as urn:li:sponsoredAccount:{id}. The column holds the URN, so it matches the id inside it, not the whole string.
  - Description: The ad account the campaign group belongs to; the value is a URN such as urn:li:sponsoredAccount:{id}. The column holds the URN, so it matches the id inside it, not the whole string.
