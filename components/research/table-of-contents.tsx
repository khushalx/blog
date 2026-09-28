import type { Heading } from "@/lib/content/render";
export function TableOfContents({ headings }: { headings: Heading[] }) {
  const list = (
    <ol>
      {headings
        .filter((heading) => heading.level === 2)
        .map((heading, index) => (
          <li key={heading.id}>
            <a href={`#${heading.id}`}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {heading.text}
            </a>
          </li>
        ))}
    </ol>
  );
  return (
    <>
      <aside className="desktop-contents">
        <nav aria-label="Research contents">
          <p className="eyebrow">In this research</p>
          {list}
          <a className="back-top" href="#report-title">
            Back to top ↑
          </a>
        </nav>
      </aside>
      <details className="mobile-contents">
        <summary>
          Contents{" "}
          <span>{headings.filter((h) => h.level === 2).length} sections</span>
        </summary>
        <nav aria-label="Research contents">{list}</nav>
      </details>
    </>
  );
}
