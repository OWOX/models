import type { ModelGraph } from "@mc/okf";
import { f, mart, rel, type Template } from "./helpers";

// B2B Marketing / Lead-gen — spend + funnel model. fct_ad_spend gives the cost
// side by channel/campaign; fct_touchpoints records each marketing touch with a
// per-touch credit weight; the funnel runs dim_lead → fct_opportunities
// (MQL → SQL → Closed-Won) so spend can be tied to closed revenue.
const graph: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_campaign", "Campaign", "TABLE", [
      f("campaign_id", "STRING", true, "Unique identifier for each campaign."),
      f("campaign_name", "STRING", false, "Human-readable name of the campaign."),
      f("channel", "STRING", false, "Marketing channel the campaign runs on (e.g. paid search, social, email)."),
      f("objective", "STRING", false, "Primary goal of the campaign (e.g. awareness, lead generation)."),
      f("utm_source", "STRING", false, "UTM source tag identifying where the traffic originates."),
      f("utm_medium", "STRING", false, "UTM medium tag describing the type of traffic (e.g. cpc, email)."),
      f("start_date", "DATE", false, "Date the campaign went live."),
    ], "Reference of campaigns with channel, objective and UTM tags."),
    mart("fct_ad_spend", "Ad Spend", "CONNECTOR", [
      f("spend_id", "STRING", true, "Unique identifier for each spend record."),
      f("spend_date", "DATE", false, "Day the spend was incurred."),
      f("campaign_id", "STRING", false, "Campaign this spend belongs to."),
      f("channel", "STRING", false, "Marketing channel where the cost was spent."),
      f("ad_group", "STRING", false, "Ad group or ad set within the campaign."),
      f("impressions", "INTEGER", false, "Number of times ads were shown."),
      f("clicks", "INTEGER", false, "Number of clicks the ads received."),
      f("cost", "FLOAT", false, "Money spent on this ad group for the day."),
    ], "One row per campaign × ad-group × day. Cross-channel cost, impressions, clicks."),
    mart("dim_lead", "Lead", "VIEW", [
      f("lead_id", "STRING", true, "Unique identifier for each lead or contact."),
      f("created_at", "TIMESTAMP", false, "When the lead first entered the system."),
      f("source_channel", "STRING", false, "Channel that first brought in the lead."),
      f("lead_score", "INTEGER", false, "Fit + engagement score for MQL gating."),
      f("company_size_band", "STRING", false, "Bucketed size of the lead's company (e.g. 1-50, 51-200)."),
      f("industry", "STRING", false, "Industry the lead's company operates in."),
      f("country", "STRING", false, "Country where the lead is located."),
      f("lifecycle_stage", "STRING", false, "subscriber / MQL / SQL / opportunity / customer."),
    ], "One row per lead/contact. Source, score and firmographics."),
    mart("fct_touchpoints", "Touchpoints", "CONNECTOR", [
      f("touchpoint_id", "STRING", true, "Unique identifier for each marketing touch."),
      f("lead_id", "STRING", false, "Lead that this touch belongs to."),
      f("campaign_id", "STRING", false, "Campaign associated with this touch."),
      f("occurred_at", "TIMESTAMP", false, "When the touch happened."),
      f("channel", "STRING", false, "Channel where the touch occurred."),
      f("touch_type", "STRING", false, "Kind of interaction (e.g. ad click, form fill, email open)."),
      f("touch_credit", "FLOAT", false, "Credit assigned to this marketing touch (sums to 1 per lead)."),
      f("is_first_touch", "BOOLEAN", false, "True if this was the lead's very first touch."),
      f("is_lead_create", "BOOLEAN", false, "True if this touch created the lead."),
    ], "One row per marketing touch on the path to conversion."),
    mart("fct_opportunities", "Opportunities", "VIEW", [
      f("opportunity_id", "STRING", true, "Unique identifier for each sales opportunity."),
      f("lead_id", "STRING", false, "Lead that the opportunity originated from."),
      f("created_at", "DATE", false, "Date the opportunity was created."),
      f("stage", "STRING", false, "Current stage in the sales pipeline."),
      f("is_mql", "BOOLEAN", false, "True if the lead reached marketing-qualified status."),
      f("is_sql", "BOOLEAN", false, "True if the lead reached sales-qualified status."),
      f("amount", "FLOAT", false, "ACV / deal size."),
      f("close_date", "DATE", false, "Date the opportunity was won or lost."),
      f("is_won", "BOOLEAN", false, "True if the deal was won."),
      f("sales_cycle_days", "INTEGER", false, "Number of days from creation to close."),
      f("owner", "STRING", false, "Sales rep who owns the opportunity."),
    ], "One row per sales opportunity. Pipeline stage, ACV and win/loss."),
  ],
  edges: [
    rel("e1", "fct_ad_spend", "dim_campaign", "campaign_id", "campaign_id"),
    rel("e2", "fct_touchpoints", "dim_campaign", "campaign_id", "campaign_id"),
    rel("e3", "fct_touchpoints", "dim_lead", "lead_id", "lead_id"),
    rel("e4", "fct_opportunities", "dim_lead", "lead_id", "lead_id"),
  ],
};

export const marketing_ads: Template = {
  id: "marketing_ads",
  nicheId: "leadgen",
  category: "industry",
  name: "Marketing / Lead-gen",
  description: "B2B funnel: cross-channel ad spend, campaigns, marketing touchpoints, leads and pipeline opportunities.",
  graph,
};
