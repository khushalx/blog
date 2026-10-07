"use client";

import { useId, useState } from "react";
import styles from "./deposit-funding-lens.module.css";

const scenarios = [
  { label: "Starting mix", casa: 40, term: 6, yield: 8 },
  { label: "More CASA", casa: 60, term: 6, yield: 8 },
  { label: "Assets reprice first", casa: 40, term: 6, yield: 7 },
];

export function DepositFundingLens() {
  const id = useId();
  const [casa, setCasa] = useState(40);
  const [termRate, setTermRate] = useState(6);
  const [assetYield, setAssetYield] = useState(8);
  // Equal ₹100 crore average pools isolate interest arithmetic, not a full balance sheet.
  // CASA is split equally between zero-interest current and 3% savings deposits.
  const current = casa / 2;
  const savings = casa / 2;
  const term = 100 - casa;
  const savingsInterest = savings * 0.03;
  const termInterest = term * termRate / 100;
  const interestCost = savingsInterest + termInterest;
  const netInterest = assetYield - interestCost;
  const money = (value: number) => `${value < 0 ? "−" : ""}₹${Math.abs(value).toFixed(2)}`;

  return (
    <figure className={styles.lens} aria-label="Illustrative bank deposit funding and interest example">
      <span className="eyebrow">FOLLOW THE FUNDING COST</span>
      <h3>Same size. Different interest bill.</h3>
      <p className={styles.intro}>Start with ₹100 crore of average deposits and a separate ₹100 crore interest-earning asset pool. CASA is half current accounts at 0%, half savings at 3%. All rates are fictional.</p>
      <div className={styles.controls}>
        <div>
          <label htmlFor={`${id}-casa`}>CASA share <span>{casa}%</span></label>
          <input id={`${id}-casa`} type="range" min="20" max="60" step="1" value={casa} aria-valuetext={`${casa} percent of deposits`} onChange={(event) => setCasa(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>20%</span><span>60%</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-term`}>Term deposit rate <span>{termRate.toFixed(1)}%</span></label>
          <input id={`${id}-term`} type="range" min="4" max="8" step="0.1" value={termRate} aria-valuetext={`${termRate.toFixed(1)} percent a year`} onChange={(event) => setTermRate(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>4%</span><span>8%</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-yield`}>Asset yield <span>{assetYield.toFixed(1)}%</span></label>
          <input id={`${id}-yield`} type="range" min="6" max="10" step="0.1" value={assetYield} aria-valuetext={`${assetYield.toFixed(1)} percent a year`} onChange={(event) => setAssetYield(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>6%</span><span>10%</span></div>
        </div>
      </div>
      <div className={styles.choices} aria-label="Deposit example scenarios">
        {scenarios.map((scenario) => (
          <button key={scenario.label} type="button" aria-pressed={casa === scenario.casa && termRate === scenario.term && assetYield === scenario.yield} onClick={() => { setCasa(scenario.casa); setTermRate(scenario.term); setAssetYield(scenario.yield); }}>{scenario.label}</button>
        ))}
      </div>
      <div className={styles.result} data-deposit-result aria-live="polite" aria-atomic="true">
        <dl>
          <div><dt>Annual deposit interest</dt><dd>{money(interestCost)}<small>crore · {interestCost.toFixed(2)}% average cost</small></dd></div>
          <div><dt>Net interest in this example</dt><dd>{money(netInterest)}<small>crore · before operating costs, credit losses and tax</small></dd></div>
        </dl>
        <p>₹{assetYield.toFixed(2)} crore of interest income − ₹{interestCost.toFixed(2)} crore of deposit interest = {money(netInterest)} crore.</p>
        <details>
          <summary>Follow the interest calculation</summary>
          <p>Current accounts: ₹{current} crore × 0% = ₹0.00 crore. Savings: ₹{savings} crore × 3% = ₹{savingsInterest.toFixed(2)} crore. Term deposits: ₹{term} crore × {termRate.toFixed(1)}% = ₹{termInterest.toFixed(2)} crore. Asset income: ₹100 crore × {assetYield.toFixed(1)}% = ₹{assetYield.toFixed(2)} crore. Balances and rates are held constant for one year.</p>
        </details>
      </div>
      <figcaption>Fictional teaching example, not HDFC Bank data, offered deposit rates or a forecast. Equal-sized average pools isolate the interest calculation; this is not a complete bank balance sheet or reported net interest margin. Capital, liquidity reserves, other funding, fees, operating costs, credit losses and tax are excluded. Mix and rates move independently here; attracting deposits can change servicing costs and customer behaviour.</figcaption>
    </figure>
  );
}
