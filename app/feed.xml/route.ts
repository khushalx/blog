import { getAllArticles, getAllResearch, isIndexable } from "@/lib/content";
import { absoluteUrl, site } from "@/lib/site";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}

export async function GET() {
  const [articles, research] = await Promise.all([getAllArticles(), getAllResearch()]);
  const items = [
    ...articles.filter((entry) => isIndexable(entry, "articles")).map((entry) => ({ ...entry, kind: "articles" })),
    ...research.filter((entry) => isIndexable(entry, "research")).map((entry) => ({ ...entry, kind: "research" })),
  ].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)).slice(0, 20);
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/"><channel><title>${xml(site.name)}</title><link>${xml(site.url)}</link><description>${xml(site.description)}</description><language>en</language><atom:link href="${xml(absoluteUrl("/feed.xml"))}" rel="self" type="application/rss+xml"/>${items.map((item) => {
    const url = absoluteUrl(`/${item.kind}/${item.slug}/`);
    return `<item><title>${xml(item.title)}</title><link>${xml(url)}</link><guid isPermaLink="true">${xml(url)}</guid><description>${xml(item.description)}</description><pubDate>${new Date(`${item.publishedAt}T00:00:00Z`).toUTCString()}</pubDate><dc:creator>${xml(item.author)}</dc:creator></item>`;
  }).join("")}</channel></rss>`;
  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
