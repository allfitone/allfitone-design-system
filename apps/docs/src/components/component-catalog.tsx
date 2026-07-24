"use client";

import { useState, type CSSProperties, type ReactNode } from "react";

import { AccentBlock, AccentBlockLabel, AccentBlockMeta, AccentBlockTitle } from "@allfitone/react/components/accent-block";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@allfitone/react/components/alert-dialog";
import { Badge } from "@allfitone/react/components/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@allfitone/react/components/breadcrumb";
import { Button, buttonVariants } from "@allfitone/react/components/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@allfitone/react/components/card";
import { Checkbox } from "@allfitone/react/components/checkbox";
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
import { PulseMark } from "@allfitone/react/components/pulse-mark";
import { RadioGroup, RadioGroupItem } from "@allfitone/react/components/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@allfitone/react/components/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@allfitone/react/components/sheet";
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuBadge, SidebarMenuButton, SidebarMenuItem } from "@allfitone/react/components/sidebar";
import { Skeleton } from "@allfitone/react/components/skeleton";
import { toast } from "@allfitone/react/components/sonner";
import { Spinner } from "@allfitone/react/components/spinner";
import { StatStrip, StatStripItem } from "@allfitone/react/components/stat-strip";
import { Switch } from "@allfitone/react/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@allfitone/react/components/tabs";
import { Textarea } from "@allfitone/react/components/textarea";
import { TickRing } from "@allfitone/react/components/tick-ring";
import { Tooltip, TooltipContent, TooltipTrigger } from "@allfitone/react/components/tooltip";
import { WorkspaceActions, WorkspaceContent, WorkspaceEyebrow, WorkspaceHeader, WorkspaceHeading, WorkspaceMain, WorkspaceShell, WorkspaceTitle } from "@allfitone/react/components/workspace-shell";
import { FoundationIcon } from "@allfitone/react/icons";

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

function CategoryHeader({ id, code, title, description }: { id: string; code: string; title: string; description: string }) {
  return (
    <header className="catalog-category__header" id={id}>
      <span>{code}</span>
      <div><h2 id={`${id}-heading`}>{title}</h2><p>{description}</p></div>
    </header>
  );
}

const programs = ["Strength", "Conditioning", "Mobility"];

export function ComponentCatalog() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div className="catalog-content page-shell">
      <section className="catalog-category" aria-labelledby="actions-heading">
        <CategoryHeader id="actions" code="ACT" title="Actions" description="Clear hierarchy, persistent focus and movement-sized targets." />
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
        <CategoryHeader id="navigation" code="NAV" title="Navigation" description="Current location stays explicit across dense workspaces, nested resources and mobile transitions." />
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
            <WorkspaceShell className="workspace-preview" style={{ "--sidebar-width": "15rem" } as CSSProperties}>
              <Sidebar collapsible="none">
                <SidebarHeader>
                  <div className="workspace-preview__brand">
                    <svg viewBox="0 0 34 14" aria-hidden="true"><path d="M1 8h6l3-6 4 10 3-7 2 3h14" /></svg>
                    <span>Allfit <em>OS</em></span>
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
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="forms-heading">
        <CategoryHeader id="forms" code="FRM" title="Forms" description="Persistent labels, explicit errors and resilient text entry." />
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
        <CategoryHeader id="selection" code="SEL" title="Selection" description="State is visible through shape, position and semantics—not color alone." />
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

          <ComponentSection id="tabs" title="Tabs" description="The selected state combines exposed state, weight and trajectory." importPath="@allfitone/react/components/tabs" contract={["Arrow navigation", "Selected trajectory", "Disabled", "Long labels"]}>
            <Tabs defaultValue="overview"><TabsList variant="line"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="history">History</TabsTrigger><TabsTrigger value="permissions">Permissions</TabsTrigger></TabsList><TabsContent value="overview">Current training summary and active plan.</TabsContent><TabsContent value="history">Completed sessions remain attached to the person.</TabsContent><TabsContent value="permissions">The person controls organizational access.</TabsContent></Tabs>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="data-heading">
        <CategoryHeader id="data-display" code="DAT" title="Data display" description="Compact information that stays readable under pressure." />
        <div className="component-grid">
          <ComponentSection id="badge" title="Badge" description="Short status labels always state their meaning in words." importPath="@allfitone/react/components/badge" contract={["Text plus color", "Long status", "Interactive target"]}><div className="demo-row"><Badge>Active</Badge><Badge variant="success">Synced</Badge><Badge variant="warning">Review needed</Badge><Badge variant="info">New activity</Badge><Badge variant="destructive">Access blocked</Badge></div></ComponentSection>
          <ComponentSection id="card" title="Card" description="Structured composition keeps title, action, content and footer predictable." importPath="@allfitone/react/components/card" contract={["Default / active", "Action slot", "Long content", "Responsive"]}><Card data-state="active"><CardHeader><CardTitle>Strength cycle</CardTitle><CardDescription>4-week program · week 2</CardDescription><CardAction><Badge>Active</Badge></CardAction></CardHeader><CardContent><strong className="metric-value">18,420 kg</strong><p className="metric-caption">Volume completed this week</p></CardContent><CardFooter><Button size="sm" variant="ghost">Open program</Button></CardFooter></Card></ComponentSection>
          <ComponentSection id="skeleton" title="Skeleton" description="Decorative loading placeholders respect reduced motion." importPath="@allfitone/react/components/skeleton" contract={["Decorative only", "Reduced motion", "Content-shaped"]}><div className="skeleton-stack"><Skeleton className="skeleton-avatar" /><div><Skeleton className="skeleton-line skeleton-line--strong" /><Skeleton className="skeleton-line" /></div></div></ComponentSection>
          <ComponentSection id="empty" title="Empty" description="Empty states explain what happened and provide the next action." importPath="@allfitone/react/components/empty" contract={["Clear reason", "Next action", "Long content"]}><Empty className="catalog-empty"><EmptyHeader><EmptyMedia variant="icon"><FoundationIcon name="activity" decorative /></EmptyMedia><EmptyTitle>No sessions yet</EmptyTitle><EmptyDescription>Record the first session to start building this member&apos;s history.</EmptyDescription></EmptyHeader><EmptyContent><Button size="sm"><FoundationIcon name="add" data-icon="inline-start" decorative />Record session</Button></EmptyContent></Empty></ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="signature-heading">
        <CategoryHeader id="signature" code="SIG" title="Signature" description="Ink & Signal brand elements: one signal per screen, athletic numerals and the pulse motif." />
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
              <PulseMark width={34} label="Pulso AllfitOne" />
              <span className="signature-wordmark__text">Allfit <em>One</em></span>
            </div>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="overlays-heading">
        <CategoryHeader id="overlays" code="OVR" title="Overlays" description="Focus enters with intent, stays contained and returns to the trigger." />
        <div className="component-grid">
          <ComponentSection id="dialog" title="Dialog" description="A focused task with discoverable title and dismissal." importPath="@allfitone/react/components/dialog" contract={["Focus trap", "Escape", "Inert background", "Focus return"]}><Dialog><DialogTrigger render={<Button variant="outline" />}>Edit member</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edit member</DialogTitle><DialogDescription>Update the display name without changing training history.</DialogDescription></DialogHeader><Field><FieldLabel htmlFor="dialog-name">Display name</FieldLabel><Input id="dialog-name" defaultValue="Alex Morgan" /></Field><DialogFooter showCloseButton><Button>Save changes</Button></DialogFooter></DialogContent></Dialog></ComponentSection>
          <ComponentSection id="alert-dialog" title="AlertDialog" description="Destructive decisions name the consequence before confirmation." importPath="@allfitone/react/components/alert-dialog" contract={["Consequence named", "Cancel path", "Focus trap", "Focus return"]}><AlertDialog><AlertDialogTrigger render={<Button variant="destructive" />}>Remove access</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove organization access?</AlertDialogTitle><AlertDialogDescription>The person keeps their history, but this organization will no longer see it.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep access</AlertDialogCancel><AlertDialogAction variant="destructive">Remove access</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></ComponentSection>
          <ComponentSection id="sheet" title="Sheet" description="Secondary workflows stay connected to the workspace context." importPath="@allfitone/react/components/sheet" contract={["Escape", "Inert background", "Focus return", "Responsive edge"]}><Sheet><SheetTrigger render={<Button variant="outline" />}>Open filters</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Activity filters</SheetTitle><SheetDescription>Narrow the workspace without leaving the current view.</SheetDescription></SheetHeader><div className="sheet-body"><Field><FieldLabel htmlFor="sheet-search">Member</FieldLabel><Input id="sheet-search" placeholder="Search members" /></Field></div><SheetFooter><Button>Apply filters</Button></SheetFooter></SheetContent></Sheet></ComponentSection>
          <ComponentSection id="tooltip" title="Tooltip" description="Supplementary text appears on pointer and keyboard focus." importPath="@allfitone/react/components/tooltip" contract={["Pointer / keyboard", "Supplementary only", "Escape dismisses"]}><Tooltip><TooltipTrigger render={<IconButton aria-label="About activity score" variant="outline" />}><FoundationIcon name="info" decorative /></TooltipTrigger><TooltipContent>Calculated from consistency and training load.</TooltipContent></Tooltip></ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="feedback-heading">
        <CategoryHeader id="feedback" code="FDB" title="Feedback" description="Progress and outcomes are announced without stealing focus." />
        <div className="component-grid">
          <ComponentSection id="spinner" title="Spinner" description="A named status indicator composes inside actions and surfaces." importPath="@allfitone/react/components/spinner" contract={["Named status", "Reduced motion", "Composed loading"]}><div className="demo-row"><Spinner /><Button disabled><Spinner data-icon="inline-start" label="Saving" />Saving</Button></div></ComponentSection>
          <ComponentSection id="toast" title="Sonner / Toast" description="Polite, textual feedback follows the active ALLFIT ONE theme." importPath="@allfitone/react/components/sonner" contract={["Live region", "No focus steal", "Text plus color", "Dismissible"]}><div className="demo-row"><Button onClick={() => toast.success("Session saved", { description: "The member history is up to date." })}>Show success</Button><Button variant="outline" onClick={() => toast.error("Sync failed", { description: "Check the connection and try again." })}>Show error</Button></div></ComponentSection>
        </div>
      </section>
    </div>
  );
}
