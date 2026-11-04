import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it, vi } from "vitest"

import { TimePicker } from "../src/components/time-picker.js"

afterEach(cleanup)

describe("TimePicker", () => {
  it("parses typed times into a 24-hour value and shows the format", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TimePicker
        id="session-start"
        label="Session start"
        description="Local time at the gym."
        onValueChange={onValueChange}
      />
    )

    expect(screen.getByText("Format: HH:MM")).toBeVisible()
    const input = screen.getByLabelText("Session start")
    await user.type(input, "6:05{Enter}")

    expect(onValueChange).toHaveBeenLastCalledWith("06:05")
    expect(input).toHaveValue("06:05")
    expect(input).not.toHaveAttribute("aria-invalid")
  })

  it("explains a time that does not exist", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TimePicker label="Check-in" onValueChange={onValueChange} />)

    const input = screen.getByLabelText("Check-in")
    await user.type(input, "24:00{Enter}")

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a valid time in HH:MM format."
    )
    expect(input).toHaveAttribute("aria-invalid", "true")
    expect(onValueChange).not.toHaveBeenCalled()

    await user.keyboard("{Escape}")
    expect(input).toHaveValue("")
    expect(input).not.toHaveAttribute("aria-invalid")
  })

  it("translates every visible and announced word", async () => {
    const user = userEvent.setup()
    render(
      <TimePicker
        label="Hora"
        formatLabel="Formato"
        formatHint="HH:MM"
        errorMessage="Escribe una hora válida en formato HH:MM."
        listLabel="Elige una hora"
        openListLabel="Abrir horas"
        clearLabel="Borrar hora"
        defaultValue="07:30"
      />
    )

    expect(screen.getByText("Formato: HH:MM")).toBeVisible()
    expect(screen.getByRole("button", { name: "Borrar hora" })).toBeVisible()
    await user.click(screen.getByRole("button", { name: "Abrir horas" }))
    expect(screen.getByRole("listbox", { name: "Elige una hora" })).toBeVisible()
  })

  it("lists times at the given step, focused on the current one", async () => {
    const user = userEvent.setup()
    render(<TimePicker label="Class time" step={15} defaultValue="09:30" />)

    await user.click(screen.getByRole("button", { name: "Open time list" }))
    const list = screen.getByRole("listbox", { name: "Choose a time" })
    const options = screen.getAllByRole("option")

    expect(options).toHaveLength(96)
    expect(options[1]).toHaveTextContent("00:15")
    expect(list).toHaveFocus()
    expect(screen.getByRole("option", { name: "09:30" })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(list).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "09:30" }).id
    )
  })

  it("moves through the list by keyboard and selects without leaving it", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(
      <TimePicker
        label="Class time"
        step={30}
        defaultValue="09:00"
        onValueChange={onValueChange}
      />
    )

    await user.click(screen.getByRole("button", { name: "Open time list" }))
    const list = screen.getByRole("listbox")

    await user.keyboard("{ArrowDown}{ArrowDown}")
    expect(list).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "10:00" }).id
    )
    await user.keyboard("{PageDown}")
    expect(list).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "11:00" }).id
    )
    await user.keyboard("{End}")
    expect(list).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "23:30" }).id
    )
    await user.keyboard("{Home}{ArrowUp}")
    expect(list).toHaveAttribute(
      "aria-activedescendant",
      screen.getByRole("option", { name: "00:00" }).id
    )

    await user.keyboard("{ArrowDown}{Enter}")
    expect(onValueChange).toHaveBeenLastCalledWith("00:30")
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    expect(screen.getByLabelText("Class time")).toHaveValue("00:30")
  })

  it("selects by pointer and clears back to no value", async () => {
    const user = userEvent.setup()
    const onValueChange = vi.fn()
    render(<TimePicker label="Class time" onValueChange={onValueChange} />)

    await user.click(screen.getByRole("button", { name: "Open time list" }))
    await user.click(screen.getByRole("option", { name: "18:30" }))
    expect(onValueChange).toHaveBeenLastCalledWith("18:30")

    await user.click(screen.getByRole("button", { name: "Clear time" }))
    expect(onValueChange).toHaveBeenLastCalledWith(undefined)
    expect(screen.getByLabelText("Class time")).toHaveValue("")
    expect(screen.getByLabelText("Class time")).toHaveFocus()
  })

  it("supports a controlled value without losing accessibility", async () => {
    const { container } = render(
      <TimePicker
        label="Controlled time"
        value="17:45"
        onValueChange={() => undefined}
      />
    )

    expect(screen.getByLabelText("Controlled time")).toHaveValue("17:45")
    expect(await axe(container)).toHaveNoViolations()
  })
})
