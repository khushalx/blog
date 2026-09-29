import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const origin = process.env.NEXT_PUBLIC_SITE_URL;
if (!origin) {
  console.error("Set NEXT_PUBLIC_SITE_URL to the exact public HTTPS origin before a public build.");
  process.exit(1);
}
let url;
try { url = new URL(origin); } catch {
  console.error("NEXT_PUBLIC_SITE_URL is not a valid URL.");
  process.exit(1);
}
if (url.protocol !== "https:" || url.pathname !== "/" || url.search || url.hash ||
    /(^localhost$|\.example$|^127\.)/.test(url.hostname)) {
  console.error("NEXT_PUBLIC_SITE_URL must be the public HTTPS origin with no path, query or fragment.");
  process.exit(1);
}
console.log(`Canonical origin: ${url.origin}`);

let publishable = 0;
for (const kind of ["articles", "research"]) {
  const directory = path.join(process.cwd(), "content", kind);
  for (const file of await readdir(directory)) {
    if (!file.endsWith(".mdx")) continue;
    const { data } = matter(await readFile(path.join(directory, file), "utf8"));
    if (data.demo !== true && data.draft !== true && data.noindex !== true &&
        data.publishedAt <= new Date().toISOString().slice(0, 10)) publishable++;
  }
}
if (!publishable) {
  console.error("Public build blocked: all current pieces are demos, drafts, noindex, or future-dated. Publish at least one verified original piece first.");
  process.exit(1);
}
console.log(`Indexable published pieces: ${publishable}`);
