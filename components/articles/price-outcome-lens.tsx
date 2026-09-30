"use client";

import { useState } from "react";

const startingEps = 10;
const earningsGrowth = 0.12;
const years = 5;
const exitMultiple = 25;
const endingEps = startingEps * (1 + earningsGrowth) ** years;
const endingPrice = endingEps * exitMultiple;
const entryMultiples = [20, 40] as const;

function rupees(value: number) {
  return "₹" + value.toFixed(2);
}

export function PriceOutcomeLens() {
  const [entryMultiple, setEntryMultiple] = useState<(typeof entryMultiples)[number]>(20);
  const entryPrice = startingEps * entryMultiple;
  const annualisedReturn = ((endingPrice / entryPrice) ** (1 / years) - 1) * 100;
  const totalReturn = (endingPrice / entryPrice - 1) * 100;

  return (
    <figure className="price-lens" aria-label="Illustrative share-price outcome at two purchase valuations">
      <div className="price-lens-heading">
        <span className="eyebrow">A FIVE-YEAR THOUGHT EXPERIMENT</span>
        <h3>Same business. What did you pay?</h3>
      </div>
      <dl className="price-lens-assumptions">
        <div><dt>Earnings today</dt><dd>₹10 per share</dd></div>
        <div><dt>Earnings growth</dt><dd>12% each year</dd></div>
        <div><dt>Holding period</dt><dd>5 years</dd></div>
        <div><dt>Exit valuation</dt><dd>25× earnings</dd></div>
      </dl>
      <div className="price-lens-choices" role="group" aria-label="Choose the price paid for the fictional company">
        {entryMultiples.map((multiple) => (
          <button
            key={multiple}
            type="button"
            aria-pressed={entryMultiple === multiple}
            onClick={() => setEntryMultiple(multiple)}
          >
            Buy at {multiple}× earnings
          </button>
        ))}
      </div>
      <div className="price-lens-outcome" aria-live="polite">
        <div className="price-lens-prices">
          <div>
            <span>Price paid today</span>
            <strong>{rupees(entryPrice)}</strong>
          </div>
          <span className="price-lens-arrow" aria-hidden="true">→</span>
          <div>
            <span>Same year-five price</span>
            <strong>{rupees(endingPrice)}</strong>
          </div>
        </div>
        <div className="price-lens-return">
          <span>Annualised price return</span>
          <strong>{annualisedReturn >= 0 ? "+" : ""}{annualisedReturn.toFixed(1)}%</strong>
          <small>{totalReturn >= 0 ? "+" : ""}{totalReturn.toFixed(1)}% over five years</small>
        </div>
      </div>
      <figcaption>
        Fictional company and assumed future earnings. The ending EPS is {rupees(endingEps)} in both cases; only the price paid changes. Excludes dividends, dilution, taxes and trading costs.
      </figcaption>
    </figure>
  );
}
