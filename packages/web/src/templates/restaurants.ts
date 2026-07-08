import type { ModelGraph } from "@mc/okf";
import { f, mart, rel, type Template } from "./helpers";

// Restaurants / QSR — POS + operations model. fct_orders/fct_order_items are
// the check and item grains (menu engineering, aggregator commission);
// fct_labor_shifts pairs labor cost with hourly sales; fct_store_days is the
// same-store rollup ops reviews run on; waste closes the food-cost loop.
//
// Goal coverage (niche "restaurants"):
//   same-store sales/check  → fct_store_days (net_sales, avg_check) same-store cohorts
//   food-cost % / menu eng  → fct_order_items (line_food_cost) × dim_menu_item price/cost
//   labor % vs hourly sales → fct_labor_shifts (labor_cost, sales_during_shift)
//   aggregator drag         → fct_orders (order_channel, aggregator_commission)
//   waste & shrink          → fct_waste_events (reason, waste_cost) × dim_menu_item
const graph: ModelGraph = {
  storageId: null,
  nodes: [
    mart("dim_location", "Location", "TABLE", [
      f("location_id", "STRING", true, "Unique location identifier."),
      f("name", "STRING", false, "Store name or number."),
      f("city", "STRING", false, "City the store operates in."),
      f("format", "STRING", false, "Store format: dine-in, QSR, dark kitchen."),
      f("opened_at", "DATE", false, "Opening date — same-store comparisons need ≥13 months."),
      f("seats", "INTEGER", false, "Seating capacity, zero for dark kitchens."),
    ], "One row per restaurant location."),
    mart("dim_menu_item", "Menu Item", "TABLE", [
      f("item_id", "STRING", true, "Unique menu-item identifier."),
      f("name", "STRING", false, "Menu-item name."),
      f("category", "STRING", false, "Menu category (mains, sides, drinks, desserts)."),
      f("station", "STRING", false, "Kitchen station that prepares the item."),
      f("menu_price", "NUMERIC", false, "Menu price of the item."),
      f("food_cost", "NUMERIC", false, "Ingredient cost — menu-engineering margin input."),
      f("is_active", "BOOLEAN", false, "Whether the item is currently on the menu."),
    ], "One row per menu item with price and food cost — the menu-engineering grid."),
    mart("dim_daypart", "Daypart", "TABLE", [
      f("daypart_id", "STRING", true, "Unique daypart identifier."),
      f("name", "STRING", false, "Daypart name: breakfast, lunch, dinner, late-night."),
      f("start_hour", "INTEGER", false, "Hour the daypart starts."),
      f("end_hour", "INTEGER", false, "Hour the daypart ends."),
    ], "Reference of dayparts for traffic and staffing cuts."),
    mart("fct_orders", "Orders", "CONNECTOR", [
      f("order_id", "STRING", true, "Unique order/check identifier."),
      f("location_id", "STRING", false, "Store that took the order."),
      f("daypart_id", "STRING", false, "Daypart the order landed in."),
      f("ordered_at", "TIMESTAMP", false, "When the order was placed."),
      f("order_channel", "STRING", false, "dine-in / takeout / first-party app / aggregator."),
      f("aggregator_name", "STRING", false, "Delivery platform when the order came via aggregator."),
      f("guests_count", "INTEGER", false, "Guests on the check — average-check denominator."),
      f("subtotal", "NUMERIC", false, "Check subtotal before discounts."),
      f("discounts", "NUMERIC", false, "Discounts and comps applied."),
      f("aggregator_commission", "NUMERIC", false, "Commission paid to the platform — the drag being cut."),
      f("tips", "NUMERIC", false, "Tips collected on the check."),
    ], "One row per check. Channel mix and aggregator commission."),
    mart("fct_order_items", "Order Items", "CONNECTOR", [
      f("line_id", "STRING", true, "Unique identifier for the check line."),
      f("order_id", "STRING", false, "Check the line belongs to."),
      f("item_id", "STRING", false, "Menu item sold."),
      f("quantity", "INTEGER", false, "Units of the item on the line."),
      f("unit_price", "NUMERIC", false, "Price charged per unit."),
      f("line_food_cost", "NUMERIC", false, "Ingredient cost of the line — food-cost % numerator."),
    ], "One row per check line. Item velocity and margin — menu engineering."),
    mart("fct_labor_shifts", "Labor Shifts", "VIEW", [
      f("shift_id", "STRING", true, "Unique identifier for the store-day-daypart labor record."),
      f("location_id", "STRING", false, "Store the shift covers."),
      f("shift_date", "DATE", false, "Calendar day of the shift."),
      f("daypart_id", "STRING", false, "Daypart the shift covers."),
      f("scheduled_hours", "FLOAT", false, "Labor hours scheduled."),
      f("actual_hours", "FLOAT", false, "Labor hours actually worked."),
      f("labor_cost", "NUMERIC", false, "Wages paid for the shift — labor % numerator."),
      f("sales_during_shift", "NUMERIC", false, "Sales rung during the shift — labor % denominator."),
    ], "One row per store × day × daypart of labor vs sales."),
    mart("fct_waste_events", "Waste Events", "VIEW", [
      f("waste_id", "STRING", true, "Unique waste-event identifier."),
      f("location_id", "STRING", false, "Store where the waste was recorded."),
      f("item_id", "STRING", false, "Menu item or ingredient wasted."),
      f("recorded_at", "DATE", false, "Day the waste was logged."),
      f("reason", "STRING", false, "Waste reason: spoilage, prep error, comp."),
      f("quantity", "INTEGER", false, "Units wasted."),
      f("waste_cost", "NUMERIC", false, "Cost of the waste — shrink on high-cost ingredients."),
    ], "One row per logged waste event."),
    mart("fct_store_days", "Store Days", "VIEW", [
      f("store_day_id", "STRING", true, "Unique identifier for the store-day rollup."),
      f("location_id", "STRING", false, "Store the day covers."),
      f("business_date", "DATE", false, "Business day."),
      f("net_sales", "NUMERIC", false, "Net sales for the day — same-store sales base."),
      f("orders_count", "INTEGER", false, "Checks closed during the day."),
      f("avg_check", "NUMERIC", false, "net_sales ÷ orders_count."),
      f("labor_cost_pct", "FLOAT", false, "Labor cost as a share of net sales."),
      f("food_cost_pct", "FLOAT", false, "Food cost as a share of net sales."),
    ], "One row per store × business day. The ops-review rollup."),
  ],
  edges: [
    rel("e1", "fct_orders", "dim_location", "location_id", "location_id"),
    rel("e2", "fct_orders", "dim_daypart", "daypart_id", "daypart_id"),
    rel("e3", "fct_order_items", "fct_orders", "order_id", "order_id"),
    rel("e4", "fct_order_items", "dim_menu_item", "item_id", "item_id"),
    rel("e5", "fct_labor_shifts", "dim_location", "location_id", "location_id"),
    rel("e6", "fct_labor_shifts", "dim_daypart", "daypart_id", "daypart_id"),
    rel("e7", "fct_waste_events", "dim_location", "location_id", "location_id"),
    rel("e8", "fct_waste_events", "dim_menu_item", "item_id", "item_id"),
    rel("e9", "fct_store_days", "dim_location", "location_id", "location_id"),
  ],
};

export const restaurants: Template = {
  id: "restaurants",
  nicheId: "restaurants",
  category: "industry",
  name: "Restaurants / QSR",
  description: "POS & operations: locations, menu items with food cost, dayparts, checks & lines (menu engineering), labor vs sales, waste and store-day rollups.",
  graph,
};
