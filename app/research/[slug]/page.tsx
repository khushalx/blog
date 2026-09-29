import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllResearch, getResearchBySlug, isIndexable } from "@/lib/content";
import { renderContent } from "@/lib/content/render";
import { contentMetadata } from "@/lib/content/metadata";
import { formatDate } from "@/lib/utils/format";
import { TableOfContents } from "@/components/research/table-of-contents";
import { DemoNotice, TextLink } from "@/components/ui/editorial";
import { RelatedContent } from "@/components/articles/related-content";
import { SourceReferences } from "@/components/mdx/source-references";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { site } from "@/lib/site";
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getAllResearch()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = await getResearchBySlug((await params).slug);
  if (!entry) notFound();
  return contentMetadata(entry.meta, "research");
}
export default async function ResearchReport({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = await getResearchBySlug((await params).slug);
  if (!entry) notFound();
  const { meta } = entry;
  const { content, headings } = await renderContent(entry.body);
  const research = await getAllResearch();
  const related = research.filter((candidate) => candidate.slug !== meta.slug && candidate.sector === meta.sector).slice(0, 3);
  return (
    <div className="shell report-page">
      {isIndexable(meta, "research") && <JsonLd data={[articleSchema(meta, "research"), breadcrumbSchema([
        { name: "Home", path: "/" }, { name: "Research", path: "/research/" }, { name: meta.company, path: `/research/${meta.slug}/` },
      ])]} />}
      <div className="breadcrumb">
        <Link href="/research/">Research</Link>
        <span>/</span>
        <span>{meta.company}</span>
      </div>
      <article>
        <header className="report-header">
          <div className="report-kicker">
            <span className="eyebrow">COMPANY RESEARCH</span>
            <span className="status">{meta.status}</span>
          </div>
          <h1 id="report-title">
            {meta.company}
            <span>.</span>
          </h1>
          <p className="report-subtitle">{meta.title}</p>
          <div className="feature-meta">
            <span className="ticker">{meta.ticker}</span>
            <span>{meta.sector}</span>
          </div>
          <div className="report-byline">
            <span>
              Research by {meta.author === site.author ? <Link href={site.authorPath}>{meta.author}</Link> : meta.author}
            </span>
            <span>
              Published{" "}
              <time dateTime={meta.publishedAt}>
                {formatDate(meta.publishedAt, true)}
              </time>
            </span>
            <span>{meta.readingTime} min read</span>
            {meta.updatedAt && (
              <span>Updated {formatDate(meta.updatedAt)}</span>
            )}
          </div>
          {meta.tags.length > 0 && <ul className="article-tags" aria-label="Topics">{meta.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
        </header>
        <section className="snapshot" aria-label="Research snapshot">
          <h2 className="eyebrow">RESEARCH SNAPSHOT</h2>
          <dl>
            <div>
              <dt>Company</dt>
              <dd>{meta.company}</dd>
            </div>
            <div>
              <dt>Sector / Market</dt>
              <dd>
                {meta.sector} / {meta.market}
              </dd>
            </div>
            <div>
              <dt>Research focus</dt>
              <dd>{meta.focus}</dd>
            </div>
          </dl>
        </section>
        <div className="report-layout">
          <TableOfContents headings={headings} />
          <div className="report-body">
            {meta.demo && <DemoNotice />}
            {meta.featuredImage && <figure className="featured-image"><Image src={meta.featuredImage} alt={meta.featuredImageAlt || ""} width={meta.featuredImageWidth} height={meta.featuredImageHeight} /><figcaption>{meta.featuredImageAlt}</figcaption></figure>}
            <div className="prose">{content}</div>
            <SourceReferences sources={meta.sources} />
            <RelatedContent title="Related research" kind="research" entries={related} />
            <div className="reading-end">
              <span className="brand-mark small" aria-hidden="true">
                lv.
              </span>
              <p>Good research leaves room for better questions.</p>
              <TextLink href="/research">Back to the research library</TextLink>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
}
