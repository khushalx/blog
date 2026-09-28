import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ResearchMeta } from "@/lib/content";
import { EntryDate } from "@/components/ui/editorial";
export function ResearchEntry({
  entry,
  number,
}: {
  entry: ResearchMeta;
  number?: number;
}) {
  return (
    <article className="research-entry">
      <div className="research-company">
        {number !== undefined && (
          <span className="index-number">
            {String(number).padStart(2, "0")}
          </span>
        )}
        <h3>{entry.company}</h3>
        <span className="ticker">
          {entry.ticker} <span>· {entry.sector}</span>
        </span>
      </div>
      <div className="research-entry-body">
        <Link href={`/research/${entry.slug}`} className="entry-title">
          {entry.title}
        </Link>
        <p>{entry.description}</p>
        <EntryDate date={entry.publishedAt} minutes={entry.readingTime} />
      </div>
      <Link
        className="arrow-link"
        href={`/research/${entry.slug}`}
        aria-label={`Read research on ${entry.company}`}
      >
        <ArrowUpRight size={22} />
      </Link>
    </article>
  );
}
