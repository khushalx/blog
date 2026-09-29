import { test, expect } from "@playwright/test";
const paths = [
  "/",
  "/research/",
  "/articles/",
  "/about/",
  "/author/khushal-dangar/",
  "/editorial-policy/",
  "/disclaimer/",
  "/privacy/",
  "/research/asian-paints/",
  "/research/hdfc-bank/",
  "/research/tcs/",
  "/articles/why-high-pe-doesnt-mean-overvalued/",
  "/articles/understanding-roce/",
  "/articles/how-interest-rates-flow/",
  "/articles/revenue-growth-and-shareholder-value/",
];
test("every publication route renders with complete metadata and no runtime errors", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  for (const path of paths) {
    const response = await page.goto(path);
    expect(response?.status(), path).toBe(200);
    await expect(page.locator("h1"), path).toHaveCount(1);
    await expect(page).toHaveTitle(/The Long View/);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute(
      "content",
      /\S/,
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      new RegExp(path.replaceAll("/", "\\/") + "$"),
    );
    await expect(page.locator('link[rel="alternate"][type="application/rss+xml"]')).toHaveAttribute("href", /\/feed\.xml$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      /\S/,
    );
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /\/(?:social-card|social\/(?:articles|research)\/[a-z0-9-]+)\.png$/,
    );
  }
  expect(errors).toEqual([]);
});

test("LinkedIn profile is available from the publication footer and About page", async ({
  page,
}) => {
  await page.goto("/");
  const footerLink = page
    .getByRole("navigation", { name: "Footer navigation" })
    .getByRole("link", { name: "LinkedIn" });
  await expect(footerLink).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/khushaldangar/",
  );
  await expect(footerLink).toHaveAttribute("target", "_blank");
  await expect(footerLink).toHaveAttribute("rel", "noreferrer");

  await page.goto("/about/");
  const aboutLink = page
    .locator("main")
    .getByRole("link", { name: "LinkedIn" });
  await expect(aboutLink).toHaveAttribute(
    "href",
    "https://www.linkedin.com/in/khushaldangar/",
  );
  await expect(aboutLink).toHaveAttribute("target", "_blank");
  await expect(aboutLink).toHaveAttribute("rel", "noreferrer");
});

test("research filters, empty state, table and generated contents work", async ({
  page,
}) => {
  await page.goto("/research/");
  await page.getByRole("button", { name: "Consumer", exact: true }).click();
  await expect(page.locator(".research-entry")).toHaveCount(1);
  await expect(page.locator(".research-entry")).toContainText("Asian Paints");
  await page.getByRole("button", { name: "Industrial", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No industrial notes yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Browse all research" }).click();
  await expect(page.locator(".research-entry")).toHaveCount(3);
  await page
    .getByRole("link", { name: "Read research on Asian Paints" })
    .click();
  await expect(page.locator(".desktop-contents li")).toHaveCount(12);
  await page
    .locator('.desktop-contents a[href="#financial-performance"]')
    .click();
  await expect(page).toHaveURL(/#financial-performance$/);
  await expect(page.locator("#financial-performance")).toBeInViewport();
  await expect(page.locator("table").first()).toContainText("25,000");
  await expect(page.locator(".footnotes")).toBeVisible();
  const ids = await page
    .locator("[id]")
    .evaluateAll((elements) => elements.map((element) => element.id));
  expect(new Set(ids).size).toBe(ids.length);
});
for (const width of [390, 768, 1440]) {
  test(`layouts fit ${width}px and reading controls work`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1000 });
    for (const path of [
      "/",
      "/research/",
      "/articles/",
      "/about/",
      "/author/khushal-dangar/",
      "/editorial-policy/",
      "/disclaimer/",
      "/privacy/",
      "/research/asian-paints/",
      "/articles/why-high-pe-doesnt-mean-overvalued/",
    ]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        path,
      ).toBe(true);
    }
    if (width === 390) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page
        .getByRole("navigation", { name: "Mobile navigation", exact: true })
        .getByRole("link", { name: "Research" })
        .click();
      await expect(page).toHaveURL(/\/research\/$/);
      await expect(
        page.getByRole("button", { name: "Open navigation" }),
      ).toHaveAttribute("aria-expanded", "false");
      await page.goto("/research/asian-paints/");
      await page.locator(".mobile-contents summary").click();
      await page
        .locator('.mobile-contents a[href="#financial-performance"]')
        .click();
      await expect(page.locator("#financial-performance")).toBeInViewport();
      expect(
        await page
          .locator(".table-scroll")
          .first()
          .evaluate((element) => element.scrollWidth > element.clientWidth),
      ).toBe(true);
    }
    await page.goto("/");
    await page.screenshot({
      path: `test-results/home-${width}.png`,
      fullPage: true,
    });
    await page.goto("/research/asian-paints/");
    await page.screenshot({
      path: `test-results/research-${width}.png`,
      fullPage: true,
    });
  });
}
test("internal links resolve and only indexable pages enter discovery feeds", async ({
  page,
  request,
}) => {
  const links = new Set<string>();
  for (const path of ["/", "/research/", "/articles/", "/about/"]) {
    await page.goto(path);
    for (const href of await page
      .locator('a[href^="/"]')
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("href")!),
      ))
      links.add(href);
  }
  for (const href of links)
    expect((await request.get(href)).status(), href).toBe(200);
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  const xml = await sitemap.text();
  for (const path of [
    "/about/", "/author/khushal-dangar/", "/editorial-policy/",
    "/disclaimer/", "/privacy/",
  ]) expect(xml).toContain(path);
  expect(xml).not.toContain("/research/asian-paints/");
  expect(xml).not.toContain("/articles/why-high-pe-doesnt-mean-overvalued/");
  const feed = await request.get("/feed.xml");
  expect(feed.status()).toBe(200);
  expect(await feed.text()).toContain("<rss version=\"2.0\"");
  expect(await feed.text()).not.toContain("<item>");
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  await page.goto("/articles/why-high-pe-doesnt-mean-overvalued/");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, follow");
  const socialImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  const imageResponse = await request.get(new URL(socialImage!).pathname);
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()["content-type"]).toContain("image/png");
  await page.goto("/");
  const websiteSchema = JSON.parse(await page.locator('script[type="application/ld+json"]').first().textContent() || "{}");
  expect(websiteSchema["@type"]).toBe("WebSite");
  expect((await request.get("/research/not-a-real-report/")).status()).toBe(
    404,
  );
});

test("narrow phones keep navigation and research reading usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 720 });
  await page.goto("/");
  const gap = await page.evaluate(() => {
    const brand = document.querySelector(".wordmark")!.getBoundingClientRect();
    const menu = document
      .querySelector(".menu-toggle")!
      .getBoundingClientRect();
    return menu.left - brand.right;
  });
  expect(gap).toBeGreaterThanOrEqual(12);
  await page.getByRole("button", { name: "Open navigation" }).click();
  await expect(
    page.getByRole("navigation", { name: "Mobile navigation" }),
  ).toBeVisible();
  await page
    .getByRole("navigation", { name: "Mobile navigation" })
    .getByRole("link", { name: "Research" })
    .click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.getByText("Swipe for more sectors")).toBeVisible();
  await page.getByRole("button", { name: "Other", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: "No other notes yet." }),
  ).toBeVisible();
  await page.getByRole("button", { name: /All/ }).first().click();
  await page
    .getByRole("link", { name: "Read research on Asian Paints" })
    .click();
  const summary = page.locator(".mobile-contents summary");
  expect(
    await summary.evaluate((element) => element.getBoundingClientRect().height),
  ).toBeGreaterThanOrEqual(44);
  await summary.click();
  await page
    .locator('.mobile-contents a[href="#financial-performance"]')
    .click();
  await expect(
    page.getByText("Swipe to see all columns").first(),
  ).toBeVisible();
  const dataNote = page.locator(".data-table-note").first();
  await expect(dataNote).toContainText("Illustrative sample data only");
  expect(
    await dataNote.evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(250);
  const table = page.locator(".table-scroll").first();
  await table.evaluate((element) => {
    element.scrollLeft = 180;
  });
  expect(await table.evaluate((element) => element.scrollLeft)).toBeGreaterThan(
    0,
  );
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    320,
  );
});
