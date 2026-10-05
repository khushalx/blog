import { test, expect } from "@playwright/test";

const storageKey = "long-view-theme";
const article = "/articles/when-better-margins-mean-less-profit/";
const research = "/research/asian-paints/";

test("theme follows the system until a reader chooses, then persists across navigation and reload", async ({ page }) => {
  // The static preview does not serve Vercel's production analytics endpoint.
  await page.route("**/_vercel/insights/script.js", (route) => route.fulfill({ contentType: "application/javascript", body: "" }));
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(article);
  const toggle = page.getByRole("button", { name: "Dark mode", exact: true });
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe("dark");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("navigation", { name: "Main navigation" }).getByRole("link", { name: "Research", exact: true }).click();
  await expect(page).toHaveURL(/\/research\/$/);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await toggle.focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  expect(await page.evaluate((key) => localStorage.getItem(key), storageKey)).toBe("light");
  expect(errors).toEqual([]);
});

for (const preference of ["light", "dark"]) {
  test(`saved ${preference} theme applies before application JavaScript loads`, async ({ page }) => {
    await page.emulateMedia({ colorScheme: preference === "dark" ? "light" : "dark" });
    await page.addInitScript(({ key, value }) => localStorage.setItem(key, value), { key: storageKey, value: preference });
    await page.route("**/_next/static/**/*.js", (route) => route.abort());
    await page.goto(article, { waitUntil: "domcontentloaded" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", preference);
    await expect(page.locator("body")).toHaveCSS("background-color", preference === "dark" ? "rgb(23, 27, 24)" : "rgb(248, 247, 243)");
  });
}

test("toggle works when browser storage is unavailable", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.addInitScript(() => {
    for (const method of ["getItem", "setItem"]) {
      Object.defineProperty(Storage.prototype, method, { value: () => { throw new DOMException("Storage unavailable", "SecurityError"); } });
    }
  });
  await page.goto(article);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await page.emulateMedia({ colorScheme: "light" });
  await page.emulateMedia({ colorScheme: "dark" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("theme choice stays in sync between tabs and clearing it restores the system preference", async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/");
  const second = await context.newPage();
  await second.emulateMedia({ colorScheme: "light" });
  await second.goto(article);
  await page.getByRole("button", { name: "Dark mode", exact: true }).click();
  await expect(second.getByRole("button", { name: "Dark mode", exact: true })).toHaveAttribute("aria-pressed", "true");
  await page.evaluate((key) => localStorage.removeItem(key), storageKey);
  await expect(second.locator("html")).toHaveAttribute("data-theme", "light");
  await second.close();
});

for (const width of [320, 390, 560, 768, 1440]) {
  test(`dark reading layouts and controls fit ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.emulateMedia({ colorScheme: "dark" });
    for (const path of ["/", "/research/", "/articles/", article,
      "/articles/when-gold-prices-rise/",
      "/articles/what-a-buyback-actually-buys/", "/articles/when-ai-capex-falls/",
      "/articles/when-a-digital-payment-looks-free/", "/articles/good-business-two-different-returns/",
      "/articles/revenue-growth-without-cash-growth/", research, "/about/", "/privacy/"]) {
      await page.goto(path);
      await page.evaluate(() => document.fonts.ready);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      await expect(page.getByRole("button", { name: "Dark mode", exact: true })).toBeVisible();
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), path).toBe(true);
    }
    await page.goto("/");
    if (width <= 640) {
      await page.getByRole("button", { name: "Open navigation" }).click();
      await page.getByRole("navigation", { name: "Mobile navigation" }).getByRole("link", { name: "Articles", exact: true }).click();
      await expect(page).toHaveURL(/\/articles\/$/);
    }
    await page.goto(article);
    await expect(page.locator(".margin-pool-result")).toHaveCSS("background-color", "rgb(35, 42, 36)");
    await page.getByRole("slider", { name: /^Gross margin/ }).fill("44.5");
    await expect(page.locator(".margin-pool-result")).toContainText("₹40.05");
    await page.getByRole("button", { name: "Reset example" }).click();
    await page.evaluate(() => {
      if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.screenshot({ path: `test-results/dark-article-${width}.png` });
    await page.locator(".margin-pool").screenshot({ path: `test-results/dark-lens-${width}.png` });
    await page.goto(research);
    await expect(page.locator(".prose table").first()).toHaveCSS("color", "rgb(232, 233, 223)");
    await page.screenshot({ path: `test-results/dark-research-${width}.png` });
    await page.goto("/");
    await page.screenshot({ path: `test-results/dark-home-${width}.png`, fullPage: true });
  });
}

test("dark body, secondary copy and accent text meet readable contrast on both surfaces", async ({ page }) => {
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto(article);
  const ratios = await page.evaluate(() => {
    const style = getComputedStyle(document.documentElement);
    const luminance = (color: string) => {
      const rgb = color.trim().slice(1).match(/.{2}/g)!.map((channel) => parseInt(channel, 16) / 255);
      const linear = rgb.map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4);
      return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
    };
    return ["--paper", "--surface"].flatMap((background) => ["--ink", "--muted", "--green"].map((foreground) => {
      const a = luminance(style.getPropertyValue(background));
      const b = luminance(style.getPropertyValue(foreground));
      return { foreground, background, ratio: (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) };
    }));
  });
  for (const result of ratios) expect(result.ratio, `${result.foreground} on ${result.background}`).toBeGreaterThanOrEqual(4.5);
});
