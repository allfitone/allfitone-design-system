import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { describe, expect, it, vi } from "vitest"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "../src/components/toggle-group.js"

describe("ToggleGroup", () => {
  it("keeps a single pressed value and exposes the state semantically", async () => {
    const user = userEvent.setup()

    render(
      <ToggleGroup aria-label="Interface language" defaultValue={["es"]}>
        <ToggleGroupItem value="es">ES</ToggleGroupItem>
        <ToggleGroupItem value="en">EN</ToggleGroupItem>
      </ToggleGroup>
    )

    const spanish = screen.getByRole("button", { name: "ES" })
    const english = screen.getByRole("button", { name: "EN" })

    expect(spanish).toHaveAttribute("aria-pressed", "true")
    expect(english).toHaveAttribute("aria-pressed", "false")

    await user.click(english)

    expect(spanish).toHaveAttribute("aria-pressed", "false")
    expect(english).toHaveAttribute("aria-pressed", "true")
  })

  it("supports roving arrow-key focus", async () => {
    const user = userEvent.setup()

    render(
      <ToggleGroup aria-label="Schedule range" defaultValue={["week"]}>
        <ToggleGroupItem value="week">Week</ToggleGroupItem>
        <ToggleGroupItem value="month">Month</ToggleGroupItem>
        <ToggleGroupItem value="year">Year</ToggleGroupItem>
      </ToggleGroup>
    )

    const week = screen.getByRole("button", { name: "Week" })
    const month = screen.getByRole("button", { name: "Month" })

    week.focus()
    await user.keyboard("{ArrowRight}")

    expect(month).toHaveFocus()
  })

  it("allows multiple pressed values and reports array changes", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()

    render(
      <ToggleGroup
        aria-label="Training filters"
        defaultValue={["strength"]}
        multiple
        onValueChange={onValueChange}
      >
        <ToggleGroupItem value="strength">Strength</ToggleGroupItem>
        <ToggleGroupItem value="mobility">Mobility</ToggleGroupItem>
        <ToggleGroupItem value="conditioning">Conditioning</ToggleGroupItem>
      </ToggleGroup>
    )

    await user.click(screen.getByRole("button", { name: "Mobility" }))

    expect(screen.getByRole("button", { name: "Strength" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(screen.getByRole("button", { name: "Mobility" })).toHaveAttribute(
      "aria-pressed",
      "true"
    )
    expect(onValueChange).toHaveBeenLastCalledWith(
      ["strength", "mobility"],
      expect.any(Object)
    )
  })

  it("inherits the disabled group state and has no detectable axe violations", async () => {
    const { container } = render(
      <ToggleGroup aria-label="View density" defaultValue={["compact"]} disabled>
        <ToggleGroupItem value="compact">Compact</ToggleGroupItem>
        <ToggleGroupItem value="comfortable">Comfortable</ToggleGroupItem>
      </ToggleGroup>
    )

    expect(screen.getByRole("button", { name: "Compact" })).toBeDisabled()
    expect(screen.getByRole("button", { name: "Comfortable" })).toBeDisabled()
    expect(await axe(container)).toHaveNoViolations()
  })
})
