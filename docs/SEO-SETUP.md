# SEO setup and publishing

The site is a Next.js static export. `npm run build` writes files to `out/`. Set `NEXT_PUBLIC_SITE_URL` to the **exact public HTTPS origin** at build time, then use `npm run build:public` for a launch build. That command also requires at least one original, indexable piece. The URL in the built HTML, sitemap, RSS and social tags is fixed until the next build. Without the variable, local builds use `http://localhost:3000` for metadata and are unsuitable for public deployment. A private or login-protected host cannot be indexed by public search engines.

## What is in place

- One canonical URL and unique title/description per route; published MDX metadata drives content pages.
- `robots.txt` allows public content and lists the sitemap. `sitemap.xml` includes only indexable pages. `feed.xml` includes the 20 newest indexable pieces.
- `WebSite`, `Person`, `Article` and `BreadcrumbList` JSON-LD where applicable. Demo articles deliberately have no Article JSON-LD.
- Open Graph and X/Twitter cards use a static 1200 × 630 PNG fallback at `/social-card.png`. Each published entry receives a generated branded PNG in `public/social/` during `npm run build`; a real featured image can override it. The generated directory is intentionally ignored by Git and rebuilt from MDX.
- Author, editorial policy, disclaimer and privacy pages. Article and research bylines link to the author profile.
- A demo entry is readable but marked `noindex` and omitted from sitemap and RSS. A draft or future-dated entry is excluded from public lists and generated routes. The publication currently has one sourced article and no research reports. The research index remains available with an honest empty state until the first report is published.

## Add an article or research note

Create `content/articles/<slug>.mdx` or `content/research/<slug>.mdx`. The filename and `slug` should match. Use the frontmatter fields below and write a unique description that accurately explains the piece. Use normal H2/H3 headings within the MDX body; the page supplies its H1. Cite significant financial claims with linked primary sources, and mark estimates and scenarios clearly. Avoid duplicate source lists: use either the `sources` frontmatter or a Sources section in MDX.

```yaml
---
title: "A specific, useful title"
slug: "a-specific-useful-title"
description: "What the reader will learn from this piece."
category: "Business" # Research instead uses company, ticker, sector, status, market and focus.
publishedAt: "2026-10-08"
updatedAt: "2026-10-15" # Only for meaningful revisions.
featured: false
demo: false
draft: false
noindex: false
tags: ["valuation", "capital allocation"]
featuredImage: "/images/example.webp" # Optional; provide a real image.
featuredImageAlt: "Concise description of the image"
featuredImageWidth: 1200
featuredImageHeight: 630
sources:
  - name: "Company name"
    title: "Annual report FY2026"
    url: "https://example.org/report.pdf"
    publishedAt: "2026-06-01"
    accessedAt: "2026-10-01"
---
```

`readingTime` is optional and calculated from body length if omitted. `author` defaults to Khushal Dangar; only use a different name after creating that person's real profile and updating the byline/schema routing. `canonical` is optional for a duplicate or syndicated page; use a fully qualified URL or a site-root path. A non-self canonical excludes the page from the sitemap. Use `draft: true` while writing. Use `demo: true` only for unpublished examples. A production piece needs verified sourcing and `demo: false`. The existing revenue-and-cash article shows a sourced table and a compact interactive MDX component.

Run `npm run typecheck`, `npm run build`, and `npm run test:e2e`. Check the generated page's title, one H1, source links, table behavior, mobile layout, canonical and social image. The site does not create category landing pages yet because the current library is small. Add one only when there is enough original content to justify it.

## Search Console

1. Publish the site publicly on your chosen HTTPS domain. Configure the host to serve `out/`, return `out/404.html` with HTTP 404, redirect HTTP to HTTPS, redirect the non-preferred hostname to the preferred hostname, and use one trailing-slash form. Static hosting redirect rules depend on the provider and cannot be expressed by this export alone.
2. Open [Google Search Console](https://search.google.com/search-console/). Add a Domain property for a domain you control, or a URL-prefix property for the exact site URL.
3. For a Domain property, add the DNS TXT record shown by Google at your DNS provider. For a URL-prefix property, choose HTML tag verification, copy **only the token** from the `content` attribute, set `GOOGLE_SITE_VERIFICATION=<token>` during the build, deploy, and click Verify. Do not invent a token.
4. Open `https://YOUR-DOMAIN/robots.txt`, `/sitemap.xml`, `/feed.xml` and a real article in a private browser window. They must load without login.
5. In Search Console → Sitemaps, submit `sitemap.xml`. In URL Inspection, inspect the homepage and an indexable article; use Test live URL and Request indexing after the page is genuinely ready.
6. Review Page Indexing, Search Performance and Core Web Vitals periodically. A sitemap is a discovery hint, not an indexing guarantee. Do not request indexing for demo or `noindex` pages.

## Analytics

The site has no analytics account or ID by default. To enable GA4, create a web data stream in [Google Analytics](https://analytics.google.com/) and set `NEXT_PUBLIC_GA_ID=G-...` at build time. The script loads after interaction only in production builds. GA4's standard page view tracking is enabled; no custom personal-finance events are collected. Review applicable consent obligations and update the privacy page for your actual deployment before setting the ID. Leave the variable empty if you do not want analytics.

## Validation and limits

Use [Google's Rich Results Test](https://search.google.com/test/rich-results) and [Schema Markup Validator](https://validator.schema.org/) on public URLs. Test a share URL in the platforms you use after deployment. The repository cannot verify DNS, HTTPS redirects, authentication, real-world crawl access, account ownership or live Core Web Vitals. A public domain remains a launch requirement.
