import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/components");
  await expect(page.getByRole("heading", { level: 1, name: "Controls built for movement." })).toBeVisible();
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
  for (const locator of [
    page.getByRole("button", { name: "Start session" }),
    page.getByRole("button", { name: "Add movement" }),
    page.getByRole("checkbox", { name: "Share training history with this coach" }),
    page.getByRole("switch", { name: "Live progress sharing" }),
    page.locator("#navigation-menu").getByRole("button", { name: "Training", exact: true }),
    page.locator("#workspace-shell").getByRole("button", { name: /Overview/ }),
  ]) {
    const box = await locator.boundingBox();
    expect(box?.width).toBeGreaterThanOrEqual(44);
    expect(box?.height).toBeGreaterThanOrEqual(44);
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
});

test("provides searchable mobile indexes for components and foundations", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/components");
  await page.getByRole("button", { name: "Open component index" }).click();
  await page.getByRole("searchbox", { name: "Find a component" }).fill("Dialog");
  await page.getByRole("link", { name: "Dialog", exact: true }).click();
  await expect(page).toHaveURL(/#dialog$/);
  await expect(page.getByRole("heading", { name: "Component index" })).toBeHidden();

  await page.goto("/");
  await page.getByRole("button", { name: "Open foundation index" }).click();
  await page.getByRole("link", { name: /Typography/ }).click();
  await expect(page).toHaveURL(/#type$/);
});

test("uses the canonical Select in the applied foundation sample", async ({ page }) => {
  await page.goto("/");
  const trigger = page.locator('[data-slot="select-trigger"][aria-label="Training goal"]');
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  await page.getByRole("option", { name: "Recovery" }).click();
  await expect(trigger).toContainText("Recovery");
});

test("keeps the hero signature visible in both themes", async ({ page }) => {
  await page.goto("/");
  const darkMark = page.locator(".hero-signature__asset--dark");
  const lightMark = page.locator(".hero-signature__asset--light");

  await expect(darkMark).toBeVisible();
  await expect(lightMark).toBeHidden();
  await page.getByRole("button", { name: "light", exact: true }).click();
  await expect(darkMark).toBeHidden();
  await expect(lightMark).toBeVisible();
  expect(Number(await lightMark.evaluate((element) => getComputedStyle(element).opacity))).toBeGreaterThanOrEqual(0.08);
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
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await expect(page).toHaveScreenshot("components-dark-desktop.png", { fullPage: true });

  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole("button", { name: "light", exact: true }).click();
  await expect(page).toHaveScreenshot("components-light-mobile.png", { fullPage: true });
});

test("matches key overlay states in both themes", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await page.getByRole("button", { name: "Edit member" }).click();
  await expect(page).toHaveScreenshot("dialog-dark-desktop.png", { fullPage: false });
  await page.keyboard.press("Escape");

  await page.setViewportSize({ width: 320, height: 800 });
  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.getByRole("button", { name: "Open filters" }).click();
  await expect(page).toHaveScreenshot("sheet-light-mobile.png", { fullPage: false });
});
