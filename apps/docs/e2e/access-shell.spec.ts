import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const fullPageScreenshotOptions = {
  fullPage: true,
  maxDiffPixelRatio: 0.0001,
  timeout: 15_000,
} as const

test("keeps the access task focused, semantic and reachable", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/patterns/access")

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Haz que cada entrenamiento cuente.",
    }),
  ).toBeVisible()
  await expect(
    page.getByRole("heading", {
      level: 2,
      name: "Entra. El contexto ya está listo.",
    }),
  ).toBeVisible()
  await expect(
    page.getByRole("list", { name: "Flujo de trabajo en Studio" }),
  ).toBeVisible()

  const action = page.getByRole("link", { name: "Entrar a Studio" })
  const actionBox = await action.boundingBox()
  expect(actionBox?.height).toBeGreaterThanOrEqual(44)
  expect(
    await action.evaluate(
      (element) => getComputedStyle(element).textDecorationLine,
    ),
  ).toBe("none")

  await action.focus()
  await expect(action).toBeFocused()
  expect(
    await action.evaluate((element) => getComputedStyle(element).boxShadow),
  ).not.toBe("none")

  const accessibility = await new AxeBuilder({ page })
    .include('[data-slot="access-shell"]')
    .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
    .analyze()
  const blocking = accessibility.violations.filter(
    (violation) =>
      violation.impact === "serious" || violation.impact === "critical",
  )
  expect(blocking).toEqual([])

})

/**
 * Split out of the behavioural test above, and named "matches" on purpose: CI
 * validates baselines in a Windows job that greps for that word, while the
 * Linux job runs everything else. A screenshot assertion outside the naming
 * therefore compared Windows baselines against Linux font rendering and passed
 * only while the difference stayed under `maxDiffPixelRatio`.
 */
test("matches the access pattern on desktop", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/patterns/access")
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "Haz que cada entrenamiento cuente.",
    }),
  ).toBeVisible()

  await expect(page).toHaveScreenshot(
    "access-shell-light-desktop.png",
    fullPageScreenshotOptions,
  )
})

test("reflows access before the supporting journey on mobile", async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/patterns/access")

  const layout = await page.evaluate(() => {
    const action = document.querySelector<HTMLElement>(
      '[data-slot="access-panel-action"]',
    )
    const journey = document.querySelector<HTMLElement>(
      '[data-slot="access-journey"]',
    )

    return {
      actionBottom:
        action?.getBoundingClientRect().bottom ?? Number.POSITIVE_INFINITY,
      actionTop:
        action?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY,
      journeyTop:
        journey?.getBoundingClientRect().top ?? Number.NEGATIVE_INFINITY,
      overflow:
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    }
  })

  expect(layout.overflow).toBeLessThanOrEqual(0)
  expect(layout.actionBottom).toBeLessThanOrEqual(812)
  expect(layout.actionTop).toBeLessThan(layout.journeyTop)

})

test("matches the access pattern on mobile", async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.emulateMedia({ reducedMotion: "reduce" })
  await page.goto("/patterns/access")
  await expect(
    page.getByRole("heading", { level: 2, name: "Entra. El contexto ya está listo." }),
  ).toBeVisible()

  await expect(page).toHaveScreenshot(
    "access-shell-light-mobile.png",
    fullPageScreenshotOptions,
  )
})
