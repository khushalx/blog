"use client";

import { useId, useState } from "react";
import styles from "./recurring-revenue-lens.module.css";

const scenarios = [
  { label: "Starting cohort", retention: 90, price: 10, newCustomers: 100 },
  { label: "Growth hides churn", retention: 80, price: 10, newCustomers: 200 },
  { label: "Price offsets departures", retention: 80, price: 25, newCustomers: 0 },
  { label: "Steady renewals", retention: 95, price: 0, newCustomers: 100 },
];
const signed = (value: number) => `${value > 0 ? "+" : value < 0 ? "−" : ""}${Math.abs(value).toFixed(1)}%`;
const money = (value: number) => `₹${Math.abs(value).toFixed(2)} lakh`;

export function RecurringRevenueLens() {
  const id = useId();
  const [retention, setRetention] = useState(90);
  const [priceChange, setPriceChange] = useState(10);
  const [newCustomers, setNewCustomers] = useState(100);
  const retainedCustomers = 1000 * retention / 100;
  const lostCustomers = 1000 - retainedCustomers;
  const annualPrice = 10000 * (1 + priceChange / 100);
  const retainedAtOldPrice = retainedCustomers * 10000 / 100000;
  const lostRunRate = 100 - retainedAtOldPrice;
  const priceEffect = retainedAtOldPrice * priceChange / 100;
  const cohortRunRate = retainedAtOldPrice + priceEffect;
  const newRunRate = newCustomers * annualPrice / 100000;
  const totalRunRate = cohortRunRate + newRunRate;
  const growth = totalRunRate - 100;

  return (
    <figure className={styles.lens} aria-label="Illustrative recurring revenue retention and price example">
      <span className="eyebrow">FOLLOW THE SAME CUSTOMERS</span>
      <h3>Growth in the total. What about the cohort?</h3>
      <p className={styles.intro}>A fictional service starts with 1,000 customers paying ₹10,000 a year: ₹100 lakh of annual recurring run-rate. At one renewal date, some leave, prices change and new customers join.</p>
      <div className={styles.controls}>
        <div>
          <label htmlFor={`${id}-retention`}>Customers renewing <span>{retention}%</span></label>
          <input id={`${id}-retention`} type="range" min="50" max="100" step="1" value={retention} aria-valuetext={`${retention} percent of the starting customers`} onChange={(event) => setRetention(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>50%</span><span>100%</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-price`}>Annual price change <span>{signed(priceChange)}</span></label>
          <input id={`${id}-price`} type="range" min="-10" max="30" step="1" value={priceChange} aria-valuetext={`${priceChange} percent price change`} onChange={(event) => setPriceChange(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>−10%</span><span>+30%</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-new`}>New customers <span>{newCustomers}</span></label>
          <input id={`${id}-new`} type="range" min="0" max="400" step="10" value={newCustomers} aria-valuetext={`${newCustomers} new customers`} onChange={(event) => setNewCustomers(Number(event.target.value))} />
          <div className={styles.range} aria-hidden="true"><span>0</span><span>400</span></div>
        </div>
      </div>
      <div className={styles.choices} aria-label="Recurring revenue example scenarios">
        {scenarios.map((scenario) => <button key={scenario.label} type="button" aria-pressed={retention === scenario.retention && priceChange === scenario.price && newCustomers === scenario.newCustomers} onClick={() => { setRetention(scenario.retention); setPriceChange(scenario.price); setNewCustomers(scenario.newCustomers); }}>{scenario.label}</button>)}
      </div>
      <div className={styles.result} data-recurring-result aria-live="polite" aria-atomic="true">
        <dl>
          <div><dt>Existing cohort’s annual run-rate</dt><dd>₹{cohortRunRate.toFixed(2)}<small>lakh · {cohortRunRate.toFixed(1)}% net revenue retention in this example</small></dd></div>
          <div><dt>Total ending annual run-rate</dt><dd>₹{totalRunRate.toFixed(2)}<small>lakh · {Math.abs(growth) < 0.005 ? "unchanged" : signed(growth)} from ₹100 lakh</small></dd></div>
        </dl>
        <p>{retainedCustomers.toLocaleString("en-IN")} original customers renew; {lostCustomers.toLocaleString("en-IN")} leave; {newCustomers} new customers join. Ending customer count: {(retainedCustomers + newCustomers).toLocaleString("en-IN")}.</p>
        <div className={styles.bridge} aria-label="Annual recurring run-rate bridge">
          {[
            ["Starting run-rate", money(100)],
            ["Lost customers, at old price", `−${money(lostRunRate)}`],
            ["Price change on retained customers", `${priceEffect < 0 ? "−" : "+"}${money(priceEffect)}`],
            ["New customers, at new price", `+${money(newRunRate)}`],
            ["Ending run-rate", money(totalRunRate)],
          ].map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}
        </div>
        <details>
          <summary>Follow the cohort calculation</summary>
          <p>Retained cohort: {retainedCustomers} customers × ₹{annualPrice.toLocaleString("en-IN")} a year = {money(cohortRunRate)}. Divide by the starting ₹100 lakh to get {cohortRunRate.toFixed(1)}% net revenue retention. New customers contribute {money(newRunRate)} separately. Everyone starts at the same price and retained customers keep the same seat count and plan.</p>
        </details>
      </div>
      <figcaption>Fictional renewal-date snapshot, not Adobe customer counts, pricing, retention or guidance. This is annualized run-rate, not revenue earned or cash collected during a year. All customers renew or leave at once; new customers pay the same new annual price. No later churn, partial-year timing, upgrades, seat changes, currency effects, acquisitions, refunds or costs are included. Inputs move independently here; real price changes can affect retention.</figcaption>
    </figure>
  );
}
