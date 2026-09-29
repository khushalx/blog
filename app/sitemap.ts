import type { MetadataRoute } from "next";
import { getAllResearch, getAllArticles, isIndexable } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [research, articles] = await Promise.all([
    getAllResearch(),
    getAllArticles(),
  ]);
  return [
    ...["/about/", "/author/khushal-dangar/", "/editorial-policy/", "/disclaimer/", "/privacy/"].map((path) => ({
      url: absoluteUrl(path),
    })),
    ...((research.some((entry) => isIndexable(entry, "research")) || articles.some((entry) => isIndexable(entry, "articles"))) ? [{ url: absoluteUrl("/") }] : []),
    ...(research.some((entry) => isIndexable(entry, "research")) ? [{ url: absoluteUrl("/research/") }] : []),
    ...(articles.some((entry) => isIndexable(entry, "articles")) ? [{ url: absoluteUrl("/articles/") }] : []),
    ...research.filter((entry) => isIndexable(entry, "research")).map((entry) => ({
      url: absoluteUrl(`/research/${entry.slug}/`),
      lastModified: entry.updatedAt || entry.publishedAt,
    })),
    ...articles.filter((entry) => isIndexable(entry, "articles")).map((entry) => ({
      url: absoluteUrl(`/articles/${entry.slug}/`),
      lastModified: entry.updatedAt || entry.publishedAt,
    })),
  ];
}
