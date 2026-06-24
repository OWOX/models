export interface BusinessGoal {
  niche: string;
  goal: string;
}

export interface NichePreset {
  id: string;
  label: string;
  goals: string[];
}

// Ten verticals with five sharp, metric-driven goals each. These feed the AI
// "Insight Questions" — phrased as the levers a senior analyst would actually
// chase (named KPIs, cohorts and funnel stages), not generic aspirations.
export const NICHE_PRESETS: NichePreset[] = [
  {
    id: "ecommerce",
    label: "E-commerce / Retail",
    goals: [
      "Increase ROAS while holding CPC",
      "Lift contribution margin per order after shipping & returns",
      "Raise 90-day repeat-purchase rate and cohort LTV",
      "Cut return/refund rate on high-AOV categories",
      "Recover revenue lost to cart & checkout abandonment",
    ],
  },
  {
    id: "saas",
    label: "SaaS / Subscription",
    goals: [
      "Lift Net Revenue Retention (NRR) above 110%",
      "Cut logo & gross-revenue churn in the first 90 days",
      "Raise trial-to-paid conversion without discounting",
      "Shorten CAC payback below 12 months",
      "Grow expansion MRR from seat & usage upsell",
    ],
  },
  {
    id: "leadgen",
    label: "B2B Marketing / Lead-gen",
    goals: [
      "Improve MQL → SQL → Closed-Won conversion across the funnel",
      "Lower blended cost per SQL by channel",
      "Tie cross-channel touchpoints to closed-won revenue",
      "Shorten sales-cycle length for mid-market deals",
      "Raise pipeline velocity (deals × win-rate × ACV ÷ cycle)",
    ],
  },
  {
    id: "mobile_gaming",
    label: "Mobile App / Gaming",
    goals: [
      "Raise D1 / D7 / D30 retention curves",
      "Grow ARPDAU without hurting retention",
      "Lift payer conversion and ARPPU",
      "Lower CPI while holding D7 ROAS on install quality",
      "De-bottleneck the FTUE / onboarding funnel",
    ],
  },
  {
    id: "fintech_lending",
    label: "Fintech / Lending",
    goals: [
      "Raise approved → funded conversion (pull-through rate)",
      "Cut first-payment default & charge-off by origination cohort",
      "Improve fraud capture without raising false-positive declines",
      "Grow funded-account activation & deposit balances",
      "Lift portfolio yield / net interest margin per risk segment",
    ],
  },
  {
    id: "marketplace",
    label: "Marketplace / Platform",
    goals: [
      "Raise liquidity (search → transaction match rate)",
      "Improve supply utilization & seller activation",
      "Optimise take rate without suppressing GMV",
      "Cut fill-rate failures and time-to-match",
      "Grow repeat rate on both buyer & seller sides",
    ],
  },
  {
    id: "ott_media",
    label: "Subscription Media / OTT",
    goals: [
      "Cut subscriber churn with engagement-based retention",
      "Lift average watch time & content completion rate",
      "Improve content ROI (cost per retained viewer-hour)",
      "Raise free / ad-tier → paid conversion",
      "Reduce involuntary churn via failed-payment recovery",
    ],
  },
  {
    id: "delivery_logistics",
    label: "On-demand Delivery / Logistics",
    goals: [
      "Raise on-time delivery rate at peak load",
      "Cut cost per delivery through batching & routing",
      "Shorten time-to-assign and end-to-end delivery time",
      "Lower order cancellation & failed-delivery rate",
      "Balance courier supply vs demand by zone & hour",
    ],
  },
  {
    id: "healthcare",
    label: "Healthcare Provider",
    goals: [
      "Cut 30-day readmission rate",
      "Reduce appointment no-show & late-cancellation rate",
      "Shorten revenue-cycle AR days & lower denial rate",
      "Optimise length-of-stay and clinic/bed utilization",
      "Improve patient throughput (door-to-provider time)",
    ],
  },
  {
    id: "insurance",
    label: "Insurance (P&C)",
    goals: [
      "Lower loss ratio by underwriting segment",
      "Improve combined ratio (loss + expense)",
      "Raise policy renewal / retention rate",
      "Lift quote-to-bind (hit) ratio profitably",
      "Cut claims cycle time & claims leakage",
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
