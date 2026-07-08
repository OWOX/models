import type { ModelGraph } from "@mc/okf";
import { f, mart, rel, type Template } from "./helpers";

// B2B Sales / RevOps — CRM pipeline model, the shape of a Salesforce rollup.
// fct_opportunities is the deal header; fct_stage_transitions its movement
// history (cycle length, slippage); fct_opportunity_products the line items
// behind ACV; activities and quota attainment close the rep-productivity loop.
//
// Goal coverage (niche "b2b_sales"):
//   win rate w/o discounts  → fct_opportunities (is_won, discount_pct) by segment
//   cycle bottlenecks       → fct_stage_transitions.days_in_from_stage
//   forecast & slippage     → fct_opportunities.forecast_category × close_date shifts
//   quota attainment/ramp   → fct_quota_attainment × dim_rep.is_ramped
//   ACV via multi-product   → fct_opportunity_products line mix per deal
const graph: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_account", "Account", "VIEW", [
      f("account_id", "STRING", true, "Unique account identifier."),
      f("name", "STRING", false, "Company name."),
      f("industry", "STRING", false, "Industry vertical of the account."),
      f("employee_band", "STRING", false, "Company-size bucket by headcount."),
      f("region", "STRING", false, "Sales region of the account."),
      f("segment", "STRING", false, "Sales segment: SMB, mid-market, enterprise."),
    ], "One row per target company. The segment axis for win-rate and cycle cuts."),
    mart("dim_rep", "Sales Rep", "TABLE", [
      f("rep_id", "STRING", true, "Unique sales-rep identifier."),
      f("name", "STRING", false, "Rep's name."),
      f("team", "STRING", false, "Team or pod the rep belongs to."),
      f("region", "STRING", false, "Territory the rep covers."),
      f("hired_at", "DATE", false, "Date the rep joined — ramp-time anchor."),
      f("is_ramped", "BOOLEAN", false, "Whether the rep has completed ramp."),
    ], "One row per quota-carrying rep."),
    mart("dim_product", "Product", "TABLE", [
      f("product_id", "STRING", true, "Unique product identifier."),
      f("name", "STRING", false, "Product display name."),
      f("family", "STRING", false, "Product family — the multi-product attach axis."),
      f("list_price", "NUMERIC", false, "Standard list price before discounting."),
    ], "Reference of sellable products."),
    mart("fct_opportunities", "Opportunities", "VIEW", [
      f("opportunity_id", "STRING", true, "Unique opportunity identifier."),
      f("account_id", "STRING", false, "Account the deal is with."),
      f("rep_id", "STRING", false, "Rep who owns the deal."),
      f("created_at", "DATE", false, "Date the opportunity was opened."),
      f("stage", "STRING", false, "Current pipeline stage."),
      f("forecast_category", "STRING", false, "commit / best-case / pipeline — forecast accuracy reads from here."),
      f("amount", "NUMERIC", false, "Deal size (ACV)."),
      f("discount_pct", "FLOAT", false, "Discount granted vs list — the margin-erosion lever."),
      f("close_date", "DATE", false, "Expected or actual close date — slippage shows as shifts here."),
      f("is_won", "BOOLEAN", false, "Whether the deal closed won."),
      f("sales_cycle_days", "INTEGER", false, "Days from creation to close."),
    ], "One row per deal. Win rate, forecast category, ACV and cycle length."),
    mart("fct_opportunity_products", "Opportunity Lines", "VIEW", [
      f("line_id", "STRING", true, "Unique identifier for the deal line item."),
      f("opportunity_id", "STRING", false, "Deal the line belongs to."),
      f("product_id", "STRING", false, "Product on the line."),
      f("quantity", "INTEGER", false, "Units or seats on the line."),
      f("line_amount", "NUMERIC", false, "Line value — multi-product ACV mix."),
    ], "One row per product line on a deal. The multi-product attach grain."),
    mart("fct_stage_transitions", "Stage Transitions", "VIEW", [
      f("transition_id", "STRING", true, "Unique identifier for the stage change."),
      f("opportunity_id", "STRING", false, "Deal that moved stage."),
      f("from_stage", "STRING", false, "Stage the deal left."),
      f("to_stage", "STRING", false, "Stage the deal entered."),
      f("transitioned_at", "TIMESTAMP", false, "When the move happened."),
      f("days_in_from_stage", "INTEGER", false, "Days spent in the previous stage — the bottleneck metric."),
    ], "One row per stage change. Cycle bottlenecks and slippage."),
    mart("fct_activities", "Activities", "CONNECTOR", [
      f("activity_id", "STRING", true, "Unique activity identifier."),
      f("opportunity_id", "STRING", false, "Deal the activity relates to."),
      f("rep_id", "STRING", false, "Rep who performed the activity."),
      f("activity_ts", "TIMESTAMP", false, "When the activity happened."),
      f("activity_type", "STRING", false, "Kind of touch: call, meeting, email, demo."),
      f("duration_mins", "INTEGER", false, "Time spent on the activity."),
    ], "One row per sales activity — effort behind pipeline movement."),
    mart("fct_quota_attainment", "Quota Attainment", "VIEW", [
      f("attainment_id", "STRING", true, "Unique identifier for the rep-quarter record."),
      f("rep_id", "STRING", false, "Rep being measured."),
      f("quarter", "STRING", false, "Fiscal quarter of the record."),
      f("quota", "NUMERIC", false, "Quota assigned for the quarter."),
      f("closed_won", "NUMERIC", false, "Revenue closed in the quarter."),
      f("attainment_pct", "FLOAT", false, "closed_won ÷ quota."),
      f("pipeline_coverage", "FLOAT", false, "Open pipeline ÷ remaining quota — forecast health."),
    ], "One row per rep × quarter. Attainment and pipeline coverage."),
  ],
  edges: [
    rel("e1", "fct_opportunities", "dim_account", "account_id", "account_id"),
    rel("e2", "fct_opportunities", "dim_rep", "rep_id", "rep_id"),
    rel("e3", "fct_opportunity_products", "fct_opportunities", "opportunity_id", "opportunity_id"),
    rel("e4", "fct_opportunity_products", "dim_product", "product_id", "product_id"),
    rel("e5", "fct_stage_transitions", "fct_opportunities", "opportunity_id", "opportunity_id"),
    rel("e6", "fct_activities", "fct_opportunities", "opportunity_id", "opportunity_id"),
    rel("e7", "fct_activities", "dim_rep", "rep_id", "rep_id"),
    rel("e8", "fct_quota_attainment", "dim_rep", "rep_id", "rep_id"),
  ],
};

export const b2b_sales: Template = {
  id: "b2b_sales",
  nicheId: "b2b_sales",
  category: "industry",
  name: "B2B Sales / RevOps",
  description: "CRM pipeline: accounts, reps, products, opportunities with stage history, deal lines (ACV mix), activities and quota attainment.",
  graph,
};
