import type { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
export function ResearchCallout({
  title = "The key idea",
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="research-callout">
      <span className="eyebrow">{title}</span>
      <div>{children}</div>
    </aside>
  );
}
export function ResearchQuestion({ children }: { children: ReactNode }) {
  return (
    <aside className="research-question">
      <span className="eyebrow">A question worth asking</span>
      <div>{children}</div>
    </aside>
  );
}
export function Metric({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change?: string;
}) {
  return (
    <div className="metric">
      <span>{label}</span>
      <strong>{value}</strong>
      {change && <small>{change}</small>}
    </div>
  );
}
export function Risk({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <aside className="risk">
      {title && <strong>{title}</strong>}
      <div>{children}</div>
    </aside>
  );
}
export function SourceNote({ children }: { children: ReactNode }) {
  return <div className="source-note">{children}</div>;
}
export function DataTable({
  caption,
  columns,
  rows,
}: {
  caption: string;
  columns: string[];
  rows: (string | number)[][];
}) {
  return (
    <div
      className="table-scroll"
      role="region"
      aria-label={caption}
      tabIndex={0}
    >
      <table>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th scope="col" key={column}>
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th scope="row" key={j}>
                    {cell}
                  </th>
                ) : (
                  <td key={j}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export function Sources({ children }: { children: ReactNode }) {
  return <div className="sources">{children}</div>;
}
export function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 600,
}: {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}) {
  return (
    <figure>
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading="lazy"
        decoding="async"
      />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
export const mdxComponents: MDXComponents = {
  ResearchCallout,
  ResearchQuestion,
  Metric,
  Risk,
  DataTable,
  SourceNote,
  Sources,
  Figure,
  table: (props: ComponentProps<"table">) => (
    <div
      className="table-scroll"
      tabIndex={0}
      role="region"
      aria-label="Article data table"
    >
      <table {...props} />
    </div>
  ),
  a: ({ href, children, ...props }: ComponentProps<"a">) => (
    <a
      href={href}
      {...props}
      {...(href?.startsWith("http")
        ? { target: "_blank", rel: "noreferrer" }
        : {})}
    >
      {children}
    </a>
  ),
  img: ({ alt, ...props }: ComponentProps<"img">) => (
    <img {...props} alt={alt || ""} loading="lazy" decoding="async" />
  ),
};
