import type { BaseMeta, ContentKind } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

type Schema = Record<string, unknown>;

export function JsonLd({ data }: { data: Schema | Schema[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

export const authorSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: site.author,
  url: absoluteUrl(site.authorPath),
  sameAs: site.social.filter((link) => link.label === "LinkedIn").map((link) => link.href),
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: site.name,
  url: site.url,
  description: site.description,
  publisher: { "@type": "Person", name: site.author, url: absoluteUrl(site.authorPath) },
};

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(meta: BaseMeta, kind: ContentKind) {
  const url = absoluteUrl(`/${kind}/${meta.slug}/`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    url,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    datePublished: meta.publishedAt,
    dateModified: meta.updatedAt || meta.publishedAt,
    author: meta.author === site.author
      ? { "@type": "Person", name: meta.author, url: absoluteUrl(site.authorPath) }
      : { "@type": "Person", name: meta.author },
    publisher: { "@type": "Person", name: site.author, url: absoluteUrl(site.authorPath) },
    image: meta.featuredImage ? absoluteUrl(meta.featuredImage) : absoluteUrl(`/social/${kind}/${meta.slug}.png`),
  };
}
