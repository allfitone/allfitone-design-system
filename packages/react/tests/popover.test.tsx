import { cleanup, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it, vi } from "vitest"

import { Button } from "../src/components/button.js"
import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverDescription,
  PopoverFooter,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "../src/components/popover.js"

afterEach(cleanup)

function PopoverHarness({ onWorkspaceAction = () => undefined }) {
  return (
    <div>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          View member context
        </PopoverTrigger>
        <PopoverContent align="start">
          <PopoverHeader>
            <PopoverTitle>Camila Torres</PopoverTitle>
            <PopoverDescription>AF-1042 · Strength program</PopoverDescription>
          </PopoverHeader>
          <p>Adherence 92%</p>
          <PopoverFooter>
            <PopoverClose render={<Button variant="outline" />}>
              Done
            </PopoverClose>
          </PopoverFooter>
        </PopoverContent>
      </Popover>
      <button type="button" onClick={onWorkspaceAction}>
        Workspace action
      </button>
    </div>
  )
}

describe("Popover", () => {
  it("opens from the keyboard, supports Escape, and restores focus", async () => {
    const user = userEvent.setup()
    render(<PopoverHarness />)

    const trigger = screen.getByRole("button", { name: "View member context" })
    trigger.focus()
    await user.keyboard("{Enter}")

    const popup = screen.getByRole("dialog", { name: "Camila Torres" })
    expect(popup).toBeVisible()
    expect(screen.getByRole("button", { name: "Done" })).toHaveFocus()

    await user.keyboard("{Escape}")
    expect(popup).not.toBeInTheDocument()
    expect(trigger).toHaveFocus()
  })

  it("remains non-modal and dismisses after an outside interaction", async () => {
    const user = userEvent.setup()
    const onWorkspaceAction = vi.fn()
    render(<PopoverHarness onWorkspaceAction={onWorkspaceAction} />)

    await user.click(
      screen.getByRole("button", { name: "View member context" })
    )
    await user.click(screen.getByRole("button", { name: "Workspace action" }))

    expect(onWorkspaceAction).toHaveBeenCalledOnce()
    expect(
      screen.queryByRole("dialog", { name: "Camila Torres" })
    ).not.toBeInTheDocument()
  })

  it("uses an opaque content class contract and has no axe violations", async () => {
    const user = userEvent.setup()
    render(<PopoverHarness />)

    await user.click(
      screen.getByRole("button", { name: "View member context" })
    )
    const popup = screen.getByRole("dialog", { name: "Camila Torres" })

    expect(popup).toHaveAttribute("data-slot", "popover-content")
    expect(popup).toHaveClass("bg-popover")
    expect(popup.className).not.toContain("fade-in")
    expect(popup.className).not.toContain("fade-out")
    expect(await axe(document.body)).toHaveNoViolations()
  })
})
