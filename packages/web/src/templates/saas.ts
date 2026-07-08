import type { ModelGraph } from "@mc/okf";
import { f, mart, rel, type Template } from "./helpers";

// SaaS / Subscription — B2B recurring-revenue model. The centrepiece is
// fct_subscription_events: one row per MRR movement, which reconstructs the
// new/expansion/contraction/churn waterfall and feeds NRR/GRR. Usage, invoices
// and support hang off the account dimension as leading churn/expansion signals.
//
// Goal coverage (niche "saas"):
//   NRR > 110%              → fct_subscription_events.mrr_delta by event_type
//   90-day churn            → fct_subscription_events × dim_account.signup_date
//   trial-to-paid           → fct_trials (is_converted) × fct_subscription_events
//   CAC payback < 12m       → fct_marketing_spend × new-business MRR by channel cohort
//   expansion MRR           → fct_subscription_events (upgrades) + fct_usage_daily signals
const graph: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_account", "Account", "VIEW", [
      f("account_id", "STRING", true, "Unique account identifier."),
      f("name", "STRING", false, "Company/account name."),
      f("industry", "STRING", false, "Industry vertical of the account."),
      f("employee_band", "STRING", false, "Company-size bucket by headcount."),
      f("plan_tier", "STRING", false, "Subscription plan tier."),
      f("mrr_band", "STRING", false, "Monthly-recurring-revenue size bucket."),
      f("region", "STRING", false, "Sales/geographic region."),
      f("acquisition_channel", "STRING", false, "Marketing channel that sourced the account — blended-CAC join key."),
      f("signup_date", "DATE", false, "Date the account first signed up."),
      f("csm_owner", "STRING", false, "Customer success manager who owns the account."),
      f("health_score", "INTEGER", false, "0–100 product-health composite."),
      f("lifecycle_stage", "STRING", false, "trial / active / at-risk / churned."),
    ], "One row per customer account (company). Firmographics, plan tier and health."),
    mart("dim_user", "User", "VIEW", [
      f("user_id", "STRING", true, "Unique user identifier."),
      f("account_id", "STRING", false, "Owning account."),
      f("email", "STRING", false, "User's email address."),
      f("role", "STRING", false, "User's role within the account."),
      f("seat_type", "STRING", false, "Type of seat assigned (e.g. full / viewer)."),
      f("invited_at", "TIMESTAMP", false, "When the user was invited."),
      f("last_active_at", "TIMESTAMP", false, "Most recent activity timestamp."),
      f("is_active", "BOOLEAN", false, "Whether the seat is currently active."),
    ], "One row per user seat within an account."),
    mart("fct_subscription_events", "Subscription Events", "VIEW", [
      f("event_id", "STRING", true, "Unique subscription-event identifier."),
      f("account_id", "STRING", false, "Account the event belongs to."),
      f("event_ts", "TIMESTAMP", false, "When the subscription change occurred."),
      f("event_type", "STRING", false, "new / upgrade / downgrade / reactivation / churn."),
      f("plan_from", "STRING", false, "Plan before the change."),
      f("plan_to", "STRING", false, "Plan after the change."),
      f("mrr_delta", "NUMERIC", false, "Signed MRR change — the MRR-movement waterfall."),
      f("seats_delta", "INTEGER", false, "Signed change in seat count."),
      f("mrr_after", "NUMERIC", false, "Total MRR after the change."),
    ], "One row per subscription change. Reconstructs the MRR waterfall and NRR/GRR."),
    mart("fct_invoices", "Invoices", "VIEW", [
      f("invoice_id", "STRING", true, "Unique invoice identifier."),
      f("account_id", "STRING", false, "Account billed."),
      f("issued_at", "DATE", false, "Date the invoice was issued."),
      f("period_start", "DATE", false, "Start of the billing period."),
      f("period_end", "DATE", false, "End of the billing period."),
      f("amount", "NUMERIC", false, "Invoice amount before tax."),
      f("tax", "NUMERIC", false, "Tax charged on the invoice."),
      f("status", "STRING", false, "Payment status of the invoice."),
      f("paid_at", "DATE", false, "Date the invoice was paid."),
      f("is_failed", "BOOLEAN", false, "Failed payment — involuntary-churn signal."),
    ], "One row per invoice. Billing, collections and dunning."),
    mart("fct_usage_daily", "Usage (daily)", "CONNECTOR", [
      f("usage_id", "STRING", true, "Unique daily-usage record identifier."),
      f("account_id", "STRING", false, "Account that generated the usage."),
      f("user_id", "STRING", false, "User that generated the usage."),
      f("usage_date", "DATE", false, "Calendar day of the usage."),
      f("active_minutes", "INTEGER", false, "Minutes the user was active in-product."),
      f("key_actions", "INTEGER", false, "Count of high-value actions taken."),
      f("feature_adoption_score", "FLOAT", false, "Breadth of features touched — activation signal."),
    ], "One row per account × user × day of product usage. Engagement and activation."),
    mart("fct_support_tickets", "Support Tickets", "VIEW", [
      f("ticket_id", "STRING", true, "Unique support-ticket identifier."),
      f("account_id", "STRING", false, "Account that opened the ticket."),
      f("opened_at", "TIMESTAMP", false, "When the ticket was opened."),
      f("closed_at", "TIMESTAMP", false, "When the ticket was closed."),
      f("priority", "STRING", false, "Ticket priority level."),
      f("category", "STRING", false, "Ticket topic/category."),
      f("csat_score", "INTEGER", false, "Customer satisfaction rating for the ticket."),
      f("first_response_mins", "INTEGER", false, "Minutes to first agent response."),
    ], "One row per support ticket — CSAT and churn-risk signal."),
    mart("fct_trials", "Trials", "VIEW", [
      f("trial_id", "STRING", true, "Unique trial identifier."),
      f("account_id", "STRING", false, "Account running the trial."),
      f("started_at", "TIMESTAMP", false, "When the trial began."),
      f("ends_at", "TIMESTAMP", false, "Scheduled trial expiry."),
      f("converted_at", "TIMESTAMP", false, "When the trial converted to a paid plan, if it did."),
      f("is_converted", "BOOLEAN", false, "Trial-to-paid outcome flag."),
      f("trial_source", "STRING", false, "Where the trial came from (self-serve, sales-assisted, PLG upsell)."),
      f("requested_plan", "STRING", false, "Plan tier the trial is evaluating."),
    ], "One row per trial. Trial-to-paid conversion without discounting."),
    mart("fct_marketing_spend", "Marketing Spend", "CONNECTOR", [
      f("spend_id", "STRING", true, "Unique identifier for each spend record."),
      f("spend_date", "DATE", false, "Day the spend was incurred."),
      f("channel", "STRING", false, "Marketing channel where the cost was spent — joins account acquisition cohorts."),
      f("campaign", "STRING", false, "Campaign the spend belongs to."),
      f("cost", "NUMERIC", false, "Money spent — the CAC numerator."),
      f("leads", "INTEGER", false, "Leads generated by the spend."),
      f("signups", "INTEGER", false, "Accounts created — CAC denominator."),
    ], "One row per channel × campaign × day of spend. CAC and payback by cohort."),
  ],
  edges: [
    rel("e1", "dim_user", "dim_account", "account_id", "account_id"),
    rel("e2", "fct_subscription_events", "dim_account", "account_id", "account_id"),
    rel("e3", "fct_invoices", "dim_account", "account_id", "account_id"),
    rel("e4", "fct_usage_daily", "dim_account", "account_id", "account_id"),
    rel("e5", "fct_usage_daily", "dim_user", "user_id", "user_id"),
    rel("e6", "fct_support_tickets", "dim_account", "account_id", "account_id"),
    rel("e7", "fct_trials", "dim_account", "account_id", "account_id"),
    rel("e8", "fct_marketing_spend", "dim_account", "channel", "acquisition_channel", "N:N"),
  ],
};

export const saas: Template = {
  id: "saas",
  nicheId: "saas",
  category: "industry",
  name: "SaaS / Subscription",
  description: "Recurring revenue: accounts, seats, MRR-movement events, trials, marketing spend (CAC), invoices, daily usage and support.",
  graph,
};
