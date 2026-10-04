"use client";

import { useId, useState } from "react";

const baseline = { revenue: 100, margin: 40, profit: 40 };
const startingScenario = { revenue: 90, margin: 42 };

export function MarginPoolLens() {
  const id = useId();
  const [revenue, setRevenue] = useState(startingScenario.revenue);
  const [margin, setMargin] = useState(startingScenario.margin);
  const profit = revenue * margin / 100;
  const change = profit - baseline.profit;
  const requiredMargin = baseline.profit / revenue * 100;
  const direction = Math.abs(change) < 0.005 ? "unchanged" : change > 0 ? "higher" : "lower";

  return (
    <figure className="margin-pool" aria-label="Illustrative revenue, margin and gross profit comparison">
      <span className="eyebrow">THE PERCENTAGE AND THE POOL</span>
      <h3>How much profit is left to work with?</h3>
      <p className="margin-pool-intro">Start with a fictional business: ₹100 crore of sales, a 40% gross margin and ₹40 crore of gross profit. Adjust the next period below.</p>
      <div className="margin-pool-controls">
        <div>
          <label htmlFor={`${id}-revenue`}>Revenue <span>₹{revenue} crore</span></label>
          <input id={`${id}-revenue`} type="range" min="70" max="120" step="1" value={revenue} aria-valuetext={`${revenue} crore rupees`} onChange={(event) => setRevenue(Number(event.target.value))} />
          <div className="margin-pool-range" aria-hidden="true"><span>₹70 cr</span><span>₹120 cr</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-margin`}>Gross margin <span>{margin.toFixed(1)}%</span></label>
          <input id={`${id}-margin`} type="range" min="30" max="60" step="0.5" value={margin} aria-valuetext={`${margin} percent`} onChange={(event) => setMargin(Number(event.target.value))} />
          <div className="margin-pool-range" aria-hidden="true"><span>30%</span><span>60%</span></div>
        </div>
      </div>
      <div className="margin-pool-result" aria-live="polite" aria-atomic="true">
        <dl>
          <div><dt>Gross profit in this scenario</dt><dd>₹{profit.toFixed(2)}<small>crore · {direction} than the starting ₹40 crore</small></dd></div>
          <div><dt>Margin needed to retain ₹40 crore</dt><dd>{requiredMargin.toFixed(2)}%<small>at ₹{revenue} crore of sales</small></dd></div>
        </dl>
        <div className="margin-pool-comparison" aria-hidden="true">
          <div><span>Starting pool</span><div><i style={{ width: `${baseline.profit / 72 * 100}%` }} /></div><strong>₹40.00 cr</strong></div>
          <div><span>Your scenario</span><div><i style={{ width: `${profit / 72 * 100}%` }} /></div><strong>₹{profit.toFixed(2)} cr</strong></div>
        </div>
        <p>₹{revenue} crore × {margin.toFixed(1)}% = ₹{profit.toFixed(2)} crore of gross profit.{direction === "unchanged" ? " The pool is unchanged." : ` That is ₹${Math.abs(change).toFixed(2)} crore ${direction}, or ${Math.abs(change / baseline.profit * 100).toFixed(1)}%.`}</p>
      </div>
      <button className="margin-pool-reset" type="button" onClick={() => { setRevenue(startingScenario.revenue); setMargin(startingScenario.margin); }}>Reset example</button>
      <figcaption>Fictional teaching example, not Nike data. Revenue and margin move independently here to isolate the calculation; in a real business they can affect one another. Gross profit is before operating expenses, interest and tax, and does not measure cash generation. The required margin is an arithmetic threshold, rounded to two decimals.</figcaption>
    </figure>
  );
}
