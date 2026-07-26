import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { es } from "react-day-picker/locale"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Calendar } from "../src/components/calendar.js"

afterEach(cleanup)

const august2026 = new Date(2026, 7, 1)

describe("Calendar", () => {
  it("selects a single date with localized labels", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        aria-label="Fecha de la sesión"
        defaultMonth={august2026}
        locale={es}
        mode="single"
        onSelect={onSelect}
      />
    )

    expect(screen.getByText(/agosto 2026/i)).toBeVisible()
    const date = screen.getByRole("button", {
      name: /martes, 18 de agosto de 2026/i,
    })
    await user.click(date)

    expect(onSelect).toHaveBeenCalled()
    expect(onSelect.mock.calls[0]?.[0]).toEqual(new Date(2026, 7, 18))
  })

  it("navigates the date grid with arrow keys and selects with Enter", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    render(
      <Calendar
        defaultMonth={august2026}
        mode="single"
        onSelect={onSelect}
      />
    )

    const august18 = screen.getByRole("button", {
      name: /Tuesday, August 18th, 2026/i,
    })
    const august19 = screen.getByRole("button", {
      name: /Wednesday, August 19th, 2026/i,
    })
    august18.focus()
    await user.keyboard("{ArrowRight}")
    expect(august19).toHaveFocus()
    await user.keyboard("{Enter}")

    expect(onSelect.mock.calls[0]?.[0]).toEqual(new Date(2026, 7, 19))
  })

  it("keeps disabled dates unavailable and exposes range states", async () => {
    const { container } = render(
      <Calendar
        aria-label="Training block"
        defaultMonth={august2026}
        disabled={{ dayOfWeek: [0] }}
        mode="range"
        selected={{
          from: new Date(2026, 7, 18),
          to: new Date(2026, 7, 20),
        }}
      />
    )

    expect(
      screen.getByRole("button", { name: /Sunday, August 16th, 2026/i })
    ).toBeDisabled()
    expect(
      screen.getByRole("button", { name: /Tuesday, August 18th, 2026/i })
    ).toHaveAttribute("data-range-start", "true")
    expect(
      screen.getByRole("button", { name: /Wednesday, August 19th, 2026/i })
    ).toHaveAttribute("data-range-middle", "true")
    expect(
      screen.getByRole("button", { name: /Thursday, August 20th, 2026/i })
    ).toHaveAttribute("data-range-end", "true")
    expect(await axe(container)).toHaveNoViolations()
  })
})
