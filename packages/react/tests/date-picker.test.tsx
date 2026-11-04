import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it, vi } from "vitest"

import { DatePicker } from "../src/components/date-picker.js"

afterEach(cleanup)

const august2026 = new Date(2026, 7, 1)

describe("DatePicker", () => {
  it("parses typed dates and exposes the visible format", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DatePicker
        id="session-date"
        label="Session date"
        description="Choose an available training day."
        onValueChange={onValueChange}
      />
    )

    expect(screen.getByText("Format: MM/DD/YYYY")).toBeVisible()
    const input = screen.getByLabelText("Session date")
    await user.type(input, "08/18/2026{Enter}")

    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 7, 18))
    expect(input).toHaveValue("08/18/2026")
    expect(input).not.toHaveAttribute("aria-invalid")
  })

  it("explains malformed and unavailable dates", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DatePicker
        label="Review date"
        calendarProps={{ disabled: { dayOfWeek: [0, 6] } }}
        onValueChange={onValueChange}
      />
    )

    const input = screen.getByLabelText("Review date")
    await user.type(input, "August 18{Enter}")
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid date in MM/DD/YYYY format."
    )
    expect(input).toHaveAttribute("aria-invalid", "true")

    await user.clear(input)
    await user.type(input, "08/16/2026{Enter}")
    expect(screen.getByRole("alert")).toHaveTextContent(
      "That date is unavailable."
    )
    expect(onValueChange).not.toHaveBeenCalled()
  })

  it("selects from the calendar, closes it and supports clearing", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <DatePicker
        label="Session date"
        calendarLabel="Session date calendar"
        calendarProps={{ defaultMonth: august2026 }}
        onValueChange={onValueChange}
      />
    )

    const trigger = screen.getByRole("button", { name: "Open calendar" })
    await user.click(trigger)
    expect(
      screen.getByRole("dialog", { name: "Session date calendar" })
    ).toBeVisible()

    await user.click(
      screen.getByRole("button", {
        name: /Tuesday, August 18th, 2026/i,
      })
    )

    expect(onValueChange).toHaveBeenLastCalledWith(new Date(2026, 7, 18))
    expect(
      screen.queryByRole("dialog", { name: "Session date calendar" })
    ).not.toBeInTheDocument()
    expect(screen.getByLabelText("Session date")).toHaveValue("08/18/2026")

    await user.click(screen.getByRole("button", { name: "Clear date" }))
    expect(onValueChange).toHaveBeenLastCalledWith(undefined)
    expect(screen.getByLabelText("Session date")).toHaveValue("")
  })

  it("names its format in the product's language", () => {
    render(
      <DatePicker
        label="Fecha"
        formatLabel="Formato"
        formatHint="DD/MM/AAAA"
        formatPattern="dd/MM/yyyy"
      />
    )

    expect(screen.getByText("Formato: DD/MM/AAAA")).toBeVisible()
    expect(screen.queryByText(/Format:/)).not.toBeInTheDocument()
  })

  it("supports a controlled value without losing accessibility", async () => {
    const { container } = render(
      <DatePicker
        label="Controlled date"
        value={new Date(2026, 7, 20)}
        onValueChange={() => undefined}
      />
    )

    expect(screen.getByLabelText("Controlled date")).toHaveValue("08/20/2026")
    expect(await axe(container)).toHaveNoViolations()
  })
})
