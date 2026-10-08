"use client";

import { useId, useState } from "react";
import styles from "./store-payback-lens.module.css";

const fixed = { fitout: 60, deposit: 10, preopening: 10, monthlyCosts: 6, maintenance: 0.2 };
const scenarios = [
  { label: "Starting store", inventory: 40, sales: 30, margin: 30, ramp: 12 },
  { label: "Slower ramp", inventory: 40, sales: 30, margin: 30, ramp: 24 },
  { label: "More stock", inventory: 70, sales: 30, margin: 30, ramp: 12 },
  { label: "Sales disappoint", inventory: 40, sales: 20, margin: 30, ramp: 12 },
];
const money = (value: number) => `${value < -0.005 ? "−" : ""}₹${Math.abs(value).toFixed(2)}`;

export function StorePaybackLens() {
  const id = useId();
  const [inventory, setInventory] = useState(40);
  const [sales, setSales] = useState(30);
  const [margin, setMargin] = useState(30);
  const [ramp, setRamp] = useState(12);
  const initial = fixed.fitout + fixed.deposit + fixed.preopening + inventory;
  const matureCash = sales * margin / 100 - fixed.monthlyCosts - fixed.maintenance;
  const balances = [-initial];
  let payback: number | undefined;
  for (let month = 1; month <= 120; month++) {
    // Month one starts at 50%; a linear ramp reaches 100% in the selected month.
    const rampFactor = month >= ramp ? 1 : 0.5 + 0.5 * (month - 1) / (ramp - 1);
    const cash = sales * rampFactor * margin / 100 - fixed.monthlyCosts - fixed.maintenance;
    balances.push(balances[month - 1] + cash);
    if (payback === undefined && balances[month] >= -1e-8) payback = month;
  }
  const nonPositive = matureCash <= 1e-8;
  const paybackLabel = payback ? `${payback} months` : nonPositive ? "No payback" : "Over 10 years";
  const years = payback ? Math.floor(payback / 12) : 0;
  const months = payback ? payback % 12 : 0;
  const duration = payback ? `${[years ? `${years} year${years === 1 ? "" : "s"}` : "", months ? `${months} month${months === 1 ? "" : "s"}` : ""].filter(Boolean).join(", ")} · first non-negative month-end` : nonPositive ? "monthly cash stays non-positive at mature sales" : "cash is still unrecovered at month 120";
  const span = Math.max(...balances, 0) - Math.min(...balances, 0);
  const padding = Math.max(10, span * 0.07);
  const low = Math.min(...balances, 0) - padding;
  const high = Math.max(...balances, 0) + padding;
  const y = (balance: number) => 26 + (high - balance) / (high - low) * 164;
  const x = (month: number) => 60 + month / 120 * 548;
  const points = balances.map((balance, month) => `${x(month)},${y(balance)}`).join(" ");

  return (
    <figure className={styles.lens} aria-label="Illustrative new store cash payback model">
      <span className="eyebrow">FROM OPENING DAY TO PAYBACK</span>
      <h3>When does the cash come back?</h3>
      <p className={styles.intro}>A fictional leased store spends ₹60 lakh on fit-out, ₹10 lakh on a security deposit and ₹10 lakh before opening, plus the inventory below. Sales start at half their mature level. Fixed cash costs are ₹6 lakh a month; maintenance capex is ₹0.20 lakh a month.</p>
      <div className={styles.controls}>
        {[
          { key: "inventory", label: "Opening inventory", value: inventory, min: 20, max: 100, step: 5, display: `₹${inventory} lakh`, set: setInventory },
          { key: "sales", label: "Mature monthly sales", value: sales, min: 20, max: 45, step: 1, display: `₹${sales} lakh`, set: setSales },
          { key: "margin", label: "Gross margin", value: margin, min: 25, max: 40, step: 0.5, display: `${margin.toFixed(1)}%`, set: setMargin },
          { key: "ramp", label: "Time to mature sales", value: ramp, min: 6, max: 24, step: 6, display: `${ramp} months`, set: setRamp },
        ].map((control) => (
          <div key={control.key}>
            <label htmlFor={`${id}-${control.key}`}>{control.label} <span>{control.display}</span></label>
            <input id={`${id}-${control.key}`} type="range" min={control.min} max={control.max} step={control.step} value={control.value} aria-valuetext={control.display} onChange={(event) => control.set(Number(event.target.value))} />
            <div className={styles.range} aria-hidden="true"><span>{control.min}{control.key === "margin" ? "%" : control.key === "ramp" ? " months" : " lakh"}</span><span>{control.max}{control.key === "margin" ? "%" : control.key === "ramp" ? " months" : " lakh"}</span></div>
          </div>
        ))}
      </div>
      <div className={styles.choices} aria-label="Store example scenarios">
        {scenarios.map((scenario) => (
          <button key={scenario.label} type="button" aria-pressed={inventory === scenario.inventory && sales === scenario.sales && margin === scenario.margin && ramp === scenario.ramp} onClick={() => { setInventory(scenario.inventory); setSales(scenario.sales); setMargin(scenario.margin); setRamp(scenario.ramp); }}>{scenario.label}</button>
        ))}
      </div>
      <div className={styles.result} data-store-result aria-live="polite" aria-atomic="true">
        <p className={styles.opening}>Cash committed before opening: <strong>₹{initial.toFixed(2)} lakh</strong></p>
        <dl>
          <div><dt>Monthly cash at mature sales</dt><dd>{money(matureCash)}<small>lakh · after maintenance capex, before interest and tax</small></dd></div>
          <div><dt>Undiscounted cash payback</dt><dd className={styles.payback}>{paybackLabel}<small>{duration}</small></dd></div>
        </dl>
        <p>At mature sales: ₹{sales.toFixed(2)} lakh × {margin.toFixed(1)}% − ₹6.00 lakh of fixed costs − ₹0.20 lakh of maintenance capex = {money(matureCash)} lakh a month.</p>
      </div>
      <div className={styles.chart}>
        <p>Cumulative cash after the opening investment · ₹ lakh</p>
        <svg viewBox="0 0 660 240" role="img" aria-label={`Cumulative cash begins at minus ${initial.toFixed(2)} lakh and ends at ${balances[120].toFixed(2)} lakh after ten years. ${paybackLabel}.`}>
          <line x1="60" x2="608" y1={y(0)} y2={y(0)} className={styles.zero} />
          <text x="8" y={y(0) + 6}>0</text>
          <polyline points={points} fill="none" strokeWidth="3" className={styles.curve} />
          <circle cx={x(0)} cy={y(balances[0])} r="4" className={styles.point} />
          <circle cx={x(120)} cy={y(balances[120])} r="4" className={styles.point} />
          {[0, 24, 48, 72, 96, 120].map((month) => <text key={month} x={x(month)} y="227" textAnchor={month === 0 ? "start" : month === 120 ? "end" : "middle"}>{month / 12}y</text>)}
        </svg>
        <p className={styles.chartNote}>Below the line, opening cash is still unrecovered. Year 1: {money(balances[12])} lakh. Year 5: {money(balances[60])} lakh. Year 10: {money(balances[120])} lakh.</p>
      </div>
      <details className={styles.method}>
        <summary>How the model counts the cash</summary>
        <p>Opening cash = ₹60 lakh fit-out + ₹10 lakh security deposit + ₹10 lakh pre-opening spend + ₹{inventory} lakh inventory. Month 1 sales are ₹{(sales * 0.5).toFixed(2)} lakh, increasing linearly to ₹{sales} lakh in month {ramp}, then staying flat. Gross profit less fixed cash costs and maintenance capex is added to cumulative cash each month. Payback is the first non-negative month-end, searched over 120 months.</p>
        <p>Stock is fully funded before opening and held constant; cost of goods sold covers replenishment, so the opening inventory is not deducted again. No supplier credit or further working-capital changes are assumed. No exit sale of stock or refund of the security deposit is counted.</p>
      </details>
      <figcaption>All assumptions are fictional, not Titan or Kalyan store economics. Inputs move independently to isolate their effects. This is undiscounted store-level cash before interest, tax and head-office costs. Rent is included in fixed cash costs; it is not deducted twice through lease accounting. Inflation, seasonality, additional fit-outs, closures, cannibalisation and exit proceeds are excluded. A real investment decision needs those cash flows and a required return.</figcaption>
    </figure>
  );
}
