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
 * Split out of the behavioural test above so the platform guard this repository
 * already uses can sit on the screenshot alone. These two assertions were the
 * only visual ones without it, and they carried Linux baselines besides — so
 * the Linux job compared them while every other baseline skipped, and they
 * passed only while Windows and Linux rendering agreed to within
 * `maxDiffPixelRatio`. Semantics, focus, the touch target, axe and the mobile
 * reflow order stay above, where Linux still runs them.
 */
test("matches the access pattern on desktop", async ({ page }) => {
  test.skip(
    process.platform !== "win32",
    "Visual baselines are canonical on Windows.",
  )
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
  test.skip(
    process.platform !== "win32",
    "Visual baselines are canonical on Windows.",
  )
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

/**
 * `app.css` resets the user-agent margins that a component cannot reach from
 * inside. Unlayered, that reset also flattened the margins components set on
 * themselves — `AccessPanelDescription` declares `mt-5` and rendered at 0.
 *
 * The reset therefore lives in `afo-base`, and `styles.css` pins that layer
 * below `utilities` so it cannot depend on a consumer's import order. This
 * asserts the outcome rather than the mechanism: the browser default is gone
 * from a bare paragraph, and a component's own spacing survives.
 */
test("lets a component's own spacing outrank the baseline reset", async ({
  page,
}) => {
  await page.goto("/patterns/access")

  const spacing = await page.evaluate(() => {
    const description = document.querySelector<HTMLElement>(
      '[data-slot="access-panel-description"]',
    )
    const probe = document.createElement("p")
    document.body.append(probe)
    const probeMargin = getComputedStyle(probe).marginBlockStart
    probe.remove()
    return {
      probeMargin,
      descriptionMargin: description
        ? getComputedStyle(description).marginBlockStart
        : null,
    }
  })

  expect(spacing.probeMargin, "the user-agent paragraph margin is reset").toBe(
    "0px",
  )
  expect(
    spacing.descriptionMargin,
    "the component's own mt-5 must outrank the reset",
  ).toBe("20px")
})
