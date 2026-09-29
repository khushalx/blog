import { pageMetadata } from "@/lib/content/metadata";
export const metadata = pageMetadata("Editorial and Research Policy",
  "How The Long View approaches evidence, original analysis, corrections and conflicts of interest.", "/editorial-policy/");
export default function EditorialPolicy() {
  return <div className="shell trust-page"><p className="eyebrow">HOW THE WORK IS MADE</p><h1>Editorial &amp; Research Policy</h1>
    <p className="trust-lead">The Long View is a personal research publication by Khushal Dangar. Its purpose is to study businesses and financial ideas carefully and explain the reasoning clearly.</p>
    <h2>Evidence and interpretation</h2><p>Company filings, annual reports, exchange disclosures and other primary documents are preferred for factual claims. Secondary research may provide context. Sources are linked or listed so readers can examine them. Estimates, scenarios and opinions are identified as such; illustrative figures are labelled.</p>
    <h2>Research process</h2><p>A company note begins with the business model, industry structure and financial evidence, then tests advantages, risks and valuation assumptions. Notes may be updated as new evidence arrives. An “ongoing” status means the work is incomplete, not that a recommendation is pending.</p>
    <h2>Corrections and updates</h2><p>Material factual errors should be corrected in the article and reflected in its updated date. A correction that changes the conclusion should be explained in the piece. Minor copy edits need not change the updated date.</p>
    <h2>Conflicts of interest</h2><p>Any material holding, commercial relationship or other conflict relevant to a piece should be disclosed in that piece. Absence of a disclosure should not be read as a claim of independence beyond the information provided.</p>
    <h2>Scope</h2><p>Content is educational and informational. It is not personalised financial advice or a buy, sell or hold recommendation. See the <a href="/disclaimer/">full disclaimer</a>.</p>
    <p>To flag a correction, contact Khushal through the <a href="https://www.linkedin.com/in/khushaldangar/" target="_blank" rel="noopener noreferrer">LinkedIn profile</a>.</p>
  </div>;
}
