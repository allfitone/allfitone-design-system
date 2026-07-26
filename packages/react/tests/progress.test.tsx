import { cleanup, render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it } from "vitest"

import {
  Progress,
  ProgressDescription,
  ProgressHeader,
  ProgressIndicator,
  ProgressLabel,
  ProgressTrack,
  ProgressValue,
} from "../src/components/progress.js"

afterEach(cleanup)

describe("Progress", () => {
  it("names and describes determinate progress with a textual value", async () => {
    const { container } = render(
      <Progress value={67}>
        <ProgressHeader>
          <ProgressLabel>Training block completion</ProgressLabel>
          <ProgressValue />
        </ProgressHeader>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
        <ProgressDescription>8 of 12 sessions published</ProgressDescription>
      </Progress>
    )

    const progress = screen.getByRole("progressbar", {
      name: "Training block completion",
    })
    expect(progress).toHaveAttribute("aria-valuenow", "67")
    expect(progress).toHaveAttribute("aria-valuetext", "67%")
    expect(progress).toHaveAttribute("data-progressing")
    expect(screen.getByText("67%")).toHaveAttribute("aria-hidden", "true")
    expect(screen.getByText("8 of 12 sessions published")).toBeVisible()
    expect(
      container.querySelector('[data-slot="progress-indicator"]')
    ).toHaveStyle({ width: "67%" })
    expect(await axe(container)).toHaveNoViolations()
  })

  it("exposes indeterminate status in text and omits the current value", async () => {
    const { container } = render(
      <Progress value={null} variant="compact">
        <ProgressHeader>
          <ProgressLabel>Member import</ProgressLabel>
          <ProgressValue />
        </ProgressHeader>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    )

    const progress = screen.getByRole("progressbar", {
      name: "Member import",
    })
    expect(progress).not.toHaveAttribute("aria-valuenow")
    expect(progress).toHaveAttribute("aria-valuetext", "indeterminate progress")
    expect(progress).toHaveAttribute("data-indeterminate")
    expect(progress).toHaveAttribute("data-variant", "compact")
    expect(screen.getByText("In progress")).toBeVisible()
    expect(
      container.querySelector('[data-slot="progress-indicator"]')
    ).toHaveAttribute("data-indeterminate")
    expect(await axe(container)).toHaveNoViolations()
  })

  it("supports domain-specific visible and accessible value text", () => {
    render(
      <Progress
        value={8}
        max={12}
        getAriaValueText={(_, value) => `${value} of 12 sessions`}
      >
        <ProgressHeader>
          <ProgressLabel>Published sessions</ProgressLabel>
          <ProgressValue>
            {(_, value) => `${value} / 12`}
          </ProgressValue>
        </ProgressHeader>
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>
    )

    expect(
      screen.getByRole("progressbar", { name: "Published sessions" })
    ).toHaveAttribute("aria-valuetext", "8 of 12 sessions")
    expect(screen.getByText("8 / 12")).toBeVisible()
  })
})
