import { getAllResearch, isIndexable } from "@/lib/content";
import { ResearchLibrary } from "@/components/research/research-library";
import { pageMetadata } from "@/lib/content/metadata";
export async function generateMetadata() {
  const research = await getAllResearch();
  return pageMetadata("Research",
    "Independent notes on businesses, industries, valuation and financial markets.",
    "/research/", research.some((entry) => isIndexable(entry, "research")));
}
export default async function ResearchPage() {
  const research = await getAllResearch();
  return (
    <div className="shell index-page">
      <header className="page-intro">
        <p className="eyebrow">THE RESEARCH LIBRARY</p>
        <h1>
          Understanding
          <br />
          the <em>business beneath.</em>
        </h1>
        <div className="index-subtitle">
          <h2>Research</h2>
          <p>
            Independent notes on businesses, industries,
            <br className="desktop-break" /> valuation and financial markets.
          </p>
        </div>
      </header>
      <ResearchLibrary entries={research} />
      {research.some((entry) => entry.demo) && <p className="library-note">
        Sample entries demonstrate the research format; no buy or sell recommendations.
      </p>}
    </div>
  );
}
