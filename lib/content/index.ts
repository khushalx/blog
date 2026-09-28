import fs from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import { articleCategories, sectors } from "@/lib/site";
export type ContentKind = "research" | "articles";
export type BaseMeta = {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  readingTime: number;
  featured: boolean;
  slug: string;
  demo: boolean;
};
export type ResearchMeta = BaseMeta & {
  company: string;
  ticker: string;
  sector: string;
  status: string;
  market: string;
  focus: string;
  question?: string;
};
export type ArticleMeta = BaseMeta & { category: string };
export type Entry<T> = { meta: T; body: string };
function required(
  data: Record<string, unknown>,
  key: string,
  file: string,
): string {
  const value = data[key];
  if (typeof value !== "string" || !value.trim())
    throw new Error(`${file}: frontmatter ${key} must be a nonempty string`);
  return value;
}
function dateField(data: Record<string, unknown>, key: string, file: string) {
  const value = required(data, key, file);
  if (
    !/^\d{4}-\d{2}-\d{2}$/.test(value) ||
    Number.isNaN(Date.parse(value)) ||
    new Date(value).toISOString().slice(0, 10) !== value
  )
    throw new Error(
      `${file}: ${key} must be a valid YYYY-MM-DD date in quotes`,
    );
  return value;
}
const load = cache(
  async (kind: ContentKind): Promise<Entry<ResearchMeta | ArticleMeta>[]> => {
    const directory = path.join(process.cwd(), "content", kind);
    const files = (await fs.readdir(directory)).filter((file) =>
      file.endsWith(".mdx"),
    );
    const entries = await Promise.all(
      files.map(async (file) => {
        const { data, content: body } = matter(
          await fs.readFile(path.join(directory, file), "utf8"),
        );
        const slug = required(data, "slug", file);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug))
          throw new Error(`${file}: invalid slug`);
        const readingTime =
          data.readingTime ??
          Math.max(1, Math.ceil(body.split(/\s+/).length / 220));
        if (!Number.isInteger(readingTime) || readingTime < 1)
          throw new Error(`${file}: invalid readingTime`);
        for (const key of ["featured", "demo"])
          if (data[key] !== undefined && typeof data[key] !== "boolean")
            throw new Error(`${file}: ${key} must be boolean`);
        const base: BaseMeta = {
          title: required(data, "title", file),
          description: required(data, "description", file),
          slug,
          publishedAt: dateField(data, "publishedAt", file),
          updatedAt: data.updatedAt
            ? dateField(data, "updatedAt", file)
            : undefined,
          readingTime,
          featured: data.featured === true,
          demo: data.demo === true,
        };
        if (base.updatedAt && base.updatedAt < base.publishedAt)
          throw new Error(`${file}: updatedAt precedes publishedAt`);
        if (kind === "research") {
          const sector = required(data, "sector", file);
          if (!(sectors as readonly string[]).includes(sector))
            throw new Error(`${file}: unknown sector`);
          return {
            body,
            meta: {
              ...base,
              company: required(data, "company", file),
              ticker: required(data, "ticker", file),
              sector,
              status: required(data, "status", file),
              market: data.market || "India",
              focus:
                data.focus ||
                "Business quality, industry structure and valuation",
              question: data.question,
            } as ResearchMeta,
          };
        }
        const category = required(data, "category", file);
        if (!(articleCategories as readonly string[]).includes(category))
          throw new Error(`${file}: unknown category`);
        return { body, meta: { ...base, category } as ArticleMeta };
      }),
    );
    if (new Set(entries.map(({ meta }) => meta.slug)).size !== entries.length)
      throw new Error(`${kind}: duplicate slugs`);
    return entries.sort((a, b) =>
      b.meta.publishedAt.localeCompare(a.meta.publishedAt),
    );
  },
);
export const getAllResearch = async () =>
  (await load("research")).map(({ meta }) => meta as ResearchMeta);
export const getAllArticles = async () =>
  (await load("articles")).map(({ meta }) => meta as ArticleMeta);
export const getResearchBySlug = async (slug: string) =>
  (await load("research")).find((entry) => entry.meta.slug === slug) as
    Entry<ResearchMeta> | undefined;
export const getArticleBySlug = async (slug: string) =>
  (await load("articles")).find((entry) => entry.meta.slug === slug) as
    Entry<ArticleMeta> | undefined;
export const getFeaturedContent = async () => ({
  research: (await getAllResearch()).filter((entry) => entry.featured),
  articles: (await getAllArticles()).filter((entry) => entry.featured),
});
