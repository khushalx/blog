import { getAllArticles } from "@/lib/content";
import { ArticleEntry } from "@/components/articles/article-entry";
import { pageMetadata } from "@/lib/content/metadata";
export const metadata = pageMetadata(
  "Articles",
  "Essays and explainers on markets, businesses, investing, economics and financial technology.",
  "/articles/",
);
export default async function ArticlesPage() {
  const articles = await getAllArticles();
  return (
    <div className="shell index-page">
      <header className="page-intro">
        <p className="eyebrow">IDEAS & PERSPECTIVES</p>
        <h1>
          Beyond the numbers.
          <br />
          <em>Into the ideas.</em>
        </h1>
        <div className="index-subtitle">
          <h2>Articles</h2>
          <p>
            Essays and explainers on markets, businesses, investing,
            <br className="desktop-break" /> economics and financial technology.
          </p>
        </div>
      </header>
      <div className="section-heading">
        <span className="eyebrow">
          ALL ARTICLES <span className="count">{articles.length}</span>
        </span>
        <span className="eyebrow muted">NEWEST FIRST</span>
      </div>
      <div className="article-grid index-articles">
        {articles.map((entry) => (
          <ArticleEntry key={entry.slug} entry={entry} />
        ))}
      </div>
    </div>
  );
}
