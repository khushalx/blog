"use client";

import { useState } from "react";
import dataset from "@/docs/research/asian-paints/financial-data.json";

const rows = dataset.rows;
const measures = [
  { id: "revenue", label: "Revenue", unit: "INR CRORE" },
  { id: "pat", label: "Group PAT", unit: "INR CRORE" },
  { id: "margin", label: "PAT margin", unit: "PERCENT" },
] as const;
const number = (value: number) => value.toLocaleString("en-IN", {
  minimumFractionDigits: 2, maximumFractionDigits: 2,
});

export function AsianPaintsFinancialLens() {
  const [selected, setSelected] = useState<(typeof measures)[number]["id"]>("revenue");
  const measure = measures.find((item) => item.id === selected) ?? measures[0];
  const values = rows.map((row) => selected === "margin" ? row.pat / row.revenue * 100 : row[selected]);
  const largest = Math.max(...values);
  return (
    <figure className="cash-lens asian-paints-lens" aria-label="Compare Asian Paints consolidated financial measures">
      <div className="cash-lens-heading">
        <div>
          <span className="eyebrow">FY2023–24 → FY2025–26 · CONSOLIDATED</span>
          <h3>Revenue recovered faster than profit.</h3>
        </div>
        <span className="cash-lens-unit">{measure.unit}</span>
      </div>
      <div className="cash-lens-controls" role="group" aria-label="Choose an Asian Paints financial measure">
        {measures.map((item) => (
          <button type="button" key={item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>
            {item.label}
          </button>
        ))}
      </div>
      <div className="cash-lens-chart" aria-live="polite">
        <div className="cash-lens-chart-top"><strong>{measure.label}</strong></div>
        {rows.map((row, index) => (
          <div className="cash-lens-row" key={row.year}>
            <span>{row.year}</span>
            <div className="cash-lens-track" aria-hidden="true">
              <div style={{ width: `${values[index] / largest * 100}%` }} />
            </div>
            <strong>{number(values[index])}{selected === "margin" ? "%" : ""}</strong>
          </div>
        ))}
        <p>Group PAT includes non-controlling interests. PAT margin is group PAT divided by revenue from operations. Historical comparisons do not establish the causes of change.</p>
      </div>
      <figcaption>
        Sources: <a href="https://www.asianpaints.com/content/dam/asianpaints/website/secondary-navigation/investors/financial-results-2/2024-2025/Q4/APLQ4and12MFY25Results.pdf" target="_blank" rel="noopener noreferrer">FY2024–25 consolidated results</a> and <a href="https://static.asianpaints.com/content/dam/annual-report-2526/pdf/Consolidated.pdf" target="_blank" rel="noopener noreferrer">FY2025–26 audited consolidated statements</a>.
      </figcaption>
    </figure>
  );
}

export function AsianPaintsScenario() {
  const [growth, setGrowth] = useState(0);
  const [marginChange, setMarginChange] = useState(0);
  const base = rows[rows.length - 1];
  const baseEarnings = base.ebitda - base.other_income;
  const revenue = base.revenue * (1 + growth / 100);
  const margin = baseEarnings / base.revenue * 100 + marginChange;
  const earnings = revenue * margin / 100;
  return (
    <figure className="cash-lens asian-paints-lens" aria-label="Asian Paints educational sensitivity calculation">
      <div className="cash-lens-heading">
        <div><span className="eyebrow">ILLUSTRATIVE SCENARIO · FY2025–26 BASE</span><h3>What changes when growth and margin move?</h3></div>
      </div>
      <p className="asian-paints-scenario-note">An educational calculation using consolidated revenue and reported EBITDA less other income. This is not a forecast or company guidance.</p>
      <div className="asian-paints-scenario-controls">
        <label htmlFor="asian-paints-growth">Revenue change
          <output htmlFor="asian-paints-growth">{growth.toFixed(1)}%</output>
          <input id="asian-paints-growth" aria-label="Revenue change" type="range" min="-10" max="15" step="0.5" value={growth} onChange={(event) => setGrowth(Number(event.target.value))} />
        </label>
        <label htmlFor="asian-paints-margin">Operating proxy margin change
          <output htmlFor="asian-paints-margin">{marginChange.toFixed(1)} percentage points</output>
          <input id="asian-paints-margin" aria-label="Operating proxy margin change" type="range" min="-3" max="3" step="0.1" value={marginChange} onChange={(event) => setMarginChange(Number(event.target.value))} />
        </label>
      </div>
      <div className="asian-paints-scenario-results" aria-live="polite">
        <div><small>Scenario revenue · INR crore</small><strong>{number(revenue)}</strong></div>
        <div><small>Scenario proxy margin</small><strong>{number(margin)}%</strong></div>
        <div><small>Scenario operating earnings · INR crore</small><strong>{number(earnings)}</strong></div>
      </div>
      <div className="cash-lens-controls"><button type="button" onClick={() => { setGrowth(0); setMarginChange(0); }}>Reset assumptions</button></div>
      <figcaption>Operating earnings here means reported EBITDA minus other income. The calculation excludes financing, depreciation, tax and exceptional items; it does not estimate net profit.</figcaption>
    </figure>
  );
}
