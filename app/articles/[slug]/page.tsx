import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getAllArticles, getArticleBySlug, isIndexable } from "@/lib/content";
import { renderContent } from "@/lib/content/render";
import { contentMetadata } from "@/lib/content/metadata";
import { formatDate } from "@/lib/utils/format";
import { DemoNotice, TextLink } from "@/components/ui/editorial";
import { RelatedContent } from "@/components/articles/related-content";
import { SourceReferences } from "@/components/mdx/source-references";
import { JsonLd, articleSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { site } from "@/lib/site";
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
  const articles = await getAllArticles();
  const related = articles.filter((candidate) => candidate.slug !== meta.slug &&
    (candidate.category === meta.category || candidate.tags.some((tag) => meta.tags.includes(tag)))).slice(0, 3);
  return (
    <div className="shell essay-page">
      {isIndexable(meta, "articles") && <JsonLd data={[articleSchema(meta, "articles"), breadcrumbSchema([
        { name: "Home", path: "/" }, { name: "Articles", path: "/articles/" }, { name: meta.title, path: `/articles/${meta.slug}/` },
      ])]} />}
      <div className="breadcrumb">
        <Link href="/articles/">Articles</Link>
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
              By {meta.author === site.author ? <Link href={site.authorPath}>{meta.author}</Link> : meta.author}
            </span>
            <time dateTime={meta.publishedAt}>
              {formatDate(meta.publishedAt, true)}
            </time>
            <span>{meta.readingTime} min read</span>
            {meta.updatedAt && (
              <span>Updated {formatDate(meta.updatedAt)}</span>
            )}
          </div>
          {meta.tags.length > 0 && <ul className="article-tags" aria-label="Topics">{meta.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul>}
        </header>
        <div className="essay-body">
          {meta.demo && <DemoNotice />}
          {meta.featuredImage && <figure className="featured-image"><Image src={meta.featuredImage} alt={meta.featuredImageAlt || ""} width={meta.featuredImageWidth} height={meta.featuredImageHeight} /><figcaption>{meta.featuredImageAlt}</figcaption></figure>}
          <div className="prose">{content}</div>
          <SourceReferences sources={meta.sources} />
          <RelatedContent title="Related articles" kind="articles" entries={related} />
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
