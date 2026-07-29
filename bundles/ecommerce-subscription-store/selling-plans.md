---
title: "Selling Plans"
description: |
  The subscription offers the store sells against — every cadence a customer can choose, the
  discount attached to it, and whether it is paid per delivery or upfront for several
  deliveries at once. Because the plan carries both the delivery rhythm and the discount, the
  cost of the subscription programme and the retention it buys can be judged offer by offer
  rather than as one blended number.

  Two families of offer live here, and they behave differently in every report: pay-as-you-go
  ("subscribe & save"), where the customer is charged on each delivery, and prepaid, where a
  single payment covers a fixed number of future deliveries. Prepaid revenue arrives in one
  lump and its churn shows up much later, which is exactly why the plan type has to be
  explicit rather than inferred.
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-29T14:33:10.000Z
---

# Schema

| Column | Type | Alias | Description |
|--------|------|-------|-------------|
| `selling_plan_id` | STRING | Selling Plan ID | PK. Unique identifier of the subscription offer a customer can subscribe to. |
| `plan_name` | STRING | Plan Name | Customer-facing name of the offer, such as Monthly Subscribe & Save or Prepaid 3-Month. |
| `plan_type` | STRING | Plan Type | Whether the customer pays on every delivery (Pay-as-you-go) or upfront for several deliveries (Prepaid). |
| `delivery_interval_unit` | STRING | Delivery Interval Unit | Unit the delivery rhythm is expressed in, such as week or month. |
| `delivery_interval_count` | INTEGER | Delivery Interval Count | Number of interval units between two deliveries, for example 2 with a unit of week means every two weeks. |
| `delivery_interval_days` | INTEGER | Delivery Interval Days | Delivery rhythm normalised to days, so cadences expressed in weeks and months can be compared directly. |
| `prepaid_cycles` | INTEGER | Prepaid Cycles | Number of deliveries covered by a single upfront payment; zero for pay-as-you-go offers. |
| `discount_pct` | FLOAT | Discount % | Discount off the one-time price granted for subscribing on this plan, in percent. |
| `is_skippable` | BOOLEAN | Is Skippable | Whether the subscriber is allowed to skip an upcoming delivery instead of cancelling. |
| `is_active` | BOOLEAN | Is Active | Whether the offer is currently available to new subscribers. |

# Example Questions

- Which delivery cadence retains subscribers longest, and does the answer change once the discount given away is taken into account?
- How does prepaid compare with pay-as-you-go on revenue per subscriber and on how long subscribers stay?
- Are the deepest discounts going to the plans that actually produce the most lifetime value, or just the most sign-ups?
