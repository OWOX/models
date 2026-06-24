import type { ModelGraph, ModelNode, ModelEdge, InputSource, SchemaField } from "@mc/okf";

// ── tiny authoring helpers ─────────────────────────────────────────────────
const f = (name: string, type: string, pk = false, description?: string): SchemaField =>
  ({ name, type, pk, ...(description ? { description } : {}) });
const mart = (
  key: string,
  title: string,
  inputSource: InputSource,
  schema: SchemaField[],
  description?: string,
): ModelNode =>
  ({ key, title, inputSource, description, schema, position: { x: 0, y: 0 }, status: "pending", owoxId: null });
// Edges carry cardinality so the ERD/OKF export reads like a real star schema.
// Default N:1 because the common case is a fact row pointing at one dimension.
const rel = (
  id: string,
  from: string,
  to: string,
  left: string,
  right: string,
  cardinality: ModelEdge["cardinality"] = "N:1",
  bidirectional = false,
): ModelEdge => ({ id, from, to, keys: [{ left, right }], bidirectional, cardinality });

export interface Template {
  id: string;
  name: string;
  description: string;
  graph: ModelGraph;
}

// Templates are authored as ModelGraph (the same shape OKF encodes), so they
// round-trip to an OKF bundle via Export OKF. Positions are 0,0 — the canvas
// runs Dagre auto-layout when a template is loaded.

// E-commerce / Retail — Kimball-style sales star. fct_order_items is the lowest
// grain (order × SKU) where true line margin lives; fct_orders keeps the header
// totals; sessions and returns hang off the same conformed customer/product dims.
const ecommerce: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_customer", "Customer", "VIEW", [
      f("customer_id", "STRING", true, "Surrogate customer key."),
      f("email", "STRING"),
      f("country", "STRING"), f("region", "STRING"),
      f("acquisition_channel", "STRING", false, "First-touch channel that won the customer."),
      f("first_order_date", "DATE"),
      f("rfm_segment", "STRING", false, "Recency-Frequency-Monetary segment (e.g. Champions, At-risk)."),
      f("lifetime_orders", "INTEGER"), f("lifetime_gmv", "FLOAT"),
      f("is_subscriber", "BOOLEAN"),
    ], "One row per customer. Conformed dimension with acquisition and RFM/LTV attributes."),
    mart("dim_product", "Product", "VIEW", [
      f("product_id", "STRING", true), f("sku", "STRING"),
      f("name", "STRING"), f("category", "STRING"), f("subcategory", "STRING"), f("brand", "STRING"),
      f("unit_cost", "FLOAT", false, "Landed cost — needed for line margin."),
      f("list_price", "FLOAT"), f("is_active", "BOOLEAN"),
    ], "One row per sellable SKU with the category hierarchy and unit cost."),
    mart("fct_orders", "Orders", "VIEW", [
      f("order_id", "STRING", true), f("customer_id", "STRING", false, "Buyer."),
      f("order_ts", "TIMESTAMP"), f("channel", "STRING"), f("status", "STRING"),
      f("items_count", "INTEGER"),
      f("gross_revenue", "FLOAT"), f("discount_amount", "FLOAT"),
      f("shipping_fee", "FLOAT"), f("tax_amount", "FLOAT"),
      f("net_revenue", "FLOAT", false, "Gross − discount + shipping − tax."),
      f("is_first_order", "BOOLEAN", false, "Drives new-vs-returning revenue splits."),
    ], "Order-header grain: one row per order with totals, discounts, shipping and status."),
    mart("fct_order_items", "Order Items", "VIEW", [
      f("order_item_id", "STRING", true), f("order_id", "STRING", false, "Parent order."),
      f("product_id", "STRING", false, "SKU sold."),
      f("quantity", "INTEGER"), f("unit_price", "FLOAT"), f("unit_cost", "FLOAT"),
      f("discount_amount", "FLOAT"),
      f("line_revenue", "FLOAT"), f("line_margin", "FLOAT", false, "(unit_price − unit_cost) × qty − discount."),
    ], "Lowest sales grain (order × SKU). The table for margin and basket analysis."),
    mart("fct_sessions", "Web Sessions", "CONNECTOR", [
      f("session_id", "STRING", true), f("customer_id", "STRING", false, "Null for anonymous visitors."),
      f("started_at", "TIMESTAMP"),
      f("source", "STRING"), f("medium", "STRING"), f("campaign", "STRING"),
      f("device", "STRING"), f("landing_page", "STRING"),
      f("pageviews", "INTEGER"),
      f("add_to_cart", "BOOLEAN"), f("reached_checkout", "BOOLEAN"), f("converted", "BOOLEAN"),
    ], "One row per web/app session from the analytics stream — funnel and acquisition source."),
    mart("fct_returns", "Returns", "VIEW", [
      f("return_id", "STRING", true), f("order_item_id", "STRING", false, "Returned line."),
      f("product_id", "STRING"),
      f("returned_at", "DATE"), f("quantity", "INTEGER"),
      f("refund_amount", "FLOAT"), f("reason", "STRING"),
    ], "One row per returned line — drives net margin and return-rate by category."),
  ],
  edges: [
    rel("e1", "fct_orders", "dim_customer", "customer_id", "customer_id"),
    rel("e2", "fct_order_items", "fct_orders", "order_id", "order_id"),
    rel("e3", "fct_order_items", "dim_product", "product_id", "product_id"),
    rel("e4", "fct_sessions", "dim_customer", "customer_id", "customer_id"),
    rel("e5", "fct_returns", "fct_order_items", "order_item_id", "order_item_id"),
    rel("e6", "fct_returns", "dim_product", "product_id", "product_id"),
  ],
};

// SaaS / Subscription — B2B recurring-revenue model. The centrepiece is
// fct_subscription_events: one row per MRR movement, which reconstructs the
// new/expansion/contraction/churn waterfall and feeds NRR/GRR. Usage, invoices
// and support hang off the account dimension as leading churn/expansion signals.
const saas: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_account", "Account", "VIEW", [
      f("account_id", "STRING", true), f("name", "STRING"),
      f("industry", "STRING"), f("employee_band", "STRING"),
      f("plan_tier", "STRING"), f("mrr_band", "STRING"),
      f("region", "STRING"), f("signup_date", "DATE"),
      f("csm_owner", "STRING"),
      f("health_score", "INTEGER", false, "0–100 product-health composite."),
      f("lifecycle_stage", "STRING", false, "trial / active / at-risk / churned."),
    ], "One row per customer account (company). Firmographics, plan tier and health."),
    mart("dim_user", "User", "VIEW", [
      f("user_id", "STRING", true), f("account_id", "STRING", false, "Owning account."),
      f("email", "STRING"), f("role", "STRING"), f("seat_type", "STRING"),
      f("invited_at", "TIMESTAMP"), f("last_active_at", "TIMESTAMP"),
      f("is_active", "BOOLEAN"),
    ], "One row per user seat within an account."),
    mart("fct_subscription_events", "Subscription Events", "VIEW", [
      f("event_id", "STRING", true), f("account_id", "STRING"),
      f("event_ts", "TIMESTAMP"),
      f("event_type", "STRING", false, "new / upgrade / downgrade / reactivation / churn."),
      f("plan_from", "STRING"), f("plan_to", "STRING"),
      f("mrr_delta", "FLOAT", false, "Signed MRR change — the MRR-movement waterfall."),
      f("seats_delta", "INTEGER"), f("mrr_after", "FLOAT"),
    ], "One row per subscription change. Reconstructs the MRR waterfall and NRR/GRR."),
    mart("fct_invoices", "Invoices", "VIEW", [
      f("invoice_id", "STRING", true), f("account_id", "STRING"),
      f("issued_at", "DATE"), f("period_start", "DATE"), f("period_end", "DATE"),
      f("amount", "FLOAT"), f("tax", "FLOAT"), f("status", "STRING"),
      f("paid_at", "DATE"),
      f("is_failed", "BOOLEAN", false, "Failed payment — involuntary-churn signal."),
    ], "One row per invoice. Billing, collections and dunning."),
    mart("fct_usage_daily", "Usage (daily)", "CONNECTOR", [
      f("usage_id", "STRING", true),
      f("account_id", "STRING"), f("user_id", "STRING"),
      f("usage_date", "DATE"),
      f("active_minutes", "INTEGER"), f("key_actions", "INTEGER"),
      f("feature_adoption_score", "FLOAT", false, "Breadth of features touched — activation signal."),
    ], "One row per account × user × day of product usage. Engagement and activation."),
    mart("fct_support_tickets", "Support Tickets", "VIEW", [
      f("ticket_id", "STRING", true), f("account_id", "STRING"),
      f("opened_at", "TIMESTAMP"), f("closed_at", "TIMESTAMP"),
      f("priority", "STRING"), f("category", "STRING"),
      f("csat_score", "INTEGER"), f("first_response_mins", "INTEGER"),
    ], "One row per support ticket — CSAT and churn-risk signal."),
  ],
  edges: [
    rel("e1", "dim_user", "dim_account", "account_id", "account_id"),
    rel("e2", "fct_subscription_events", "dim_account", "account_id", "account_id"),
    rel("e3", "fct_invoices", "dim_account", "account_id", "account_id"),
    rel("e4", "fct_usage_daily", "dim_account", "account_id", "account_id"),
    rel("e5", "fct_usage_daily", "dim_user", "user_id", "user_id"),
    rel("e6", "fct_support_tickets", "dim_account", "account_id", "account_id"),
  ],
};

// Finance / Fintech — neobank + lending model. Two fact streams sit side by
// side: fct_transactions (card/money movement → engagement, interchange, fraud)
// and the lending funnel fct_loans → fct_repayments (origination, pull-through,
// DPD and charge-off). KYC/risk attributes live on the customer dimension.
const finance: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_customer", "Customer", "VIEW", [
      f("customer_id", "STRING", true),
      f("signup_date", "DATE"),
      f("kyc_status", "STRING", false, "passed / pending / rejected."),
      f("risk_band", "STRING"), f("credit_score", "INTEGER"),
      f("acquisition_channel", "STRING"), f("region", "STRING"),
      f("is_funded", "BOOLEAN", false, "Has at least one funded account — activation flag."),
    ], "One row per customer with KYC, risk band and acquisition."),
    mart("dim_product", "Product", "TABLE", [
      f("product_id", "STRING", true), f("name", "STRING"),
      f("product_type", "STRING", false, "deposit / card / loan / BNPL."),
      f("apr", "FLOAT"), f("term_months", "INTEGER"),
    ], "Reference of financial products."),
    mart("fct_accounts", "Accounts", "VIEW", [
      f("account_id", "STRING", true),
      f("customer_id", "STRING"), f("product_id", "STRING"),
      f("opened_at", "DATE"), f("status", "STRING"),
      f("current_balance", "FLOAT"),
      f("activated_at", "DATE", false, "First funding / first card use."),
      f("is_active", "BOOLEAN"),
    ], "One row per opened product holding. Balances and activation state."),
    mart("fct_transactions", "Transactions", "CONNECTOR", [
      f("txn_id", "STRING", true), f("account_id", "STRING"),
      f("txn_ts", "TIMESTAMP"),
      f("txn_type", "STRING"), f("mcc", "STRING", false, "Merchant category code."),
      f("amount", "FLOAT"), f("currency", "STRING"),
      f("is_declined", "BOOLEAN"),
      f("fraud_score", "FLOAT", false, "Model score at authorization time."),
      f("channel", "STRING"),
    ], "One row per money movement / card authorization. Engagement, interchange and fraud."),
    mart("fct_loans", "Loans", "VIEW", [
      f("loan_id", "STRING", true),
      f("customer_id", "STRING"), f("product_id", "STRING"),
      f("applied_at", "DATE"),
      f("decision", "STRING", false, "approved / declined / withdrawn."),
      f("approved_amount", "FLOAT"),
      f("funded_amount", "FLOAT", false, "Approved → funded is the pull-through rate."),
      f("apr", "FLOAT"), f("term_months", "INTEGER"),
      f("funded_at", "DATE"), f("status", "STRING"),
    ], "One row per loan application → origination. Underwriting funnel and pull-through."),
    mart("fct_repayments", "Repayments", "VIEW", [
      f("repayment_id", "STRING", true), f("loan_id", "STRING"),
      f("due_date", "DATE"), f("paid_date", "DATE"),
      f("due_amount", "FLOAT"), f("paid_amount", "FLOAT"),
      f("days_past_due", "INTEGER", false, "DPD bucket driver for delinquency."),
      f("is_charged_off", "BOOLEAN"),
    ], "One row per scheduled repayment. Delinquency (DPD) and charge-off."),
  ],
  edges: [
    rel("e1", "fct_accounts", "dim_customer", "customer_id", "customer_id"),
    rel("e2", "fct_accounts", "dim_product", "product_id", "product_id"),
    rel("e3", "fct_transactions", "fct_accounts", "account_id", "account_id"),
    rel("e4", "fct_loans", "dim_customer", "customer_id", "customer_id"),
    rel("e5", "fct_loans", "dim_product", "product_id", "product_id"),
    rel("e6", "fct_repayments", "fct_loans", "loan_id", "loan_id"),
  ],
};

// Healthcare provider — operational + revenue-cycle model. fct_appointments
// carries scheduling (no-show, wait, lead time); fct_encounters the clinical
// visit (LOS, 30-day readmission); fct_claims the revenue cycle (denials, AR
// days) against the payer dimension. Patient and provider are conformed dims.
const medical: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_patient", "Patient", "VIEW", [
      f("patient_id", "STRING", true),
      f("birth_year", "INTEGER"), f("gender", "STRING"), f("postal_code", "STRING"),
      f("insurance_type", "STRING", false, "commercial / Medicare / Medicaid / self-pay."),
      f("risk_tier", "STRING", false, "Risk-stratification band for care management."),
      f("registered_at", "DATE"),
    ], "One row per patient. De-identified demographics and risk stratification."),
    mart("dim_provider", "Provider", "TABLE", [
      f("provider_id", "STRING", true), f("full_name", "STRING"),
      f("specialty", "STRING"), f("department", "STRING"),
      f("npi", "STRING", false, "National Provider Identifier."),
    ], "One row per clinician/provider."),
    mart("dim_payer", "Payer", "TABLE", [
      f("payer_id", "STRING", true), f("name", "STRING"),
      f("plan_type", "STRING", false, "HMO / PPO / EPO / government."),
    ], "Reference of insurance payers / plans."),
    mart("fct_appointments", "Appointments", "VIEW", [
      f("appointment_id", "STRING", true),
      f("patient_id", "STRING"), f("provider_id", "STRING"),
      f("scheduled_at", "TIMESTAMP"), f("department", "STRING"), f("status", "STRING"),
      f("is_no_show", "BOOLEAN"),
      f("wait_minutes", "INTEGER", false, "Door-to-provider wait."),
      f("lead_time_days", "INTEGER", false, "Booking-to-visit lead time — no-show driver."),
    ], "One row per scheduled appointment. No-show, wait time and utilization."),
    mart("fct_encounters", "Encounters", "VIEW", [
      f("encounter_id", "STRING", true),
      f("appointment_id", "STRING"), f("patient_id", "STRING"), f("provider_id", "STRING"),
      f("admit_ts", "TIMESTAMP"), f("discharge_ts", "TIMESTAMP"),
      f("encounter_type", "STRING", false, "outpatient / inpatient / ED."),
      f("primary_diagnosis", "STRING", false, "Primary ICD-10 code."),
      f("length_of_stay_days", "FLOAT"),
      f("is_readmission_30d", "BOOLEAN", false, "Unplanned readmission within 30 days."),
    ], "One row per clinical encounter. Diagnoses, length-of-stay and readmission."),
    mart("fct_claims", "Claims", "VIEW", [
      f("claim_id", "STRING", true), f("encounter_id", "STRING"), f("payer_id", "STRING"),
      f("submitted_at", "DATE"), f("paid_at", "DATE"),
      f("billed_amount", "FLOAT"), f("allowed_amount", "FLOAT"), f("paid_amount", "FLOAT"),
      f("status", "STRING"),
      f("denial_code", "STRING", false, "CARC/RARC denial reason, when denied."),
      f("ar_days", "INTEGER", false, "Days in accounts receivable — revenue-cycle speed."),
    ], "One row per claim line. Revenue cycle, denials and AR days."),
  ],
  edges: [
    rel("e1", "fct_appointments", "dim_patient", "patient_id", "patient_id"),
    rel("e2", "fct_appointments", "dim_provider", "provider_id", "provider_id"),
    rel("e3", "fct_encounters", "fct_appointments", "appointment_id", "appointment_id"),
    rel("e4", "fct_encounters", "dim_patient", "patient_id", "patient_id"),
    rel("e5", "fct_claims", "fct_encounters", "encounter_id", "encounter_id"),
    rel("e6", "fct_claims", "dim_payer", "payer_id", "payer_id"),
  ],
};

// Marketplace / Platform — two-sided model. Supply (sellers, listings) and
// demand (buyers, search) are deliberately separate branches; fct_orders is the
// match where they meet, carrying GMV, take rate and fill. Liquidity = the rate
// at which search requests and listings convert into completed orders.
const marketplace: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_buyer", "Buyer", "VIEW", [
      f("buyer_id", "STRING", true), f("signup_date", "DATE"),
      f("acquisition_channel", "STRING"), f("region", "STRING"), f("segment", "STRING"),
      f("lifetime_orders", "INTEGER"),
      f("is_repeat", "BOOLEAN", false, "Made 2+ orders — demand-side retention."),
    ], "Demand side: one row per buyer."),
    mart("dim_seller", "Seller", "VIEW", [
      f("seller_id", "STRING", true), f("onboarded_at", "DATE"),
      f("category", "STRING"), f("region", "STRING"),
      f("rating", "FLOAT"), f("active_listings", "INTEGER"),
      f("is_activated", "BOOLEAN", false, "Reached first sale — supply activation."),
      f("fulfillment_type", "STRING"),
    ], "Supply side: one row per seller/supplier."),
    mart("fct_listings", "Listings", "VIEW", [
      f("listing_id", "STRING", true), f("seller_id", "STRING"),
      f("created_at", "TIMESTAMP"), f("category", "STRING"),
      f("price", "FLOAT"), f("status", "STRING"),
      f("is_available", "BOOLEAN", false, "Live inventory — supply availability."),
    ], "One row per listing/offer. Supply inventory and availability."),
    mart("fct_search_requests", "Search Requests", "CONNECTOR", [
      f("request_id", "STRING", true), f("buyer_id", "STRING"),
      f("requested_at", "TIMESTAMP"), f("query", "STRING"), f("category", "STRING"),
      f("results_count", "INTEGER"), f("clicked", "BOOLEAN"), f("converted", "BOOLEAN"),
      f("time_to_match_mins", "FLOAT", false, "Search → transaction latency."),
    ], "One row per search/browse request. Demand and match-quality signal."),
    mart("fct_orders", "Orders", "VIEW", [
      f("order_id", "STRING", true),
      f("buyer_id", "STRING"), f("seller_id", "STRING"), f("listing_id", "STRING"),
      f("ordered_at", "TIMESTAMP"),
      f("gmv", "FLOAT", false, "Gross merchandise value."),
      f("take_rate", "FLOAT", false, "Platform's cut as a fraction of GMV."),
      f("platform_revenue", "FLOAT", false, "gmv × take_rate."),
      f("status", "STRING"), f("is_fulfilled", "BOOLEAN"),
      f("fulfillment_mins", "FLOAT", false, "Order-to-fulfilment time — fill speed."),
    ], "The match: one row per completed transaction. GMV, take rate and fill."),
    mart("fct_reviews", "Reviews", "VIEW", [
      f("review_id", "STRING", true), f("order_id", "STRING"),
      f("rating", "INTEGER"), f("created_at", "TIMESTAMP"),
      f("has_complaint", "BOOLEAN"),
    ], "One row per post-transaction review. Trust and retention signal."),
  ],
  edges: [
    rel("e1", "fct_listings", "dim_seller", "seller_id", "seller_id"),
    rel("e2", "fct_search_requests", "dim_buyer", "buyer_id", "buyer_id"),
    rel("e3", "fct_orders", "dim_buyer", "buyer_id", "buyer_id"),
    rel("e4", "fct_orders", "dim_seller", "seller_id", "seller_id"),
    rel("e5", "fct_orders", "fct_listings", "listing_id", "listing_id"),
    rel("e6", "fct_reviews", "fct_orders", "order_id", "order_id"),
  ],
};

// Mobile / Gaming — free-to-play telemetry model. fct_sessions/fct_events are
// the high-volume engagement streams (retention, FTUE funnel); monetization
// splits into fct_iap_purchases (ARPPU, payer conversion) and fct_ad_impressions
// (ad ARPDAU). fct_ua_spend closes the loop on CPI and D7 ROAS by campaign.
const mobile_gaming: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_player", "Player", "VIEW", [
      f("player_id", "STRING", true), f("install_ts", "TIMESTAMP"),
      f("platform", "STRING"), f("country", "STRING"),
      f("acquisition_source", "STRING"), f("campaign", "STRING", false, "UA campaign — joins to spend."),
      f("is_payer", "BOOLEAN"), f("ltv", "FLOAT"), f("last_active_date", "DATE"),
    ], "One row per player/install. Acquisition, device and LTV state."),
    mart("fct_sessions", "Sessions", "CONNECTOR", [
      f("session_id", "STRING", true), f("player_id", "STRING"),
      f("started_at", "TIMESTAMP"), f("ended_at", "TIMESTAMP"),
      f("session_length_secs", "INTEGER"),
      f("level_reached", "INTEGER"),
      f("day_number", "INTEGER", false, "Days since install — powers D1/D7/D30 retention."),
    ], "One row per game session. Engagement, retention and session length."),
    mart("fct_events", "Events", "CONNECTOR", [
      f("event_id", "STRING", true),
      f("player_id", "STRING"), f("session_id", "STRING"),
      f("event_ts", "TIMESTAMP"),
      f("event_name", "STRING", false, "tutorial_step / level_complete / store_open …"),
      f("level", "INTEGER"), f("value", "FLOAT"),
    ], "One row per gameplay/telemetry event. FTUE funnel and feature usage."),
    mart("fct_iap_purchases", "IAP Purchases", "VIEW", [
      f("purchase_id", "STRING", true), f("player_id", "STRING"),
      f("purchased_at", "TIMESTAMP"), f("product_sku", "STRING"),
      f("price_usd", "FLOAT"), f("currency", "STRING"), f("store", "STRING"),
      f("is_first_purchase", "BOOLEAN", false, "Payer-conversion event."),
    ], "One row per in-app purchase. Monetization, ARPPU and payer conversion."),
    mart("fct_ad_impressions", "Ad Impressions", "CONNECTOR", [
      f("impression_id", "STRING", true), f("player_id", "STRING"),
      f("shown_at", "TIMESTAMP"),
      f("ad_format", "STRING", false, "rewarded / interstitial / banner."),
      f("placement", "STRING"),
      f("revenue_usd", "FLOAT", false, "Estimated ad revenue — ad ARPDAU."),
      f("network", "STRING"),
    ], "One row per ad impression. Ad monetization and ARPDAU."),
    mart("fct_ua_spend", "UA Spend", "VIEW", [
      f("spend_id", "STRING", true), f("spend_date", "DATE"),
      f("network", "STRING"), f("campaign", "STRING"), f("country", "STRING"),
      f("installs", "INTEGER"), f("spend_usd", "FLOAT"),
      f("impressions", "INTEGER"), f("clicks", "INTEGER"),
    ], "One row per campaign × day of user-acquisition spend. CPI and D7 ROAS."),
  ],
  edges: [
    rel("e1", "fct_sessions", "dim_player", "player_id", "player_id"),
    rel("e2", "fct_events", "dim_player", "player_id", "player_id"),
    rel("e3", "fct_events", "fct_sessions", "session_id", "session_id"),
    rel("e4", "fct_iap_purchases", "dim_player", "player_id", "player_id"),
    rel("e5", "fct_ad_impressions", "dim_player", "player_id", "player_id"),
    rel("e6", "fct_ua_spend", "dim_player", "campaign", "campaign", "N:N"),
  ],
};

// B2B Marketing / Lead-gen — spend + funnel model. fct_ad_spend gives the cost
// side by channel/campaign; fct_touchpoints records each marketing touch with a
// per-touch credit weight; the funnel runs dim_lead → fct_opportunities
// (MQL → SQL → Closed-Won) so spend can be tied to closed revenue.
const marketing_ads: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_campaign", "Campaign", "TABLE", [
      f("campaign_id", "STRING", true), f("campaign_name", "STRING"),
      f("channel", "STRING"), f("objective", "STRING"),
      f("utm_source", "STRING"), f("utm_medium", "STRING"), f("start_date", "DATE"),
    ], "Reference of campaigns with channel, objective and UTM tags."),
    mart("fct_ad_spend", "Ad Spend", "CONNECTOR", [
      f("spend_id", "STRING", true), f("spend_date", "DATE"),
      f("campaign_id", "STRING"), f("channel", "STRING"), f("ad_group", "STRING"),
      f("impressions", "INTEGER"), f("clicks", "INTEGER"), f("cost", "FLOAT"),
    ], "One row per campaign × ad-group × day. Cross-channel cost, impressions, clicks."),
    mart("dim_lead", "Lead", "VIEW", [
      f("lead_id", "STRING", true), f("created_at", "TIMESTAMP"),
      f("source_channel", "STRING"),
      f("lead_score", "INTEGER", false, "Fit + engagement score for MQL gating."),
      f("company_size_band", "STRING"), f("industry", "STRING"), f("country", "STRING"),
      f("lifecycle_stage", "STRING", false, "subscriber / MQL / SQL / opportunity / customer."),
    ], "One row per lead/contact. Source, score and firmographics."),
    mart("fct_touchpoints", "Touchpoints", "CONNECTOR", [
      f("touchpoint_id", "STRING", true),
      f("lead_id", "STRING"), f("campaign_id", "STRING"),
      f("occurred_at", "TIMESTAMP"), f("channel", "STRING"), f("touch_type", "STRING"),
      f("touch_credit", "FLOAT", false, "Credit assigned to this marketing touch (sums to 1 per lead)."),
      f("is_first_touch", "BOOLEAN"), f("is_lead_create", "BOOLEAN"),
    ], "One row per marketing touch on the path to conversion."),
    mart("fct_opportunities", "Opportunities", "VIEW", [
      f("opportunity_id", "STRING", true), f("lead_id", "STRING"),
      f("created_at", "DATE"), f("stage", "STRING"),
      f("is_mql", "BOOLEAN"), f("is_sql", "BOOLEAN"),
      f("amount", "FLOAT", false, "ACV / deal size."),
      f("close_date", "DATE"), f("is_won", "BOOLEAN"),
      f("sales_cycle_days", "INTEGER"), f("owner", "STRING"),
    ], "One row per sales opportunity. Pipeline stage, ACV and win/loss."),
  ],
  edges: [
    rel("e1", "fct_ad_spend", "dim_campaign", "campaign_id", "campaign_id"),
    rel("e2", "fct_touchpoints", "dim_campaign", "campaign_id", "campaign_id"),
    rel("e3", "fct_touchpoints", "dim_lead", "lead_id", "lead_id"),
    rel("e4", "fct_opportunities", "dim_lead", "lead_id", "lead_id"),
  ],
};

const crypto_bitcoin: ModelGraph = {
  storageId: null,
  nodes: [
    mart("blocks", "Blocks", "TABLE", [
      f("hash", "STRING", true), f("number", "INTEGER"), f("size", "INTEGER"), f("weight", "INTEGER"),
      f("version", "INTEGER"), f("merkle_root", "STRING"), f("timestamp", "TIMESTAMP"),
      f("nonce", "STRING"), f("bits", "STRING"), f("transaction_count", "INTEGER"),
    ]),
    mart("transactions", "Transactions", "TABLE", [
      f("hash", "STRING", true), f("size", "INTEGER"), f("virtual_size", "INTEGER"), f("version", "INTEGER"),
      f("lock_time", "INTEGER"), f("block_hash", "STRING"), f("block_number", "INTEGER"),
      f("block_timestamp", "TIMESTAMP"), f("input_count", "INTEGER"), f("output_count", "INTEGER"),
      f("input_value", "NUMERIC"), f("output_value", "NUMERIC"), f("is_coinbase", "BOOLEAN"), f("fee", "NUMERIC"),
    ]),
    mart("inputs", "Inputs", "TABLE", [
      f("transaction_hash", "STRING"), f("block_hash", "STRING"), f("block_number", "INTEGER"),
      f("block_timestamp", "TIMESTAMP"), f("index", "INTEGER", true), f("spent_transaction_hash", "STRING"),
      f("spent_output_index", "INTEGER"), f("script_asm", "STRING"), f("sequence", "INTEGER"),
      f("type", "STRING"), f("value", "NUMERIC"),
    ]),
    mart("outputs", "Outputs", "TABLE", [
      f("transaction_hash", "STRING"), f("block_hash", "STRING"), f("block_number", "INTEGER"),
      f("block_timestamp", "TIMESTAMP"), f("index", "INTEGER", true), f("script_asm", "STRING"),
      f("type", "STRING"), f("value", "NUMERIC"),
    ]),
  ],
  edges: [
    rel("e1", "transactions", "blocks", "block_hash", "hash"),
    rel("e2", "inputs", "transactions", "transaction_hash", "hash"),
    rel("e3", "outputs", "transactions", "transaction_hash", "hash"),
  ],
};

const stackoverflow: ModelGraph = {
  storageId: null,
  nodes: [
    mart("users", "Users", "TABLE", [
      f("id", "INTEGER", true), f("display_name", "STRING"), f("reputation", "INTEGER"),
      f("creation_date", "TIMESTAMP"), f("location", "STRING"), f("up_votes", "INTEGER"), f("down_votes", "INTEGER"),
    ]),
    mart("posts_questions", "Posts Questions", "TABLE", [
      f("id", "INTEGER", true), f("title", "STRING"), f("body", "STRING"), f("owner_user_id", "INTEGER"),
      f("creation_date", "TIMESTAMP"), f("score", "INTEGER"), f("view_count", "INTEGER"),
      f("answer_count", "INTEGER"), f("tags", "STRING"),
    ]),
    mart("posts_answers", "Posts Answers", "TABLE", [
      f("id", "INTEGER", true), f("parent_id", "INTEGER"), f("owner_user_id", "INTEGER"),
      f("body", "STRING"), f("creation_date", "TIMESTAMP"), f("score", "INTEGER"),
    ]),
    mart("comments", "Comments", "TABLE", [
      f("id", "INTEGER", true), f("post_id", "INTEGER"), f("user_id", "INTEGER"),
      f("text", "STRING"), f("creation_date", "TIMESTAMP"), f("score", "INTEGER"),
    ]),
    mart("votes", "Votes", "TABLE", [
      f("id", "INTEGER", true), f("post_id", "INTEGER"), f("vote_type_id", "INTEGER"), f("creation_date", "TIMESTAMP"),
    ]),
    mart("badges", "Badges", "TABLE", [
      f("id", "INTEGER", true), f("user_id", "INTEGER"), f("name", "STRING"), f("date", "TIMESTAMP"), f("class", "INTEGER"),
    ]),
    mart("tags", "Tags", "TABLE", [
      f("id", "INTEGER", true), f("tag_name", "STRING"), f("count", "INTEGER"), f("excerpt_post_id", "INTEGER"),
    ]),
  ],
  edges: [
    rel("e1", "posts_questions", "users", "owner_user_id", "id"),
    rel("e2", "posts_answers", "posts_questions", "parent_id", "id"),
    rel("e3", "posts_answers", "users", "owner_user_id", "id"),
    rel("e4", "comments", "posts_questions", "post_id", "id"),
    rel("e5", "comments", "users", "user_id", "id"),
    rel("e6", "votes", "posts_questions", "post_id", "id"),
    rel("e7", "badges", "users", "user_id", "id"),
  ],
};

export const TEMPLATES: Template[] = [
  { id: "ecommerce", name: "E-commerce / Retail", description: "Sales star schema: order & line-item margin, web sessions and returns over conformed customer/product dimensions.", graph: ecommerce },
  { id: "saas", name: "SaaS / Subscription", description: "Recurring revenue: accounts, seats, MRR-movement events, invoices, daily product usage and support.", graph: saas },
  { id: "marketplace", name: "Marketplace", description: "Two-sided platform: buyers, sellers, listings, search demand, GMV/take-rate orders and reviews.", graph: marketplace },
  { id: "marketing_ads", name: "Marketing / Lead-gen", description: "B2B funnel: cross-channel ad spend, campaigns, marketing touchpoints, leads and pipeline opportunities.", graph: marketing_ads },
  { id: "mobile_gaming", name: "Mobile / Gaming", description: "Free-to-play telemetry: players, sessions, events, IAP, ad impressions and user-acquisition spend.", graph: mobile_gaming },
  { id: "finance", name: "Finance / Fintech", description: "Neobank & lending: customers (KYC/risk), accounts, transactions, loan origination and repayments.", graph: finance },
  { id: "medical", name: "Healthcare", description: "Provider analytics: patients, providers, appointments, encounters (LOS/readmission) and claims/denials.", graph: medical },
  { id: "crypto_bitcoin", name: "Bitcoin (crypto)", description: "Blocks, transactions, inputs and outputs from the public Bitcoin BigQuery dataset.", graph: crypto_bitcoin },
  { id: "stackoverflow", name: "Stack Overflow", description: "Users, questions, answers, comments, votes, badges and tags from the public Stack Overflow BigQuery dataset.", graph: stackoverflow },
];
