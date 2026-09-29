# The Long View

An independent financial research publication by Khushal Dangar, built with Next.js App Router, TypeScript and repository-owned MDX content.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`. Use `npm run build` to produce a static export in `out/`, then `npm start` to serve that export locally. Run `npm run lint`, `npm run typecheck`, and `npm run test:e2e` before publishing.

For a public build, set `NEXT_PUBLIC_SITE_URL` to the exact HTTPS origin and run `npm run build:public`. The public host must serve `out/`, return a real 404 for missing pages, and redirect alternate hostnames and HTTP to the canonical origin. See [SEO setup](docs/SEO-SETUP.md) and the [public launch checklist](docs/PUBLIC-LAUNCH-CHECKLIST.md).

Write new research in `content/research/` and articles in `content/articles/`. Follow the [metadata and sourcing guide](docs/SEO-SETUP.md#add-an-article-or-research-note). The article in `content/articles/` is a sourced format example; the research library is intentionally empty until the first original report is ready.
