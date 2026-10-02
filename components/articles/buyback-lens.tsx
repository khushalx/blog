"use client";

import { useState } from "react";

const assumptions = { shares: 100, profit: 1000, budget: 1000, equityValue: 10000 };
const prices = [80, 100, 200] as const;
const decimal = (value: number) => value.toFixed(2);

export function BuybackLens() {
  const [price, setPrice] = useState<number>(100);
  const retired = assumptions.budget / price;
  const remaining = assumptions.shares - retired;
  const eps = assumptions.profit / remaining;
  const value = (assumptions.equityValue - assumptions.budget) / remaining;

  return (
    <figure className="buyback-lens" aria-label="Illustrative buyback price, earnings and remaining-owner value">
      <span className="eyebrow">SAME BUSINESS. SAME BUDGET.</span>
      <h3>Change the price the company pays.</h3>
      <p className="buyback-lens-intro">A fictional company has 100 crore shares and earns ₹1,000 crore a year. Assume its entire equity is worth ₹10,000 crore, including cash: ₹100 per share. It spends ₹1,000 crore on a buyback.</p>
      <div className="buyback-lens-choices" role="group" aria-label="Select the buyback price per share">
        {prices.map((option) => (
          <button key={option} type="button" aria-pressed={price === option} onClick={() => setPrice(option)}>
            Pay ₹{option}<small>per share</small>
          </button>
        ))}
      </div>
      <div className="buyback-lens-result" aria-live="polite" aria-atomic="true">
        <dl>
          <div><dt>Shares retired</dt><dd>{decimal(retired)}<small>crore of the original 100</small></dd></div>
          <div><dt>Annual earnings per share</dt><dd>₹{decimal(eps)}<small>before buyback: ₹10.00</small></dd></div>
          <div><dt>Assumed value per remaining share</dt><dd>₹{decimal(value)}<small>before buyback: ₹100.00</small></dd></div>
        </dl>
        <p>{price < 100
          ? "Below the assumed value: the budget retires more shares. Both EPS and estimated value per remaining share rise."
          : price > 100
            ? "Above the assumed value: EPS still rises, but estimated value per remaining share falls. A better earnings number does not settle whether the purchase was worthwhile."
            : "At the assumed value: EPS rises, but estimated value per remaining share stays at ₹100. The smaller share count is offset by the cash that left the company."}</p>
        <details>
          <summary>Follow the calculation</summary>
          <p>Shares left: 100 − (1,000 ÷ {price}) = {decimal(remaining)} crore.<br />EPS: ₹1,000 crore ÷ {decimal(remaining)} crore = ₹{decimal(eps)}.<br />Equity value after spending cash: ₹10,000 − ₹1,000 = ₹9,000 crore.<br />Value per remaining share: ₹9,000 crore ÷ {decimal(remaining)} crore = ₹{decimal(value)}.</p>
        </details>
      </div>
      <figcaption>Fictional arithmetic, not NVIDIA data or a market-price forecast. All purchases occur at the start of the year; shares are retired and profit stays unchanged. The assumed equity value includes the cash spent. No new shares, lost interest income, taxes, fees, borrowing or operating changes are modelled. Actual reported EPS uses weighted average shares, with dilution considered for diluted EPS. The estimated value is only as useful as its starting assumption.</figcaption>
    </figure>
  );
}
