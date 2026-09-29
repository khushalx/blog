# Public launch checklist

## Content
- [ ] Review the sourced revenue-and-cash article and publish future research only after its evidence and calculations are ready.
- [ ] Confirm every financial number, date, company description and citation.
- [ ] Add meaningful updated dates and disclose any relevant conflicts in each piece.
- [ ] Review About, author, editorial policy, disclaimer and privacy text for accuracy.

## Domain and deployment
- [ ] Choose one public HTTPS hostname and set `NEXT_PUBLIC_SITE_URL` to its origin.
- [ ] Run `npm run build:public`; deploy the generated `out/` directory.
- [ ] Ensure the host returns 200 for pages, 404 for missing pages, and permanent redirects from HTTP and alternate hostname.
- [ ] Ensure `/social-card.png`, `/robots.txt`, `/sitemap.xml` and `/feed.xml` are public without login.
- [ ] Confirm canonical, OG and RSS URLs use the live hostname and preferred trailing slash.

## Google Search Console
- [ ] Add and verify the property (DNS TXT or HTML tag token).
- [ ] Submit `sitemap.xml` and inspect the homepage and one real article.
- [ ] Review Page Indexing after Google crawls the site.

## Analytics and privacy
- [ ] Decide whether GA4 is needed; if so, review consent obligations first.
- [ ] Set the real `NEXT_PUBLIC_GA_ID` and update the privacy page for your practices.

## Reader QA
- [ ] Test article and research links, citations, tables and the mobile menu.
- [ ] Check share previews on LinkedIn and a messaging app.
- [ ] Run build, type check and browser tests; review mobile screenshots.
- [ ] Check site speed with PageSpeed Insights and revisit after real images are added.

## Post-launch
- [ ] Watch Search Console Performance and Core Web Vitals as data accumulates.
- [ ] Correct dated claims when new filings or economic data change the analysis.
- [ ] Link each new piece to relevant earlier analysis and update the earlier piece where useful.
