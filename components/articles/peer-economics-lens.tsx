"use client";

import { useId, useState } from "react";
import styles from "./peer-economics-lens.module.css";

const scenarios = [
  { label: "Starting comparison", margin: 15, capital: 50, growth: 20 },
  { label: "Higher margin, more capital", margin: 25, capital: 150, growth: 20 },
  { label: "More capital tied up", margin: 15, capital: 100, growth: 20 },
  { label: "No expansion", margin: 15, capital: 50, growth: 0 },
];
const money = (value: number) => `₹${value.toFixed(2)}`;

export function PeerEconomicsLens() {
  const id = useId();
  const [margin, setMargin] = useState(15);
  const [capital, setCapital] = useState(50);
  const [growth, setGrowth] = useState(20);
  const profit = 100 * margin / 100;
  const turnover = 100 / capital;
  const operatingReturn = profit / capital * 100;
  const extraRevenue = 100 * growth / 100;
  const extraProfit = extraRevenue * margin / 100;
  const extraCapital = extraRevenue / turnover;
  const returnComparison = Math.abs(operatingReturn - 20) < 0.005 ? "equals" : operatingReturn > 20 ? "exceeds" : "falls below";

  return (
    <figure className={styles.lens} aria-label="Illustrative two-company margin and capital comparison">
      <span className="eyebrow">SAME SALES. DIFFERENT CAPITAL NEEDS.</span>
      <h3>The higher margin doesn’t settle it.</h3>
      <p className={styles.intro}>Two fictional suppliers each sell ₹100 crore a year. Company A stays fixed at a 20% margin and ₹100 crore of operating capital. Change Company B, then see what growth requires from both.</p>
      <div className={styles.controls}>
        <div>
          <label htmlFor={`${id}-margin`}>B’s operating margin <span>{margin}%</span></label>
          <input id={`${id}-margin`} type="range" min="5" max="30" step="1" value={margin} aria-valuetext={`${margin} percent operating margin`} onChange={(event) => setMargin(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>5%</span><span>30%</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-capital`}>B’s operating capital <span>₹{capital} crore</span></label>
          <input id={`${id}-capital`} type="range" min="25" max="150" step="5" value={capital} aria-valuetext={`${capital} crore rupees of operating capital`} onChange={(event) => setCapital(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>₹25 crore</span><span>₹150 crore</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-growth`}>Sales growth for both <span>{growth}%</span></label>
          <input id={`${id}-growth`} type="range" min="0" max="40" step="5" value={growth} aria-valuetext={`${growth} percent sales growth for both companies`} onChange={(event) => setGrowth(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>0%</span><span>40%</span></div>
        </div>
      </div>
      <div className={styles.choices} aria-label="Company economics example scenarios">
        {scenarios.map((scenario) => <button key={scenario.label} type="button" aria-pressed={margin === scenario.margin && capital === scenario.capital && growth === scenario.growth} onClick={() => { setMargin(scenario.margin); setCapital(scenario.capital); setGrowth(scenario.growth); }}>{scenario.label}</button>)}
      </div>
      <div className={styles.result} data-peer-result aria-live="polite" aria-atomic="true">
        <p className={styles.tableHint}>Scroll the table sideways to compare both companies.</p>
        <div className={styles.tableScroll} role="region" aria-label="Scrollable company comparison" tabIndex={0}>
          <table aria-label="Fictional supplier comparison, amounts in crore rupees">
            <caption>Annual figures; rupee amounts in crore</caption>
            <thead><tr><th scope="col">Measure</th><th scope="col">Company A</th><th scope="col">Company B</th></tr></thead>
            <tbody>
              {[
                ["Revenue", money(100), money(100)],
                ["Operating margin", "20%", `${margin}%`],
                ["Operating profit", money(20), money(profit)],
                ["Operating capital base", money(100), money(capital)],
                ["Capital turnover", "1.00×", `${turnover.toFixed(2)}×`],
                ["Pre-tax operating return", "20.0%", `${operatingReturn.toFixed(1)}%`],
                [`Extra sales at ${growth}% growth`, money(extraRevenue), money(extraRevenue)],
                ["Extra annual operating profit", money(extraRevenue * 0.2), money(extraProfit)],
                ["Extra operating capital needed", money(extraRevenue), money(extraCapital)],
              ].map(([label, a, b]) => <tr key={label}><th scope="row">{label}</th><td>{a}</td><td>{b}</td></tr>)}
            </tbody>
          </table>
        </div>
        <p>B’s {operatingReturn.toFixed(1)}% operating return {returnComparison} A’s 20.0%. {growth === 0 ? "With no expansion, this model requires no extra capital for growth; existing operations still need funding and upkeep." : `At ${growth}% growth, B needs ${money(extraCapital)} crore of extra capital for ${money(extraProfit)} crore of extra annual operating profit.`}</p>
        <details>
          <summary>Follow the capital calculation</summary>
          <p>B’s operating profit: ₹100 crore × {margin}% = {money(profit)} crore. Capital turnover: ₹100 crore ÷ ₹{capital} crore = {turnover.toFixed(2)}×. Operating return: {money(profit)} crore ÷ ₹{capital} crore = {operatingReturn.toFixed(1)}%. Growth adds {money(extraRevenue)} crore of sales; keeping turnover constant requires {money(extraCapital)} crore more capital. Margin and turnover are assumed unchanged during expansion.</p>
        </details>
      </div>
      <figcaption>Fictional suppliers, not TCS or Infosys estimates. Return is annual operating profit divided by the model’s operating capital base, a simplified pre-tax proxy rather than reported ROCE. Extra profit is an annual flow; extra capital is a funding requirement. Neither is free cash flow. No tax, financing, maintenance investment, spare capacity, payment timing or valuation is modeled. Capital needs scale proportionally with sales; actual growth may behave differently.</figcaption>
    </figure>
  );
}
