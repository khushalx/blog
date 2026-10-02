"use client";

import { useState } from "react";

export function LeaseSpendingLens() {
  const [classification, setClassification] = useState<"finance" | "operating">("finance");
  const finance = classification === "finance";

  return (
    <figure className="lease-lens" aria-label="Illustrative lease classification and unchanged cash commitment">
      <span className="eyebrow">ONE CONTRACT, TWO REPORTING VIEWS</span>
      <h3>Does a smaller headline mean a smaller bill?</h3>
      <p className="lease-lens-intro">Hold the payment schedule fixed: ₹24 crore a year for five years. Compare how a capex measure that includes finance leases treats the initial ₹100 crore lease asset.</p>
      <div className="lease-lens-choices" role="group" aria-label="Compare lease classifications">
        <button type="button" aria-pressed={finance} onClick={() => setClassification("finance")}>Finance lease</button>
        <button type="button" aria-pressed={!finance} onClick={() => setClassification("operating")}>Operating lease</button>
      </div>
      <div className="lease-lens-result" aria-live="polite" aria-atomic="true">
        <div className="lease-lens-figures">
          <div><span>Initial addition to this capex measure</span><strong>{finance ? "₹100" : "₹0"}<small>crore</small></strong></div>
          <div><span>Total contracted cash payments</span><strong>₹120<small>crore over five years</small></strong></div>
        </div>
        <div className="lease-lens-track" aria-hidden="true"><div style={{ width: finance ? "100%" : "0%" }} /></div>
        <p>{finance
          ? "The upfront lease asset enters the capex headline. It is not ₹100 crore paid in cash at commencement. The assumed payment schedule is still ₹24 crore a year."
          : "The lease asset is excluded from this capex headline. The assumed ₹24 crore annual payments still exist, and the lease asset and liability remain on the balance sheet."}</p>
      </div>
      <ol className="lease-lens-timeline" aria-label="Unchanged illustrative annual cash payments">
        {[1, 2, 3, 4, 5].map((year) => <li key={year}><span>Year {year}</span><strong>₹24 cr</strong></li>)}
      </ol>
      <figcaption>Fictional example, not Microsoft data. ₹100 crore is an assumed initial present value; ₹120 crore is the undiscounted total. No upfront payment, incentives or initial direct costs are assumed. This isolates presentation: actual classification follows accounting criteria and cannot be freely selected. It does not compare expense patterns, taxes or investment returns.</figcaption>
    </figure>
  );
}
