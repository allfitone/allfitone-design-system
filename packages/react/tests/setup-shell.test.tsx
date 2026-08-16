import { render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { describe, expect, it } from "vitest";

import {
  SetupHeader,
  SetupMain,
  SetupPanel,
  SetupPanelActions,
  SetupPanelContent,
  SetupPanelDescription,
  SetupPanelEyebrow,
  SetupPanelIntro,
  SetupPanelNote,
  SetupPanelTitle,
  SetupProgress,
  SetupProgressStep,
  SetupShell,
  SetupStage,
} from "../src/components/setup-shell.js";

describe("SetupShell", () => {
  it("owns setup layout, hierarchy and progress semantics", async () => {
    const { container } = render(
      <SetupShell>
        <SetupHeader>Allfit Studio</SetupHeader>
        <SetupMain>
          <SetupProgress aria-label="Setup progress">
            <SetupProgressStep status="complete" index={1} label="Identity" />
            <SetupProgressStep status="current" index={2} label="Workspace" />
            <SetupProgressStep status="pending" index={3} label="Ready" />
          </SetupProgress>
          <SetupStage>
            <SetupPanel>
              <SetupPanelIntro>
                <SetupPanelEyebrow>Step two</SetupPanelEyebrow>
                <SetupPanelTitle>Configure your workspace.</SetupPanelTitle>
                <SetupPanelDescription>
                  Choose the structure that fits.
                </SetupPanelDescription>
                <SetupPanelNote>Nothing is published yet.</SetupPanelNote>
              </SetupPanelIntro>
              <SetupPanelContent>Configuration</SetupPanelContent>
              <SetupPanelActions>Continue</SetupPanelActions>
            </SetupPanel>
          </SetupStage>
        </SetupMain>
      </SetupShell>
    );

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Configure your workspace."
    );
    expect(
      screen.getByRole("list", { name: "Setup progress" })
    ).toBeInTheDocument();
    expect(screen.getByText("Workspace").closest("li")).toHaveAttribute(
      "aria-current",
      "step"
    );
    expect(screen.getByText("Identity").closest("li")).toHaveAttribute(
      "data-status",
      "complete"
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it("supports a subordinate panel title", () => {
    render(<SetupPanelTitle as="h2">Invite a teammate.</SetupPanelTitle>);

    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Invite a teammate."
    );
  });

  it("can avoid a nested main landmark in composed explorers", () => {
    render(<SetupMain as="div" data-testid="setup-main" />);

    expect(screen.getByTestId("setup-main").tagName).toBe("DIV");
  });
});
