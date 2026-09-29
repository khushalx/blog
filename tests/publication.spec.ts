import { test, expect } from "@playwright/test";

const articlePath = "/articles/revenue-growth-without-cash-growth/";
const paths = [
  "/", "/research/", "/articles/", articlePath, "/about/",
  "/author/khushal-dangar/", "/editorial-policy/",
  "/disclaimer/", "/privacy/",
];

test("every public route renders with metadata and no runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page).toHaveTitle(/The Long View/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href", new RegExp(path.replaceAll("/", "\\/") + "$"),
    );
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", /\S/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  }
  expect(errors).toEqual([]);
});

test("demo content is gone and the empty research library remains useful", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Latest research" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Revenue Grew. Cash Didn’t Follow.", exact: true })).toBeVisible();
  await page.goto("/research/");
  await expect(page.getByRole("heading", { name: "Careful work takes time." })).toBeVisible();
  await expect(page.locator(".research-entry")).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Read the latest article/ })).toHaveAttribute("href", articlePath);
  for (const path of [
    "/research/asian-paints/", "/research/hdfc-bank/", "/research/tcs/",
    "/research/__no_research__/",
    "/articles/why-high-pe-doesnt-mean-overvalued/",
    "/articles/understanding-roce/", "/articles/how-interest-rates-flow/",
    "/articles/revenue-growth-and-shareholder-value/",
  ]) expect((await request.get(path)).status(), path).toBe(404);
});

test("the article explains sourced figures and its comparison works", async ({ page }) => {
  await page.goto(articlePath);
  await expect(page.getByRole("heading", { name: "Revenue Grew. Cash Didn’t Follow." })).toBeVisible();
  await expect(page.locator(".prose")).toContainText("working-capital movement helped cash flow");
  await expect(page.locator(".prose table")).toContainText("96,773");
  await expect(page.locator(".prose table")).toContainText("13,256");
  await expect(page.locator(".source-references a")).toHaveAttribute(
    "href", "https://www.sec.gov/Archives/edgar/data/1318605/000162828024002390/tsla-20231231.htm",
  );
  const lens = page.getByRole("figure", { name: "Compare Tesla financial measures in 2022 and 2023" });
  await expect(lens.getByRole("button", { name: "Revenue" })).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator(".cash-lens-chart")).toContainText("96,773");
  await lens.getByRole("button", { name: "Operating cash flow" }).click();
  await expect(lens.getByRole("button", { name: "Operating cash flow" })).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator(".cash-lens-chart")).toContainText("13,256");
  await lens.getByRole("button", { name: "Cash after capex" }).click();
  await expect(lens.locator(".cash-lens-chart")).toContainText("4,358");
});

test("LinkedIn links use the requested profile", async ({ page }) => {
  await page.goto("/");
  const footer = page.getByRole("navigation", { name: "Footer navigation" });
  await expect(footer.getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href", "https://www.linkedin.com/in/khushaldangar/",
  );
  await page.goto("/about/");
  await expect(page.locator("main").getByRole("link", { name: "LinkedIn" })).toHaveAttribute(
    "href", "https://www.linkedin.com/in/khushaldangar/",
  );
});

for (const width of [320, 390, 768, 1440]) {
  test("publication and article fit " + width + "px", async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    for (const path of ["/", "/research/", "/articles/", articlePath, "/about/"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
    }
    await page.goto(articlePath);
    const table = page.locator(".table-scroll").first();
    await expect(table).toBeVisible();
    if (width <= 390) {
      expect(await table.evaluate((element) => element.scrollWidth > element.clientWidth)).toBe(true);
      await page.getByRole("button", { name: "Open navigation" }).click();
      await expect(page.getByRole("navigation", { name: "Mobile navigation" })).toBeVisible();
      await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Research" }).click();
      await expect(page).toHaveURL(/\/research\/$/);
    }
    await page.goto(articlePath);
    await page.screenshot({ path: "test-results/article-" + width + ".png", fullPage: true });
  });
}

test("internal links, sitemap, feed and article social image resolve", async ({ page, request }) => {
  const links = new Set<string>();
  for (const path of ["/", "/research/", "/articles/", articlePath, "/about/"]) {
    await page.goto(path);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")!),
    )) links.add(href);
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(articlePath);
  expect(sitemap).not.toContain("/research/__no_research__/");
  expect(sitemap).not.toContain("/research/asian-paints/");
  const feed = await (await request.get("/feed.xml")).text();
  expect(feed).toContain("<item>");
  expect(feed).toContain(articlePath);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  await page.goto(articlePath);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/);
  const socialImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  const imageResponse = await request.get(new URL(socialImage!).pathname);
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()["content-type"]).toContain("image/png");
});
