import { pageMetadata } from "@/lib/content/metadata";
export const metadata = pageMetadata("Disclaimer",
  "Important context for reading independent financial research and educational articles on The Long View.", "/disclaimer/");
export default function Disclaimer() {
  return <div className="shell trust-page"><p className="eyebrow">READING THE RESEARCH</p><h1>Disclaimer</h1>
    <p className="trust-lead">The Long View publishes research notes and essays for educational and informational purposes.</p>
    <p>Nothing on this site is personalised investment, legal or tax advice, or an offer or solicitation to buy or sell any security. The author is a student and does not present himself as a registered investment adviser.</p>
    <p>Financial information can be incomplete, delayed or change. Opinions and assumptions may be wrong. Readers should verify primary sources and consider their own circumstances, risks and independent professional advice before making financial decisions.</p>
    <p>Historical figures, original calculations and illustrative examples are identified in the relevant piece. A discussion of a past filing is not a current assessment of a company or its securities.</p>
    <p>Relevant conflicts of interest should be disclosed in individual pieces. See the <a href="/editorial-policy/">editorial and research policy</a>.</p>
  </div>;
}
