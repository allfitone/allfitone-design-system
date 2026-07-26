import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
  AvatarImage,
  AvatarPresence,
} from "../src/components/avatar.js"

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

describe("Avatar", () => {
  it("keeps fallback identity named when no image is available", async () => {
    const { container } = render(
      <Avatar aria-label="Camila Torres" size="lg">
        <AvatarFallback>CT</AvatarFallback>
        <AvatarPresence status="online" label="Camila is online" />
      </Avatar>
    )

    expect(
      screen.getByRole("group", { name: "Camila Torres" })
    ).toHaveAttribute("data-size", "lg")
    expect(screen.getByText("CT")).toBeVisible()
    const presence = screen.getByRole("img", { name: "Camila is online" })
    expect(presence).toHaveAttribute("data-status", "online")
    expect(presence.querySelector("svg")).toHaveAttribute("stroke-width", "2")
    expect(await axe(container)).toHaveNoViolations()
  })

  it("reports image loading failure and returns to the initials fallback", async () => {
    const onLoadingStatusChange = vi.fn()

    class FailingImage {
      complete = false
      naturalWidth = 0
      onerror: null | (() => void) = null
      onload: null | (() => void) = null

      set src(_value: string) {
        queueMicrotask(() => this.onerror?.())
      }
    }

    vi.stubGlobal("Image", FailingImage)

    render(
      <Avatar aria-label="Mateo Ruiz">
        <AvatarImage
          src="/missing-member.png"
          onLoadingStatusChange={onLoadingStatusChange}
        />
        <AvatarFallback>MR</AvatarFallback>
      </Avatar>
    )

    await waitFor(() =>
      expect(onLoadingStatusChange).toHaveBeenLastCalledWith("error")
    )
    expect(screen.getByText("MR")).toBeVisible()
  })

  it("groups named members and exposes the remaining count in words", async () => {
    const { container } = render(
      <AvatarGroup aria-label="Assigned coaching team">
        <Avatar aria-label="Camila Torres" size="sm">
          <AvatarFallback>CT</AvatarFallback>
        </Avatar>
        <Avatar aria-label="Mateo Ruiz" size="sm">
          <AvatarFallback>MR</AvatarFallback>
          <AvatarPresence status="away" label="Mateo is away" />
        </Avatar>
        <AvatarGroupCount
          count={3}
          label="3 more assigned coaches"
          size="sm"
        />
      </AvatarGroup>
    )

    expect(
      screen.getByRole("group", { name: "Assigned coaching team" })
    ).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Camila Torres" })).toBeVisible()
    expect(screen.getByText("3 more assigned coaches")).toHaveClass("sr-only")
    expect(await axe(container)).toHaveNoViolations()
  })

  it("can be explicitly decorative beside an existing visible name", () => {
    render(
      <div>
        <Avatar decorative data-testid="decorative-avatar">
          <AvatarFallback>CT</AvatarFallback>
        </Avatar>
        <span>Camila Torres</span>
      </div>
    )

    expect(screen.getByTestId("decorative-avatar")).toHaveAttribute(
      "aria-hidden",
      "true"
    )
    expect(screen.getByTestId("decorative-avatar")).not.toHaveAttribute("role")
  })
})
