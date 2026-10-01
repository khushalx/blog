"use client";

import { useState } from "react";

const scenarios = [
  {
    id: "friend",
    label: "Pay a friend",
    amount: "₹500",
    customerFee: "₹0",
    mdr: "Not applicable",
    explanation: "A person-to-person transfer has no MDR. Neither person pays a UPI transaction fee under the September 2026 framework.",
  },
  {
    id: "small-purchase",
    label: "Buy from a shop",
    amount: "₹300",
    customerFee: "₹0",
    mdr: "₹0",
    explanation: "A merchant payment up to ₹2,000 carries zero MDR. The app, banks and network still process it.",
  },
  {
    id: "large-retailer",
    label: "Pay a large retailer",
    amount: "₹5,000",
    customerFee: "₹0",
    mdr: "₹20",
    explanation: "For a standard covered merchant payment above ₹2,000, 0.4% of ₹5,000 is ₹20. MDR is charged within the merchant-payment ecosystem, not to the customer.",
  },
  {
    id: "eligible-small-merchant",
    label: "Pay an eligible small merchant",
    amount: "₹5,000",
    customerFee: "₹0",
    mdr: "₹0",
    explanation: "An eligible P2PM merchant receiving up to ₹1 lakh a month through UPI QR remains at zero MDR even on this larger payment. Classification matters as much as the amount.",
  },
] as const;

export function PaymentCostLens() {
  const [selectedId, setSelectedId] = useState<(typeof scenarios)[number]["id"]>("small-purchase");
  const selected = scenarios.find((scenario) => scenario.id === selectedId)!;

  return (
    <figure className="payment-lens" aria-label="Compare who pays for four UPI payment situations">
      <div className="payment-lens-heading">
        <span className="eyebrow">FOLLOW THE FEE</span>
        <h3>Same payment rail, different bill</h3>
        <p>Choose a payment. The amount alone does not tell you whether anyone pays a merchant discount rate (MDR).</p>
      </div>
      <div className="payment-lens-choices" role="group" aria-label="Choose a UPI payment situation">
        {scenarios.map((scenario) => (
          <button
            key={scenario.id}
            type="button"
            aria-pressed={scenario.id === selectedId}
            onClick={() => setSelectedId(scenario.id)}
          >
            <span>{scenario.label}</span>
            <strong>{scenario.amount}</strong>
          </button>
        ))}
      </div>
      <div className="payment-lens-result" aria-live="polite" aria-atomic="true">
        <div className="payment-lens-numbers">
          <div><span>Payment amount</span><strong>{selected.amount}</strong></div>
          <div><span>Customer fee</span><strong>{selected.customerFee}</strong></div>
          <div><span>Merchant discount rate</span><strong>{selected.mdr}</strong></div>
        </div>
        <p>{selected.explanation}</p>
      </div>
      <div className="payment-lens-route" aria-label="Simplified route of a bank-account UPI payment">
        <span>Payment app<br />&amp; payer bank</span>
        <span aria-hidden="true">→</span>
        <span>UPI network</span>
        <span aria-hidden="true">→</span>
        <span>Recipient<br />bank</span>
      </div>
      <figcaption>
        Illustrative bank-account UPI scenarios under the <a href="https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310586&lang=1&reg=3" target="_blank" rel="noopener noreferrer">Ministry of Finance’s 15 September 2026 framework</a>. This shows MDR, not each participant’s cost or its share of revenue. Special merchant categories have different rates.
      </figcaption>
    </figure>
  );
}
