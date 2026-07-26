"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";

import { AccentBlock, AccentBlockLabel, AccentBlockMeta, AccentBlockTitle } from "@allfitone/react/components/accent-block";
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@allfitone/react/components/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@allfitone/react/components/alert-dialog";
import { Avatar, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarPresence } from "@allfitone/react/components/avatar";
import { Badge } from "@allfitone/react/components/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@allfitone/react/components/breadcrumb";
import { Button, buttonVariants } from "@allfitone/react/components/button";
import { Calendar, type DateRange, type Matcher } from "@allfitone/react/components/calendar";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@allfitone/react/components/card";
import { Checkbox } from "@allfitone/react/components/checkbox";
import { Combobox, ComboboxActions, ComboboxChip, ComboboxChipRemove, ComboboxChips, ComboboxChipsInput, ComboboxClear, ComboboxCollection, ComboboxContent, ComboboxEmpty, ComboboxGroup, ComboboxInput, ComboboxInputGroup, ComboboxItem, ComboboxLabel, ComboboxList, ComboboxStatus, ComboboxTrigger, ComboboxValue } from "@allfitone/react/components/combobox";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@allfitone/react/components/command";
import { DataTable, DataTableColumnHeader, DataTableFilterInput, DataTablePagination, DataTableSelectionBar, DataTableToolbar, DataTableViewOptions, useDataTable, type ColumnDef } from "@allfitone/react/components/data-table";
import { DatePicker } from "@allfitone/react/components/date-picker";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@allfitone/react/components/dialog";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle, DrawerTrigger } from "@allfitone/react/components/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@allfitone/react/components/dropdown-menu";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@allfitone/react/components/empty";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@allfitone/react/components/field";
import { IconButton } from "@allfitone/react/components/icon-button";
import { Input } from "@allfitone/react/components/input";
import { Label } from "@allfitone/react/components/label";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, NavigationMenuTrigger } from "@allfitone/react/components/navigation-menu";
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@allfitone/react/components/pagination";
import { Popover, PopoverClose, PopoverContent, PopoverDescription, PopoverFooter, PopoverHeader, PopoverTitle, PopoverTrigger } from "@allfitone/react/components/popover";
import { Progress, ProgressDescription, ProgressHeader, ProgressIndicator, ProgressLabel, ProgressTrack, ProgressValue } from "@allfitone/react/components/progress";
import { RadioGroup, RadioGroupItem } from "@allfitone/react/components/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@allfitone/react/components/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@allfitone/react/components/sheet";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@allfitone/react/components/sidebar";
import { Skeleton } from "@allfitone/react/components/skeleton";
import { toast } from "@allfitone/react/components/sonner";
import { Spinner } from "@allfitone/react/components/spinner";
import { StatStrip, StatStripItem } from "@allfitone/react/components/stat-strip";
import { Switch } from "@allfitone/react/components/switch";
import { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow, TableSortButton, TableState } from "@allfitone/react/components/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@allfitone/react/components/tabs";
import { Textarea } from "@allfitone/react/components/textarea";
import { TickRing } from "@allfitone/react/components/tick-ring";
import { Tooltip, TooltipContent, TooltipTrigger } from "@allfitone/react/components/tooltip";
import { WorkspaceActions, WorkspaceContent, WorkspaceEyebrow, WorkspaceHeader, WorkspaceHeading, WorkspaceMain, WorkspaceShell, WorkspaceTitle } from "@allfitone/react/components/workspace-shell";
import { FoundationIcon } from "@allfitone/react/icons";

import { AllfitOsLockup } from "@/components/allfit-os-brand";

type ComponentSectionProps = {
  id: string;
  title: string;
  description: string;
  importPath: string;
  contract?: string[];
  children: ReactNode;
};

function ComponentSection({ id, title, description, importPath, contract = ["Dark / light", "Long content"], children }: ComponentSectionProps) {
  return (
    <article className="component-entry" id={id}>
      <header className="component-entry__header">
        <div>
          <p className="component-entry__eyebrow">{importPath}</p>
          <h3>{title}</h3>
          <p>{description}</p>
        </div>
        <a href={`#${id}`} aria-label={`Link to ${title}`}>#</a>
      </header>
      <div className="component-demo">{children}</div>
      <footer className="component-entry__contract">
        <span>Contract</span>
        <ul aria-label={`${title} contract`}>
          {contract.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </footer>
    </article>
  );
}

function CategoryHeader({
  id,
  code,
  title,
  description,
  count,
}: {
  id: string;
  code: string;
  title: string;
  description: string;
  count: number;
}) {
  return (
    <header className="catalog-category__header" id={id}>
      <Badge variant="code" className="catalog-category__code">{code}</Badge>
      <div>
        <div className="catalog-category__title-row">
          <h2 id={`${id}-heading`}>{title}</h2>
          <Badge variant="outline">{count} components</Badge>
        </div>
        <p>{description}</p>
      </div>
    </header>
  );
}

const programs = ["Strength", "Conditioning", "Mobility"];

type MemberTableState = "ready" | "loading" | "empty" | "error";

const memberRows = [
  { id: "AF-1042", name: "Camila Torres", plan: "Strength", status: "Active", adherence: 92, lastSession: "Today, 06:30" },
  { id: "AF-1187", name: "Mateo Ruiz", plan: "Mobility", status: "Review needed", adherence: 76, lastSession: "Yesterday, 18:10" },
  { id: "AF-1294", name: "Valentina Gómez de la Torre", plan: "Conditioning", status: "Active", adherence: 88, lastSession: "Jul 23, 07:05" },
  { id: "AF-1308", name: "Nicolás Peña", plan: "Strength", status: "Paused", adherence: 64, lastSession: "Jul 22, 17:40" },
  { id: "AF-1371", name: "Sara Mendoza", plan: "Mobility", status: "Active", adherence: 96, lastSession: "Jul 22, 06:15" },
  { id: "AF-1416", name: "Daniel Rojas", plan: "Conditioning", status: "Review needed", adherence: 71, lastSession: "Jul 21, 19:20" },
];

type Member = (typeof memberRows)[number];

function TableSpecimen() {
  const [previewState, setPreviewState] = useState<MemberTableState>("ready");
  const [sortDirection, setSortDirection] = useState<"ascending" | "descending">("ascending");
  const [selectedIds, setSelectedIds] = useState<string[]>(["AF-1042"]);
  const sortedRows = [...memberRows].sort((left, right) => {
    const result = left.name.localeCompare(right.name);
    return sortDirection === "ascending" ? result : -result;
  });
  const allSelected = selectedIds.length === memberRows.length;
  const partiallySelected = selectedIds.length > 0 && !allSelected;

  const toggleAll = (checked: boolean) => {
    setSelectedIds(checked ? memberRows.map(({ id }) => id) : []);
  };

  const toggleMember = (id: string, checked: boolean) => {
    setSelectedIds((current) =>
      checked ? [...new Set([...current, id])] : current.filter((item) => item !== id)
    );
  };

  return (
    <div className="table-specimen">
      <div className="table-specimen__toolbar">
        <div className="table-specimen__context">
          <strong>Member directory</strong>
          <span aria-live="polite">{selectedIds.length} selected</span>
        </div>
        <Field orientation="horizontal" className="table-specimen__state">
          <FieldLabel htmlFor="table-preview-state">Preview state</FieldLabel>
          <Select
            value={previewState}
            onValueChange={(value) => setPreviewState(value as MemberTableState)}
          >
            <SelectTrigger id="table-preview-state" aria-label="Preview table state">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Table state</SelectLabel>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="loading">Loading</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>

      <Table
        density="compact"
        scrollAreaLabel="Scrollable member directory"
        aria-label="Members"
        aria-busy={previewState === "loading"}
      >
        <TableCaption>
          Active members in the current organization. Scroll horizontally on narrow screens.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Checkbox
                aria-label="Select all members"
                checked={allSelected}
                indeterminate={partiallySelected}
                onCheckedChange={toggleAll}
              />
            </TableHead>
            <TableHead aria-sort={sortDirection}>
              <TableSortButton
                direction={sortDirection}
                aria-label={`Sort members ${sortDirection === "ascending" ? "descending" : "ascending"}`}
                onClick={() =>
                  setSortDirection((current) =>
                    current === "ascending" ? "descending" : "ascending"
                  )
                }
              >
                Member
              </TableSortButton>
            </TableHead>
            <TableHead>Plan</TableHead>
            <TableHead>Status</TableHead>
            <TableHead align="end">Adherence</TableHead>
            <TableHead align="end">Last session</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {previewState === "ready" ? (
            sortedRows.map((member) => {
              const selected = selectedIds.includes(member.id);
              return (
                <TableRow key={member.id} selected={selected}>
                  <TableCell>
                    <Checkbox
                      aria-label={`Select ${member.name}`}
                      checked={selected}
                      onCheckedChange={(checked) => toggleMember(member.id, checked)}
                    />
                  </TableCell>
                  <TableCell>
                    <span className="table-specimen__member">
                      <strong>{member.name}</strong>
                      <small>{member.id}</small>
                    </span>
                  </TableCell>
                  <TableCell>{member.plan}</TableCell>
                  <TableCell>
                    <Badge variant={member.status === "Active" ? "success" : "warning"}>
                      {member.status}
                    </Badge>
                  </TableCell>
                  <TableCell align="end" numeric>{member.adherence}%</TableCell>
                  <TableCell align="end">{member.lastSession}</TableCell>
                </TableRow>
              );
            })
          ) : previewState === "loading" ? (
            <TableState
              colSpan={6}
              state="loading"
              title="Loading members"
              description="Updating the directory for this organization."
            />
          ) : previewState === "empty" ? (
            <TableState
              colSpan={6}
              state="empty"
              title="No members found"
              description="Clear the active filters or add the first member."
              action={<Button size="sm">Add member</Button>}
            />
          ) : (
            <TableState
              colSpan={6}
              state="error"
              title="Members could not be loaded"
              description="Check the connection and try again."
              action={<Button size="sm" variant="outline" onClick={() => setPreviewState("ready")}>Try again</Button>}
            />
          )}
        </TableBody>
        {previewState === "ready" ? (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={4}>Current organization</TableCell>
              <TableCell colSpan={2} align="end" numeric>{memberRows.length} members</TableCell>
            </TableRow>
          </TableFooter>
        ) : null}
      </Table>
    </div>
  );
}

function DataTableSpecimen() {
  const columns = useMemo<ColumnDef<Member>[]>(
    () => [
      {
        id: "select",
        enableHiding: false,
        enableSorting: false,
        header: ({ table }) => (
          <Checkbox
            aria-label="Select all visible members"
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
        cell: ({ row }) => (
          <span className="table-specimen__member">
            <strong>{row.original.name}</strong>
            <small>{row.original.id}</small>
          </span>
        ),
      },
      {
        accessorKey: "plan",
        meta: { label: "Plan" },
        header: "Plan",
      },
      {
        accessorKey: "status",
        meta: { label: "Status" },
        header: "Status",
        cell: ({ row }) => (
          <Badge
            variant={
              row.original.status === "Active"
                ? "success"
                : row.original.status === "Paused"
                  ? "outline"
                  : "warning"
            }
          >
            {row.original.status}
          </Badge>
        ),
      },
      {
        accessorKey: "adherence",
        meta: { align: "end", label: "Adherence", numeric: true },
        header: ({ column }) => (
          <DataTableColumnHeader
            column={column}
            title="Adherence"
            sortLabel="Change adherence sorting"
          />
        ),
        cell: ({ row }) => `${row.original.adherence}%`,
      },
      {
        accessorKey: "lastSession",
        meta: { align: "end", label: "Last session" },
        header: "Last session",
      },
    ],
    []
  );
  const table = useDataTable({
    columns,
    data: memberRows,
    getRowId: (row) => row.id,
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 3,
      },
    },
  });

  return (
    <div className="table-specimen">
      <DataTableToolbar>
        <DataTableFilterInput
          table={table}
          label="Search members"
          placeholder="Search member, plan, or status"
        />
        <DataTableViewOptions
          table={table}
          label="Columns"
          title="Visible columns"
        />
      </DataTableToolbar>
      <DataTable
        table={table}
        density="compact"
        scrollAreaLabel="Scrollable member results"
        aria-label="Member results"
        caption="Filtered members in the current organization."
        emptyState={{
          title: "No members match",
          description: "Try another name, plan, or status.",
        }}
      />
      <DataTableSelectionBar
        table={table}
        getSelectionLabel={(count) =>
          `${count} member${count === 1 ? "" : "s"} selected`
        }
      >
        <Button size="sm" variant="secondary">Assign plan</Button>
        <Button size="sm" variant="outline">Export</Button>
      </DataTableSelectionBar>
      <DataTablePagination table={table} pageSizeOptions={[3, 6]} />
    </div>
  );
}

type Coach = {
  id: string;
  label: string;
  role: string;
  team: "Performance" | "Recovery";
};

type CoachGroup = {
  value: string;
  items: Coach[];
};

type ComboboxPreviewState = "ready" | "loading" | "empty" | "error";

const coaches: Coach[] = [
  { id: "coach-camila", label: "Camila Torres", role: "Strength coach", team: "Performance" },
  { id: "coach-valentina", label: "Valentina Gómez de la Torre", role: "Conditioning coach", team: "Performance" },
  { id: "coach-mateo", label: "Mateo Ruiz", role: "Mobility coach", team: "Recovery" },
  { id: "coach-sara", label: "Sara Mendoza", role: "Physiotherapist", team: "Recovery" },
];

const coachTeams = ["Performance", "Recovery"] as const;
const coachGroups: CoachGroup[] = coachTeams.map((team) => ({
  value: team,
  items: coaches.filter((coach) => coach.team === team),
}));

function CoachOption({ coach }: { coach: Coach }) {
  return (
    <span className="combobox-specimen__option">
      <strong>{coach.label}</strong>
      <small>{coach.role}</small>
    </span>
  );
}

function ComboboxSpecimen() {
  const [remoteState, setRemoteState] = useState<ComboboxPreviewState>("ready");
  const remoteItems = remoteState === "ready" ? coaches : [];

  return (
    <div className="combobox-specimen">
      <div className="combobox-specimen__heading">
        <div>
          <strong>Session roster</strong>
          <span>Filter a known directory; selection stays visibly anchored.</span>
        </div>
        <Badge variant="outline">4 coaches</Badge>
      </div>

      <div className="combobox-specimen__grid">
        <Field>
          <FieldLabel htmlFor="lead-coach-combobox">Lead coach</FieldLabel>
          <FieldDescription>Grouped directory with long-name handling.</FieldDescription>
          <Combobox
            items={coachGroups}
          >
            <ComboboxInputGroup>
              <ComboboxInput id="lead-coach-combobox" placeholder="Search coaches" />
              <ComboboxActions>
                <ComboboxClear aria-label="Clear lead coach" />
                <ComboboxTrigger aria-label="Open lead coach options" />
              </ComboboxActions>
            </ComboboxInputGroup>
            <ComboboxContent>
              <ComboboxStatus />
              <ComboboxEmpty>No coaches match this search.</ComboboxEmpty>
              <ComboboxList>
                {(group: CoachGroup) => (
                  <ComboboxGroup key={group.value} items={group.items}>
                    <ComboboxLabel>{group.value}</ComboboxLabel>
                    <ComboboxCollection>
                      {(coach: Coach) => (
                        <ComboboxItem key={coach.id} value={coach}>
                          <CoachOption coach={coach} />
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>

        <Field>
          <FieldLabel htmlFor="session-coaches-combobox">Session coaches</FieldLabel>
          <FieldDescription>Multiple selection uses neutral, removable chips.</FieldDescription>
          <Combobox
            items={coaches}
            itemToStringLabel={(coach: Coach) => coach.label}
            multiple
            defaultValue={[coaches[0]!]}
          >
            <ComboboxInputGroup>
              <ComboboxChips>
                <ComboboxValue>
                  {(value: Coach[]) => (
                    <>
                      {value.map((coach) => (
                        <ComboboxChip key={coach.id}>
                          {coach.label}
                          <ComboboxChipRemove aria-label={`Remove ${coach.label}`} />
                        </ComboboxChip>
                      ))}
                      <ComboboxChipsInput
                        id="session-coaches-combobox"
                        placeholder={value.length === 0 ? "Add coaches" : ""}
                      />
                    </>
                  )}
                </ComboboxValue>
              </ComboboxChips>
              <ComboboxActions>
                <ComboboxTrigger aria-label="Open session coach options" />
              </ComboboxActions>
            </ComboboxInputGroup>
            <ComboboxContent>
              <ComboboxStatus />
              <ComboboxEmpty>No coaches match this search.</ComboboxEmpty>
              <ComboboxList>
                {(coach: Coach) => (
                  <ComboboxItem key={coach.id} value={coach}>
                    <CoachOption coach={coach} />
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </Field>
      </div>

      <div className="combobox-specimen__remote">
        <Field orientation="horizontal" className="combobox-specimen__state">
          <FieldLabel htmlFor="combobox-preview-state">Remote state</FieldLabel>
          <Select
            value={remoteState}
            onValueChange={(value) => setRemoteState(value as ComboboxPreviewState)}
          >
            <SelectTrigger id="combobox-preview-state" aria-label="Preview combobox remote state">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Directory state</SelectLabel>
                <SelectItem value="ready">Ready</SelectItem>
                <SelectItem value="loading">Loading</SelectItem>
                <SelectItem value="empty">Empty</SelectItem>
                <SelectItem value="error">Error</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>

        <Field data-invalid={remoteState === "error" || undefined}>
          <FieldLabel htmlFor="remote-coach-combobox">Remote directory</FieldLabel>
          <Combobox
            items={remoteItems}
            itemToStringLabel={(coach: Coach) => coach.label}
          >
            <ComboboxInputGroup>
              <ComboboxInput
                id="remote-coach-combobox"
                placeholder="Search remote directory"
                aria-invalid={remoteState === "error" || undefined}
                aria-errormessage={remoteState === "error" ? "remote-coach-error" : undefined}
              />
              <ComboboxActions>
                <ComboboxClear aria-label="Clear remote coach" />
                <ComboboxTrigger
                  aria-label="Open remote coach options"
                />
              </ComboboxActions>
            </ComboboxInputGroup>
            <ComboboxContent aria-busy={remoteState === "loading"}>
              <ComboboxStatus
                variant={remoteState === "error" ? "error" : remoteState === "loading" ? "loading" : "default"}
                role={remoteState === "error" ? "alert" : "status"}
              >
                {remoteState === "loading" ? (
                  <><Spinner label="Loading remote coaches" />Loading remote coaches</>
                ) : remoteState === "error" ? (
                  "Remote directory could not be loaded."
                ) : null}
              </ComboboxStatus>
              <ComboboxEmpty>
                {remoteState === "empty" ? "No remote coaches are available." : null}
              </ComboboxEmpty>
              <ComboboxList>
                {(coach: Coach) => (
                  <ComboboxItem key={coach.id} value={coach}>
                    <CoachOption coach={coach} />
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
          {remoteState === "error" ? (
            <FieldError id="remote-coach-error">Check the connection and retry the directory search.</FieldError>
          ) : null}
        </Field>
      </div>
    </div>
  );
}

const calendarScheduledDates = [
  new Date(2026, 7, 18),
  new Date(2026, 7, 20),
  new Date(2026, 7, 22),
];
const calendarMaintenanceDates = [
  new Date(2026, 7, 27),
  new Date(2026, 8, 3),
];
const calendarDefaultMonth = new Date(2026, 7, 1);
const calendarStartMonth = new Date(2026, 6, 1);
const calendarEndMonth = new Date(2026, 11, 1);
const calendarSingleDisabled: Matcher[] = [
  { before: new Date(2026, 7, 10) },
  ...calendarMaintenanceDates,
];
const calendarModifiers = {
  maintenance: calendarMaintenanceDates,
  scheduled: calendarScheduledDates,
};
const calendarModifierClassNames = {
  maintenance: "calendar-specimen__maintenance-day",
  scheduled: "calendar-specimen__scheduled-day",
};
const calendarDateFormatter = new Intl.DateTimeFormat("en-US", {
  weekday: "short",
  month: "short",
  day: "numeric",
});

function DatePickerSpecimen() {
  const [sessionDate, setSessionDate] = useState<Date | undefined>(
    () => new Date(2026, 7, 18)
  );

  return (
    <div className="date-picker-specimen">
      <div className="date-picker-specimen__schedule">
        <div className="date-picker-specimen__heading">
          <span>Next planned session</span>
          <Badge variant="outline">Scheduled</Badge>
        </div>
        <DatePicker
          id="scheduled-session-date"
          label="Session date"
          description="Choose an available weekday."
          calendarLabel="Session date calendar"
          calendarProps={{
            defaultMonth: calendarDefaultMonth,
            disabled: calendarSingleDisabled,
            fixedWeeks: true,
            startMonth: calendarStartMonth,
            endMonth: calendarEndMonth,
            timeZone: "America/Bogota",
            weekStartsOn: 1,
          }}
          onValueChange={setSessionDate}
          value={sessionDate}
        />
        <div className="date-picker-specimen__slot" aria-live="polite">
          <FoundationIcon name="calendar" decorative />
          <span>
            <small>Current slot</small>
            <strong>
              {sessionDate
                ? calendarDateFormatter.format(sessionDate)
                : "No session date"}
            </strong>
            <em>06:30 · Strength · Camila Torres</em>
          </span>
        </div>
      </div>
      <div className="date-picker-specimen__validation">
        <Badge variant="code">Required state</Badge>
        <DatePicker
          id="review-deadline"
          label="Review deadline"
          description="Use the format shown below the field."
          errorMessage="Choose a review deadline before publishing."
          invalid
          required
        />
      </div>
    </div>
  );
}

function CalendarSpecimen() {
  const [sessionDate, setSessionDate] = useState<Date | undefined>(
    () => new Date(2026, 7, 18)
  );
  const [trainingRange, setTrainingRange] = useState<DateRange | undefined>(
    () => ({
      from: new Date(2026, 8, 7),
      to: new Date(2026, 8, 18),
    })
  );
  const rangeLabel = trainingRange?.from
    ? trainingRange.to
      ? `${calendarDateFormatter.format(trainingRange.from)} – ${calendarDateFormatter.format(trainingRange.to)}`
      : `Starts ${calendarDateFormatter.format(trainingRange.from)}`
    : "Choose a start date";

  return (
    <div className="calendar-specimen">
      <Card className="calendar-specimen__single">
        <CardHeader>
          <CardTitle>Schedule a session</CardTitle>
          <CardDescription>
            Choose one available day; planned and maintenance dates remain explicit.
          </CardDescription>
          <CardAction><Badge variant="code">Single</Badge></CardAction>
        </CardHeader>
        <CardContent className="calendar-specimen__single-layout">
          <Calendar
            aria-label="Session calendar"
            defaultMonth={calendarDefaultMonth}
            disabled={calendarSingleDisabled}
            fixedWeeks
            mode="single"
            modifiers={calendarModifiers}
            modifiersClassNames={calendarModifierClassNames}
            onSelect={setSessionDate}
            selected={sessionDate}
            startMonth={calendarStartMonth}
            endMonth={calendarEndMonth}
            timeZone="America/Bogota"
            weekStartsOn={1}
          />
          <aside className="calendar-specimen__context" aria-label="Calendar state key">
            <div className="calendar-specimen__selection" aria-live="polite">
              <FoundationIcon name="calendar" decorative />
              <span>
                <small>Selected session</small>
                <strong>
                  {sessionDate
                    ? calendarDateFormatter.format(sessionDate)
                    : "No date selected"}
                </strong>
              </span>
            </div>
            <ul className="calendar-specimen__legend">
              <li data-state="selected"><i />Selected</li>
              <li data-state="scheduled"><i />Already planned</li>
              <li data-state="maintenance"><i />Unavailable</li>
            </ul>
          </aside>
        </CardContent>
        <CardFooter>
          Use arrow keys to move by day and Page Up or Page Down to change month.
        </CardFooter>
      </Card>

      <Card className="calendar-specimen__range">
        <CardHeader>
          <CardTitle>Plan a training block</CardTitle>
          <CardDescription>
            A two-month range becomes a stacked calendar on narrow screens.
          </CardDescription>
          <CardAction><Badge variant="code">Range</Badge></CardAction>
        </CardHeader>
        <CardContent>
          <Calendar
            aria-label="Training block calendar"
            defaultMonth={calendarDefaultMonth}
            disabled={calendarMaintenanceDates}
            excludeDisabled
            fixedWeeks
            mode="range"
            numberOfMonths={2}
            onSelect={setTrainingRange}
            pagedNavigation
            resetOnSelect
            selected={trainingRange}
            startMonth={calendarStartMonth}
            endMonth={calendarEndMonth}
            timeZone="America/Bogota"
            weekStartsOn={1}
          />
        </CardContent>
        <CardFooter className="calendar-specimen__range-summary" aria-live="polite">
          <span>Current block</span>
          <strong>{rangeLabel}</strong>
        </CardFooter>
      </Card>
    </div>
  );
}

function PopoverSpecimen() {
  return (
    <div className="popover-specimen">
      <div className="popover-specimen__use-case">
        <span>Member context</span>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <FoundationIcon name="people" data-icon="inline-start" decorative />
            View member context
          </PopoverTrigger>
          <PopoverContent align="start">
            <PopoverHeader>
              <div className="popover-specimen__identity">
                <div>
                  <PopoverTitle>Camila Torres</PopoverTitle>
                  <PopoverDescription>AF-1042 · Strength program</PopoverDescription>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            </PopoverHeader>
            <dl className="popover-specimen__metrics">
              <div>
                <dt>Adherence</dt>
                <dd>92%</dd>
              </div>
              <div>
                <dt>Last session</dt>
                <dd>Today, 06:30</dd>
              </div>
              <div>
                <dt>Coach note</dt>
                <dd>Maintain the current upper-body load.</dd>
              </div>
            </dl>
            <PopoverFooter>
              <PopoverClose render={<Button variant="outline" size="sm" />}>
                Done
              </PopoverClose>
              <Button size="sm">Open profile</Button>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>

      <div className="popover-specimen__use-case popover-specimen__use-case--end">
        <span>Bounded edit</span>
        <Popover>
          <PopoverTrigger render={<Button variant="outline" />}>
            <FoundationIcon name="training" data-icon="inline-start" decorative />
            Adjust session load
          </PopoverTrigger>
          <PopoverContent align="end" side="top">
            <PopoverHeader>
              <PopoverTitle>Adjust session load</PopoverTitle>
              <PopoverDescription>
                Record the perceived effort without leaving today&apos;s session.
              </PopoverDescription>
            </PopoverHeader>
            <Field>
              <FieldLabel htmlFor="popover-session-load">Perceived effort</FieldLabel>
              <Input
                id="popover-session-load"
                type="number"
                min="1"
                max="10"
                step="0.5"
                defaultValue="7.5"
              />
              <FieldDescription>Use a value from 1 to 10.</FieldDescription>
            </Field>
            <PopoverFooter>
              <PopoverClose render={<Button variant="ghost" size="sm" />}>
                Cancel
              </PopoverClose>
              <PopoverClose render={<Button size="sm" />}>
                Save load
              </PopoverClose>
            </PopoverFooter>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

function AlertSpecimen() {
  return (
    <div className="alert-specimen">
      <Alert variant="info">
        <AlertTitle>Schedule window changed</AlertTitle>
        <AlertDescription>
          Monday sessions now open at 06:00. <a href="#calendar">Review the calendar</a>.
        </AlertDescription>
      </Alert>
      <Alert variant="success">
        <AlertTitle>Training block published</AlertTitle>
        <AlertDescription>
          Camila can now see all twelve sessions in the member app.
        </AlertDescription>
      </Alert>
      <Alert variant="warning">
        <AlertTitle>Class capacity is nearly reached</AlertTitle>
        <AlertDescription>
          Functional 45° has two places left for Friday at 18:00.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">Review capacity</Button>
        </AlertAction>
      </Alert>
      <Alert variant="danger">
        <AlertTitle>Member sync stopped</AlertTitle>
        <AlertDescription>
          The latest attendance changes were not saved. Check the connection and try again.
        </AlertDescription>
        <AlertAction>
          <Button size="sm" variant="outline">Retry sync</Button>
        </AlertAction>
      </Alert>
    </div>
  );
}

function AvatarSpecimen() {
  return (
    <div className="avatar-specimen">
      <Card className="avatar-specimen__profile">
        <CardHeader>
          <CardTitle>Session lead</CardTitle>
          <CardDescription>Functional 45′ · Friday at 18:00</CardDescription>
          <CardAction>
            <Badge variant="secondary">Initials</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="avatar-specimen__identity">
            <Avatar aria-label="Camila Torres" size="lg">
              <AvatarFallback>CT</AvatarFallback>
              <AvatarPresence status="online" label="Camila is online" />
            </Avatar>
            <div className="avatar-specimen__identity-copy">
              <strong>Camila Torres</strong>
              <span>Strength coach</span>
              <small>
                <FoundationIcon name="check" decorative />
                Online · leading the current session
              </small>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <p className="avatar-specimen__fallback-note">
            No profile image · initials remain available
          </p>
        </CardFooter>
      </Card>

      <Card className="avatar-specimen__roster">
        <CardHeader>
          <CardTitle>Coaching team</CardTitle>
          <CardDescription>Assigned to today&apos;s operation</CardDescription>
        </CardHeader>
        <CardContent>
          <AvatarGroup aria-label="Assigned coaching team">
            <Avatar aria-label="Camila Torres">
              <AvatarFallback>CT</AvatarFallback>
              <AvatarPresence status="online" label="Camila is online" />
            </Avatar>
            <Avatar aria-label="Mateo Ruiz">
              <AvatarFallback>MR</AvatarFallback>
              <AvatarPresence status="away" label="Mateo is away" />
            </Avatar>
            <Avatar aria-label="Sara Mendoza">
              <AvatarFallback>SM</AvatarFallback>
              <AvatarPresence status="busy" label="Sara is busy" />
            </Avatar>
            <Avatar aria-label="Daniel Rojas">
              <AvatarFallback>DR</AvatarFallback>
              <AvatarPresence status="offline" label="Daniel is offline" />
            </Avatar>
            <AvatarGroupCount count={2} label="2 more assigned coaches" />
          </AvatarGroup>
          <ul
            className="avatar-specimen__presence-key"
            aria-label="Presence icon key"
          >
            <li data-status="online">
              <FoundationIcon name="check" decorative />
              Online
            </li>
            <li data-status="away">
              <FoundationIcon name="time" decorative />
              Away
            </li>
            <li data-status="busy">
              <FoundationIcon name="indeterminate" decorative />
              Busy
            </li>
            <li data-status="offline">
              <FoundationIcon name="close" decorative />
              Offline
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function ProgressSpecimen() {
  const [publishedSessions, setPublishedSessions] = useState(8);
  const isComplete = publishedSessions === 12;

  return (
    <div className="progress-specimen">
      <div className="progress-specimen__primary">
        <div className="progress-specimen__context">
          <span className="progress-specimen__marker" aria-hidden="true">
            <FoundationIcon name="training" decorative />
          </span>
          <div>
            <strong>Strength foundation</strong>
            <span>Four-week training block</span>
          </div>
        </div>

        <Progress
          value={publishedSessions}
          max={12}
          getAriaValueText={(_, value) => `${value} of 12 sessions published`}
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
          <ProgressDescription>
            {isComplete
              ? "The complete block is available to members."
              : `${12 - publishedSessions} sessions remain in draft.`}
          </ProgressDescription>
        </Progress>

        <Button
          size="sm"
          variant="outline"
          className="progress-specimen__action"
          onClick={() =>
            setPublishedSessions((current) => current === 12 ? 8 : current + 1)
          }
        >
          {isComplete ? "Reset preview" : "Publish next session"}
        </Button>
      </div>

      <div className="progress-specimen__queue" aria-label="Background operations">
        <div className="progress-specimen__queue-header">
          <strong>Background operations</strong>
          <span>Live</span>
        </div>
        <div className="progress-specimen__queue-item">
          <Progress value={82} variant="compact">
            <ProgressHeader>
              <ProgressLabel>Member import</ProgressLabel>
              <ProgressValue />
            </ProgressHeader>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>
        <div className="progress-specimen__queue-item">
          <Progress value={null} variant="compact">
            <ProgressHeader>
              <ProgressLabel>Session sync</ProgressLabel>
              <ProgressValue />
            </ProgressHeader>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
        </div>
      </div>
    </div>
  );
}

type WorkspaceCommandItemsProps = {
  onSelect: (label: string) => void;
};

function WorkspaceCommandItems({ onSelect }: WorkspaceCommandItemsProps) {
  return (
    <CommandList label="Available workspace commands">
      <CommandEmpty>
        No commands match this search. Try a member, session or program.
      </CommandEmpty>
      <CommandGroup heading="Navigate">
        <CommandItem
          value="member directory"
          keywords={["people", "clients"]}
          onSelect={() => onSelect("Member directory")}
        >
          <FoundationIcon name="people" decorative />
          <span className="command-specimen__item-copy">
            <strong>Member directory</strong>
            <small>Find profiles and training context</small>
          </span>
          <CommandShortcut>G M</CommandShortcut>
        </CommandItem>
        <CommandItem
          value="today schedule"
          keywords={["calendar", "sessions", "agenda"]}
          onSelect={() => onSelect("Today’s schedule")}
        >
          <FoundationIcon name="calendar" decorative />
          <span className="command-specimen__item-copy">
            <strong>Today’s schedule</strong>
            <small>Review sessions that need attention</small>
          </span>
          <CommandShortcut>G S</CommandShortcut>
        </CommandItem>
        <CommandItem
          value="training programs"
          keywords={["workouts", "plans"]}
          onSelect={() => onSelect("Training programs")}
        >
          <FoundationIcon name="training" decorative />
          <span className="command-specimen__item-copy">
            <strong>Training programs</strong>
            <small>Plan and publish member work</small>
          </span>
          <CommandShortcut>G P</CommandShortcut>
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Create">
        <CommandItem
          value="invite member"
          keywords={["add", "person"]}
          onSelect={() => onSelect("Invite member")}
        >
          <FoundationIcon name="person" decorative />
          <span className="command-specimen__item-copy">
            <strong>Invite member</strong>
            <small>Send access to the current organization</small>
          </span>
          <CommandShortcut>⌘ I</CommandShortcut>
        </CommandItem>
        <CommandItem
          value="create session"
          keywords={["add", "calendar"]}
          onSelect={() => onSelect("Create session")}
        >
          <FoundationIcon name="add" decorative />
          <span className="command-specimen__item-copy">
            <strong>Create session</strong>
            <small>Add a coached or independent session</small>
          </span>
          <CommandShortcut>⌘ N</CommandShortcut>
        </CommandItem>
        <CommandItem
          value="publish organization template"
          keywords={["permission", "owner"]}
          disabled
        >
          <FoundationIcon name="permissions" decorative />
          <span className="command-specimen__item-copy">
            <strong>Publish organization template</strong>
            <small>Owner permission required</small>
          </span>
        </CommandItem>
      </CommandGroup>
    </CommandList>
  );
}

function CommandSpecimen() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastCommand, setLastCommand] = useState("No command run yet");
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const openFromKeyboard = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        returnFocusRef.current = document.activeElement as HTMLElement | null;
        setDialogOpen((current) => !current);
      }
    };

    document.addEventListener("keydown", openFromKeyboard);
    return () => document.removeEventListener("keydown", openFromKeyboard);
  }, []);

  const runCommand = (label: string, closeDialog = false) => {
    setLastCommand(label);
    if (closeDialog) {
      setDialogOpen(false);
    }
  };

  const openCommandDialog = () => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    setDialogOpen(true);
  };

  return (
    <div className="command-specimen">
      <div className="command-specimen__surface">
        <header className="command-specimen__header">
          <div>
            <span>Workspace / Quick route</span>
            <strong>Move without leaving context</strong>
          </div>
          <Badge variant="outline">Keyboard first</Badge>
        </header>
        <Command label="Search quick workspace commands" loop>
          <CommandInput placeholder="Search people, sessions or actions…" />
          <WorkspaceCommandItems onSelect={runCommand} />
        </Command>
        <footer className="command-specimen__footer">
          <span aria-live="polite">{lastCommand}</span>
          <span className="command-specimen__keys" aria-hidden="true">
            <kbd>↑↓</kbd> Move <kbd>↵</kbd> Run
          </span>
        </footer>
      </div>

      <aside className="command-specimen__launcher">
        <div className="command-specimen__launcher-icon">
          <FoundationIcon name="search" decorative />
        </div>
        <div>
          <span>Global command</span>
          <strong>Available from any workspace</strong>
          <small>Opens as a focused Dialog and returns focus when dismissed.</small>
        </div>
        <Button variant="outline" onClick={openCommandDialog}>
          Open commands
          <span className="command-specimen__trigger-key" aria-hidden="true">Ctrl K</span>
        </Button>
      </aside>

      <CommandDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Workspace command menu"
        description="Search destinations and actions in the current organization."
        finalFocus={returnFocusRef}
      >
        <Command label="Search global workspace commands" loop>
          <CommandInput placeholder="Where do you want to go?" />
          <WorkspaceCommandItems
            onSelect={(label) => runCommand(label, true)}
          />
        </Command>
      </CommandDialog>
    </div>
  );
}

export function ComponentCatalog() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="catalog-content page-shell">
      <section className="catalog-category" aria-labelledby="actions-heading">
        <CategoryHeader id="actions" code="ACT" title="Actions" description="Clear hierarchy, persistent focus and movement-sized targets." count={2} />
        <div className="component-grid">
          <ComponentSection id="button" title="Button" description="Semantic hierarchy and movement-safe sizes for product actions." importPath="@allfitone/react/components/button" contract={["Hover / focus / active", "Disabled", "Loading", "Long content"]}>
            <div className="demo-row">
              <Button>Start session</Button><Button variant="secondary">Review</Button><Button variant="outline">Export</Button>
              <Button variant="ghost">Dismiss</Button><Button variant="destructive">Delete</Button>
              <a className={buttonVariants({ variant: "link" })} href="#button">View contract</a>
            </div>
            <div className="demo-row">
              <Button size="sm">Small</Button><Button size="default">Default</Button><Button size="lg">Large action with long text</Button>
              <Button disabled><Spinner data-icon="inline-start" />Syncing</Button>
            </div>
            <div className="demo-row state-preview" aria-label="Button interaction states">
              <Button className="catalog-state-hover">Hover</Button>
              <Button className="catalog-state-focus" variant="outline">Focus</Button>
              <Button className="catalog-state-active">Active</Button>
            </div>
          </ComponentSection>

          <ComponentSection id="icon-button" title="IconButton" description="Icon-only actions require an accessible name at compile time." importPath="@allfitone/react/components/icon-button" contract={["Required aria-label", "44 px target", "Disabled"]}>
            <div className="demo-row">
              <IconButton aria-label="Add movement"><FoundationIcon name="add" decorative /></IconButton>
              <IconButton aria-label="Search members" variant="outline"><FoundationIcon name="search" decorative /></IconButton>
              <IconButton aria-label="Open settings" variant="ghost"><FoundationIcon name="settings" decorative /></IconButton>
            </div>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="navigation-heading">
        <CategoryHeader id="navigation" code="NAV" title="Navigation" description="Current location stays explicit across dense workspaces, nested resources and mobile transitions." count={7} />
        <div className="component-grid">
          <ComponentSection id="breadcrumb" title="Breadcrumb" description="Resource hierarchy stays readable without competing with the page title." importPath="@allfitone/react/components/breadcrumb" contract={["Current page", "Collapsed path", "Router composition", "44 px links"]}>
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem><BreadcrumbLink href="#navigation">People</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbLink href="#navigation">Camila Torres</BreadcrumbLink></BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem><BreadcrumbPage>Training</BreadcrumbPage></BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </ComponentSection>

          <ComponentSection id="navigation-menu" title="NavigationMenu" description="Top-level product areas expose related destinations without hiding the active context." importPath="@allfitone/react/components/navigation-menu" contract={["Arrow keys", "Escape", "Active trajectory", "Long labels"]}>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem><NavigationMenuLink href="#navigation" active>Overview</NavigationMenuLink></NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Training</NavigationMenuTrigger>
                  <NavigationMenuContent className="navigation-menu-demo">
                    <NavigationMenuLink href="#navigation"><FoundationIcon name="training" decorative /><span><strong>Programs</strong><small>Plan and publish training.</small></span></NavigationMenuLink>
                    <NavigationMenuLink href="#navigation"><FoundationIcon name="calendar" decorative /><span><strong>Sessions</strong><small>Review what needs attention.</small></span></NavigationMenuLink>
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem><NavigationMenuLink href="#navigation">Operation</NavigationMenuLink></NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </ComponentSection>

          <ComponentSection id="dropdown-menu" title="DropdownMenu" description="Compact contextual actions keep organization and account controls close to their trigger." importPath="@allfitone/react/components/dropdown-menu" contract={["Arrow keys", "Typeahead", "Grouped items", "Destructive text"]}>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="outline" />}><FoundationIcon name="organization" data-icon="inline-start" decorative />Allfit Performance<FoundationIcon name="expand" data-icon="inline-end" decorative /></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Organization</DropdownMenuLabel>
                  <DropdownMenuItem><FoundationIcon name="overview" decorative />Overview</DropdownMenuItem>
                  <DropdownMenuItem><FoundationIcon name="people" decorative />Team</DropdownMenuItem>
                  <DropdownMenuItem><FoundationIcon name="settings" decorative />Settings</DropdownMenuItem>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem variant="destructive">Leave organization</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </ComponentSection>

          <ComponentSection id="pagination" title="Pagination" description="Large operational lists expose position, direction and the active page." importPath="@allfitone/react/components/pagination" contract={["Current page", "Previous / next", "Accessible labels", "Mobile collapse"]}>
            <Pagination>
              <PaginationContent>
                <PaginationItem><PaginationPrevious href="#pagination" /></PaginationItem>
                <PaginationItem><PaginationLink href="#pagination">1</PaginationLink></PaginationItem>
                <PaginationItem><PaginationLink href="#pagination" isActive>2</PaginationLink></PaginationItem>
                <PaginationItem><PaginationEllipsis /></PaginationItem>
                <PaginationItem><PaginationLink href="#pagination">8</PaginationLink></PaginationItem>
                <PaginationItem><PaginationNext href="#pagination" /></PaginationItem>
              </PaginationContent>
            </Pagination>
          </ComponentSection>

          <ComponentSection id="drawer" title="Drawer" description="Mobile navigation enters from the physical edge and preserves the workspace beneath it." importPath="@allfitone/react/components/drawer" contract={["Required title", "Swipe / Escape", "Focus return", "Mobile navigation"]}>
            <Drawer open={drawerOpen} onOpenChange={setDrawerOpen} swipeDirection="right">
              <DrawerTrigger render={<Button variant="outline" />}><FoundationIcon name="menu" data-icon="inline-start" decorative />Open mobile navigation</DrawerTrigger>
              <DrawerContent>
                <DrawerHeader><DrawerTitle>Workspace</DrawerTitle><DrawerDescription>Move through Allfit Performance.</DrawerDescription></DrawerHeader>
                <nav className="drawer-navigation" aria-label="Mobile workspace">
                  <a href="#navigation" aria-current="page" onClick={() => setDrawerOpen(false)}><FoundationIcon name="overview" decorative />Overview</a>
                  <a href="#navigation" onClick={() => setDrawerOpen(false)}><FoundationIcon name="people" decorative />People</a>
                  <a href="#navigation" onClick={() => setDrawerOpen(false)}><FoundationIcon name="training" decorative />Training</a>
                  <a href="#navigation" onClick={() => setDrawerOpen(false)}><FoundationIcon name="operation" decorative />Operation</a>
                </nav>
              </DrawerContent>
            </Drawer>
          </ComponentSection>

          <ComponentSection id="workspace-shell" title="Sidebar + WorkspaceShell" description="The application frame keeps organization, product area and current task in one disciplined hierarchy." importPath="@allfitone/react/components/workspace-shell" contract={["Desktop sidebar", "Mobile sheet", "Collapsed state", "Landmark order"]}>
            <WorkspaceShell className="workspace-preview" lang="es" style={{ "--sidebar-width": "15rem" } as CSSProperties}>
                <Sidebar collapsible="none">
                  <SidebarHeader>
                    <div className="workspace-preview__brand">
                      <AllfitOsLockup surface="adaptive" />
                    </div>
                  </SidebarHeader>
                <SidebarContent>
                  <SidebarGroup>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        <SidebarMenuItem><SidebarMenuButton isActive><FoundationIcon name="overview" decorative /><span>Panel</span><SidebarMenuBadge>3</SidebarMenuBadge></SidebarMenuButton></SidebarMenuItem>
                        <SidebarMenuItem><SidebarMenuButton><FoundationIcon name="people" decorative /><span>Clientes</span></SidebarMenuButton></SidebarMenuItem>
                        <SidebarMenuItem><SidebarMenuButton><FoundationIcon name="operation" decorative /><span>Agenda</span></SidebarMenuButton></SidebarMenuItem>
                        <SidebarMenuItem><SidebarMenuButton><FoundationIcon name="training" decorative /><span>Rutinas</span></SidebarMenuButton></SidebarMenuItem>
                        <SidebarMenuItem><SidebarMenuButton><FoundationIcon name="business" decorative /><span>Monetización</span></SidebarMenuButton></SidebarMenuItem>
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </SidebarGroup>
                </SidebarContent>
                <SidebarFooter><SidebarMenu><SidebarMenuItem><SidebarMenuButton><FoundationIcon name="settings" decorative /><span>Configuración</span></SidebarMenuButton></SidebarMenuItem></SidebarMenu></SidebarFooter>
              </Sidebar>
              <WorkspaceMain as="div">
                <WorkspaceHeader>
                  <WorkspaceHeading><WorkspaceEyebrow>Today · 8 sessions</WorkspaceEyebrow><WorkspaceTitle as="h3">Overview</WorkspaceTitle></WorkspaceHeading>
                  <WorkspaceActions><Button size="sm">Invite person</Button></WorkspaceActions>
                </WorkspaceHeader>
                <WorkspaceContent><div className="workspace-preview__metric"><span>Needs attention</span><strong>03</strong><p>Two reviews and one relationship setup.</p></div></WorkspaceContent>
              </WorkspaceMain>
            </WorkspaceShell>
          </ComponentSection>

          <ComponentSection id="command" title="Command + CommandDialog" description="A shared keyboard-first command model moves through the workspace inline or inside a focused global Dialog." importPath="@allfitone/react/components/command" contract={["Filtering / groups", "Arrow keys / Enter", "Empty / disabled", "Dialog focus return"]}>
            <CommandSpecimen />
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="forms-heading">
        <CategoryHeader id="forms" code="FRM" title="Forms" description="Persistent labels, explicit errors and resilient text entry." count={4} />
        <div className="component-grid">
          <ComponentSection id="label" title="Label" description="Visible naming remains separate from placeholder content." importPath="@allfitone/react/components/label" contract={["Persistent name", "Native association", "Disabled context"]}>
            <div className="demo-stack"><Label htmlFor="standalone-label">Member search</Label><Input id="standalone-label" placeholder="Name or email" /></div>
          </ComponentSection>

          <ComponentSection id="input" title="Input" description="A 44 px target with theme-aware boundaries." importPath="@allfitone/react/components/input" contract={["Hover / focus", "Disabled", "Invalid", "Placeholder is not a label"]}>
            <div className="demo-stack"><Input aria-label="Default input" placeholder="Default" /><Input aria-label="Disabled input" placeholder="Disabled" disabled /></div>
          </ComponentSection>

          <ComponentSection id="textarea" title="Textarea" description="Content grows without clipping essential instructions." importPath="@allfitone/react/components/textarea" contract={["Focus", "Disabled", "Invalid", "Long content"]}>
            <Textarea aria-label="Coach notes" placeholder="Add a note for the next session…" />
          </ComponentSection>

          <ComponentSection id="field" title="Field" description="Label, help and error text form one accessible relationship." importPath="@allfitone/react/components/field" contract={["Description relationship", "Textual error", "aria-invalid", "Error announcement"]}>
            <FieldGroup>
              <Field><FieldLabel htmlFor="member-email">Email</FieldLabel><Input id="member-email" type="email" aria-describedby="member-email-help" /><FieldDescription id="member-email-help">Used for access and training updates.</FieldDescription></Field>
              <Field data-invalid><FieldLabel htmlFor="member-code">Member code</FieldLabel><Input id="member-code" aria-invalid aria-errormessage="member-code-error" defaultValue="AF-" /><FieldError id="member-code-error">Enter the complete six-character member code.</FieldError></Field>
            </FieldGroup>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="selection-heading">
        <CategoryHeader id="selection" code="SEL" title="Selection" description="State is visible through shape, position and semantics—not color alone." count={8} />
        <div className="component-grid">
          <ComponentSection id="checkbox" title="Checkbox" description="Checked and indeterminate states retain a 44 px target." importPath="@allfitone/react/components/checkbox" contract={["Checked", "Indeterminate", "Disabled", "44 px target"]}>
            <Field orientation="horizontal"><Checkbox id="consent" defaultChecked /><FieldLabel htmlFor="consent">Share training history with this coach</FieldLabel></Field>
          </ComponentSection>

          <ComponentSection id="radio-group" title="RadioGroup" description="Arrow-key selection follows the established composite pattern." importPath="@allfitone/react/components/radio-group" contract={["Arrow navigation", "Selected", "Disabled", "Group label"]}>
            <FieldSet><FieldLegend variant="label">Training focus</FieldLegend><RadioGroup defaultValue="strength" aria-label="Training focus">{programs.map((program) => <Field key={program} orientation="horizontal"><RadioGroupItem id={`program-${program}`} value={program.toLowerCase()} /><FieldLabel htmlFor={`program-${program}`}>{program}</FieldLabel></Field>)}</RadioGroup></FieldSet>
          </ComponentSection>

          <ComponentSection id="switch" title="Switch" description="Track and thumb expose state through position as well as color." importPath="@allfitone/react/components/switch" contract={["On / off", "Disabled", "Visible label", "44 px target"]}>
            <Field orientation="horizontal"><Switch id="progress-sharing" defaultChecked /><FieldLabel htmlFor="progress-sharing">Live progress sharing</FieldLabel></Field>
          </ComponentSection>

          <ComponentSection id="select" title="Select" description="Grouped options support keyboard traversal and explicit labels." importPath="@allfitone/react/components/select" contract={["Open / closed", "Arrow navigation", "Grouped options", "Invalid"]}>
            <Field><FieldLabel htmlFor="program-select">Program</FieldLabel><Select defaultValue="strength"><SelectTrigger id="program-select"><SelectValue placeholder="Choose a program" /></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Program</SelectLabel>{programs.map((program) => <SelectItem key={program} value={program.toLowerCase()}>{program}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
          </ComponentSection>

          <ComponentSection id="combobox" title="Combobox" description="Filterable predefined options support rich items, grouped directories and multiple selection without becoming a free-form search field." importPath="@allfitone/react/components/combobox" contract={["Keyboard filtering", "Single / multiple", "Grouped rich options", "Loading / empty / error"]}>
            <ComboboxSpecimen />
          </ComponentSection>

          <ComponentSection id="date-picker" title="DatePicker" description="Typed dates and the calendar share one controlled value, visible format guidance and explicit unavailable or invalid states." importPath="@allfitone/react/components/date-picker" contract={["Typed parsing", "Controlled / uncontrolled", "Unavailable dates", "Visible format and error"]}>
            <DatePickerSpecimen />
          </ComponentSection>

          <ComponentSection id="calendar" title="Calendar" description="Session dates and training blocks preserve a 44 px grid, explicit unavailable days and keyboard navigation across months." importPath="@allfitone/react/components/calendar" contract={["Single / range", "Disabled modifiers", "Locale / timezone ready", "Arrow and page keys"]}>
            <CalendarSpecimen />
          </ComponentSection>

          <ComponentSection id="tabs" title="Tabs" description="The selected state combines exposed state, weight and trajectory." importPath="@allfitone/react/components/tabs" contract={["Arrow navigation", "Selected trajectory", "Disabled", "Long labels"]}>
            <Tabs defaultValue="overview"><TabsList variant="line"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="history">History</TabsTrigger><TabsTrigger value="permissions">Permissions</TabsTrigger></TabsList><TabsContent value="overview">Current training summary and active plan.</TabsContent><TabsContent value="history">Completed sessions remain attached to the person.</TabsContent><TabsContent value="permissions">The person controls organizational access.</TabsContent></Tabs>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="data-heading">
        <CategoryHeader id="data-display" code="DAT" title="Data display" description="Compact information that stays readable under pressure." count={7} />
        <div className="component-grid">
          <ComponentSection id="table" title="Table" description="Operational records keep native table relationships, explicit selection and a focusable overflow region." importPath="@allfitone/react/components/table" contract={["Comfortable / compact", "Selection and sorting", "Loading / empty / error", "320 px overflow"]}><TableSpecimen /></ComponentSection>
          <ComponentSection id="data-table" title="DataTable" description="Composable controls add filtering, column visibility, selection actions and client or server pagination without replacing Table." importPath="@allfitone/react/components/data-table" contract={["Headless controlled state", "Filter and sort", "Column visibility", "Selection and pagination"]}><DataTableSpecimen /></ComponentSection>
          <ComponentSection id="avatar" title="Avatar" description="Member and coach identity survives image failure, while presence remains recognizable without relying on color." importPath="@allfitone/react/components/avatar" contract={["Named / decorative", "Image fallback", "Icon plus presence label", "Group and count"]}><AvatarSpecimen /></ComponentSection>
          <ComponentSection id="badge" title="Badge" description="Short status labels always state their meaning in words." importPath="@allfitone/react/components/badge" contract={["Text plus color", "Long status", "Interactive target"]}><div className="demo-row"><Badge>Active</Badge><Badge variant="code">ACT</Badge><Badge variant="success">Synced</Badge><Badge variant="warning">Review needed</Badge><Badge variant="info">New activity</Badge><Badge variant="destructive">Access blocked</Badge></div></ComponentSection>
          <ComponentSection id="card" title="Card" description="Structured composition keeps title, action, content and footer predictable." importPath="@allfitone/react/components/card" contract={["Default / active", "Action slot", "Long content", "Responsive"]}><Card data-state="active"><CardHeader><CardTitle>Strength cycle</CardTitle><CardDescription>4-week program · week 2</CardDescription><CardAction><Badge>Active</Badge></CardAction></CardHeader><CardContent><strong className="metric-value">18,420 kg</strong><p className="metric-caption">Volume completed this week</p></CardContent><CardFooter><Button size="sm" variant="ghost">Open program</Button></CardFooter></Card></ComponentSection>
          <ComponentSection id="skeleton" title="Skeleton" description="Decorative loading placeholders respect reduced motion." importPath="@allfitone/react/components/skeleton" contract={["Decorative only", "Reduced motion", "Content-shaped"]}><div className="skeleton-stack"><Skeleton className="skeleton-avatar" /><div><Skeleton className="skeleton-line skeleton-line--strong" /><Skeleton className="skeleton-line" /></div></div></ComponentSection>
          <ComponentSection id="empty" title="Empty" description="Empty states explain what happened and provide the next action." importPath="@allfitone/react/components/empty" contract={["Clear reason", "Next action", "Long content"]}><Empty className="catalog-empty"><EmptyHeader><EmptyMedia variant="icon"><FoundationIcon name="activity" decorative /></EmptyMedia><EmptyTitle>No sessions yet</EmptyTitle><EmptyDescription>Record the first session to start building this member&apos;s history.</EmptyDescription></EmptyHeader><EmptyContent><Button size="sm"><FoundationIcon name="add" data-icon="inline-start" decorative />Record session</Button></EmptyContent></Empty></ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="signature-heading">
        <CategoryHeader id="signature" code="SIG" title="Signature" description="Ink & Signal brand elements: one signal per screen, athletic numerals and the pulse motif." count={5} />
        <div className="component-grid">
          <ComponentSection id="accent-block" title="AccentBlock" description="The single accent surface per screen carries the next action on the signal gradient." importPath="@allfitone/react/components/accent-block" contract={["One per screen", "Theme-invariant gradient", "On-accent ink text", "Dot texture"]}>
            <AccentBlock className="signature-accent-demo">
              <AccentBlockLabel>Entrenamiento programado</AccentBlockLabel>
              <AccentBlockTitle>Fuerza — Tren superior</AccentBlockTitle>
              <AccentBlockMeta>18:00 · Factory Fitness Chapinero</AccentBlockMeta>
              <Button className="signature-accent-demo__action">Empezar entrenamiento</Button>
            </AccentBlock>
          </ComponentSection>

          <ComponentSection id="stat-strip" title="StatStrip" description="Big session metrics divided by hairlines, set in condensed tabular numerals." importPath="@allfitone/react/components/stat-strip" contract={["Tabular numerals", "Hairline dividers", "Equal-width items", "Long values"]}>
            <StatStrip>
              <StatStripItem value="4.320" label="Volumen" />
              <StatStripItem value="22" label="Series" />
              <StatStripItem value="186" label="Rep." />
            </StatStrip>
          </ComponentSection>

          <ComponentSection id="tick-ring" title="TickRing" description="Bezel-style progress built from tick dashes with a single signal arc." importPath="@allfitone/react/components/tick-ring" contract={["role=meter", "0–100 clamp", "Center label slot", "Reference geometry"]}>
            <div className="demo-row">
              <TickRing value={86} size={64} aria-label="Adherencia semanal">
                <span className="signature-tick-demo__value">86%</span>
              </TickRing>
              <p className="signature-tick-demo__caption">Adherencia semanal</p>
            </div>
          </ComponentSection>

          <ComponentSection id="pulse-mark" title="PulseMark" description="The EKG brand motif composes next to wordmarks and eyebrows." importPath="@allfitone/react/components/pulse-mark" contract={["aria-hidden by default", "Optional label", "currentColor stroke"]}>
            <div className="demo-row signature-wordmark">
              <AllfitOsLockup surface="adaptive" />
            </div>
          </ComponentSection>

          <ComponentSection id="class-cards" title="Class cards" description="Patrón de reservas del producto: clase destacada, inscrita y no disponible — AccentBlock, Card, Badge y Button compuestos." importPath="@allfitone/react (composición)" contract={["Destacada única", "Estados de reserva", "CTA invertido", "Dark / light"]}>
            <div className="class-cards-demo" lang="es">
              <AccentBlock>
                <div className="class-cards-demo__top"><AccentBlockTitle>Functional 45′</AccentBlockTitle><Badge>HIIT</Badge></div>
                <AccentBlockMeta>Vie 24 jul · 7:00 – 7:45 · Clase en vivo</AccentBlockMeta>
                <AccentBlockMeta><strong>14/16</strong> reservas · quedan 2 cupos</AccentBlockMeta>
                <Button className="class-cards-demo__cta">Reservar clase</Button>
              </AccentBlock>
              <Card size="sm">
                <CardContent>
                  <div className="class-cards-demo__top"><span className="class-cards-demo__name">Movilidad</span><Badge variant="info">Inscrito</Badge></div>
                  <p className="class-cards-demo__meta">Sáb 25 jul · 7:00 – 7:50 · Clase en vivo</p>
                  <p className="class-cards-demo__meta"><strong>12/16</strong> reservas</p>
                  <Button className="class-cards-demo__cta class-cards-demo__cta--tonal">Cancelar reserva</Button>
                </CardContent>
              </Card>
              <Card size="sm">
                <CardContent>
                  <div className="class-cards-demo__top"><span className="class-cards-demo__name">Yoga Flow</span><Badge variant="sport">Yoga</Badge></div>
                  <p className="class-cards-demo__meta">Dom 26 jul · 9:00 – 10:00 · Contenido digital</p>
                  <p className="class-cards-demo__meta">Cupos abiertos</p>
                  <Button variant="secondary" disabled className="class-cards-demo__cta">No disponible</Button>
                </CardContent>
              </Card>
            </div>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="overlays-heading">
        <CategoryHeader id="overlays" code="OVR" title="Overlays" description="Focus enters with intent and returns predictably to the trigger." count={5} />
        <div className="component-grid">
          <ComponentSection id="dialog" title="Dialog" description="A focused task with discoverable title and dismissal." importPath="@allfitone/react/components/dialog" contract={["Focus trap", "Escape", "Inert background", "Focus return"]}><Dialog><DialogTrigger render={<Button variant="outline" />}>Edit member</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edit member</DialogTitle><DialogDescription>Update the display name without changing training history.</DialogDescription></DialogHeader><Field><FieldLabel htmlFor="dialog-name">Display name</FieldLabel><Input id="dialog-name" defaultValue="Alex Morgan" /></Field><DialogFooter showCloseButton><Button>Save changes</Button></DialogFooter></DialogContent></Dialog></ComponentSection>
          <ComponentSection id="alert-dialog" title="AlertDialog" description="Destructive decisions name the consequence before confirmation." importPath="@allfitone/react/components/alert-dialog" contract={["Consequence named", "Cancel path", "Focus trap", "Focus return"]}><AlertDialog><AlertDialogTrigger render={<Button variant="destructive" />}>Remove access</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove organization access?</AlertDialogTitle><AlertDialogDescription>The person keeps their history, but this organization will no longer see it.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep access</AlertDialogCancel><AlertDialogAction variant="destructive">Remove access</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></ComponentSection>
          <ComponentSection id="sheet" title="Sheet" description="Secondary workflows stay connected to the workspace context." importPath="@allfitone/react/components/sheet" contract={["Escape", "Inert background", "Focus return", "Responsive edge"]}><Sheet><SheetTrigger render={<Button variant="outline" />}>Open filters</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Activity filters</SheetTitle><SheetDescription>Narrow the workspace without leaving the current view.</SheetDescription></SheetHeader><div className="sheet-body"><Field><FieldLabel htmlFor="sheet-search">Member</FieldLabel><Input id="sheet-search" placeholder="Search members" /></Field></div><SheetFooter><Button>Apply filters</Button></SheetFooter></SheetContent></Sheet></ComponentSection>
          <ComponentSection id="tooltip" title="Tooltip" description="Supplementary text appears on pointer and keyboard focus." importPath="@allfitone/react/components/tooltip" contract={["Pointer / keyboard", "Supplementary only", "Escape dismisses"]}><Tooltip><TooltipTrigger render={<IconButton aria-label="About activity score" variant="outline" />}><FoundationIcon name="info" decorative /></TooltipTrigger><TooltipContent>Calculated from consistency and training load.</TooltipContent></Tooltip></ComponentSection>
          <ComponentSection id="popover" title="Popover" description="Anchored, non-modal context supports quick inspection and bounded edits without obscuring the workspace." importPath="@allfitone/react/components/popover" contract={["Solid raised surface", "Placement / collision", "Escape / outside press", "Focus return"]}><PopoverSpecimen /></ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="feedback-heading">
        <CategoryHeader id="feedback" code="FDB" title="Feedback" description="Progress and outcomes are announced without stealing focus." count={4} />
        <div className="component-grid">
          <ComponentSection id="progress" title="Progress" description="Training work and background operations expose their current state as readable data, not color alone." importPath="@allfitone/react/components/progress" contract={["Determinate / indeterminate", "Visible value", "Full / compact", "Reduced motion"]}><ProgressSpecimen /></ComponentSection>
          <ComponentSection id="alert" title="Alert" description="Operational callouts pair plain-language meaning with a distinct icon and restrained status signal." importPath="@allfitone/react/components/alert" contract={["Info / success / warning / danger", "Icon plus text", "Optional action", "Explicit live priority"]}><AlertSpecimen /></ComponentSection>
          <ComponentSection id="spinner" title="Spinner" description="A named status indicator composes inside actions and surfaces." importPath="@allfitone/react/components/spinner" contract={["Named status", "Reduced motion", "Composed loading"]}><div className="demo-row"><Spinner /><Button disabled><Spinner data-icon="inline-start" label="Saving" />Saving</Button></div></ComponentSection>
          <ComponentSection id="toast" title="Sonner / Toast" description="Polite, textual feedback follows the active ALLFIT ONE theme." importPath="@allfitone/react/components/sonner" contract={["Live region", "No focus steal", "Text plus color", "Dismissible"]}><div className="demo-row"><Button onClick={() => toast.success("Session saved", { description: "The member history is up to date." })}>Show success</Button><Button variant="outline" onClick={() => toast.error("Sync failed", { description: "Check the connection and try again." })}>Show error</Button></div></ComponentSection>
        </div>
      </section>
    </div>
  );
}
