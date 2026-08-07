import { render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { describe, expect, it } from "vitest"

import {
  AccessDescription,
  AccessEyebrow,
  AccessHeader,
  AccessHero,
  AccessJourney,
  AccessJourneyIndex,
  AccessJourneyLabel,
  AccessJourneyStep,
  AccessMain,
  AccessPanel,
  AccessPanelAction,
  AccessPanelContent,
  AccessPanelDescription,
  AccessPanelEyebrow,
  AccessPanelHeader,
  AccessPanelNote,
  AccessPanelTitle,
  AccessShell,
  AccessTitle,
} from "../src/components/access-shell.js"

describe("AccessShell", () => {
  it("composes a semantic access page without product-owned layout styles", async () => {
    const { container } = render(
      <AccessShell>
        <AccessHeader>Allfit One</AccessHeader>
        <AccessMain>
          <AccessHero aria-labelledby="access-title">
            <AccessEyebrow>Studio</AccessEyebrow>
            <AccessTitle id="access-title">Make every session count.</AccessTitle>
            <AccessDescription>Continue your coaching work.</AccessDescription>
          </AccessHero>
          <AccessPanel aria-labelledby="panel-title">
            <AccessPanelHeader>
              <AccessPanelEyebrow>Secure access</AccessPanelEyebrow>
              <AccessPanelTitle id="panel-title">Enter Studio.</AccessPanelTitle>
              <AccessPanelDescription>Use your organization account.</AccessPanelDescription>
            </AccessPanelHeader>
            <AccessPanelContent>
              <AccessPanelAction>
                <a href="/studio">Enter Studio</a>
              </AccessPanelAction>
            </AccessPanelContent>
            <AccessPanelNote>Authentication is handled securely.</AccessPanelNote>
          </AccessPanel>
          <AccessJourney aria-label="Coaching workflow">
            <AccessJourneyStep>
              <AccessJourneyIndex>01</AccessJourneyIndex>
              <AccessJourneyLabel>Plan</AccessJourneyLabel>
            </AccessJourneyStep>
          </AccessJourney>
        </AccessMain>
      </AccessShell>
    )

    expect(screen.getByRole("main")).toBeInTheDocument()
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Make every session count.",
      })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("heading", { level: 2, name: "Enter Studio." })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("list", { name: "Coaching workflow" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Enter Studio" })).toHaveAttribute(
      "href",
      "/studio"
    )
    expect(await axe(container)).toHaveNoViolations()
  })
})
