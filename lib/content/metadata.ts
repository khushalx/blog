import type { Metadata } from "next";
import type { BaseMeta, ContentKind } from ".";
import { isIndexable } from ".";
import { absoluteUrl, site } from "@/lib/site";
export function pageMetadata(
  title: string,
  description: string,
  pathname: string,
  indexable = true,
): Metadata {
  const url = absoluteUrl(pathname);
  return {
    title,
    description,
    alternates: { canonical: url, types: { "application/rss+xml": "/feed.xml" } },
    robots: { index: indexable, follow: true },
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      url,
      type: "website",
      siteName: site.name,
      images: [{ url: absoluteUrl("/social-card.png"), width: 1200, height: 630, alt: site.name }],
    },
    twitter: { card: "summary_large_image", title, description, images: [absoluteUrl("/social-card.png")] },
  };
}
export function contentMetadata(meta: BaseMeta, kind: ContentKind): Metadata {
  const path = `/${kind}/${meta.slug}/`;
  const url = absoluteUrl(path);
  const image = meta.featuredImage
    ? absoluteUrl(meta.featuredImage)
    : absoluteUrl(process.env.NODE_ENV === "production"
      ? `/social/${kind}/${meta.slug}.png`
      : "/social-card.png");
  return {
    ...pageMetadata(meta.title, meta.description, path, isIndexable(meta, kind)),
    alternates: { canonical: meta.canonical ? absoluteUrl(meta.canonical) : url,
      types: { "application/rss+xml": "/feed.xml" } },
    authors: [{ name: meta.author, ...(meta.author === site.author ? { url: site.authorPath } : {}) }],
    openGraph: {
      title: meta.title,
      description: meta.description,
      url,
      type: "article",
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt || meta.publishedAt,
      authors: [meta.author],
      siteName: site.name,
      images: [{ url: image, alt: meta.featuredImageAlt || site.name,
        width: meta.featuredImageWidth || 1200, height: meta.featuredImageHeight || 630 }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: [image] },
  };
}
