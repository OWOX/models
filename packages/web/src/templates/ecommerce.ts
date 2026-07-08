import type { ModelGraph } from "@mc/okf";
import { f, mart, rel, type Template } from "./helpers";

// E-commerce / Retail — Kimball-style sales star. fct_order_items is the lowest
// grain (order × SKU) where true line margin lives; fct_orders keeps the header
// totals; sessions and returns hang off the same conformed customer/product dims.
const graph: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_customer", "Customer", "VIEW", [
      f("customer_id", "STRING", true, "Surrogate customer key."),
      f("email", "STRING", false, "Primary contact address used for login and outreach."),
      f("country", "STRING", false, "Customer's country, used for geo segmentation."),
      f("region", "STRING", false, "Sub-national region or state within the country."),
      f("acquisition_channel", "STRING", false, "First-touch channel that won the customer."),
      f("first_order_date", "DATE", false, "Date of the customer's very first purchase."),
      f("rfm_segment", "STRING", false, "Recency-Frequency-Monetary segment (e.g. Champions, At-risk)."),
      f("lifetime_orders", "INTEGER", false, "Total count of orders placed to date."),
      f("lifetime_gmv", "FLOAT", false, "Cumulative gross merchandise value across all orders."),
      f("is_subscriber", "BOOLEAN", false, "Whether the customer holds an active subscription."),
    ], "One row per customer. Conformed dimension with acquisition and RFM/LTV attributes."),
    mart("dim_product", "Product", "VIEW", [
      f("product_id", "STRING", true, "Surrogate product key."),
      f("sku", "STRING", false, "Stock-keeping unit code that identifies the sellable item."),
      f("name", "STRING", false, "Display name of the product."),
      f("category", "STRING", false, "Top-level category in the product hierarchy."),
      f("subcategory", "STRING", false, "Second-level grouping within the category."),
      f("brand", "STRING", false, "Manufacturer or brand label."),
      f("unit_cost", "FLOAT", false, "Landed cost — needed for line margin."),
      f("list_price", "FLOAT", false, "Standard catalog selling price before discounts."),
      f("is_active", "BOOLEAN", false, "Whether the SKU is currently available for sale."),
    ], "One row per sellable SKU with the category hierarchy and unit cost."),
    mart("fct_orders", "Orders", "VIEW", [
      f("order_id", "STRING", true, "Unique identifier for the order."),
      f("customer_id", "STRING", false, "Buyer."),
      f("order_ts", "TIMESTAMP", false, "Moment the order was placed."),
      f("channel", "STRING", false, "Sales channel through which the order came in."),
      f("status", "STRING", false, "Current fulfillment state (e.g. paid, shipped, cancelled)."),
      f("items_count", "INTEGER", false, "Number of line items in the order."),
      f("gross_revenue", "FLOAT", false, "Order value before discounts, shipping and tax."),
      f("discount_amount", "FLOAT", false, "Total discounts applied to the order."),
      f("shipping_fee", "FLOAT", false, "Shipping charged to the customer."),
      f("tax_amount", "FLOAT", false, "Tax collected on the order."),
      f("net_revenue", "FLOAT", false, "Gross − discount + shipping − tax."),
      f("is_first_order", "BOOLEAN", false, "Drives new-vs-returning revenue splits."),
    ], "Order-header grain: one row per order with totals, discounts, shipping and status."),
    mart("fct_order_items", "Order Items", "VIEW", [
      f("order_item_id", "STRING", true, "Unique identifier for the order line."),
      f("order_id", "STRING", false, "Parent order."),
      f("product_id", "STRING", false, "SKU sold."),
      f("quantity", "INTEGER", false, "Units of the product sold on this line."),
      f("unit_price", "FLOAT", false, "Price charged per unit on this line."),
      f("unit_cost", "FLOAT", false, "Cost per unit at time of sale."),
      f("discount_amount", "FLOAT", false, "Discount applied to this line."),
      f("line_revenue", "FLOAT", false, "Revenue for the line — unit_price × quantity less discount."),
      f("line_margin", "FLOAT", false, "(unit_price − unit_cost) × qty − discount."),
    ], "Lowest sales grain (order × SKU). The table for margin and basket analysis."),
    mart("fct_sessions", "Web Sessions", "CONNECTOR", [
      f("session_id", "STRING", true, "Unique identifier for the web/app session."),
      f("customer_id", "STRING", false, "Null for anonymous visitors."),
      f("started_at", "TIMESTAMP", false, "Moment the session began."),
      f("source", "STRING", false, "Traffic source that referred the session."),
      f("medium", "STRING", false, "Marketing medium (e.g. organic, cpc, email)."),
      f("campaign", "STRING", false, "Campaign that drove the session."),
      f("device", "STRING", false, "Device type used (e.g. mobile, desktop, tablet)."),
      f("landing_page", "STRING", false, "First page viewed in the session."),
      f("pageviews", "INTEGER", false, "Count of pages viewed during the session."),
      f("add_to_cart", "BOOLEAN", false, "Whether an item was added to the cart."),
      f("reached_checkout", "BOOLEAN", false, "Whether the visitor reached the checkout step."),
      f("converted", "BOOLEAN", false, "Whether the session ended in a purchase."),
    ], "One row per web/app session from the analytics stream — funnel and acquisition source."),
    mart("fct_returns", "Returns", "VIEW", [
      f("return_id", "STRING", true, "Unique identifier for the return."),
      f("order_item_id", "STRING", false, "Returned line."),
      f("product_id", "STRING", false, "SKU that was returned."),
      f("returned_at", "DATE", false, "Date the return was processed."),
      f("quantity", "INTEGER", false, "Units returned on this line."),
      f("refund_amount", "FLOAT", false, "Amount refunded to the customer."),
      f("reason", "STRING", false, "Stated reason for the return."),
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

export const ecommerce: Template = {
  id: "ecommerce",
  nicheId: "ecommerce",
  category: "industry",
  name: "E-commerce / Retail",
  description: "Sales star schema: order & line-item margin, web sessions and returns over conformed customer/product dimensions.",
  graph,
};
