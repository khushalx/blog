import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getAllResearch, getAllArticles } from "@/lib/content";
import { ResearchEntry } from "@/components/research/research-entry";
import { ArticleEntry } from "@/components/articles/article-entry";
import { EntryDate, SectionHeading, TextLink } from "@/components/ui/editorial";
import { pageMetadata } from "@/lib/content/metadata";
import { site } from "@/lib/site";
export const metadata = {
  ...pageMetadata("Independent Financial Research", site.description, "/"),
  title: { absolute: "The Long View — Independent Financial Research" },
};
export default async function Home() {
  const [research, articles] = await Promise.all([
    getAllResearch(),
    getAllArticles(),
  ]);
  const latest = research[0];
  return (
    <div className="shell">
      <section className="home-intro">
        <div>
          <p className="eyebrow intro-label">
            BUSINESSES. MARKETS. PERSPECTIVE.
          </p>
          <h1>
            Look closer.
            <br />
            Think <em>longer.</em>
          </h1>
        </div>
        <div className="intro-description">
          <p>
            Independent research on businesses,
            <br className="desktop-break" /> markets, valuation and financial
            technology.
          </p>
          <span>
            Research and essays by{" "}
            <Link href="/about">
              Khushal Dangar <ArrowUpRight size={13} />
            </Link>
          </span>
        </div>
      </section>
      <section className="home-research">
        <SectionHeading
          title="Latest research"
          href="/research"
          link="View all research"
        />
        {latest && (
          <article className="featured-research">
            <div className="feature-content">
              <div className="feature-label">
                <span className="eyebrow">COMPANY RESEARCH</span>
                <span className="sample-tag">Sample note</span>
              </div>
              <h2>
                <Link href={`/research/${latest.slug}`}>
                  {latest.company}
                  <span aria-hidden="true">.</span>
                </Link>
              </h2>
              <h3>{latest.title}</h3>
              <p>{latest.description}</p>
              <div className="feature-meta">
                <span className="ticker">{latest.ticker}</span>
                <span>{latest.sector}</span>
                <span>{latest.market}</span>
              </div>
              <div className="feature-bottom">
                <EntryDate
                  date={latest.publishedAt}
                  minutes={latest.readingTime}
                />
                <TextLink href={`/research/${latest.slug}`}>
                  Read research
                </TextLink>
              </div>
            </div>
            <aside className="research-lens">
              <span className="eyebrow">THE RESEARCH QUESTION</span>
              <p>
                {latest.question ||
                  "What makes this business durable—and what could change that?"}
              </p>
              <div className="lens-topics">
                <span>
                  01 <span>Business economics</span>
                </span>
                <span>
                  02 <span>Competitive advantage</span>
                </span>
                <span>
                  03 <span>Valuation & risk</span>
                </span>
              </div>
              <span className="lens-foot">A BUSINESS-FIRST PERSPECTIVE</span>
            </aside>
          </article>
        )}
        <div className="recent-research">
          {research.slice(1, 4).map((entry) => (
            <ResearchEntry key={entry.slug} entry={entry} />
          ))}
        </div>
      </section>
      <section className="home-articles">
        <SectionHeading
          title="Latest articles"
          href="/articles"
          link="View all articles"
        />
        <div className="article-grid">
          {articles.slice(0, 4).map((entry) => (
            <ArticleEntry key={entry.slug} entry={entry} />
          ))}
        </div>
      </section>
      <section className="about-strip">
        <p className="eyebrow">ABOUT THIS PUBLICATION</p>
        <div>
          <h2>
            A journal of research.
            <br />A practice in <em>thinking clearly.</em>
          </h2>
          <p>
            I’m Khushal, a Computer Science & AI student exploring how
            businesses, financial markets and technology interact. This is where
            I document what I’m learning—one company, one question, one idea at
            a time.
          </p>
          <TextLink href="/about">More about the publication</TextLink>
        </div>
      </section>
    </div>
  );
}
