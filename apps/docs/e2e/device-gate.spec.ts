import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const fullPageScreenshotOptions = {
  fullPage: true,
  maxDiffPixelRatio: 0.0001,
  timeout: 15_000,
} as const;

test("keeps the workspace available on tablet and desktop", async ({
  page,
}) => {
  await page.goto("/patterns/device-gate");

  await expect(page.getByTestId("device-gate-workspace")).toBeVisible();
  await expect(page.getByTestId("device-gate-fallback")).toBeHidden();

  await page.setViewportSize({ width: 600, height: 960 });
  await expect(page.getByTestId("device-gate-workspace")).toBeVisible();
  await expect(page.getByTestId("device-gate-fallback")).toBeHidden();
});

test("matches the workspace guidance on compact screens", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/patterns/device-gate");

  await expect(page.getByTestId("device-gate-workspace")).toBeHidden();
  await expect(page.getByTestId("device-gate-fallback")).toBeVisible();
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Continúa en una pantalla más amplia.",
    })
  ).toBeVisible();

  const overflow = await page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth
  );
  expect(overflow).toBeLessThanOrEqual(0);

  const accessibility = await new AxeBuilder({ page })
    .include('[data-slot="device-gate-fallback"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze();
  const blocking = accessibility.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical"
  );
  expect(blocking).toEqual([]);

  const landmarks = await new AxeBuilder({ page })
    .include('[data-slot="device-gate-fallback"]')
    .withRules(["landmark-unique", "region", "landmark-main-is-top-level"])
    .analyze();
  expect(landmarks.violations).toEqual([]);

  if (process.platform === "win32") {
    await expect(page).toHaveScreenshot(
      "device-gate-light-mobile.png",
      fullPageScreenshotOptions
    );
  }

  await page.setViewportSize({ width: 320, height: 640 });
  expect(
    await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth
    )
  ).toBeLessThanOrEqual(0);
});

test("copies the workspace link and announces the recovery outcome", async ({ page, context }) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/patterns/device-gate");

  await page.getByRole("button", { name: "Copiar enlace" }).click();
  await expect(page.getByRole("status")).toHaveText("Enlace copiado.");
});

test("offers a selectable manual link when Clipboard API fails", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: () => Promise.reject(new Error("Clipboard unavailable")) },
    });
  });
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto("/patterns/device-gate");

  await page.getByRole("button", { name: "Copiar enlace" }).click();
  await expect(page.getByRole("status")).toHaveText("Copia este enlace manualmente.");
  const manualLink = page.getByRole("textbox", { name: "Enlace del espacio de trabajo" });
  await expect(manualLink).toBeVisible();
  await expect(manualLink).toBeFocused();
  await expect(manualLink).toHaveValue(/\/patterns\/device-gate$/);
});

test("matches the compact guidance in the dark theme", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/patterns/device-gate-dark");

  await expect(page.getByTestId("device-gate-workspace")).toBeHidden();
  await expect(page.getByTestId("device-gate-fallback")).toBeVisible();
  await expect(
    page.getByText("Allfit Backoffice no está disponible en celular.")
  ).toBeVisible();

  if (process.platform === "win32") {
    await expect(page).toHaveScreenshot(
      "device-gate-dark-mobile.png",
      fullPageScreenshotOptions
    );
  }
});

test("blocks a coarse-pointer phone in landscape", async ({ browser }) => {
  const context = await browser.newContext({
    hasTouch: true,
    isMobile: true,
    viewport: { width: 844, height: 390 },
  });
  const page = await context.newPage();

  try {
    await page.goto("/patterns/device-gate");
    await expect(page.getByTestId("device-gate-workspace")).toBeHidden();
    await expect(page.getByTestId("device-gate-fallback")).toBeVisible();
  } finally {
    await context.close();
  }
});
