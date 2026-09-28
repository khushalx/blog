import { ArrowUpRight } from "lucide-react";
import { site } from "@/lib/site";
import { pageMetadata } from "@/lib/content/metadata";
import { TextLink } from "@/components/ui/editorial";
export const metadata = pageMetadata(
  "About",
  "Khushal Dangar is a Computer Science & AI student studying businesses, financial markets and technology.",
  "/about/",
);
export default function AboutPage() {
  return (
    <div className="shell about-page">
      <header className="page-intro">
        <p className="eyebrow">THE PERSON BEHIND THE NOTES</p>
        <h1>
          Curiosity first.
          <br />
          <em>Conviction earned.</em>
        </h1>
      </header>
      <div className="about-layout">
        <aside>
          <span className="about-monogram" aria-hidden="true">
            kd.
          </span>
          <p>Khushal Dangar</p>
          <span>Computer Science & AI student</span>
          {site.social.length > 0 && (
            <div className="social-links">
              {site.social.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {link.label}
                  <ArrowUpRight size={15} />
                </a>
              ))}
            </div>
          )}
        </aside>
        <div className="about-copy">
          <h2>Hi, I’m Khushal.</h2>
          <p>
            I’m a Computer Science & AI student interested in understanding how
            businesses, financial markets and technology interact.
          </p>
          <p>
            The Long View is my personal research journal. It’s where I document
            my work on companies, markets, valuation and financial technology,
            and try to turn complicated questions into clear writing.
          </p>
          <p>
            My goal is simple: study businesses deeply, work with real data, and
            improve the quality of my thinking over time.
          </p>
          <h3>A work in progress, by design.</h3>
          <p>
            I approach this as a student. Research notes are working documents,
            assumptions deserve to be challenged, and changing my mind is part
            of the process. This publication is a record of that learning, not
            professional investment advice.
          </p>
          <div className="interest-block">
            <p className="eyebrow">AREAS OF INTEREST</p>
            <ul>
              {[
                "Equity Research",
                "Financial Markets",
                "Business Analysis",
                "FinTech",
                "Data & Technology",
              ].map((interest) => (
                <li key={interest}>{interest}</li>
              ))}
            </ul>
          </div>
          <TextLink href="/research">Explore the research</TextLink>
        </div>
      </div>
    </div>
  );
}
