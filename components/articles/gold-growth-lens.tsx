"use client";

import { useId, useState } from "react";

const baseline = { price: 6000, grams: 1000, revenue: 60 };
const scenarios = [
  { label: "Price rises, volume falls", price: 25, volume: -10 },
  { label: "Same sales, less gold", price: 25, volume: -20 },
  { label: "Volume grows too", price: 25, volume: 10 },
];

export function GoldGrowthLens() {
  const id = useId();
  const [priceChange, setPriceChange] = useState(25);
  const [volumeChange, setVolumeChange] = useState(-10);
  const price = baseline.price * (1 + priceChange / 100);
  const grams = baseline.grams * (1 + volumeChange / 100);
  const revenue = price * grams / 100000;
  const revenueChange = (revenue / baseline.revenue - 1) * 100;
  const unchanged = Math.abs(revenueChange) < 0.005;
  const signed = (value: number) => `${value > 0 ? "+" : ""}${value.toFixed(1)}%`;
  const priceEffect = baseline.revenue * priceChange / 100;
  const volumeEffect = baseline.revenue * (1 + priceChange / 100) * volumeChange / 100;

  return (
    <figure className="gold-growth" aria-label="Illustrative gold price, physical volume and revenue comparison">
      <span className="eyebrow">FOLLOW THE PRICE AND THE GRAMS</span>
      <h3>Higher sales. More gold sold?</h3>
      <p className="gold-growth-intro">A fictional seller starts with 1,000 grams at ₹6,000 per gram: ₹60 lakh of metal sales. Change the next period below.</p>
      <div className="gold-growth-controls">
        <div>
          <label htmlFor={`${id}-price`}>Gold price change <span>+{priceChange}%</span></label>
          <input id={`${id}-price`} type="range" min="0" max="60" step="1" value={priceChange} aria-valuetext={`${priceChange} percent increase`} onChange={(event) => setPriceChange(Number(event.target.value))} />
          <div className="gold-growth-range" aria-hidden="true"><span>Unchanged</span><span>+60%</span></div>
        </div>
        <div>
          <label htmlFor={`${id}-volume`}>Grams sold change <span>{volumeChange > 0 ? "+" : ""}{volumeChange}%</span></label>
          <input id={`${id}-volume`} type="range" min="-30" max="30" step="1" value={volumeChange} aria-valuetext={`${Math.abs(volumeChange)} percent ${volumeChange < 0 ? "decrease" : volumeChange > 0 ? "increase" : "change"}`} onChange={(event) => setVolumeChange(Number(event.target.value))} />
          <div className="gold-growth-range" aria-hidden="true"><span>−30%</span><span>+30%</span></div>
        </div>
      </div>
      <div className="gold-growth-choices" aria-label="Example scenarios">
        {scenarios.map((scenario) => (
          <button key={scenario.label} type="button" aria-pressed={priceChange === scenario.price && volumeChange === scenario.volume} onClick={() => { setPriceChange(scenario.price); setVolumeChange(scenario.volume); }}>{scenario.label}</button>
        ))}
      </div>
      <div className="gold-growth-result" aria-live="polite" aria-atomic="true">
        <dl>
          <div><dt>Revenue</dt><dd>₹{revenue.toFixed(2)}<small>lakh · {unchanged ? "unchanged" : signed(revenueChange)} from ₹60 lakh</small></dd></div>
          <div><dt>Physical volume</dt><dd>{grams.toLocaleString("en-IN")}<small>grams · {signed(volumeChange)} from 1,000 grams</small></dd></div>
        </dl>
        <div className="gold-growth-comparison" aria-hidden="true">
          <p>Compare growth, with the starting period = 100</p>
          {[{ label: "Revenue", index: revenue / baseline.revenue * 100 }, { label: "Grams sold", index: grams / baseline.grams * 100 }].map((item) => (
            <div key={item.label}><span>{item.label}</span><div><i style={{ width: `${item.index / 208 * 100}%` }} /><b style={{ left: `${100 / 208 * 100}%` }} /></div><strong>{item.index.toFixed(1)}</strong></div>
          ))}
          <small>The vertical mark is the starting level of 100.</small>
        </div>
        <p>₹{price.toLocaleString("en-IN")} per gram × {grams.toLocaleString("en-IN")} grams = ₹{revenue.toFixed(2)} lakh. {unchanged ? "Revenue holds steady" : `Revenue ${revenueChange > 0 ? "rises" : "falls"}`} while physical volume {volumeChange === 0 ? "stays unchanged" : volumeChange > 0 ? "rises" : "falls"}.</p>
        <details>
          <summary>Follow the revenue bridge</summary>
          <p>Start with ₹60 lakh. The price change adds ₹{priceEffect.toFixed(2)} lakh at the original volume. Changing grams sold at the new price then {volumeEffect < 0 ? "subtracts" : "adds"} ₹{Math.abs(volumeEffect).toFixed(2)} lakh. Result: ₹{revenue.toFixed(2)} lakh. This order allocates the interaction between price and volume to the volume step.</p>
        </details>
      </div>
      <figcaption>Fictional metal-only example, not Titan data or a current gold-price quote. Making charges, stones, product mix, tax, costs, buyer counts and cash flows are excluded. Price and volume move independently here to isolate the arithmetic; real demand can respond to price.</figcaption>
    </figure>
  );
}
