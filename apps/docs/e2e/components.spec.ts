import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const fullPageScreenshotOptions = {
  fullPage: true,
  maxDiffPixelRatio: 0.0001,
  timeout: 15_000,
} as const;

async function verifyExplorerVersion(page: Page, expectedLabels: readonly string[]) {
  for (const label of expectedLabels) {
    await expect(page.getByText(label, { exact: true })).toBeVisible();
  }
  await expect(page.locator("body")).not.toContainText(/\bv\d+\.\d+\.\d+\b/);
}

async function openCategory(page: Page, category: string, heading: string) {
  await page.goto(`/components/${category}`);
  await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
}

test.beforeEach(async ({ page }) => {
  await page.goto("/components");
  await expect(page.getByRole("heading", { level: 1, name: "Components" })).toBeVisible();
});

test("documents responsive setup and choice contracts", async ({ page }) => {
  await openCategory(page, "navigation", "Navigation");
  const setup = page.locator("#setup-shell");
  await expect(setup.getByRole("list", { name: "Setup progress" })).toBeVisible();
  await expect(setup.locator('[data-slot="setup-progress-step"][data-status="current"]')).toHaveAttribute("aria-current", "step");

  await page.setViewportSize({ width: 390, height: 844 });
  await expect(setup.locator('[data-slot="setup-panel"]')).toBeVisible();
  expect(await setup.evaluate((element) => element.scrollWidth - element.clientWidth)).toBeLessThanOrEqual(0);

  await openCategory(page, "selection", "Selection");
  const choice = page.getByRole("button", { name: /Independent practice/ });
  const box = await choice.boundingBox();
  expect(box?.height).toBeGreaterThanOrEqual(44);
  await choice.focus();
  await expect(choice).toBeFocused();

  await page.emulateMedia({ reducedMotion: "reduce", forcedColors: "active" });
  await choice.focus();
  expect(await choice.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");
});

test("applies the public application baseline and product font bridge", async ({ page }) => {
  const baseline = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement);
    const body = getComputedStyle(document.body);
    const sample = document.createElement("div");
    document.body.append(sample);
    const sampleBoxSizing = getComputedStyle(sample).boxSizing;
    sample.remove();

    return {
      bodyFont: body.fontFamily,
      bodyMargin: body.margin,
      bodyBackground: body.backgroundColor,
      displayFont: root.getPropertyValue("--afo-font-family-display").trim(),
      sampleBoxSizing,
    };
  });

  expect(baseline.bodyMargin).toBe("0px");
  expect(baseline.sampleBoxSizing).toBe("border-box");
  expect(baseline.displayFont).not.toBe("");
  expect(baseline.bodyFont).toContain("Manrope");
  expect(baseline.bodyBackground).not.toBe("rgba(0, 0, 0, 0)");
});

test("supports both themes without serious accessibility violations", async ({ page }) => {
  test.setTimeout(45_000);
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

test("keeps the index searchable without mounting live specimens", async ({ page }) => {
  await expect(page.getByRole("search")).toBeVisible();
  await expect(page.locator(".component-entry")).toHaveCount(0);
  await page.getByRole("searchbox", { name: "Search by name, contract or import" }).fill("calendar");
  await expect(page.getByRole("link", { name: /Calendar/ })).toHaveAttribute("href", "/components/selection#calendar");
});

test("contains dialog focus and returns it to the trigger", async ({ page }) => {
  await openCategory(page, "overlays", "Overlays");
  await page.getByRole("button", { name: "dark", exact: true }).click();
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

test("filters shared commands and composes the global dialog shortcut", async ({ page }) => {
  await openCategory(page, "navigation", "Navigation");
  const specimen = page.locator("#command");
  const inlineCommand = specimen.locator('[data-slot="command"]').first();
  const input = inlineCommand.getByRole("combobox", {
    name: "Search quick workspace commands",
  });

  await input.fill("schedule");
  await expect(
    inlineCommand.getByRole("option", { name: /Today’s schedule/ })
  ).toBeVisible();
  await expect(
    inlineCommand.getByRole("option", { name: /Member directory/ })
  ).toHaveCount(0);

  await input.fill("permission");
  await expect(
    inlineCommand.getByRole("option", {
      name: /Publish organization template/,
    })
  ).toHaveAttribute("aria-disabled", "true");

  await input.fill("not a real command");
  await expect(
    inlineCommand.getByText(
      "No commands match this search. Try a member, session or program."
    )
  ).toBeVisible();

  await input.fill("");
  await input.focus();
  await page.keyboard.press("Control+k");

  const dialog = page.getByRole("dialog", {
    name: "Workspace command menu",
  });
  await expect(dialog).toBeVisible();
  const dialogInput = dialog.getByRole("combobox", {
    name: "Search global workspace commands",
  });
  await expect(dialogInput).toBeFocused();
  await dialogInput.fill("invite");
  await page.keyboard.press("Enter");
  await expect(dialog).toBeHidden();
  await expect(input).toBeFocused();
  await expect(
    specimen.locator(".command-specimen__footer").getByText(
      "Invite member",
      { exact: true }
    )
  ).toBeVisible();

  const selectedTarget = inlineCommand
    .locator('[data-slot="command-item"][data-selected="true"]')
    .first();
  const targetBox = await selectedTarget.boundingBox();
  expect(targetBox?.height).toBeGreaterThanOrEqual(44);

  const accessibility = await new AxeBuilder({ page }).include("#command").analyze();
  expect(
    accessibility.violations.filter(
      ({ impact }) => impact === "serious" || impact === "critical"
    )
  ).toEqual([]);
});

test("keeps popover content opaque, non-modal and collision-aware", async ({ page }) => {
  await openCategory(page, "overlays", "Overlays");
  await page.getByRole("button", { name: "dark", exact: true }).click();
  const specimen = page.locator("#popover");
  const trigger = specimen.getByRole("button", { name: "View member context" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  const popover = page.getByRole("dialog", { name: "Camila Torres" });
  await expect(popover).toBeVisible();
  await expect(popover.getByRole("button", { name: "Done" })).toBeFocused();
  expect(
    await popover.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        opacity: styles.opacity,
        zIndex: Number(styles.zIndex),
      };
    }),
  ).toEqual({
    backgroundColor: "rgb(11, 20, 29)",
    opacity: "1",
    zIndex: 50,
  });

  await page.keyboard.press("Escape");
  await expect(popover).toBeHidden();
  await expect(trigger).toBeFocused();

  await page.setViewportSize({ width: 320, height: 800 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const bounds = await popover.boundingBox();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(320);

  const triggerBox = await trigger.boundingBox();
  expect(triggerBox?.height).toBeGreaterThanOrEqual(44);
  await page.mouse.click(2, 2);
  await expect(popover).toBeHidden();
});

test("operates composite selection controls from the keyboard", async ({ page }) => {
  await openCategory(page, "selection", "Selection");
  const toggleGroup = page.locator("#toggle-group");
  const spanishToggle = toggleGroup.getByRole("button", { name: "ES", exact: true });
  const englishToggle = toggleGroup.getByRole("button", { name: "EN", exact: true });
  await spanishToggle.focus();
  await page.keyboard.press("ArrowRight");
  await expect(englishToggle).toBeFocused();
  await page.keyboard.press("Space");
  await expect(englishToggle).toHaveAttribute("aria-pressed", "true");
  await expect(spanishToggle).toHaveAttribute("aria-pressed", "false");

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

test("parses date picker input and keeps its calendar bounded", async ({ page }) => {
  await openCategory(page, "selection", "Selection");
  const specimen = page.locator("#date-picker");
  const field = specimen.locator('[data-slot="date-picker"]').first();
  const input = field.getByLabel("Session date");
  const trigger = field.getByRole("button", { name: "Open calendar" });

  await expect(input).toHaveValue("08/18/2026");
  await trigger.click();

  const dialog = page.getByRole("dialog", { name: "Session date calendar" });
  await expect(dialog).toBeVisible();
  await dialog
    .getByRole("button", { name: /Thursday, August 20th, 2026/i })
    .click();
  await expect(dialog).toBeHidden();
  await expect(input).toHaveValue("08/20/2026");
  await expect(
    specimen.getByText("Thu, Aug 20", { exact: true })
  ).toBeVisible();

  await field.getByRole("button", { name: "Clear date" }).click();
  await expect(input).toBeFocused();
  await input.fill("08/27/2026");
  await input.press("Enter");
  await expect(field.getByRole("alert")).toHaveText(
    "That date is unavailable."
  );
  await expect(input).toHaveAttribute("aria-invalid", "true");

  await input.fill("08/25/2026");
  await input.press("Enter");
  await expect(input).toHaveValue("08/25/2026");
  await expect(input).not.toHaveAttribute("aria-invalid");

  const triggerBox = await trigger.boundingBox();
  expect(triggerBox?.width).toBeGreaterThanOrEqual(44);
  expect(triggerBox?.height).toBeGreaterThanOrEqual(44);

  await page.setViewportSize({ width: 320, height: 800 });
  await trigger.scrollIntoViewIfNeeded();
  await trigger.click();
  const bounds = await dialog.boundingBox();
  expect(bounds?.x).toBeGreaterThanOrEqual(0);
  expect((bounds?.x ?? 0) + (bounds?.width ?? 0)).toBeLessThanOrEqual(320);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();
});

test("selects calendar dates and ranges with 44 px keyboard targets", async ({ page }) => {
  await openCategory(page, "selection", "Selection");
  const specimen = page.locator("#calendar");
  const single = specimen.locator(
    '[data-slot="calendar"][aria-label="Session calendar"]',
  );
  const range = specimen.locator(
    '[data-slot="calendar"][aria-label="Training block calendar"]',
  );
  const august20 = single.getByRole("button", {
    name: /Thursday, August 20th, 2026/i,
  });

  await august20.click();
  await expect(specimen.getByText("Thu, Aug 20", { exact: true })).toBeVisible();
  await expect(august20).toHaveAttribute("data-selected-single", "true");

  await august20.focus();
  await page.keyboard.press("ArrowRight");
  const august21 = single.getByRole("button", {
    name: /Friday, August 21st, 2026/i,
  });
  await expect(august21).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(specimen.getByText("Fri, Aug 21", { exact: true })).toBeVisible();

  const unavailable = single.getByRole("button", {
    name: /Thursday, August 27th, 2026/i,
  });
  await expect(unavailable).toBeDisabled();

  const targetBox = await august21.boundingBox();
  const navigationBox = await single
    .getByRole("button", { name: "Go to the Next Month" })
    .boundingBox();
  for (const [name, box] of [
    ["calendar day", targetBox],
    ["calendar navigation", navigationBox],
  ] as const) {
    expect(box?.width, `${name} width`).toBeGreaterThanOrEqual(44);
    expect(box?.height, `${name} height`).toBeGreaterThanOrEqual(44);
  }

  await expect(
    range.getByRole("button", { name: /Monday, September 7th, 2026/i }),
  ).toHaveAttribute("data-range-start", "true");
  await expect(
    range.getByRole("button", { name: /Friday, September 18th, 2026/i }),
  ).toHaveAttribute("data-range-end", "true");

  await range
    .getByRole("button", { name: /Monday, September 21st, 2026/i })
    .click();
  await range
    .getByRole("button", { name: /Friday, September 25th, 2026/i })
    .click();
  await expect(
    specimen.getByText("Mon, Sep 21 – Fri, Sep 25", { exact: true }),
  ).toBeVisible();

  await page.setViewportSize({ width: 320, height: 800 });
  await range.scrollIntoViewIfNeeded();
  expect(
    await range.locator(".rdp-months").evaluate(
      (element) => getComputedStyle(element).flexDirection,
    ),
  ).toBe("column");
  const rangeOverflow = await range.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
  }));
  expect(rangeOverflow.scrollWidth).toBeGreaterThanOrEqual(
    rangeOverflow.clientWidth,
  );
  const pageWidth = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(pageWidth.document).toBeLessThanOrEqual(pageWidth.viewport);
});

test("filters rich combobox options and exposes multiple and remote states", async ({ page }) => {
  await openCategory(page, "selection", "Selection");
  await page.getByRole("button", { name: "dark", exact: true }).click();
  const specimen = page.locator("#combobox");
  const leadCoach = specimen.locator("#lead-coach-combobox");

  await leadCoach.focus();
  await leadCoach.fill("Valentina");
  const popup = page.locator('[data-slot="combobox-content"]');
  await expect(page.getByRole("option", { name: /Valentina Gómez de la Torre/ })).toBeVisible();
  expect(
    await popup.evaluate((element) => {
      const styles = getComputedStyle(element);
      return {
        backgroundColor: styles.backgroundColor,
        opacity: styles.opacity,
        zIndex: Number(styles.zIndex),
      };
    }),
  ).toEqual({
    backgroundColor: "rgb(11, 20, 29)",
    opacity: "1",
    zIndex: 50,
  });
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Enter");
  await expect(leadCoach).toHaveValue("Valentina Gómez de la Torre");

  const clear = specimen.getByRole("button", { name: "Clear lead coach" });
  const clearBox = await clear.boundingBox();
  expect(clearBox?.width).toBeGreaterThanOrEqual(44);
  expect(clearBox?.height).toBeGreaterThanOrEqual(44);
  await clear.click();
  await expect(leadCoach).toHaveValue("");

  const multiple = specimen.locator("#session-coaches-combobox");
  await multiple.click();
  await page.getByRole("option", { name: /Mateo Ruiz/ }).click();
  await page.keyboard.press("Escape");
  const removeMateo = specimen.getByRole("button", { name: "Remove Mateo Ruiz" });
  await expect(removeMateo).toBeVisible();
  const removeBox = await removeMateo.boundingBox();
  expect(removeBox?.width).toBeGreaterThanOrEqual(44);
  expect(removeBox?.height).toBeGreaterThanOrEqual(44);
  await removeMateo.click();
  await expect(removeMateo).toHaveCount(0);

  const stateSelect = specimen.getByRole("combobox", { name: "Preview combobox remote state" });
  const remote = specimen.locator("#remote-coach-combobox");

  await stateSelect.click();
  await page.getByRole("option", { name: "Loading", exact: true }).click();
  await remote.click();
  await expect(page.getByText("Loading remote coaches", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");

  await stateSelect.click();
  await page.getByRole("option", { name: "Empty", exact: true }).click();
  await remote.click();
  await expect(page.getByText("No remote coaches are available.", { exact: true })).toBeVisible();
  await page.keyboard.press("Escape");

  await stateSelect.click();
  await page.getByRole("option", { name: "Error", exact: true }).click();
  await expect(remote).toHaveAttribute("aria-invalid", "true");
  await remote.click();
  await expect(page.getByRole("alert")).toContainText("Remote directory could not be loaded.");
});

test("keeps table sorting, selection and result states explicit", async ({ page }) => {
  await openCategory(page, "data-display", "Data display");
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
  await openCategory(page, "data-display", "Data display");
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

test("keeps avatar identity and presence explicit without a profile image", async ({ page }) => {
  await openCategory(page, "data-display", "Data display");
  const specimen = page.locator("#avatar");
  const profile = specimen.locator(
    '[data-slot="avatar"][aria-label="Camila Torres"]',
  ).first();
  const team = specimen.getByRole("group", {
    name: "Assigned coaching team",
  });

  await expect(profile).toHaveAttribute("role", "group");
  await expect(profile.locator('[data-slot="avatar-image"]')).toHaveCount(0);
  await expect(profile.locator('[data-slot="avatar-fallback"]')).toHaveText("CT");
  await expect(
    specimen.getByText("No profile image · initials remain available"),
  ).toBeVisible();
  const online = profile.getByRole("img", { name: "Camila is online" });
  await expect(online).toHaveAttribute("data-status", "online");
  await expect(online.locator("svg")).toHaveClass(/lucide-check/);

  await expect(team.getByRole("group", { name: "Mateo Ruiz" })).toBeVisible();
  await expect(team.getByRole("img", { name: "Mateo is away" }).locator("svg"))
    .toHaveClass(/lucide-clock/);
  await expect(team.getByText("2 more assigned coaches")).toHaveClass("sr-only");

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await expect(online).toHaveCSS("forced-color-adjust", "none");
});

test("operates workspace navigation and returns focus from mobile overlays", async ({ page }) => {
  await openCategory(page, "navigation", "Navigation");
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

test("keeps alert meaning explicit beyond color", async ({ page }) => {
  await openCategory(page, "feedback", "Feedback");
  const specimen = page.locator("#alert");
  const alerts = specimen.locator('[data-slot="alert"]');

  await expect(alerts).toHaveCount(4);
  await expect(
    specimen.getByText("Schedule window changed", { exact: true })
  ).toBeVisible();
  await expect(
    specimen.getByText("Training block published", { exact: true })
  ).toBeVisible();
  await expect(
    specimen.getByText("Class capacity is nearly reached", { exact: true })
  ).toBeVisible();
  await expect(
    specimen.getByText("Member sync stopped", { exact: true })
  ).toBeVisible();

  for (const variant of ["info", "success", "warning", "danger"]) {
    await expect(
      specimen.locator(
        `[data-slot="alert"][data-variant="${variant}"] [data-slot="alert-icon"] svg`
      )
    ).toHaveCount(1);
  }

  const action = specimen.getByRole("button", { name: "Retry sync" });
  await action.focus();
  await expect(action).toBeFocused();
  const actionBox = await action.boundingBox();
  expect(actionBox?.height).toBeGreaterThanOrEqual(44);
  await page.keyboard.press("Enter");
  await expect(action).toBeFocused();
});

test("keeps progress named, textual and still with reduced motion", async ({ page }) => {
  await openCategory(page, "feedback", "Feedback");
  const specimen = page.locator("#progress");
  const published = specimen.getByRole("progressbar", {
    name: "Published sessions",
  });
  const indeterminate = specimen.getByRole("progressbar", {
    name: "Session sync",
  });

  await expect(published).toHaveAttribute("aria-valuenow", "8");
  await expect(published).toHaveAttribute("aria-valuemax", "12");
  await expect(published).toHaveAttribute(
    "aria-valuetext",
    "8 of 12 sessions published",
  );
  await expect(specimen.getByText("8 / 12", { exact: true })).toBeVisible();
  await expect(indeterminate).not.toHaveAttribute("aria-valuenow");
  await expect(indeterminate).toHaveAttribute("data-indeterminate");
  await expect(specimen.getByText("In progress", { exact: true })).toBeVisible();

  await specimen.getByRole("button", { name: "Publish next session" }).click();
  await expect(published).toHaveAttribute("aria-valuenow", "9");
  await expect(specimen.getByText("9 / 12", { exact: true })).toBeVisible();

  await page.emulateMedia({ reducedMotion: "reduce" });
  const indicator = indeterminate.locator('[data-slot="progress-indicator"]');
  await expect(indicator).toHaveCSS("animation-name", "none");
});

test("announces toast feedback without stealing focus", async ({ page }) => {
  await openCategory(page, "feedback", "Feedback");
  const trigger = page.getByRole("button", { name: "Show success" });
  await trigger.focus();
  await page.keyboard.press("Enter");

  await expect(page.getByText("Session saved")).toBeVisible();
  await expect(trigger).toBeFocused();
});

test("keeps touch targets and focus treatment at the minimum contract", async ({ page }) => {
  await openCategory(page, "actions", "Actions");
  for (const [name, locator] of [
    ["primary button", page.getByRole("button", { name: "Start session" })],
    ["icon button", page.getByRole("button", { name: "Add movement" })],
  ] as const) {
    const box = await locator.boundingBox();
    expect(box?.width, `${name} width`).toBeGreaterThanOrEqual(44);
    expect(box?.height, `${name} height`).toBeGreaterThanOrEqual(44);
  }

  const action = page.getByRole("button", { name: "Start session" });
  await action.focus();
  const focusShadow = await action.evaluate((element) => getComputedStyle(element).boxShadow);
  expect(focusShadow).not.toBe("none");

  await openCategory(page, "selection", "Selection");
  for (const [name, locator] of [
    ["checkbox", page.getByRole("checkbox", { name: "Share training history with this coach" })],
    ["switch", page.getByRole("switch", { name: "Live progress sharing" })],
    ["toggle group item", page.locator("#toggle-group").getByRole("button", { name: "ES" })],
  ] as const) {
    const box = await locator.boundingBox();
    expect(box?.width, `${name} width`).toBeGreaterThanOrEqual(44);
    expect(box?.height, `${name} height`).toBeGreaterThanOrEqual(44);
  }

  await openCategory(page, "navigation", "Navigation");
  for (const [name, locator] of [
    ["navigation trigger", page.locator("#navigation-menu").getByRole("button", { name: "Training", exact: true })],
    ["workspace action", page.locator("#workspace-shell").getByRole("button", { name: /Panel/ })],
  ] as const) {
    const box = await locator.boundingBox();
    expect(box?.width, `${name} width`).toBeGreaterThanOrEqual(44);
    expect(box?.height, `${name} height`).toBeGreaterThanOrEqual(44);
  }

  await openCategory(page, "data-display", "Data display");
  const tableCheckbox = page.getByRole("table", { name: "Members" }).getByRole("checkbox", { name: "Select Camila Torres" });
  const tableCheckboxBox = await tableCheckbox.boundingBox();
  expect(tableCheckboxBox?.width, "table checkbox width").toBeGreaterThanOrEqual(44);
  expect(tableCheckboxBox?.height, "table checkbox height").toBeGreaterThanOrEqual(44);
});

test("does not overflow at 320 px or with long text", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/components");
  const dimensions = await page.evaluate(() => ({
    document: document.documentElement.scrollWidth,
    viewport: document.documentElement.clientWidth,
  }));
  expect(dimensions.document).toBeLessThanOrEqual(dimensions.viewport);
  await page.goto("/components/actions");
  await expect(page.getByRole("button", { name: "Large action with long text" })).toBeVisible();

  await page.goto("/components/navigation");
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
  await page.getByRole("link", { name: "OVR Overlays", exact: true }).click();
  await expect(page).toHaveURL(/\/components\/overlays$/);

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
  await openCategory(page, "signature", "Signature");
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
  await openCategory(page, "feedback", "Feedback");
  const spinner = page.getByRole("status", { name: "Loading" }).first();
  expect(await spinner.evaluate((element) => getComputedStyle(element).animationDuration)).toBe("0s");

  await page.emulateMedia({ forcedColors: "active", reducedMotion: "reduce" });
  await openCategory(page, "actions", "Actions");
  const action = page.getByRole("button", { name: "Start session" });
  await action.focus();
  expect(await action.evaluate((element) => getComputedStyle(element).outlineStyle)).not.toBe("none");

  await openCategory(page, "selection", "Selection");
  const pressedToggle = page.locator("#toggle-group").getByRole("button", { name: "ES", exact: true });
  await expect(pressedToggle).toHaveAttribute("aria-pressed", "true");
  expect(await pressedToggle.evaluate((element) => getComputedStyle(element).forcedColorAdjust)).toBe("none");
});

test("matches the approved component index and category composition", async ({ page }) => {
  test.skip(process.platform !== "win32", "Visual baselines are canonical on Windows.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await verifyExplorerVersion(page, [
    "React \u00b7 v0",
    "React components / v0",
  ]);
  await expect(page).toHaveScreenshot(
    "components-index-dark-desktop.png",
    fullPageScreenshotOptions,
  );
  await page.goto("/components/navigation#command");
  await expect(page.locator("#command")).toHaveScreenshot(
    "command-inline-dark-desktop.png",
  );

  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  await page.goto("/components");
  await expect(page).toHaveScreenshot(
    "components-index-light-mobile.png",
    fullPageScreenshotOptions,
  );
});

test("matches the approved foundation composition", async ({ page }) => {
  test.skip(process.platform !== "win32", "Visual baselines are canonical on Windows.");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/ui-foundation");
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await verifyExplorerVersion(page, [
    "Tokens \u00b7 v0",
    "v0",
    "UI Foundation / Tokens / v0",
  ]);
  await expect(page).toHaveScreenshot(
    "foundation-dark-desktop.png",
    fullPageScreenshotOptions,
  );

  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  await expect(page).toHaveScreenshot(
    "foundation-light-mobile.png",
    fullPageScreenshotOptions,
  );
});

test("matches key overlay states in both themes", async ({ page }) => {
  test.skip(process.platform !== "win32", "Visual baselines are canonical on Windows.");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.getByRole("button", { name: "dark", exact: true }).click();
  await openCategory(page, "navigation", "Navigation");
  const commandTrigger = page.locator("#command").getByRole("button", {
    name: /Open commands/,
  });
  await commandTrigger.click();
  await expect(page).toHaveScreenshot("command-dialog-dark-desktop.png", {
    fullPage: false,
  });
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();

  await openCategory(page, "overlays", "Overlays");
  const editMemberTrigger = page.getByRole("button", { name: "Edit member" });
  await editMemberTrigger.scrollIntoViewIfNeeded();
  await editMemberTrigger.click();
  const editMemberDialog = page.getByRole("dialog", { name: "Edit member" });
  await expect(editMemberDialog).toBeVisible();
  await expect(
    editMemberDialog.getByRole("textbox", { name: "Display name" }),
  ).toHaveValue("Alex Morgan");
  await expect(page).toHaveScreenshot("dialog-dark-desktop.png", {
    fullPage: false,
    maxDiffPixels: 10,
  });
  await page.keyboard.press("Escape");

  await page.getByRole("button", { name: "light", exact: true }).click();
  await page.setViewportSize({ width: 320, height: 800 });
  await openCategory(page, "navigation", "Navigation");
  const mobileCommandTrigger = page.locator("#command").getByRole("button", {
    name: /Open commands/,
  });
  await mobileCommandTrigger.scrollIntoViewIfNeeded();
  await mobileCommandTrigger.click();
  await expect(page).toHaveScreenshot("command-dialog-light-mobile.png", {
    fullPage: false,
  });
  await page.keyboard.press("Escape");

  await openCategory(page, "overlays", "Overlays");
  await page.getByRole("button", { name: "Open filters" }).click();
  await expect(page).toHaveScreenshot("sheet-light-mobile.png", { fullPage: false });
});

/**
 * Three defects whose fixes the visual baselines cannot see: a badge border is
 * roughly 200 of 2.4 million pixels, which clears `maxDiffPixelRatio` on its
 * own, and the collapsed sidebar is not composed anywhere in the Explorer.
 * Asserted here so a regression fails rather than passing quietly.
 */
test("keeps the outline badge, the setup steps and their labels honest", async ({
  page,
}) => {
  await openCategory(page, "navigation", "Navigation");

  const setup = page.locator("#setup-shell");
  const steps = setup.locator('[data-slot="setup-progress-step"]');
  await expect(steps).toHaveCount(3);

  // `last:flex-none` is deliberately not asserted here. It answers dead space
  // after the final label in a wide container; the Explorer's progress list is
  // narrower than its own content, so every step is squeezed and the defect
  // cannot be reproduced on this page at any viewport.

  // Below 640px the connectors are hidden and three steps split the width; a
  // truncated label loses the word rather than a line.
  await page.setViewportSize({ width: 390, height: 844 });
  const label = steps.first().locator("span").last();
  expect(
    await label.evaluate((element) => getComputedStyle(element).textOverflow),
    "the label wraps on a phone rather than truncating",
  ).toBe("clip");

  // The index counts each category with an outline badge. The base sets
  // `border border-transparent`, so the variant colouring nothing left it as
  // text in an invisible pill.
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/components");
  const outlined = page.getByText(/^\d+ components$/).first();
  await expect(outlined).toBeVisible();
  const border = await outlined.evaluate(
    (element) => getComputedStyle(element).borderTopColor,
  );
  expect(border, "an outline badge draws an outline").not.toBe("rgba(0, 0, 0, 0)");
})
