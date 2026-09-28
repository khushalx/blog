import type { MetadataRoute } from "next";
import { getAllResearch, getAllArticles } from "@/lib/content";
import { site } from "@/lib/site";
export const dynamic = "force-static";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [research, articles] = await Promise.all([
    getAllResearch(),
    getAllArticles(),
  ]);
  return [
    ...["/", "/research/", "/articles/", "/about/"].map((path) => ({
      url: new URL(path, site.url).href,
    })),
    ...research.map((entry) => ({
      url: new URL(`/research/${entry.slug}/`, site.url).href,
      lastModified: entry.updatedAt || entry.publishedAt,
    })),
    ...articles.map((entry) => ({
      url: new URL(`/articles/${entry.slug}/`, site.url).href,
      lastModified: entry.updatedAt || entry.publishedAt,
    })),
  ];
}
