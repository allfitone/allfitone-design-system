import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../src/components/button.js";
import { Checkbox } from "../src/components/checkbox.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "../src/components/field.js";
import { IconButton } from "../src/components/icon-button.js";
import { Input } from "../src/components/input.js";
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group.js";
import { Spinner } from "../src/components/spinner.js";
import { Switch } from "../src/components/switch.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/tabs.js";

describe("ALLFIT ONE React components", () => {
  it("forwards native button behavior and renders named icon actions", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <div>
        <Button onClick={onClick}>Start session</Button>
        <IconButton aria-label="Open settings">S</IconButton>
      </div>,
    );

    await user.click(screen.getByRole("button", { name: "Start session" }));
    expect(onClick).toHaveBeenCalledOnce();
    expect(screen.getByRole("button", { name: "Open settings" })).toBeInTheDocument();
  });

  it("relates field labels, help and textual errors", async () => {
    const { container } = render(
      <Field data-invalid>
        <FieldLabel htmlFor="member-code">Member code</FieldLabel>
        <Input
          id="member-code"
          aria-invalid
          aria-describedby="member-code-help"
          aria-errormessage="member-code-error"
        />
        <FieldDescription id="member-code-help">Six characters.</FieldDescription>
        <FieldError id="member-code-error">Enter the complete code.</FieldError>
      </Field>,
    );

    const input = screen.getByRole("textbox", { name: "Member code" });
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAccessibleDescription("Six characters.");
    expect(screen.getByRole("alert")).toHaveTextContent("Enter the complete code.");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("exposes selection state and keyboard-operable tabs", async () => {
    const user = userEvent.setup();
    const { container } = render(
      <div>
        <Checkbox aria-label="Share history" defaultChecked />
        <Switch aria-label="Live progress" />
        <RadioGroup aria-label="Training focus" defaultValue="strength">
          <RadioGroupItem value="strength" aria-label="Strength" />
          <RadioGroupItem value="mobility" aria-label="Mobility" />
        </RadioGroup>
        <Tabs defaultValue="overview">
          <TabsList aria-label="Profile sections">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>
          <TabsContent value="overview">Current plan</TabsContent>
          <TabsContent value="history">Past sessions</TabsContent>
        </Tabs>
      </div>,
    );

    expect(screen.getByRole("checkbox", { name: "Share history" })).toBeChecked();
    await user.click(screen.getByRole("switch", { name: "Live progress" }));
    expect(screen.getByRole("switch", { name: "Live progress" })).toBeChecked();

    const overview = screen.getByRole("tab", { name: "Overview" });
    overview.focus();
    await user.click(screen.getByRole("tab", { name: "History" }));
    expect(screen.getByRole("tab", { name: "History" })).toHaveAttribute("aria-selected", "true");
    expect(screen.getByText("Past sessions")).toBeVisible();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("composes loading from a disabled button and a named status", async () => {
    const { container } = render(
      <Button disabled>
        <Spinner label="Saving" />
        Saving
      </Button>,
    );

    expect(screen.getByRole("button", { name: /saving/i })).toBeDisabled();
    expect(screen.getByRole("status", { name: "Saving" })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });
});
