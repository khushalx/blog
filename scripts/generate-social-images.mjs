import { readdir, readFile, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import matter from "gray-matter";
import { ImageResponse } from "next/og.js";

const output = path.join(process.cwd(), "public", "social");
await rm(output, { recursive: true, force: true });

const element = (tag, style, children) => React.createElement(tag, { style }, children);
for (const kind of ["articles", "research"]) {
  const directory = path.join(process.cwd(), "content", kind);
  const destination = path.join(output, kind);
  await mkdir(destination, { recursive: true });
  for (const file of await readdir(directory)) {
    if (!file.endsWith(".mdx")) continue;
    const { data } = matter(await readFile(path.join(directory, file), "utf8"));
    if (data.draft === true || data.featuredImage || data.publishedAt > new Date().toISOString().slice(0, 10)) continue;
    if (typeof data.slug !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug))
      throw new Error(`${file}: invalid slug for social image`);
    const title = kind === "research" ? data.company : data.title;
    const subtitle = kind === "research" ? data.title : undefined;
    const label = kind === "research" ? `RESEARCH  /  ${data.sector}` : `ARTICLE  /  ${data.category}`;
    const card = element("div", {
      width: "100%", height: "100%", display: "flex", flexDirection: "column",
      justifyContent: "space-between", padding: "56px 70px", background: "#f8f7f3",
      color: "#252923", borderTop: "16px solid #234c3f",
    }, [
      element("div", { display: "flex", color: "#234c3f", fontSize: 25, letterSpacing: 3 }, label),
      element("div", { display: "flex", flexDirection: "column", gap: 15 }, [
        element("div", { display: "flex", fontSize: title.length > 60 ? 51 : title.length > 40 ? 60 : 73,
          lineHeight: 1.09, maxWidth: 1050 }, title),
        ...(subtitle ? [element("div", { display: "flex", color: "#566159", fontSize: 32, lineHeight: 1.2,
          maxWidth: 1000 }, subtitle)] : []),
      ]),
      element("div", { display: "flex", borderTop: "1px solid #cbd0c6", paddingTop: 25,
        color: "#234c3f", fontSize: 25 }, "The Long View  ·  Khushal Dangar"),
    ]);
    const response = new ImageResponse(card, { width: 1200, height: 630 });
    await writeFile(path.join(destination, `${data.slug}.png`), Buffer.from(await response.arrayBuffer()));
  }
}
