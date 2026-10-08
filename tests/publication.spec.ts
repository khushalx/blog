import { test, expect } from "@playwright/test";
import { publicationDate } from "../lib/content/publication-date.mjs";

test("publication day changes at India midnight rather than UTC midnight", () => {
  expect(publicationDate(new Date("2026-10-02T18:29:59Z"))).toBe("2026-10-02");
  expect(publicationDate(new Date("2026-10-02T18:30:00Z"))).toBe("2026-10-03");
  expect(publicationDate(new Date("2026-10-03T00:00:00Z"))).toBe("2026-10-03");
});

const articlePath = "/articles/revenue-growth-without-cash-growth/";
const latestArticlePath = "/articles/good-business-two-different-returns/";
const newestArticlePath = "/articles/when-a-digital-payment-looks-free/";
const aiCapexArticlePath = "/articles/when-ai-capex-falls/";
const buybackArticlePath = "/articles/what-a-buyback-actually-buys/";
const marginArticlePath = "/articles/when-better-margins-mean-less-profit/";
const goldArticlePath = "/articles/when-gold-prices-rise/";
const depositArticlePath = "/articles/why-bank-deposits-matter/";
const storeArticlePath = "/articles/when-a-new-store-pays-back/";
const researchPath = "/research/asian-paints/";
const paths = [
  "/", "/research/", "/articles/", articlePath, latestArticlePath, newestArticlePath, aiCapexArticlePath, buybackArticlePath, marginArticlePath, goldArticlePath, depositArticlePath, storeArticlePath, researchPath, "/about/",
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

test("demo content is gone and the published research is discoverable", async ({ page, request }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "Latest research" })).toBeVisible();
  await expect(page.getByRole("link", { name: "A New Store Is an Investment. When Does It Pay Back?", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Nike’s Margin Improved. Why Did Gross Profit Fall?", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "When Gold Prices Rise, Is a Jeweller Really Growing?", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Why a Bank’s Deposits Matter More Than They Look", exact: true })).toBeVisible();
  await page.goto("/articles/");
  await expect(page.getByRole("link", { name: "What Does a $150 Billion Buyback Actually Buy?", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "When AI Capex Falls, Has the Spending Really Fallen?", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "When a Digital Payment Looks Free, Who Keeps It Running?", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "Revenue Grew. Cash Didn’t Follow.", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: "A Good Business, Two Different Returns", exact: true })).toBeVisible();
  await page.goto("/research/");
  await expect(page.locator(".research-entry")).toHaveCount(1);
  await expect(page.getByRole("link", { name: "Asian Paints and the Future of Competitive Advantage in the Indian Paint Industry", exact: true })).toHaveAttribute("href", researchPath);
  await page.getByRole("button", { name: "Consumer", exact: true }).click();
  await expect(page.locator(".research-entry")).toHaveCount(1);
  await page.getByRole("button", { name: "Technology", exact: true }).click();
  await expect(page.locator(".research-entry")).toHaveCount(0);
  for (const path of [
    "/research/hdfc-bank/", "/research/tcs/",
    "/research/__no_research__/",
    "/articles/why-high-pe-doesnt-mean-overvalued/",
    "/articles/understanding-roce/", "/articles/how-interest-rates-flow/",
    "/articles/revenue-growth-and-shareholder-value/",
  ]) expect((await request.get(path)).status(), path).toBe(404);
});

test("store payback includes opening inventory, ramp losses and non-recovery scenarios", async ({ page, request }) => {
  await page.goto(storeArticlePath);
  await expect(page.locator(".prose")).toContainText("78 net store additions");
  await expect(page.locator(".report-byline time")).toHaveAttribute("datetime", "2026-10-08");
  await expect(page.locator(".source-references a").first()).toHaveAttribute("href", "https://www.titancompany.in/sites/default/files/2026-10/Q2update202627.pdf");
  const lens = page.getByRole("figure", { name: "Illustrative new store cash payback model" });
  const cash = lens.locator("dd").first();
  const payback = lens.locator("dd").nth(1);
  const inventory = lens.getByRole("slider", { name: /^Opening inventory/ });
  const sales = lens.getByRole("slider", { name: /^Mature monthly sales/ });
  const margin = lens.getByRole("slider", { name: /^Gross margin/ });
  const ramp = lens.getByRole("slider", { name: /^Time to mature sales/ });
  await expect(cash).toContainText("₹2.80");
  await expect(payback).toContainText("53 months");
  await expect(lens.locator("[data-store-result]")).toContainText("₹120.00 lakh");
  await expect(lens.getByRole("img")).toHaveAttribute("aria-label", /189.00 lakh after ten years/);
  await lens.getByRole("button", { name: "Slower ramp", exact: true }).click();
  await expect(payback).toContainText("63 months");
  await expect(cash).toContainText("₹2.80");
  const moreStock = lens.getByRole("button", { name: "More stock", exact: true });
  await moreStock.focus();
  await page.keyboard.press("Enter");
  await expect(moreStock).toHaveAttribute("aria-pressed", "true");
  await expect(payback).toContainText("64 months");
  await expect(lens.locator("[data-store-result]")).toContainText("₹150.00 lakh");
  await lens.getByRole("button", { name: "Sales disappoint", exact: true }).click();
  await expect(cash).toContainText("−₹0.20");
  await expect(payback).toContainText("No payback");
  await sales.fill("22");
  await expect(payback).toContainText("Over 10 years");
  await expect(cash).toContainText("₹0.40");
  await sales.fill("20");
  await margin.fill("31");
  await expect(payback).toContainText("No payback");
  await expect(cash).toContainText("₹0.00");
  await lens.getByRole("button", { name: "Starting store", exact: true }).click();
  await inventory.focus();
  await page.keyboard.press("ArrowRight");
  await expect(inventory).toHaveValue("45");
  await expect(payback).toContainText("55 months");
  await inventory.fill("20");
  await sales.fill("45");
  await margin.fill("40");
  await ramp.fill("6");
  await expect(cash).toContainText("₹11.80");
  await expect(payback).toContainText("11 months");
  await expect(payback).not.toContainText("0 years");
  await lens.getByRole("button", { name: "Starting store", exact: true }).click();
  await lens.getByText("How the model counts the cash", { exact: true }).click();
  await expect(lens.locator("details")).toContainText("opening inventory is not deducted again");
  await expect(lens.locator("figcaption")).toContainText("not Titan or Kalyan store economics");
  const social = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect((await request.get(new URL(social!).pathname)).status()).toBe(200);
});

test("deposit article separates the reported funding mix from fictional interest scenarios", async ({ page, request }) => {
  await page.goto(depositArticlePath);
  await expect(page.locator(".prose table")).toContainText("33,275");
  await expect(page.locator(".prose table")).toContainText("31.6%");
  await expect(page.locator(".source-references a").first()).toHaveAttribute("href", "https://www.sec.gov/Archives/edgar/data/1144967/000119312526413040/d342028dex99.htm");
  const lens = page.getByRole("figure", { name: "Illustrative bank deposit funding and interest example" });
  const cost = lens.locator("dd").first();
  const net = lens.locator("dd").nth(1);
  const casa = lens.getByRole("slider", { name: /^CASA share/ });
  const term = lens.getByRole("slider", { name: /^Term deposit rate/ });
  const yieldInput = lens.getByRole("slider", { name: /^Asset yield/ });
  await expect(cost).toContainText("₹4.20");
  await expect(net).toContainText("₹3.80");
  await lens.getByRole("button", { name: "More CASA", exact: true }).click();
  await expect(cost).toContainText("₹3.30");
  await expect(net).toContainText("₹4.70");
  const reprice = lens.getByRole("button", { name: "Assets reprice first", exact: true });
  await reprice.focus();
  await page.keyboard.press("Enter");
  await expect(reprice).toHaveAttribute("aria-pressed", "true");
  await expect(cost).toContainText("₹4.20");
  await expect(net).toContainText("₹2.80");
  await term.fill("5");
  await expect(cost).toContainText("₹3.60");
  await expect(net).toContainText("₹3.40");
  await casa.focus();
  await page.keyboard.press("ArrowRight");
  await expect(casa).toHaveValue("41");
  await expect(cost).toContainText("₹3.57");
  await casa.fill("20");
  await term.fill("8");
  await yieldInput.fill("6");
  await expect(cost).toContainText("₹6.70");
  await expect(net).toContainText("−₹0.70");
  await lens.getByRole("button", { name: "Starting mix", exact: true }).click();
  await expect(casa).toHaveValue("40");
  await expect(term).toHaveValue("6");
  await expect(yieldInput).toHaveValue("8");
  await lens.getByText("Follow the interest calculation", { exact: true }).click();
  await expect(lens.locator("details p")).toContainText("Term deposits: ₹60 crore × 6.0% = ₹3.60 crore");
  await expect(lens.locator("figcaption")).toContainText("not a complete bank balance sheet or reported net interest margin");
  const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect((await request.get(new URL(imageUrl!).pathname)).status()).toBe(200);
});

test("gold article separates reported buyer commentary from fictional physical volume", async ({ page, request }) => {
  await page.goto(goldArticlePath);
  await expect(page.locator(".prose table")).toContainText("About 46%");
  await expect(page.locator(".prose table")).toContainText("Early double digits");
  await expect(page.locator(".source-references a").first()).toHaveAttribute("href", "https://www.titancompany.in/sites/default/files/2026-07/Annual%20Report%20FY%202025-26.pdf");
  const lens = page.getByRole("figure", { name: "Illustrative gold price, physical volume and revenue comparison" });
  const price = lens.getByRole("slider", { name: /^Gold price change/ });
  const volume = lens.getByRole("slider", { name: /^Grams sold change/ });
  await expect(lens.locator("dd").first()).toContainText("₹67.50");
  await expect(lens.locator("dd").first()).toContainText("+12.5%");
  await expect(lens.locator("dd").nth(1)).toContainText("900");
  const steady = lens.getByRole("button", { name: "Same sales, less gold", exact: true });
  await steady.focus();
  await page.keyboard.press("Enter");
  await expect(steady).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator("dd").first()).toContainText("₹60.00");
  await expect(lens.locator("dd").first()).toContainText("unchanged");
  await expect(lens.locator("dd").nth(1)).toContainText("800");
  await lens.getByText("Follow the revenue bridge", { exact: true }).click();
  await expect(lens.locator("details p")).toContainText("subtracts ₹15.00 lakh");
  await price.fill("0");
  await volume.fill("0");
  await expect(lens.locator("dd").first()).toContainText("₹60.00");
  await expect(lens.locator("dd").nth(1)).toContainText("1,000");
  await price.focus();
  await page.keyboard.press("ArrowRight");
  await expect(price).toHaveValue("1");
  await expect(lens.locator("dd").first()).toContainText("₹60.60");
  await price.fill("60");
  await volume.fill("30");
  await expect(lens.locator("dd").first()).toContainText("₹124.80");
  await price.fill("0");
  await volume.fill("-30");
  await expect(lens.locator("dd").first()).toContainText("₹42.00");
  await lens.getByRole("button", { name: "Volume grows too", exact: true }).click();
  await expect(lens.locator("dd").first()).toContainText("₹82.50");
  await lens.getByRole("button", { name: "Price rises, volume falls", exact: true }).click();
  await expect(price).toHaveValue("25");
  await expect(volume).toHaveValue("-10");
  await expect(lens.locator("figcaption")).toContainText("not Titan data or a current gold-price quote");
  const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect((await request.get(new URL(imageUrl!).pathname)).status()).toBe(200);
});

test("margin article distinguishes reported results from interactive scenarios", async ({ page, request }) => {
  await page.goto(marginArticlePath);
  await expect(page.locator(".prose table")).toContainText("$4,798");
  await expect(page.locator(".prose table")).toContainText("42.8%");
  await expect(page.locator(".prose")).toContainText("44.08%");
  await expect(page.locator(".source-references a").first()).toHaveAttribute("href", "https://investors.nike.com/investors/news-events-and-reports/investor-news/investor-news-details/2026/NIKE-Inc--Reports-Fiscal-2027-First-Quarter-Results/default.aspx");
  const lens = page.getByRole("figure", { name: "Illustrative revenue, margin and gross profit comparison" });
  const revenue = lens.getByRole("slider", { name: /^Revenue/ });
  const margin = lens.getByRole("slider", { name: /^Gross margin/ });
  await expect(lens.locator("dd").nth(0)).toContainText("₹37.80");
  await expect(lens.locator("dd").nth(1)).toContainText("44.44%");
  await margin.fill("44.5");
  await expect(lens.locator("dd").nth(0)).toContainText("₹40.05");
  await expect(lens.locator("dd").nth(0)).toContainText("higher");
  await revenue.fill("100");
  await margin.fill("40");
  await expect(lens.locator("dd").nth(0)).toContainText("₹40.00");
  await expect(lens.locator("dd").nth(0)).toContainText("unchanged");
  await revenue.focus();
  await page.keyboard.press("ArrowRight");
  await expect(revenue).toHaveValue("101");
  await expect(lens.locator("dd").nth(0)).toContainText("₹40.40");
  await margin.fill("60");
  await revenue.fill("120");
  await expect(lens.locator("dd").nth(0)).toContainText("₹72.00");
  await lens.getByRole("button", { name: "Reset example", exact: true }).click();
  await expect(revenue).toHaveValue("90");
  await expect(margin).toHaveValue("42");
  await expect(lens.locator("dd").nth(0)).toContainText("₹37.80");
  await expect(lens.locator("figcaption")).toContainText("not Nike data");
  const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect((await request.get(new URL(imageUrl!).pathname)).status()).toBe(200);
});

test("buyback price changes remaining-owner value even when EPS rises", async ({ page, request }) => {
  await page.goto(buybackArticlePath);
  const lens = page.getByRole("figure", { name: "Illustrative buyback price, earnings and remaining-owner value" });
  await expect(lens.locator("dd").nth(0)).toContainText("10.00");
  await expect(lens.locator("dd").nth(1)).toContainText("₹11.11");
  await expect(lens.locator("dd").nth(2)).toContainText("₹100.00");
  const highPrice = lens.getByRole("button", { name: "Pay ₹200 per share", exact: true });
  await highPrice.focus();
  await page.keyboard.press("Enter");
  await expect(highPrice).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator("dd").nth(0)).toContainText("5.00");
  await expect(lens.locator("dd").nth(1)).toContainText("₹10.53");
  await expect(lens.locator("dd").nth(2)).toContainText("₹94.74");
  await lens.getByText("Follow the calculation", { exact: true }).click();
  await expect(lens.locator("details p")).toBeVisible();
  await expect(lens.locator("details p")).toContainText("₹9,000 crore");
  await lens.getByRole("button", { name: "Pay ₹80 per share", exact: true }).click();
  await expect(lens.locator("dd").nth(0)).toContainText("12.50");
  await expect(lens.locator("dd").nth(1)).toContainText("₹11.43");
  await expect(lens.locator("dd").nth(2)).toContainText("₹102.86");
  await expect(page.locator(".prose")).toContainText("$19.7 billion");
  await expect(page.locator(".source-references a").first()).toHaveAttribute("href", "https://investor.nvidia.com/news/press-release-details/2026/NVIDIA-Announces-a-150-Billion-Share-Repurchase-Authorization-Increase/default.aspx");
  const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect((await request.get(new URL(imageUrl!).pathname)).status()).toBe(200);
});

test("AI capex article distinguishes asset recognition from contractual payments", async ({ page, request }) => {
  await page.goto(aiCapexArticlePath);
  const lens = page.getByRole("figure", { name: "Illustrative lease classification and unchanged cash commitment" });
  await expect(lens.getByRole("button", { name: "Finance lease", exact: true })).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator(".lease-lens-figures")).toContainText("₹100");
  await expect(lens.locator(".lease-lens-figures")).toContainText("₹120");
  await lens.getByRole("button", { name: "Operating lease", exact: true }).click();
  await expect(lens.locator(".lease-lens-figures")).toContainText("₹0");
  await expect(lens.locator(".lease-lens-figures")).toContainText("₹120");
  await expect(lens.locator(".lease-lens-timeline li")).toHaveCount(5);
  await expect(page.locator(".prose table")).toContainText("$3.101");
  await expect(page.locator(".prose")).toContainText("not final 2026 spending totals");
  await expect(page.locator(".source-references a").first()).toHaveAttribute("href", "https://www.microsoft.com/en-us/Investor/events/fy-2026/earnings-fy-2026-q4");
  const imageUrl = await page.locator('meta[property="og:image"]').getAttribute("content");
  expect((await request.get(new URL(imageUrl!).pathname)).status()).toBe(200);
});

test("the UPI article explains current charges and its payment comparison works", async ({ page }) => {
  await page.goto(newestArticlePath);
  await expect(page.getByRole("heading", { name: "When a Digital Payment Looks Free, Who Keeps It Running?" })).toBeVisible();
  await expect(page.locator(".prose")).toContainText("96% of merchant transactions");
  await expect(page.locator(".prose")).toContainText("FY2024–25");
  await expect(page.locator(".source-references a").first()).toHaveAttribute(
    "href", "https://www.pib.gov.in/PressReleseDetailm.aspx?PRID=2310586&lang=1&reg=3",
  );
  const lens = page.getByRole("figure", { name: "Compare who pays for four UPI payment situations" });
  await expect(lens.getByRole("button", { name: "Buy from a shop ₹300" })).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator(".payment-lens-result")).toContainText("₹0");
  await lens.getByRole("button", { name: "Pay a large retailer ₹5,000" }).click();
  await expect(lens.locator(".payment-lens-result")).toContainText("₹20");
  await lens.getByRole("button", { name: "Pay an eligible small merchant ₹5,000" }).click();
  await expect(lens.locator(".payment-lens-result")).toContainText("Classification matters");
  await expect(lens.locator(".payment-lens-result")).not.toContainText("₹20");
});

test("the new article separates reported economics from the hypothetical share-price outcome", async ({ page }) => {
  await page.goto(latestArticlePath);
  await expect(page.getByRole("heading", { name: "A Good Business, Two Different Returns" })).toBeVisible();
  await expect(page.locator(".prose table")).toContainText("331.8");
  await expect(page.locator(".prose table")).toContainText("115.9");
  await expect(page.locator(".source-references a")).toHaveAttribute(
    "href", "https://www.sec.gov/Archives/edgar/data/789019/000119312526323660/msft-20260630.htm",
  );
  const lens = page.getByRole("figure", { name: "Illustrative share-price outcome at two purchase valuations" });
  await expect(lens.getByRole("button", { name: "Buy at 20× earnings" })).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator(".price-lens-outcome")).toContainText("₹200.00");
  await expect(lens.locator(".price-lens-outcome")).toContainText("₹440.59");
  await expect(lens.locator(".price-lens-outcome")).toContainText("+17.1%");
  await lens.getByRole("button", { name: "Buy at 40× earnings" }).click();
  await expect(lens.getByRole("button", { name: "Buy at 40× earnings" })).toHaveAttribute("aria-pressed", "true");
  await expect(lens.locator(".price-lens-outcome")).toContainText("₹400.00");
  await expect(lens.locator(".price-lens-outcome")).toContainText("₹440.59");
  await expect(lens.locator(".price-lens-outcome")).toContainText("+2.0%");
  await expect(page.locator(".related-content").getByRole("link", { name: /Revenue Grew/ })).toHaveAttribute("href", articlePath);
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
    for (const path of ["/", "/research/", "/articles/", articlePath, latestArticlePath, newestArticlePath, aiCapexArticlePath, buybackArticlePath, marginArticlePath, goldArticlePath, depositArticlePath, storeArticlePath, researchPath, "/about/"]) {
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
    await page.goto(latestArticlePath);
    await page.screenshot({ path: "test-results/latest-article-" + width + ".png", fullPage: true });
    await page.goto(newestArticlePath);
    await page.screenshot({ path: "test-results/upi-article-" + width + ".png", fullPage: true });
    await page.goto(aiCapexArticlePath);
    await page.screenshot({ path: "test-results/ai-capex-" + width + ".png", fullPage: true });
    await page.goto(buybackArticlePath);
    await page.screenshot({ path: "test-results/buyback-" + width + ".png", fullPage: true });
    await page.locator(".buyback-lens").screenshot({ path: "test-results/buyback-lens-" + width + ".png" });
    await page.goto(marginArticlePath);
    await page.screenshot({ path: "test-results/margin-" + width + ".png", fullPage: true });
    await page.locator(".margin-pool").screenshot({ path: "test-results/margin-pool-" + width + ".png" });
    await page.goto(goldArticlePath);
    await page.screenshot({ path: "test-results/gold-" + width + ".png", fullPage: true });
    await page.locator(".gold-growth").screenshot({ path: "test-results/gold-growth-" + width + ".png" });
    await page.goto(depositArticlePath);
    await page.screenshot({ path: `test-results/deposits-light-${width}.png` });
    await page.getByRole("figure", { name: "Illustrative bank deposit funding and interest example" }).screenshot({ path: `test-results/deposits-lens-light-${width}.png` });
    await page.goto(storeArticlePath);
    await page.screenshot({ path: `test-results/store-light-${width}.png` });
    await page.getByRole("figure", { name: "Illustrative new store cash payback model" }).screenshot({ path: `test-results/store-lens-light-${width}.png` });
  });
}

test("internal links, sitemap, feed and article social image resolve", async ({ page, request }) => {
  const links = new Set<string>();
  for (const path of ["/", "/research/", "/articles/", articlePath, latestArticlePath, newestArticlePath, aiCapexArticlePath, buybackArticlePath, marginArticlePath, goldArticlePath, depositArticlePath, storeArticlePath, researchPath, "/about/"]) {
    await page.goto(path);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((elements) =>
      elements.map((element) => element.getAttribute("href")!),
    )) links.add(href);
  }
  for (const href of links) expect((await request.get(href)).status(), href).toBe(200);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  expect(sitemap).toContain(articlePath);
  expect(sitemap).toContain(latestArticlePath);
  expect(sitemap).toContain(newestArticlePath);
  expect(sitemap).toContain(aiCapexArticlePath);
  expect(sitemap).toContain(buybackArticlePath);
  expect(sitemap).toContain(marginArticlePath);
  expect(sitemap).toContain(goldArticlePath);
  expect(sitemap).toContain(depositArticlePath);
  expect(sitemap).toContain(storeArticlePath);
  expect(sitemap).toContain(researchPath);
  expect(sitemap).not.toContain("/research/__no_research__/");
  const feed = await (await request.get("/feed.xml")).text();
  expect(feed).toContain("<item>");
  expect(feed).toContain(articlePath);
  expect(feed).toContain(latestArticlePath);
  expect(feed).toContain(newestArticlePath);
  expect(feed).toContain(aiCapexArticlePath);
  expect(feed).toContain(buybackArticlePath);
  expect(feed).toContain(marginArticlePath);
  expect(feed).toContain(goldArticlePath);
  expect(feed).toContain(depositArticlePath);
  expect(feed).toContain(storeArticlePath);
  expect(feed).toContain(researchPath);
  expect(await (await request.get("/robots.txt")).text()).toContain("Sitemap:");
  await page.goto(articlePath);
  await expect(page.locator('meta[name="robots"]')).not.toHaveAttribute("content", /noindex/);
  const socialImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  const imageResponse = await request.get(new URL(socialImage!).pathname);
  expect(imageResponse.status()).toBe(200);
  expect(imageResponse.headers()["content-type"]).toContain("image/png");
});


test("Asian Paints report retains its evidence, downloads and interactive calculations", async ({ page, request }) => {
  await page.goto(researchPath);
  await expect(page.locator(".prose")).toContainText("13 Conclusion");
  await expect(page.locator(".prose")).toContainText("6,651-word");
  await expect(page.locator(".prose table").first()).toContainText("35,583.54");
  const history = page.getByRole("figure", { name: "Compare Asian Paints consolidated financial measures" });
  await history.getByRole("button", { name: "Group PAT", exact: true }).click();
  await expect(history.locator(".cash-lens-chart")).toContainText("4,394.69");
  await history.getByRole("button", { name: "PAT margin", exact: true }).click();
  await expect(history.locator(".cash-lens-chart")).toContainText("12.35%");
  const scenario = page.getByRole("figure", { name: "Asian Paints educational sensitivity calculation" });
  await expect(scenario.locator(".asian-paints-scenario-results")).toContainText("6,695.92");
  await scenario.getByLabel("Revenue change", { exact: true }).fill("10");
  await scenario.getByLabel("Operating proxy margin change", { exact: true }).fill("-1");
  const expected = (35583.54 * 1.1 * ((6695.92 / 35583.54 * 100 - 1) / 100)).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  await expect(scenario.locator(".asian-paints-scenario-results")).toContainText(expected);
  await scenario.getByRole("button", { name: "Reset assumptions" }).click();
  await expect(scenario.getByLabel("Revenue change", { exact: true })).toHaveValue("0");
  await expect(scenario.locator(".asian-paints-scenario-results")).toContainText("6,695.92");
  for (const filename of ["Asian_Paints_Research_Paper.docx", "financial-data.csv", "Asian_Paints_Interactive_Paper.html"]) {
    const response = await request.get(`/research/asian-paints/${filename}`);
    expect(response.status(), filename).toBe(200);
    expect((await response.body()).length).toBeGreaterThan(400);
  }
  await page.getByRole("link", { name: "Open the interactive reader", exact: true }).click();
  await expect(page.locator("#metric")).toBeVisible();
  await page.locator("#metric").selectOption("pat");
  await expect(page.locator("#chart-selection")).toContainText("4,394.69");
});
