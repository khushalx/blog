import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ArticleMeta } from "@/lib/content";
import { EntryDate } from "@/components/ui/editorial";
export function ArticleEntry({ entry }: { entry: ArticleMeta }) {
  return (
    <article className="article-entry">
      <span className="eyebrow category">{entry.category}</span>
      <h3>
        <Link href={`/articles/${entry.slug}`}>{entry.title}</Link>
      </h3>
      <p>{entry.description}</p>
      <div className="article-entry-bottom">
        <EntryDate date={entry.publishedAt} minutes={entry.readingTime} />
        <Link
          className="arrow-link"
          href={`/articles/${entry.slug}`}
          aria-label={`Read ${entry.title}`}
        >
          <ArrowUpRight size={19} />
        </Link>
      </div>
    </article>
  );
}
