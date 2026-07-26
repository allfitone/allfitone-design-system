import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

function readWorkspacePackageVersion(packageDirectory: "react" | "tokens") {
  const candidates = [
    resolve(process.cwd(), "packages", packageDirectory, "package.json"),
    resolve(process.cwd(), "..", "..", "packages", packageDirectory, "package.json"),
  ];
  const manifestPath = candidates.find((candidate) => existsSync(candidate));

  if (!manifestPath) {
    throw new Error(`Unable to locate the @allfitone/${packageDirectory} package manifest.`);
  }

  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as { version?: unknown };
  if (typeof manifest.version !== "string") {
    throw new Error(`@allfitone/${packageDirectory} does not declare a valid version.`);
  }

  return manifest.version;
}

const reactPackageVersion = readWorkspacePackageVersion("react");
const tokensPackageVersion = readWorkspacePackageVersion("tokens");
const fullPageScreenshotOptions = {
  fullPage: true,
  maxDiffPixelRatio: 0.0001,
} as const;

async function verifyPackageVersion(page: Page, expectedLabels: readonly string[]) {
  for (const label of expectedLabels) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
}

async function normalizePackageVersions(page: Page) {
  await page.locator("body").evaluate((body) => {
    const walker = document.createTreeWalker(body, NodeFilter.SHOW_TEXT);
    let node = walker.nextNode();

    while (node) {
      node.textContent =
        node.textContent?.replace(
          /\bv\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?\b/g,
          "v0.0.0",
        ) ?? null;
      node = walker.nextNode();
    }
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto("/components");
  await expect(page.getByRole("heading", { level: 1, name: "Components" })).toBeVisible();
});

test("supports both themes without serious accessibility violations", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const theme of ["dark", "light"] as const) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-afo-theme", theme);
    await page.waitForTimeout(50);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter((violation) =>
      violation.impact === "serious" || violation.impact === "critical",
    );
    expect(blocking).toEqual([]);
  }
});

test("keeps foundations accessible in both themes", async ({ page }) => {
  await page.goto("/ui-foundation");
  await expect(page.getByRole("heading", { level: 1, name: "UI Foundation" })).toBeVisible();
  await page.emulateMedia({ reducedMotion: "reduce" });

  for (const theme of ["dark", "light"] as const) {
    await page.getByRole("button", { name: theme, exact: true }).click();
    await expect(page.locator("html")).toHaveAttribute("data-afo-theme", theme);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    const blocking = results.violations.filter((violation) =>
      violation.impact === "serious" || violation.impact === "critical",
    );
    expect(blocking).toEqual([]);
  }
});

test("keeps visible Explorer text at the 12 px minimum", async ({ page }) => {
  for (const route of ["/components", "/ui-foundation"]) {
    await page.goto(route);
    const undersized = await page.locator("body *").evaluateAll((elements) =>
      elements.flatMap((element) => {
        const styles = getComputedStyle(element);
        const bounds = element.getBoundingClientRect();
        const hasDirectText = [...element.childNodes].some(
          (node) => node.nodeType === Node.TEXT_NODE && node.textContent?.trim(),
        );

        if (
          !hasDirectText ||
          styles.display === "none" ||
          styles.visibility === "hidden" ||
          bounds.width === 0 ||
          bounds.height === 0 ||
          Number.parseFloat(styles.fontSize) >= 12
        ) {
          return [];
        }

        return [{
          element: element.tagName.toLowerCase(),
          text: element.textContent?.trim().replace(/\s+/g, " ").slice(0, 80),
          fontSize: styles.fontSize,
        }];
      }),
    );

    expect(undersized, `${route} undersized text`).toEqual([]);
  }
});

test("keeps the component manifest free of category counts", async ({ page }) => {
  await expect(page.locator(".component-manifest__count")).toHaveCount(0);
});

test("contains dialog focus and returns it to the trigger", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Edit member" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  const dialog = page.getByRole("dialog", { name: "Edit member" });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByRole("textbox", { name: "Display name" })).toBeVisible();

  const accessibility = await new AxeBuilder({ page }).include("[role=dialog]").analyze();
  expect(accessibility.violations.filter(({ impact }) => impact === "serious" || impact === "critical")).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("operates composite selection controls from the keyboard", async ({ page }) => {
  const historyTab = page.getByRole("tab", { name: "History" });
  await page.getByRole("tab", { name: "Overview" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(historyTab).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(historyTab).toHaveAttribute("aria-selected", "true");

  const select = page.getByRole("combobox", { name: "Program" });
  await select.focus();
  await page.keyboard.press("Enter");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(select).not.toHaveText("");
});

test("keeps table sorting, selection and result states explicit", async ({ page }) => {
  const table = page.getByRole("table", { name: "Members" });
  const region = page.getByRole("region", { name: "Scrollable member directory" });
  const memberHeader = table.locator('th[aria-sort]');

  await expect(region).toHaveAttribute("tabindex", "0");
  await expect(memberHeader).toHaveAttribute("aria-sort", "ascending");
  const sortButton = table.getByRole("button", { name: "Sort members descending" });
  const sortButtonStyles = await sortButton.evaluate((element) => {
    const styles = getComputedStyle(element);
    return {
      backgroundColor: styles.backgroundColor,
      borderWidth: styles.borderWidth,
      borderRadius: styles.borderRadius,
      hasVisibleBoxShadow: (styles.boxShadow.match(/rgba?\([^)]+\)/g) ?? [])
        .some((color) => !color.endsWith(", 0)")),
    };
  });
  expect(sortButtonStyles).toEqual({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderWidth: "0px",
    borderRadius: "0px",
    hasVisibleBoxShadow: false,
  });
  await sortButton.click();
  await expect(memberHeader).toHaveAttribute("aria-sort", "descending");

  const memberCheckbox = table.getByRole("checkbox", { name: "Select Camila Torres" });
  const memberRow = memberCheckbox.locator("xpath=ancestor::tr");
  await expect(memberRow).toHaveAttribute("data-state", "selected");
  await memberCheckbox.click();
  await expect(memberRow).not.toHaveAttribute("data-state", "selected");

  const stateSelect = page.getByRole("combobox", { name: "Preview table state" });
  await stateSelect.click();
  await page.getByRole("option", { name: "Error" }).click();
  await expect(table.getByRole("alert")).toContainText("Members could not be loaded");
  await table.getByRole("button", { name: "Try again" }).click();
  await expect(table.getByText("Camila Torres")).toBeVisible();

  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  await region.scrollIntoViewIfNeeded();
  const mobileSortStyles = await table
    .getByRole("button", { name: "Sort members ascending" })
    .evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        borderWidth: styles.borderWidth,
        borderRadius: styles.borderRadius,
      };
    });
  expect(mobileSortStyles).toEqual({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderWidth: "0px",
    borderRadius: "0px",
  });
  const overflow = await region.evaluate((element) => ({
    client: element.clientWidth,
    scroll: element.scrollWidth,
  }));
  expect(overflow.scroll).toBeGreaterThan(overflow.client);
});

test("composes data-table controls without restyling sortable headers", async ({ page }) => {
  const specimen = page.locator("#data-table");
  const table = specimen.getByRole("table", { name: "Member results" });
  const sortButton = table.getByRole("button", {
    name: "Change member sorting",
  });

  await expect(sortButton).toHaveAttribute("data-direction", "none");
  expect(
    await sortButton.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        borderWidth: styles.borderWidth,
        borderRadius: styles.borderRadius,
      };
    }),
  ).toEqual({
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderWidth: "0px",
    borderRadius: "0px",
  });

  await sortButton.click();
  await expect(table.locator('th[aria-sort="ascending"]')).toBeVisible();

  const search = specimen.getByRole("textbox", { name: "Search members" });
  await search.fill("Mobility");
  await expect(table.getByText("Mateo Ruiz")).toBeVisible();
  await expect(table.getByText("Camila Torres")).toHaveCount(0);
  await search.fill("");

  await table.getByRole("checkbox", { name: "Select Camila Torres" }).click();
  await expect(specimen.getByRole("status")).toContainText("1 member selected");
  await expect(specimen.getByRole("button", { name: "Assign plan" })).toBeVisible();

  await specimen.getByRole("button", { name: "Columns" }).click();
  await page.getByRole("menuitemcheckbox", { name: "Plan" }).click();
  await expect(table.getByRole("columnheader", { name: "Plan" })).toHaveCount(0);
  await page.keyboard.press("Escape");

  await specimen.getByRole("button", { name: "Next page" }).click();
  await expect(specimen.getByText("Page 2 of 2")).toBeVisible();
});

test("operates workspace navigation and returns focus from mobile overlays", async ({ page }) => {
  const navigationMenu = page.locator("#navigation-menu");
  const trainingTrigger = navigationMenu.getByRole("button", { name: "Training", exact: true });
  await trainingTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("link", { name: /Programs/ })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(trainingTrigger).toBeFocused();

  const organizationTrigger = page.locator("#dropdown-menu").getByRole("button", { name: /Allfit Performance/ });
  await organizationTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("menuitem", { name: "Overview" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(organizationTrigger).toBeFocused();

  await page.setViewportSize({ width: 320, height: 800 });
  const drawerTrigger = page.getByRole("button", { name: "Open mobile navigation" });
  await drawerTrigger.focus();
  await page.keyboard.press("Enter");
  const drawer = page.getByRole("dialog", { name: "Workspace" });
  await expect(drawer).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(drawerTrigger).toBeFocused();

  await drawerTrigger.click();
  await drawer.getByRole("link", { name: "Overview" }).click();
  await expect(drawer).toBeHidden();
  await expect(page).toHaveURL(/#navigation$/);
});

test("demonstrates the interaction sequence from the keyboard", async ({ page }) => {
  const idle = page.getByRole("tab", { name: /Idle/ });
  const focus = page.getByRole("tab", { name: /Focus/ });
  await idle.focus();
  await page.keyboard.press("ArrowRight");
  await expect(focus).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Keyboard focus is visible")).toBeVisible();
});

test("announces toast feedback without stealing focus", async ({ page }) => {
  const trigger = page.getByRole("button", { name: "Show success" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByText("Session saved")).toBeVisible();
  await expect(trigger).toBeFocused();
});

test("keeps touch targets and focus treatment at the minimum contract", async ({ page }) => {
  const targets = {
    "primary button": page.getByRole("button", { name: "Start session" }),
    "icon button": page.getByRole("button", { name: "Add movement" }),
    checkbox: page.getByRole("checkbox", { name: "Share training history with this coach" }),
    "table checkbox": page
      .getByRole("table", { name: "Members" })
      .getByRole("checkbox", { name: "Select Camila Torres" }),
    switch: page.getByRole("switch", { name: "Live progress sharing" }),
    "navigation trigger": page.locator("#navigation-menu").getByRole("button", { name: "Training", exact: true }),
    "workspace action": page.locator("#workspace-shell").getByRole("button", { name: /Panel/ }),
  };

  for (const [name, locator] of Object.entries(targets)) {
    const box = await locator.boundingBox();
    expect(box?.width, `${name} width`).toBeGreaterThanOrEqual(44);
    expect(box?.height, `${name} height`).toBeGreaterThanOrEqual(44);
  }

  const action = page.getByRole("button", { name: "Start session" });
  await action.focus();
  const focusShadow = await action.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(focusShadow).not.toBe("none");
});

test("does not overflow at 320 px or with long text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/components");
  const dimensions = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  await expect(page.getByRole("button", { name: "Large action with long text" })).toBeVisible();

  for (const name of ["Go to previous page", "Go to next page"]) {
    const box = await page.getByRole("link", { name }).boundingBox();
    expect(box?.width, `${name} width`).toBeGreaterThanOrEqual(44);
    expect(box?.height, `${name} height`).toBeGreaterThanOrEqual(44);
  }
});

test("provides responsive navigation for components and foundations", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/components");
  const mobileHeader = page.locator(".design-system-mobile-header");
  const menuTrigger = mobileHeader.locator('[data-sidebar="trigger"]');
  const brand = mobileHeader.getByRole("link", { name: /Allfit One Components home/ });
  await expect(menuTrigger).toHaveAccessibleName("Open design system navigation");
  await expect(menuTrigger.locator("svg")).toHaveClass(/lucide-menu/);
  await expect(mobileHeader.locator(".theme-toggle")).toHaveCount(0);

  const menuBox = await menuTrigger.boundingBox();
  const brandBox = await brand.boundingBox();
  expect(menuBox?.x).toBeLessThan(brandBox?.x ?? 0);

  await menuTrigger.click();
  await expect(menuTrigger).toHaveAttribute("aria-expanded", "true");
  await page.getByRole("link", { name: /Overlays/ }).click();
  await expect(page).toHaveURL(/#overlays$/);

  await page.goto("/ui-foundation");
  await page.getByRole("button", { name: "Open design system navigation" }).click();
  await page.getByRole("link", { name: /Typography/ }).click();
  await expect(page).toHaveURL(/#type$/);
});

test("keeps the design system sidebar free of decorative separators", async ({ page }) => {
  await expect(page.locator('[data-sidebar="sidebar"] [data-slot="sidebar-separator"]')).toHaveCount(0);
});

test("keeps the back-to-top action floating outside both footers", async ({ page }) => {
  for (const [route, target] of [["/components", "#overview"], ["/ui-foundation", "#top"]] as const) {
    await page.goto(route);
    const action = page.locator('[data-slot="back-to-top"]');

    await expect(action).toHaveAttribute("href", target);
    await expect(action).toHaveAttribute("data-visible", "false");
    await expect(page.locator(".guide-footer").getByRole("link", { name: "Back to top" })).toHaveCount(0);

    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect(action).toHaveAttribute("data-visible", "true");
    await expect(action).toHaveAccessibleName("Back to top");
    expect(await action.evaluate((element) => getComputedStyle(element).position)).toBe("fixed");

    const box = await action.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
  }
});

test("keeps typography descenders clear of scale dividers", async ({ page }) => {
  await page.goto("/ui-foundation");
  const clearances = await page.locator(".type-scale > div").evaluateAll((rows) =>
    rows.map((row) => {
      const sample = row.querySelector("span");
      if (!sample) return 0;

      return row.getBoundingClientRect().bottom - sample.getBoundingClientRect().bottom;
    }),
  );

  expect(Math.min(...clearances)).toBeGreaterThanOrEqual(8);
});

test("composes foundation samples from canonical public components", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".theme-preview[data-slot=card]")).toHaveCount(2);
  await expect(page.locator(".theme-preview [data-slot=button]")).toHaveCount(2);
  await expect(page.locator("#applied .sample-panel[data-slot=card]")).toHaveCount(3);
  await expect(page.locator("#applied [data-slot=stat-strip]")).toBeVisible();
  await expect(page.locator("#applied .applied-grid [data-slot=badge]")).toHaveCount(5);

  const trigger = page.locator('[data-slot="select-trigger"][aria-label="Training goal"]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await page.getByRole("option", { name: "Recovery" }).click();
  await expect(trigger).toContainText("Recovery");
});

test("keeps the Ink & Signal signature stable in both themes", async ({ page }) => {
  const accent = page.locator('[data-slot="accent-block"]').first();
  const pulse = page.locator('[data-slot="pulse-mark"]').first();

  await expect(accent).toBeVisible();
  await expect(pulse).toBeVisible();
  const darkSignal = await accent.evaluate((element) => getComputedStyle(element).backgroundImage);
  await page.getByRole("button", { name: "light", exact: true }).click();
  const lightSignal = await accent.evaluate((element) => getComputedStyle(element).backgroundImage);
  expect(lightSignal).toBe(darkSignal);
});

test("renders the brand entrance as a static final frame for reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ui-foundation?motion=reduced");
  await expect(page.getByRole("heading", { level: 1, name: "UI Foundation" })).toBeVisible();

  const brandLockup = page.locator('[data-slot="animated-brand-lockup"]');
  await expect(brandLockup).toHaveAttribute("data-motion-reduced", "true");
  await expect(brandLockup).toHaveAccessibleName("Allfit One");
  await page.getByRole("button", { name: "Replay entrance" }).click();
  await expect(brandLockup).toHaveAttribute("data-motion-reduced", "true");
});

test("honors reduced motion and forced color focus", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  const spinner = page.getByRole("status", { name: "Loading" }).first();
  expect(await spinner.evaluate((element) => getComputedStyle(element).animationDuration)).toBe("0s");

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  const action = page.getByRole("button", { name: "Start session" });
  await action.focus();
  expect(await action.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
});

test("matches the approved catalog composition", async ({ page }) => {
  test.skip(process.platform !== "win32", "Visual baselines are canonical on Windows.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await verifyPackageVersion(page, [
    `React \u00b7 v${reactPackageVersion}`,
    `v${reactPackageVersion}`,
    `React components / v${reactPackageVersion}`,
  ]);
  await normalizePackageVersions(page);
  await expect(page).toHaveScreenshot(
    "components-dark-desktop.png",
    fullPageScreenshotOptions,
  );

  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  await normalizePackageVersions(page);
  await expect(page).toHaveScreenshot(
    "components-light-mobile.png",
    fullPageScreenshotOptions,
  );
});

test("matches the approved foundation composition", async ({ page }) => {
  test.skip(process.platform !== "win32", "Visual baselines are canonical on Windows.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ui-foundation");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await verifyPackageVersion(page, [
    `Tokens \u00b7 v${tokensPackageVersion}`,
    `v${tokensPackageVersion}`,
    `UI Foundation / Tokens / v${tokensPackageVersion}`,
  ]);
  await normalizePackageVersions(page);
  await expect(page).toHaveScreenshot(
    "foundation-dark-desktop.png",
    fullPageScreenshotOptions,
  );

  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  await normalizePackageVersions(page);
  await expect(page).toHaveScreenshot(
    "foundation-light-mobile.png",
    fullPageScreenshotOptions,
  );
});

test("matches key overlay states in both themes", async ({ page }) => {
  test.skip(process.platform !== "win32", "Visual baselines are canonical on Windows.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await page.getByRole("button", { name: "Edit member" }).click();
  await expect(page).toHaveScreenshot("dialog-dark-desktop.png", { fullPage: false });
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole("button", { name: "Open filters" }).click();
  await expect(page).toHaveScreenshot("sheet-light-mobile.png", { fullPage: false });
});
