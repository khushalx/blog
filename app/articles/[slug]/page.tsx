import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "@/lib/content";
import { renderContent } from "@/lib/content/render";
import { contentMetadata } from "@/lib/content/metadata";
import { formatDate } from "@/lib/utils/format";
import { DemoNotice, TextLink } from "@/components/ui/editorial";
export const dynamicParams = false;
export async function generateStaticParams() {
  return (await getAllArticles()).map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = await getArticleBySlug((await params).slug);
  if (!entry) notFound();
  return contentMetadata(entry.meta, "articles");
}
export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const entry = await getArticleBySlug((await params).slug);
  if (!entry) notFound();
  const { meta } = entry;
  const { content } = await renderContent(entry.body);
  return (
    <div className="shell essay-page">
      <div className="breadcrumb">
        <a href="/articles/">Articles</a>
        <span>/</span>
        <span>{meta.category}</span>
      </div>
      <article>
        <header className="essay-header">
          <p className="eyebrow">{meta.category}</p>
          <h1>{meta.title}</h1>
          <p className="essay-description">{meta.description}</p>
          <div className="report-byline">
            <span>
              By <a href="/about/">Khushal Dangar</a>
            </span>
            <time dateTime={meta.publishedAt}>
              {formatDate(meta.publishedAt, true)}
            </time>
            <span>{meta.readingTime} min read</span>
            {meta.updatedAt && (
              <span>Updated {formatDate(meta.updatedAt)}</span>
            )}
          </div>
        </header>
        <div className="essay-body">
          {meta.demo && <DemoNotice />}
          <div className="prose">{content}</div>
          <div className="reading-end">
            <span className="brand-mark small" aria-hidden="true">
              lv.
            </span>
            <TextLink href="/articles">Explore more articles</TextLink>
          </div>
        </div>
      </article>
    </div>
  );
}
