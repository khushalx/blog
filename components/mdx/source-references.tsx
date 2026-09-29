import type { Source } from "@/lib/content";

export function SourceReferences({ sources }: { sources: Source[] }) {
  if (!sources.length) return null;
  return (
    <section className="source-references" aria-label="Sources and references">
      <h2>Sources &amp; References</h2>
      <ol>
        {sources.map((source) => (
          <li key={source.url}>
            {source.name}: <a href={source.url} target="_blank" rel="noopener noreferrer">{source.title}</a>
            {source.publishedAt && <> · Published <time dateTime={source.publishedAt}>{source.publishedAt}</time></>}
            {source.accessedAt && <> · Accessed <time dateTime={source.accessedAt}>{source.accessedAt}</time></>}
          </li>
        ))}
      </ol>
    </section>
  );
}
