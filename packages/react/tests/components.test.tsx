import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Button } from "../src/components/button.js";
import { AnimatedBrandLockup } from "../src/components/animated-brand-lockup.js";
import { AccentBlock, AccentBlockLabel, AccentBlockTitle } from "../src/components/accent-block.js";
import { Badge } from "../src/components/badge.js";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../src/components/breadcrumb.js";
import { Checkbox } from "../src/components/checkbox.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "../src/components/field.js";
import { IconButton } from "../src/components/icon-button.js";
import { Input } from "../src/components/input.js";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../src/components/pagination.js";
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group.js";
import { Spinner } from "../src/components/spinner.js";
import { StatStrip, StatStripItem } from "../src/components/stat-strip.js";
import { Switch } from "../src/components/switch.js";
import { SidebarMenuSkeleton } from "../src/components/sidebar.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/tabs.js";
import { TickRing } from "../src/components/tick-ring.js";
import { PulseMark } from "../src/components/pulse-mark.js";

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

  it("exposes current resource and page state in navigation", async () => {
    const { container } = render(
      <div>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem><BreadcrumbLink href="/people">People</BreadcrumbLink></BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem><BreadcrumbPage>Training</BreadcrumbPage></BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Pagination>
          <PaginationContent>
            <PaginationItem><PaginationLink href="?page=1">1</PaginationLink></PaginationItem>
            <PaginationItem><PaginationLink href="?page=2" isActive>2</PaginationLink></PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>,
    );

    expect(screen.getByText("Training")).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute("aria-current", "page");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("names and clamps athletic meter values", async () => {
    const { container } = render(
      <TickRing aria-label="Weekly adherence" value={140}>
        100%
      </TickRing>,
    );

    const meter = screen.getByRole("meter", { name: "Weekly adherence" });
    expect(meter).toHaveAttribute("aria-valuenow", "100");
    expect(meter).toHaveAttribute("aria-valuetext", "100%");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("keeps signature primitives semantic and composable", async () => {
    const { container } = render(
      <div>
        <AccentBlock>
          <AccentBlockLabel>Next session</AccentBlockLabel>
          <AccentBlockTitle>Strength</AccentBlockTitle>
        </AccentBlock>
        <StatStrip>
          <StatStripItem value="22" label="Sets" />
        </StatStrip>
        <PulseMark label="Allfit pulse" />
        <PulseMark data-testid="decorative-pulse" />
      </div>,
    );

    expect(screen.getByRole("img", { name: "Allfit pulse" })).toBeInTheDocument();
    expect(screen.getByTestId("decorative-pulse")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector('[data-slot="accent-block"]')).toBeInTheDocument();
    expect(container.querySelector('[data-slot="stat-strip"]')).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders the animated brand lockup from canonical geometry", async () => {
    const { container } = render(
      <div>
        <AnimatedBrandLockup label="Allfit One" replayKey="test" />
        <AnimatedBrandLockup data-testid="decorative-lockup" />
      </div>,
    );

    expect(screen.getByRole("img", { name: "Allfit One" })).toHaveAttribute(
      "viewBox",
      "0 0 1678 480",
    );
    expect(screen.getByTestId("decorative-lockup")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
    expect(container.querySelectorAll('[data-slot="animated-brand-lockup"]')).toHaveLength(2);
    expect(await axe(container)).toHaveNoViolations();
  });

  it("renders section codes through the shared badge variant", () => {
    render(<Badge variant="code">ACT</Badge>);

    const badge = screen.getByText("ACT");
    expect(badge).toHaveAttribute("data-slot", "badge");
    expect(badge.className).toContain("tracking-[var(--afo-letter-spacing-eyebrow)]");
  });

  it("renders sidebar skeleton widths deterministically for hydration", () => {
    const random = vi.spyOn(Math, "random");
    const renderSkeletons = () =>
      renderToString(
        <div>
          <SidebarMenuSkeleton showIcon />
          <SidebarMenuSkeleton />
        </div>,
      );

    const firstRender = renderSkeletons();
    const secondRender = renderSkeletons();

    expect(firstRender).toBe(secondRender);
    expect(firstRender.match(/--skeleton-width:/g)).toHaveLength(2);
    expect(random).not.toHaveBeenCalled();
    random.mockRestore();
  });
});
