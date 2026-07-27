import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "../src/components/alert.js"
import { Button } from "../src/components/button.js"

afterEach(cleanup)

describe("Alert", () => {
  it.each([
    ["info", "lucide-info"],
    ["success", "lucide-circle-check"],
    ["warning", "lucide-triangle-alert"],
    ["danger", "lucide-circle-x"],
  ] as const)("renders the %s variant with a redundant icon", (variant, iconClass) => {
    const { container } = render(
      <Alert variant={variant}>
        <AlertTitle>{variant} title</AlertTitle>
        <AlertDescription>{variant} description</AlertDescription>
      </Alert>
    )

    const alert = container.querySelector('[data-slot="alert"]')
    expect(alert).toHaveAttribute("data-variant", variant)
    expect(
      alert?.querySelector('[data-slot="alert-icon"] svg')
    ).toHaveClass(iconClass)
    expect(alert).not.toHaveAttribute("role")
  })

  it("supports an optional action without stealing semantic ownership", async () => {
    const user = userEvent.setup()
    const onRetry = vi.fn()
    const { container } = render(
      <Alert variant="danger" live="assertive">
        <AlertTitle>Member sync stopped</AlertTitle>
        <AlertDescription>
          Check the connection and try again.
        </AlertDescription>
        <AlertAction>
          <Button variant="outline" onClick={onRetry}>
            Retry sync
          </Button>
        </AlertAction>
      </Alert>
    )

    const alert = screen.getByRole("alert")
    expect(alert).toHaveAttribute("aria-live", "assertive")
    expect(alert).toHaveAttribute("aria-atomic", "true")
    expect(within(alert).getByText("Member sync stopped")).toBeVisible()
    await user.click(within(alert).getByRole("button", { name: "Retry sync" }))
    expect(onRetry).toHaveBeenCalledOnce()
    expect(await axe(container)).toHaveNoViolations()
  })

  it("uses a polite status only when requested", () => {
    render(
      <Alert live="polite">
        <AlertTitle>Program published</AlertTitle>
      </Alert>
    )

    expect(screen.getByRole("status")).toHaveAttribute("aria-live", "polite")
  })
})
