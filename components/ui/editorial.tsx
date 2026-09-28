import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { formatDate } from "@/lib/utils/format";
export function TextLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link className="text-link" href={href}>
      {children}
      <ArrowRight size={16} aria-hidden="true" />
    </Link>
  );
}
export function SectionHeading({
  title,
  href,
  link,
}: {
  title: string;
  href: string;
  link: string;
}) {
  return (
    <div className="section-heading">
      <h2 className="eyebrow">{title}</h2>
      <TextLink href={href}>{link}</TextLink>
    </div>
  );
}
export function EntryDate({
  date,
  minutes,
}: {
  date: string;
  minutes: number;
}) {
  return (
    <div className="entry-date">
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden="true">·</span>
      <span>{minutes} min read</span>
    </div>
  );
}
export function DemoNotice() {
  return (
    <aside className="demo-notice">
      <span>Editorial sample</span> This entry demonstrates the publication
      format. Illustrative figures are not reported company data, and research
      questions are not investment recommendations.
    </aside>
  );
}
