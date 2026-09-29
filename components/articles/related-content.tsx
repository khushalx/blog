import Link from "next/link";
import type { ArticleMeta, ResearchMeta } from "@/lib/content";

export function RelatedContent({
  title,
  kind,
  entries,
}: {
  title: string;
  kind: "articles" | "research";
  entries: (ArticleMeta | ResearchMeta)[];
}) {
  if (!entries.length) return null;
  return (
    <section className="related-content" aria-label={title}>
      <h2>{title}</h2>
      <ul>
        {entries.map((entry) => (
          <li key={entry.slug}>
            <Link href={`/${kind}/${entry.slug}/`}>{entry.title}</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
