import { notFound } from "next/navigation";
import { getAllResearch, getResearchBySlug } from "@/lib/content";
import { renderContent } from "@/lib/content/render";
import { contentMetadata } from "@/lib/content/metadata";
import { formatDate } from "@/lib/utils/format";
import { TableOfContents } from "@/components/research/table-of-contents";
import { DemoNotice, TextLink } from "@/components/ui/editorial";
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
  return (
    <div className="shell report-page">
      <div className="breadcrumb">
        <a href="/research/">Research</a>
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
              Research by <a href="/about/">Khushal Dangar</a>
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
            <div className="prose">{content}</div>
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
