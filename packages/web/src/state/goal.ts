export interface BusinessGoal {
  niche: string;
  goal: string;
}

export interface NichePreset {
  id: string;
  label: string;
  goals: string[];
}

// Default verticals and five non-trivial goals each (from the design spec).
export const NICHE_PRESETS: NichePreset[] = [
  {
    id: "ecommerce",
    label: "E-commerce / Retail",
    goals: [
      "Increase ROAS while holding CPC",
      "Lower CAC at equal order volume",
      "Raise repeat-purchase rate / LTV",
      "Reduce cart abandonment",
      "Optimise margin by product category",
    ],
  },
  {
    id: "saas",
    label: "SaaS / Subscription",
    goals: [
      "Reduce monthly churn / raise retention",
      "Grow expansion revenue (NRR)",
      "Shorten time-to-value",
      "Raise trial-to-paid conversion",
      "Reduce CAC payback period",
    ],
  },
  {
    id: "leadgen",
    label: "Lead-gen / B2B services",
    goals: [
      "Improve lead-to-SQL-to-deal conversion",
      "Lower cost per qualified lead",
      "Shorten sales-cycle length",
      "Raise average deal size",
      "Improve channel attribution to closed deals",
    ],
  },
  {
    id: "mobile",
    label: "Mobile app / Gaming",
    goals: [
      "Raise D1/D7/D30 retention",
      "Grow ARPDAU",
      "Lower CPI at equal user quality",
      "Raise payer conversion",
      "Optimise the onboarding funnel",
    ],
  },
  {
    id: "finance",
    label: "Finance / Fintech",
    goals: [
      "Lower cost to acquire an active customer",
      "Raise account activation / usage",
      "Reduce fraud / chargeback rate",
      "Grow cross-product adoption",
      "Improve approval-to-funding conversion",
    ],
  },
];

const KEY = "mc.goal.v1";

export function loadGoal(): BusinessGoal | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.niche === "string" && typeof parsed.goal === "string") {
      return { niche: parsed.niche, goal: parsed.goal };
    }
    return null;
  } catch {
    return null;
  }
}

export function persistGoal(goal: BusinessGoal | null): void {
  try {
    if (goal === null) localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, JSON.stringify(goal));
  } catch {
    // best-effort; ignore quota / private-mode failures
  }
}
