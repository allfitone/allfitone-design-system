import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "../src/components/command.js"

afterEach(cleanup)

function CommandMenu({
  onSelect = () => undefined,
}: {
  onSelect?: (value: string) => void
}) {
  return (
    <Command label="Search workspace commands" loop>
      <CommandInput
        placeholder="Search people, sessions or actions"
      />
      <CommandList label="Available workspace commands">
        <CommandEmpty>No commands match this search.</CommandEmpty>
        <CommandGroup heading="Navigate">
          <CommandItem value="open member directory" onSelect={onSelect}>
            Member directory
            <CommandShortcut>G M</CommandShortcut>
          </CommandItem>
          <CommandItem value="open session schedule" onSelect={onSelect}>
            Session schedule
            <CommandShortcut>G S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Actions">
          <CommandItem value="invite member" onSelect={onSelect}>
            Invite member
            <CommandShortcut>⌘ I</CommandShortcut>
          </CommandItem>
          <CommandItem value="publish program" disabled onSelect={onSelect}>
            Publish program
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}

function CommandDialogHarness() {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open command menu
      </button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Workspace command menu"
        description="Navigate or run an action."
      >
        <CommandMenu />
      </CommandDialog>
    </>
  )
}

describe("Command", () => {
  it("filters, navigates and selects commands from the keyboard", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const { container } = render(<CommandMenu onSelect={onSelect} />)
    const input = screen.getByRole("combobox", {
      name: "Search workspace commands",
    })

    await user.type(input, "schedule")
    expect(
      screen.getByRole("option", { name: /Session schedule/ })
    ).toBeVisible()
    expect(
      screen.queryByRole("option", { name: /Member directory/ })
    ).not.toBeInTheDocument()

    await user.keyboard("{ArrowDown}{Enter}")
    expect(onSelect).toHaveBeenCalledWith("open session schedule")

    await user.clear(input)
    await user.type(input, "missing")
    expect(screen.getByText("No commands match this search.")).toBeVisible()
    expect(await axe(container)).toHaveNoViolations()
  })

  it("skips disabled commands and keeps visible shortcuts decorative", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const { container } = render(<CommandMenu onSelect={onSelect} />)
    const input = screen.getByRole("combobox", {
      name: "Search workspace commands",
    })
    const disabled = screen.getByRole("option", { name: "Publish program" })

    expect(disabled).toHaveAttribute("data-disabled", "true")
    expect(screen.getByText("G M")).toHaveAttribute("aria-hidden", "true")

    await user.click(input)
    await user.keyboard("{ArrowUp}{Enter}")
    expect(onSelect).toHaveBeenCalledWith("invite member")
    expect(onSelect).not.toHaveBeenCalledWith("publish program")
    expect(await axe(container)).toHaveNoViolations()
  })

  it("composes with Dialog and returns focus after Escape", async () => {
    const user = userEvent.setup()
    const { container } = render(<CommandDialogHarness />)
    const trigger = screen.getByRole("button", { name: "Open command menu" })

    await user.click(trigger)
    expect(
      screen.getByRole("dialog", { name: "Workspace command menu" })
    ).toBeVisible()
    expect(
      screen.getByRole("combobox", { name: "Search workspace commands" })
    ).toHaveFocus()
    expect(await axe(container)).toHaveNoViolations()

    await user.keyboard("{Escape}")
    expect(
      screen.queryByRole("dialog", { name: "Workspace command menu" })
    ).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })
})
