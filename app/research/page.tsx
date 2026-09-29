import Link from "next/link";
import { getAllArticles, getAllResearch, isIndexable } from "@/lib/content";
import { ResearchLibrary } from "@/components/research/research-library";
import { pageMetadata } from "@/lib/content/metadata";
export async function generateMetadata() {
  const research = await getAllResearch();
  return pageMetadata("Research",
    "Independent notes on businesses, industries, valuation and financial markets.",
    "/research/", research.some((entry) => isIndexable(entry, "research")));
}
export default async function ResearchPage() {
  const [research, articles] = await Promise.all([getAllResearch(), getAllArticles()]);
  const latestArticle = articles[0];
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
      {research.length > 0 ? <ResearchLibrary entries={research} /> : (
        <section className="research-empty" aria-labelledby="research-empty-title">
          <span className="eyebrow">THE FIRST REPORT IS IN PROGRESS</span>
          <h2 id="research-empty-title">Careful work takes time.</h2>
          <p>Company research will appear here when the evidence, calculations and writing are ready. In the meantime, explore the articles on how businesses and financial statements work.</p>
          {latestArticle && <Link href={`/articles/${latestArticle.slug}/`}>Read the latest article <span aria-hidden="true">↗</span></Link>}
        </section>
      )}
    </div>
  );
}
