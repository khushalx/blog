import type { Metadata } from "next";
import type { BaseMeta, ContentKind } from ".";
import { site } from "@/lib/site";
export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
): Metadata {
  return {
    title,
    description,
    alternates: { canonical: pathname },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url: pathname,
      type: "website",
      siteName: site.name,
    },
    twitter: { card: "summary", title, description },
  };
}
export function contentMetadata(meta: BaseMeta, kind: ContentKind): Metadata {
  return {
    ...pageMetadata(meta.title, meta.description, `/${kind}/${meta.slug}/`),
    authors: [{ name: site.author }],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `/${kind}/${meta.slug}/`,
      type: "article",
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt || meta.publishedAt,
      authors: [site.author],
      siteName: site.name,
    },
  };
}
