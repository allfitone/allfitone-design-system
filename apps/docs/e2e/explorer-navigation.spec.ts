import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const categoryRoutes = [
  "/components/actions",
  "/components/navigation",
  "/components/forms",
  "/components/selection",
  "/components/data-display",
  "/components/signature",
  "/components/overlays",
  "/components/feedback",
] as const;

test("loads the index and category routes at the intended position", async ({ page }) => {
  await page.goto("/components");
  await expect(page.getByRole("heading", { level: 1, name: "Components" })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
  await expect(page.locator(".component-entry")).toHaveCount(0);

  const desktopHeight = await page.evaluate(() => document.documentElement.scrollHeight);
  expect(desktopHeight).toBeLessThanOrEqual(6_039);

  await page.goto("/components/navigation");
  await expect(page.getByRole("heading", { level: 1, name: "Navigation" })).toBeVisible();
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  await page.goto("/components/navigation#command");
  const commandHeading = page.locator("#command h3");
  await expect(commandHeading).toBeFocused();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/components");
  const mobileDimensions = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(mobileDimensions.height).toBeLessThanOrEqual(9_235);
  expect(mobileDimensions.scrollWidth).toBeLessThanOrEqual(mobileDimensions.clientWidth);
});

test("preserves legacy hashes and canonical component deep links", async ({ page }) => {
  await page.goto("/components#calendar");
  await expect(page).toHaveURL(/\/components\/selection#calendar$/);
  await expect(page.locator("#calendar h3")).toBeFocused();

  await page.goto("/components#navigation");
  await expect(page).toHaveURL(/\/components\/navigation$/);
});

test("searches and filters the static registry through shareable URLs", async ({ page }) => {
  await page.goto("/components");
  const search = page.getByRole("searchbox", { name: "Search by name, contract or import" });
  await search.fill("keyboard");
  await expect(page).toHaveURL(/\?q=keyboard$/);
  await expect(page.getByRole("link", { name: /Command \+ CommandDialog/ })).toBeVisible();

  await search.fill("");
  await page.getByRole("button", { name: "DAT", exact: true }).click();
  await expect(page).toHaveURL(/\?category=data-display$/);
  await expect(page.getByRole("link", { name: /DataTable/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Calendar/ })).toHaveCount(0);

  await page.getByRole("link", { name: /DataTable/ }).click();
  await expect(page).toHaveURL(/\/components\/data-display#data-table$/);
  await expect(page.locator("#data-table h3")).toBeFocused();
});

test("keeps category search, sequence and focus usable on compact screens", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/components/selection#calendar");
  const navigator = page.getByRole("navigation", { name: "Selection component navigation" });
  await expect(page.locator("#calendar h3")).toBeFocused();

  const next = navigator.getByRole("link", { name: "Next component: Tabs" });
  const nextBox = await next.boundingBox();
  expect(nextBox?.width).toBeGreaterThanOrEqual(44);
  expect(nextBox?.height).toBeGreaterThanOrEqual(44);
  await next.click();
  await expect(page).toHaveURL(/#tabs$/);
  await expect(page.locator("#tabs h3")).toBeFocused();

  const categorySearch = navigator.getByRole("searchbox", { name: "Search Selection components" });
  await categorySearch.fill("combobox");
  await navigator.getByRole("link", { name: /Combobox/ }).click();
  await expect(page).toHaveURL(/#combobox$/);
  await expect(page.locator("#combobox h3")).toBeFocused();

  await navigator.getByRole("combobox", { name: "Component category" }).selectOption("navigation");
  await expect(page).toHaveURL(/\/components\/navigation$/);
  const overflow = await page.evaluate(() => ({
    scroll: document.documentElement.scrollWidth,
    client: document.documentElement.clientWidth,
  }));
  expect(overflow.scroll).toBeLessThanOrEqual(overflow.client);
});

test("uses the system theme first and persists manual choices across routes and tabs", async ({ page, context }) => {
  await page.emulateMedia({ colorScheme: "light" });
  await page.goto("/components");
  await expect(page.locator("html")).toHaveAttribute("data-afo-theme", "light");

  const secondPage = await context.newPage();
  await secondPage.emulateMedia({ colorScheme: "light" });
  await secondPage.goto("/ui-foundation");
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await expect(secondPage.locator("html")).toHaveAttribute("data-afo-theme", "dark");

  await page.goto("/ui-foundation");
  await expect(page.locator("html")).toHaveAttribute("data-afo-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-afo-theme", "dark");

  await page.evaluate(() => localStorage.setItem("afo-explorer-theme-v1", "invalid"));
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-afo-theme", "light");
  await secondPage.close();
});

test("keeps audited landmark rules clean across the Explorer", async ({ page }) => {
  test.setTimeout(120_000);
  for (const route of ["/components", "/ui-foundation", ...categoryRoutes]) {
    await page.goto(route);
    const results = await new AxeBuilder({ page })
      .withRules(["landmark-unique", "region", "landmark-main-is-top-level"])
      .analyze();
    expect(results.violations, `${route} landmark violations`).toEqual([]);
  }
});

test("keeps every category free of serious WCAG violations in both themes", async ({ page }) => {
  test.setTimeout(180_000);
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const route of categoryRoutes) {
    await page.goto(route);
    for (const theme of ["dark", "light"] as const) {
      await page.getByRole("button", { name: theme, exact: true }).click();
      await expect(page.locator("html")).toHaveAttribute("data-afo-theme", theme);
      const results = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      const blocking = results.violations.filter(({ impact }) => impact === "serious" || impact === "critical");
      expect(blocking, `${route} ${theme} blocking violations`).toEqual([]);
    }
  }
});
