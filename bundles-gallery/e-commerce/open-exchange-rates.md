---
type: "OWOX Data Mart"
title: "Open Exchange Rates"
description: "OWOX data mart 'Open Exchange Rates'."
tags: ["owox"]
timestamp: 2026-07-23T07:00:52.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | PK. Date of exchange rate |
| `base` | STRING | PK. Base currency |
| `currency` | STRING | PK. Target currency |
| `rate` | FLOAT | Exchange rate |
