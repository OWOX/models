---
title: "Open Exchange Rates"
description: "OWOX data mart 'Open Exchange Rates'."
tags: ["owox"]
type: "OWOX Data Mart"
timestamp: 2026-07-24T07:00:48.000Z
---

# Schema

| Column | Type | Description |
|--------|------|-------------|
| `date` | DATE | PK. Date of exchange rate |
| `base` | STRING | PK. Base currency |
| `currency` | STRING | PK. Target currency |
| `rate` | FLOAT | Exchange rate |
