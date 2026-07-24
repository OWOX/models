import { describe, it, expect } from "vitest";
import { parseBundle } from "../src/parse";

const martWithBlockDescription = `---
type: "OWOX Data Mart"
title: "Customers"
description: |
  A B2B subscription software business modeled end to end — from the marketing that brings
  accounts in, through trials, subscriptions and seat expansion.
tags: ["owox", "view"]
---

# Customers

## Overview
- **ID:** \`abc-123\`
- **Status:** PUBLISHED
- **Definition type:** VIEW

# Schema

| Column | Type | Description |
|--------|------|-------------|
| \`id\` | INTEGER | PK. Customer id |
`;

describe("parseBundle (block-scalar description)", () => {
  it("imports a multi-line | description on a mart file instead of dropping it to '|'", () => {
    const g = parseBundle({ "b/customers.md": martWithBlockDescription });
    expect(g.nodes[0].description).toBe(
      "A B2B subscription software business modeled end to end — from the marketing that brings\naccounts in, through trials, subscriptions and seat expansion."
    );
  });
});
