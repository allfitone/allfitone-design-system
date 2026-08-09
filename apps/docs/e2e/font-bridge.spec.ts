import { expect, test } from "@playwright/test"

test("keeps display typography valid and visible across browser engines", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto("/patterns/access")
  await page.evaluate(() => {
    const root = document.documentElement

    root.style.setProperty("--afo-app-font-display", '"Barlow Condensed"')
    root.style.setProperty("--font-display", "var(--afo-font-family-display)")
  })
  await page.evaluate(() => document.fonts.ready)

  const typography = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const title = document.querySelector<HTMLElement>('[data-slot="access-title"]')

    if (!title) {
      throw new Error("Access title is missing from the public pattern")
    }

    const titleStyles = getComputedStyle(title)
    const titleRect = title.getBoundingClientRect()

    return {
      displayFamily: root.getPropertyValue("--afo-font-family-display").trim(),
      titleFamily: titleStyles.fontFamily,
      titleContentRight: titleRect.left + Math.max(titleRect.width, title.scrollWidth),
      viewportRight: document.documentElement.clientWidth,
    }
  })

  expect(typography.displayFamily).toContain("Barlow Condensed")
  expect(typography.titleFamily).toContain("Barlow Condensed")
  expect(typography.titleContentRight).toBeLessThanOrEqual(typography.viewportRight)
})
