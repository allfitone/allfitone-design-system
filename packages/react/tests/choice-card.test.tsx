import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import {
  ChoiceCard,
  ChoiceCardAction,
  ChoiceCardDescription,
  ChoiceCardEyebrow,
  ChoiceCardTitle,
} from "../src/components/choice-card.js";

describe("ChoiceCard", () => {
  it("is a single keyboard-operable choice with canonical content", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const { container } = render(
      <ChoiceCard onClick={onClick}>
        <ChoiceCardEyebrow>For me</ChoiceCardEyebrow>
        <ChoiceCardTitle>Independent practice</ChoiceCardTitle>
        <ChoiceCardDescription>
          Create a private workspace.
        </ChoiceCardDescription>
        <ChoiceCardAction>Create workspace</ChoiceCardAction>
      </ChoiceCard>
    );

    const choice = screen.getByRole("button", {
      name: /independent practice/i,
    });
    choice.focus();
    await user.keyboard("{Enter}");

    expect(onClick).toHaveBeenCalledOnce();
    expect(choice).toHaveFocus();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("supports disabled and muted choices", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <ChoiceCard variant="muted" disabled onClick={onClick}>
        <ChoiceCardTitle>Wait for an invitation</ChoiceCardTitle>
      </ChoiceCard>
    );

    const choice = screen.getByRole("button", {
      name: /wait for an invitation/i,
    });
    await user.click(choice);

    expect(choice).toBeDisabled();
    expect(choice).toHaveAttribute("data-variant", "muted");
    expect(onClick).not.toHaveBeenCalled();
  });

  it("renders as a link without losing its choice contract", () => {
    render(
      <ChoiceCard render={<a href="/studio" />}>
        <ChoiceCardTitle>Open Studio</ChoiceCardTitle>
      </ChoiceCard>
    );

    expect(screen.getByRole("link", { name: /open studio/i })).toHaveAttribute(
      "href",
      "/studio"
    );
  });
});
