import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { useState } from "react";
import { renderToString } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

import { Button, buttonVariants } from "../src/components/button.js";
import { AnimatedBrandLockup } from "../src/components/animated-brand-lockup.js";
import { AccentBlock, AccentBlockLabel, AccentBlockTitle } from "../src/components/accent-block.js";
import { Badge } from "../src/components/badge.js";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../src/components/breadcrumb.js";
import { Checkbox } from "../src/components/checkbox.js";
import { DataTable, DataTableColumnHeader, DataTableFilterInput, DataTablePagination, DataTableSelectionBar, DataTableToolbar, DataTableViewOptions, useDataTable, type ColumnDef } from "../src/components/data-table.js";
import { Field, FieldDescription, FieldError, FieldLabel } from "../src/components/field.js";
import { IconButton } from "../src/components/icon-button.js";
import { Input } from "../src/components/input.js";
import { Pagination, PaginationContent, PaginationItem, PaginationLink } from "../src/components/pagination.js";
import { RadioGroup, RadioGroupItem } from "../src/components/radio-group.js";
import { Spinner } from "../src/components/spinner.js";
import { StatStrip, StatStripItem } from "../src/components/stat-strip.js";
import { Switch } from "../src/components/switch.js";
import { SidebarMenuSkeleton } from "../src/components/sidebar.js";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow, TableSortButton, TableState } from "../src/components/table.js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../src/components/tabs.js";
import { TickRing } from "../src/components/tick-ring.js";
import { PulseMark } from "../src/components/pulse-mark.js";

type TestMember = {
  id: string;
  name: string;
  plan: string;
};

const dataTableRows: TestMember[] = [
  { id: "AF-2", name: "Mateo Ruiz", plan: "Mobility" },
  { id: "AF-1", name: "Camila Torres", plan: "Strength" },
  { id: "AF-3", name: "Sara Mendoza", plan: "Conditioning" },
];

const dataTableColumns: ColumnDef<TestMember>[] = [
  {
    id: "select",
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        aria-label="Select visible members"
        checked={table.getIsAllPageRowsSelected()}
        indeterminate={table.getIsSomePageRowsSelected()}
        onCheckedChange={(checked) =>
          table.toggleAllPageRowsSelected(Boolean(checked))
        }
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        aria-label={`Select ${row.original.name}`}
        checked={row.getIsSelected()}
        onCheckedChange={(checked) => row.toggleSelected(Boolean(checked))}
      />
    ),
  },
  {
    accessorKey: "name",
    meta: { label: "Member" },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Member"
        sortLabel="Change member sorting"
      />
    ),
  },
  {
    accessorKey: "plan",
    meta: { label: "Plan" },
    header: "Plan",
  },
];

function DataTableHarness() {
  const table = useDataTable({
    columns: dataTableColumns,
    data: dataTableRows,
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 2,
      },
    },
  });

  return (
    <div>
      <DataTableToolbar>
        <DataTableFilterInput
          table={table}
          label="Search members"
          placeholder="Search members"
        />
        <DataTableViewOptions table={table} />
      </DataTableToolbar>
      <DataTable
        table={table}
        aria-label="Member results"
        emptyState={{ title: "No matching members" }}
      />
      <DataTableSelectionBar table={table}>
        <Button size="sm">Assign plan</Button>
      </DataTableSelectionBar>
      <DataTablePagination table={table} pageSizeOptions={[2, 3]} />
    </div>
  );
}

function ServerDataTableHarness({
  onPageChange,
}: {
  onPageChange: (pageIndex: number) => void;
}) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 2,
  });
  const table = useDataTable({
    columns: dataTableColumns,
    data: dataTableRows.slice(0, 2),
    getRowId: (row) => row.id,
    manualPagination: true,
    rowCount: 4,
    state: { pagination },
    onPaginationChange: (updater) => {
      setPagination((current) => {
        const next =
          typeof updater === "function" ? updater(current) : updater;
        onPageChange(next.pageIndex);
        return next;
      });
    },
  });

  return <DataTablePagination table={table} pageSizeOptions={[2]} />;
}

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

  // The native adapter names it `danger` and the web `destructive`; both paint a flat
  // `status.danger` and neither spends the one accent gradient a screen is allowed.
  it("fills the destructive action with the danger status and no accent gradient", () => {
    const classes = buttonVariants({ variant: "destructive" });

    expect(classes).toContain("bg-destructive");
    expect(classes).toContain("text-destructive-foreground");
    expect(classes).not.toContain("afo-gradient-accent");
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

  it("keeps dense operational tables semantic, selected and horizontally reachable", async () => {
    const { container } = render(
      <Table
        density="compact"
        scrollAreaLabel="Member directory"
        aria-label="Members"
      >
        <TableCaption>Current members and weekly adherence.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox aria-label="Select all members" />
            </TableHead>
            <TableHead aria-sort="ascending">
              <TableSortButton
                direction="ascending"
                aria-label="Sort members descending"
              >
                Member
              </TableSortButton>
            </TableHead>
            <TableHead align="end">Adherence</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow selected>
            <TableCell>
              <Checkbox aria-label="Select Camila Torres" defaultChecked />
            </TableCell>
            <TableCell>Camila Torres</TableCell>
            <TableCell align="end" numeric>92%</TableCell>
          </TableRow>
        </TableBody>
      </Table>,
    );

    expect(screen.getByRole("region", { name: "Member directory" })).toHaveAttribute("tabindex", "0");
    expect(screen.getByRole("table", { name: "Members" })).toHaveAttribute("data-density", "compact");
    expect(screen.getByRole("columnheader", { name: "Member" })).toHaveAttribute("aria-sort", "ascending");
    expect(screen.getByRole("button", { name: "Sort members descending" })).toHaveAttribute("data-direction", "ascending");
    expect(screen.getByRole("button", { name: "Sort members descending" })).not.toHaveAttribute("data-variant");
    expect(screen.getByRole("row", { name: /Camila Torres/ })).toHaveAttribute("data-state", "selected");
    expect(screen.getByRole("cell", { name: "92%" })).toHaveAttribute("data-numeric", "true");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("announces loading, empty and error table states", async () => {
    const { container, rerender } = render(
      <Table aria-label="Members">
        <TableBody>
          <TableState
            colSpan={4}
            state="loading"
            title="Loading members"
            description="Updating the current organization."
          />
        </TableBody>
      </Table>,
    );

    expect(within(container).getByRole("status", { name: "Loading members" })).toBeInTheDocument();

    rerender(
      <Table aria-label="Members">
        <TableBody>
          <TableState
            colSpan={4}
            state="empty"
            title="No members found"
            description="Clear the active filters to see everyone."
          />
        </TableBody>
      </Table>,
    );

    expect(within(container).getByRole("status")).toHaveTextContent("No members found");

    rerender(
      <Table aria-label="Members">
        <TableBody>
          <TableState
            colSpan={4}
            state="error"
            title="Members could not be loaded"
            description="Check the connection and try again."
          />
        </TableBody>
      </Table>,
    );

    expect(within(container).getByRole("alert")).toHaveTextContent("Members could not be loaded");
    expect(await axe(container)).toHaveNoViolations();
  });

  it("composes data-table filtering, sorting, selection, visibility and pagination", async () => {
    const user = userEvent.setup();
    const { container } = render(<DataTableHarness />);
    const view = within(container);

    const sortButton = view.getByRole("button", {
      name: "Change member sorting",
    });
    expect(sortButton).toHaveAttribute("data-direction", "none");
    expect(sortButton).not.toHaveAttribute("data-variant");

    await user.click(sortButton);
    expect(sortButton).toHaveAttribute("data-direction", "ascending");
    expect(view.getByRole("columnheader", { name: "Member" })).toHaveAttribute(
      "aria-sort",
      "ascending",
    );

    await user.click(view.getByRole("checkbox", { name: "Select Camila Torres" }));
    expect(view.getByRole("row", { name: /Camila Torres/ })).toHaveAttribute(
      "data-state",
      "selected",
    );
    expect(view.getByRole("status")).toHaveTextContent("1 selected");
    expect(view.getByRole("button", { name: "Assign plan" })).toBeVisible();

    const search = view.getByRole("textbox", { name: "Search members" });
    await user.clear(search);
    await user.type(search, "Mobility");
    expect(view.getByRole("row", { name: /Mateo Ruiz/ })).toBeInTheDocument();
    expect(view.queryByRole("row", { name: /Camila Torres/ })).not.toBeInTheDocument();

    await user.clear(search);
    await user.click(view.getByRole("button", { name: "Columns" }));
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "Plan" }),
    );
    expect(view.queryByRole("columnheader", { name: "Plan" })).not.toBeInTheDocument();

    await user.click(view.getByRole("button", { name: "Next page" }));
    expect(view.getByText("Page 2 of 2")).toBeInTheDocument();
    expect(view.getByRole("row", { name: /Sara Mendoza/ })).toBeInTheDocument();
    expect(await axe(container)).toHaveNoViolations();
  });

  it("preserves controlled server pagination state", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();
    const { container } = render(
      <ServerDataTableHarness onPageChange={onPageChange} />,
    );
    const view = within(container);

    expect(view.getByText("Page 1 of 2")).toBeInTheDocument();
    await user.click(view.getByRole("button", { name: "Next page" }));
    expect(onPageChange).toHaveBeenLastCalledWith(1);
    expect(view.getByText("Page 2 of 2")).toBeInTheDocument();
  });
});
