import Link from "next/link";
import { getAllArticles, getAllResearch } from "@/lib/content";
import { pageMetadata } from "@/lib/content/metadata";
import { JsonLd, authorSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { site } from "@/lib/site";

export const metadata = pageMetadata("Khushal Dangar — Author",
  "Research and essays by Khushal Dangar, a Computer Science & AI student studying businesses, markets and financial technology.",
  site.authorPath);

export default async function AuthorPage() {
  const [articles, research] = await Promise.all([getAllArticles(), getAllResearch()]);
  return <div className="shell trust-page">
    <JsonLd data={[authorSchema, breadcrumbSchema([{ name: "Home", path: "/" }, { name: site.author, path: site.authorPath }])]} />
    <p className="eyebrow">AUTHOR</p><h1>Khushal Dangar</h1>
    <p className="trust-lead">Computer Science &amp; AI student exploring businesses, financial markets, valuation and technology through independent research and clear writing.</p>
    <p>My research notes are working documents. I use primary sources where possible, show assumptions, and distinguish observed facts from interpretation. This publication is a record of learning, not a professional investment advisory service.</p>
    <p><Link href="/about/">Read more about the publication</Link> · <Link href="/editorial-policy/">Editorial and research policy</Link></p>
    {research.length > 0 && <><h2>Research</h2><ul>{research.filter((entry) => entry.author === site.author).map((entry) => <li key={entry.slug}><Link href={`/research/${entry.slug}/`}>{entry.company}: {entry.title}</Link></li>)}</ul></>}
    <h2>Articles</h2><ul>{articles.filter((entry) => entry.author === site.author).map((entry) => <li key={entry.slug}><Link href={`/articles/${entry.slug}/`}>{entry.title}</Link></li>)}</ul>
  </div>;
}
