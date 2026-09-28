# The Long View

A personal financial research publication by Khushal Dangar. Built with Next.js 16.3.6 App Router, TypeScript, Tailwind CSS 4 and local MDX. Newsreader and DM Sans are self-hosted. No CMS, database, external font requests or financial APIs are required.

## Run

Requires Node.js 20.9+ and npm (Node.js 24 recommended).

```sh
npm ci
npm run dev
```

Open http://localhost:3000. To check and serve the production export:

```sh
npm run build
npm run typecheck
npm start
```

Stop the dev server before running `npm start` on the same port, or use `PORT=3001 npm start`. The production output is `out/`, suitable for a static host. The tiny Node preview server is for checking this export locally; hosted production uses the static hosting platform.

## Architecture

```text
app/                      App Router pages, metadata, sitemap and robots
  research/[slug]/        Research report layout and static generation
  articles/[slug]/        Essay layout and static generation
  about/                 Author and publication information
  globals.css            Editorial design tokens and responsive styles
components/
  layout/                Header, accessible mobile navigation and footer
  research/              Library, sector controls, entries and contents
  articles/              Reusable article listings
  mdx/                   Callouts, metrics, risks, sources, figures and tables
  ui/                    Shared editorial links, dates and sample notice
content/
  research/              Research MDX files
  articles/              Article MDX files
lib/
  content/               Validated frontmatter, loading, sorting, MDX and SEO
  utils/                 Shared date formatting
  site.ts                Publication identity, navigation, categories and links
scripts/serve.mjs         Local static-export preview
tests/                   Browser smoke and responsive checks
```

Most UI renders on the server at build time. Client JavaScript is limited to navigation and the small research sector filter. There is no client MDX compiler. The data-access functions in `lib/content/index.ts` form the boundary for a future CMS; the frontend consumes typed metadata and entries rather than reading files directly.

## Add research

Create `content/research/your-company.mdx`. Metadata is read automatically; there is no second list to update. Use quoted ISO dates and unique lowercase, hyphenated slugs.

```mdx
---
title: "The question your research explores"
company: "Company Name"
ticker: "TICKER"
sector: "Consumer"
description: "A concise explanation of the research focus."
publishedAt: "2026-09-28"
updatedAt: "2026-09-28"
readingTime: 8
featured: false
status: "Ongoing Research"
slug: "your-company"
market: "India"
focus: "Business quality, financial performance and valuation"
question: "What makes this business durable?"
demo: false
---

## Executive Summary

Your research begins here.

<ResearchCallout title="Key observation">
  The observation, supported by evidence.
</ResearchCallout>

## Sources & References

<Sources>

1. [Document title](https://example.com/verified-document) — date and page.

</Sources>
```

Allowed sectors: Consumer, Financials, Technology, Industrial, Other. Optional fields: `updatedAt`, `readingTime` (estimated from words if omitted), `featured`, `market`, `focus`, `question`, and `demo`. All remaining fields shown are required. Invalid metadata and duplicate slugs fail the build with a filename. Slugs determine URLs independently from filenames.

Research contents are collected from rendered Markdown headings, using the same IDs as the page. H2 sections appear in the desktop sidebar and mobile disclosure. H3s remain subsections. The newest research note leads the homepage; `getFeaturedContent()` also supports curated selections later.

## Add articles

Create `content/articles/your-article.mdx`:

```mdx
---
title: "Your article title"
description: "A concise description of the idea."
category: "Valuation"
publishedAt: "2026-09-28"
readingTime: 6
featured: false
slug: "your-article"
demo: false
---

Your opening paragraph.

## A useful heading

Develop the idea here.
```

Allowed categories: Markets, Investing, Valuation, Business, Economics, FinTech, Data. `updatedAt` is optional. Reading time and flags follow the same rules as research. Listings are sorted newest first. Rebuild to publish any content changes; there is no runtime editing backend.

## MDX components

All components are available without imports:

```mdx
<ResearchCallout title="The key idea">Observation</ResearchCallout>
<ResearchQuestion>What would change the thesis?</ResearchQuestion>
<Risk title="A specific risk">Explain the mechanism.</Risk>
<Metric label="Illustrative margin" value="16%" change="Example only" />
<SourceNote>Source, date, definition or methodological caveat.</SourceNote>
<DataTable
  caption="Illustrative figures, ₹ crore"
  columns={["Year", "Revenue"]}
  rows={[["Year 1", "100"]]}
/>
<Figure
  src="/images/chart.webp"
  alt="Explain the chart’s finding"
  width={1200}
  height={600}
  caption="Verified source and units"
/>
```

Standard Markdown headings, lists, emphasis, links, tables, fenced code and GFM footnotes (`[^note]`) are supported. Put images in `public/images/`. Supply useful alt text, intrinsic dimensions and an appropriately compressed WebP/AVIF file. Static export has no image-optimisation server; images are responsive and lazy-loaded, but authors must resize/compress assets before committing. `Figure` avoids layout shifts through explicit dimensions.

MDX is executable source. Only compile trusted, reviewed repository files. JavaScript expressions are enabled for structured component props; never pass user submissions or untrusted remote MDX into this renderer. A future CMS should preserve this trust boundary or use a restricted content format.

## Identity, social links and SEO

Copy `.env.example` to `.env.local` if you want local overrides. Configure:

- `NEXT_PUBLIC_SITE_URL`: your canonical HTTPS origin; the default is the assigned private Sites URL. Replace it when moving to your public domain.
- `NEXT_PUBLIC_LINKEDIN_URL`: your exact LinkedIn profile URL.
- `NEXT_PUBLIC_GITHUB_URL`: your exact GitHub profile URL.

Social links are omitted until real profile URLs are supplied; no handles are guessed. Rebuild after changing these values. `lib/site.ts` controls the name, author, navigation and taxonomies. Metadata, canonical URLs, OpenGraph, Twitter summary metadata, sitemap and robots are generated automatically. The private deployment remains access-controlled; switch audience intentionally when ready to publish your verified writing.

## Sample content and editorial accuracy

V1 includes three sample research notes and four sample essays. Asian Paints and the high-P/E essay have substantial bodies. All samples carry `demo: true`, which displays an editorial sample notice. Invented numbers are explicitly labelled. Two shorter research entries are research outlines, not completed assessments. No sample has a buy/sell rating or price target.

Before publishing a real report, replace demonstration data with verified figures, state definitions and periods, link the actual documents and page numbers, and set `demo: false` only when appropriate. A company or source link is not evidence for every hypothesis in an article.

## Validation

```sh
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
```

Browser checks cover all eleven content/navigation routes, runtime errors, metadata, internal links, sitemap/robots, missing-page handling, sector filtering and empty states, contents anchors, footnotes, and layouts at 390, 768 and 1440 pixels. Also checked at 320 pixels for horizontal overflow. Screenshot artifacts are written to ignored `test-results/`.

## Deliberately left for V2

No tools, live prices, APIs, authentication, subscriptions, newsletter backend, comments, portfolios, recommendation engine, CMS or admin UI. A future `/tools` route can be added through the central navigation configuration without changing the publication templates. Research data components are presentational, with no invented live data service. Analytics and a reading-progress widget are omitted to keep the first version quiet and light.
