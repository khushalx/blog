import type { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import { CashFlowLens } from "@/components/articles/cash-flow-lens";
import { PriceOutcomeLens } from "@/components/articles/price-outcome-lens";
import { PaymentCostLens } from "@/components/articles/payment-cost-lens";
import { LeaseSpendingLens } from "@/components/articles/lease-spending-lens";
import { BuybackLens } from "@/components/articles/buyback-lens";
import { MarginPoolLens } from "@/components/articles/margin-pool-lens";
import { GoldGrowthLens } from "@/components/articles/gold-growth-lens";
import { DepositFundingLens } from "@/components/articles/deposit-funding-lens";
import { StorePaybackLens } from "@/components/articles/store-payback-lens";
import { AsianPaintsFinancialLens, AsianPaintsScenario } from "@/components/research/asian-paints-lens";
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
function TableFrame({
  label,
  caption,
  children,
}: {
  label: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <div className={caption ? "table-frame has-caption" : "table-frame"}>
      <p className="table-swipe-hint" aria-hidden="true">
        Swipe to see all columns <span>→</span>
      </p>
      <div
        className="table-scroll"
        role="region"
        aria-label={`${label}; scroll horizontally for more columns`}
        tabIndex={0}
      >
        {children}
      </div>
      {caption && <p className="data-table-note">{caption}</p>}
    </div>
  );
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
    <TableFrame label={caption} caption={caption}>
      <table>
        <caption className="visually-hidden">{caption}</caption>
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
    </TableFrame>
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
      <Image
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
  CashFlowLens,
  PriceOutcomeLens,
  PaymentCostLens,
  LeaseSpendingLens,
  BuybackLens,
  MarginPoolLens,
  GoldGrowthLens,
  DepositFundingLens,
  StorePaybackLens,
  AsianPaintsFinancialLens,
  AsianPaintsScenario,
  table: (props: ComponentProps<"table">) => (
    <TableFrame label="Article data table">
      <table {...props} />
    </TableFrame>
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
    // MDX permits arbitrary source images; static export has no image optimizer.
    // eslint-disable-next-line @next/next/no-img-element
    <img {...props} alt={alt || ""} loading="lazy" decoding="async" />
  ),
};
