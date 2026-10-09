// One source for the purple Σ / fx glyph: symbol, short label and hover explanation.
export const CALC_GLYPH = {
  metric: {
    symbol: "Σ",
    label: "Metric",
    tip: "Metric — a calculated field that aggregates (SUM, COUNT, AVG…). OWOX computes it for each report group; reports can't group by it.",
  },
  column: {
    symbol: "fx",
    label: "Calculated column",
    tip: "Calculated column — a row-level formula with no aggregation. OWOX computes it for every row; reports can group and filter by it.",
  },
} as const;
