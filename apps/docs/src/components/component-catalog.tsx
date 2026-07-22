"use client";

import type { ReactNode } from "react";

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@allfitone/react/components/alert-dialog";
import { Badge } from "@allfitone/react/components/badge";
import { Button, buttonVariants } from "@allfitone/react/components/button";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@allfitone/react/components/card";
import { Checkbox } from "@allfitone/react/components/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@allfitone/react/components/dialog";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@allfitone/react/components/empty";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@allfitone/react/components/field";
import { IconButton } from "@allfitone/react/components/icon-button";
import { Input } from "@allfitone/react/components/input";
import { Label } from "@allfitone/react/components/label";
import { RadioGroup, RadioGroupItem } from "@allfitone/react/components/radio-group";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@allfitone/react/components/select";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@allfitone/react/components/sheet";
import { Skeleton } from "@allfitone/react/components/skeleton";
import { toast } from "@allfitone/react/components/sonner";
import { Spinner } from "@allfitone/react/components/spinner";
import { Switch } from "@allfitone/react/components/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@allfitone/react/components/tabs";
import { Textarea } from "@allfitone/react/components/textarea";
import { Tooltip, TooltipContent, TooltipTrigger } from "@allfitone/react/components/tooltip";
import { FoundationIcon } from "@allfitone/react/icons";

type ComponentSectionProps = {
  id: string;
  title: string;
  description: string;
  importPath: string;
  children: ReactNode;
};

function ComponentSection({ id, title, description, importPath, children }: ComponentSectionProps) {
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
    </article>
  );
}

function CategoryHeader({ id, index, title, description }: { id: string; index: string; title: string; description: string }) {
  return (
    <header className="catalog-category__header" id={id}>
      <span>{index}</span>
      <div><h2 id={`${id}-heading`}>{title}</h2><p>{description}</p></div>
    </header>
  );
}

const programs = ["Strength", "Conditioning", "Mobility"];

export function ComponentCatalog() {
  return (
    <div className="catalog-content page-shell">
      <section className="catalog-category" aria-labelledby="actions-heading">
        <CategoryHeader id="actions" index="01" title="Actions" description="Clear hierarchy, persistent focus and movement-sized targets." />
        <div className="component-grid">
          <ComponentSection id="button" title="Button" description="Six semantic variants and six target-safe sizes." importPath="@allfitone/react/components/button">
            <div className="demo-row">
              <Button>Start session</Button><Button variant="secondary">Review</Button><Button variant="outline">Export</Button>
              <Button variant="ghost">Dismiss</Button><Button variant="destructive">Delete</Button>
              <a className={buttonVariants({ variant: "link" })} href="#button">View contract</a>
            </div>
            <div className="demo-row">
              <Button size="sm">Small</Button><Button size="default">Default</Button><Button size="lg">Large action with long text</Button>
              <Button disabled><Spinner data-icon="inline-start" />Syncing</Button>
            </div>
          </ComponentSection>

          <ComponentSection id="icon-button" title="IconButton" description="Icon-only actions require an accessible name at compile time." importPath="@allfitone/react/components/icon-button">
            <div className="demo-row">
              <IconButton aria-label="Add movement"><FoundationIcon name="add" decorative /></IconButton>
              <IconButton aria-label="Search members" variant="outline"><FoundationIcon name="search" decorative /></IconButton>
              <IconButton aria-label="Open settings" variant="ghost"><FoundationIcon name="settings" decorative /></IconButton>
            </div>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="forms-heading">
        <CategoryHeader id="forms" index="02" title="Forms" description="Persistent labels, explicit errors and resilient text entry." />
        <div className="component-grid">
          <ComponentSection id="label" title="Label" description="Visible naming remains separate from placeholder content." importPath="@allfitone/react/components/label">
            <div className="demo-stack"><Label htmlFor="standalone-label">Member search</Label><Input id="standalone-label" placeholder="Name or email" /></div>
          </ComponentSection>

          <ComponentSection id="input" title="Input" description="Eleven-rem target height with theme-aware boundaries." importPath="@allfitone/react/components/input">
            <div className="demo-stack"><Input aria-label="Default input" placeholder="Default" /><Input aria-label="Disabled input" placeholder="Disabled" disabled /></div>
          </ComponentSection>

          <ComponentSection id="textarea" title="Textarea" description="Content grows without clipping essential instructions." importPath="@allfitone/react/components/textarea">
            <Textarea aria-label="Coach notes" placeholder="Add a note for the next session…" />
          </ComponentSection>

          <ComponentSection id="field" title="Field" description="Label, help and error text form one accessible relationship." importPath="@allfitone/react/components/field">
            <FieldGroup>
              <Field><FieldLabel htmlFor="member-email">Email</FieldLabel><Input id="member-email" type="email" aria-describedby="member-email-help" /><FieldDescription id="member-email-help">Used for access and training updates.</FieldDescription></Field>
              <Field data-invalid><FieldLabel htmlFor="member-code">Member code</FieldLabel><Input id="member-code" aria-invalid aria-errormessage="member-code-error" defaultValue="AF-" /><FieldError id="member-code-error">Enter the complete six-character member code.</FieldError></Field>
            </FieldGroup>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="selection-heading">
        <CategoryHeader id="selection" index="03" title="Selection" description="State is visible through shape, position and semantics—not color alone." />
        <div className="component-grid">
          <ComponentSection id="checkbox" title="Checkbox" description="Checked and indeterminate states retain a 44 px target." importPath="@allfitone/react/components/checkbox">
            <Field orientation="horizontal"><Checkbox id="consent" defaultChecked /><FieldLabel htmlFor="consent">Share training history with this coach</FieldLabel></Field>
          </ComponentSection>

          <ComponentSection id="radio-group" title="RadioGroup" description="Arrow-key selection follows the established composite pattern." importPath="@allfitone/react/components/radio-group">
            <FieldSet><FieldLegend variant="label">Training focus</FieldLegend><RadioGroup defaultValue="strength" aria-label="Training focus">{programs.map((program) => <Field key={program} orientation="horizontal"><RadioGroupItem id={`program-${program}`} value={program.toLowerCase()} /><FieldLabel htmlFor={`program-${program}`}>{program}</FieldLabel></Field>)}</RadioGroup></FieldSet>
          </ComponentSection>

          <ComponentSection id="switch" title="Switch" description="Track and thumb expose state through position as well as color." importPath="@allfitone/react/components/switch">
            <Field orientation="horizontal"><Switch id="progress-sharing" defaultChecked /><FieldLabel htmlFor="progress-sharing">Live progress sharing</FieldLabel></Field>
          </ComponentSection>

          <ComponentSection id="select" title="Select" description="Grouped options support keyboard traversal and explicit labels." importPath="@allfitone/react/components/select">
            <Field><FieldLabel htmlFor="program-select">Program</FieldLabel><Select defaultValue="strength"><SelectTrigger id="program-select"><SelectValue placeholder="Choose a program" /></SelectTrigger><SelectContent><SelectGroup><SelectLabel>Program</SelectLabel>{programs.map((program) => <SelectItem key={program} value={program.toLowerCase()}>{program}</SelectItem>)}</SelectGroup></SelectContent></Select></Field>
          </ComponentSection>

          <ComponentSection id="tabs" title="Tabs" description="The selected state combines exposed state, weight and underline." importPath="@allfitone/react/components/tabs">
            <Tabs defaultValue="overview"><TabsList variant="line"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="history">History</TabsTrigger><TabsTrigger value="permissions">Permissions</TabsTrigger></TabsList><TabsContent value="overview">Current training summary and active plan.</TabsContent><TabsContent value="history">Completed sessions remain attached to the person.</TabsContent><TabsContent value="permissions">The person controls organizational access.</TabsContent></Tabs>
          </ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="data-heading">
        <CategoryHeader id="data-display" index="04" title="Data display" description="Compact information that stays readable under pressure." />
        <div className="component-grid">
          <ComponentSection id="badge" title="Badge" description="Short status labels always state their meaning in words." importPath="@allfitone/react/components/badge"><div className="demo-row"><Badge>Active</Badge><Badge variant="secondary">Draft</Badge><Badge variant="outline">Offline</Badge><Badge variant="destructive">Access blocked</Badge></div></ComponentSection>
          <ComponentSection id="card" title="Card" description="Structured composition keeps title, action, content and footer predictable." importPath="@allfitone/react/components/card"><Card><CardHeader><CardTitle>Strength cycle</CardTitle><CardDescription>4-week program · week 2</CardDescription><CardAction><Badge>Active</Badge></CardAction></CardHeader><CardContent><strong className="metric-value">18,420 kg</strong><p className="metric-caption">Volume completed this week</p></CardContent><CardFooter><Button size="sm" variant="ghost">Open program</Button></CardFooter></Card></ComponentSection>
          <ComponentSection id="skeleton" title="Skeleton" description="Decorative loading placeholders respect reduced motion." importPath="@allfitone/react/components/skeleton"><div className="skeleton-stack"><Skeleton className="skeleton-avatar" /><div><Skeleton className="skeleton-line skeleton-line--strong" /><Skeleton className="skeleton-line" /></div></div></ComponentSection>
          <ComponentSection id="empty" title="Empty" description="Empty states explain what happened and provide the next action." importPath="@allfitone/react/components/empty"><Empty className="catalog-empty"><EmptyHeader><EmptyMedia variant="icon"><FoundationIcon name="activity" decorative /></EmptyMedia><EmptyTitle>No sessions yet</EmptyTitle><EmptyDescription>Record the first session to start building this member&apos;s history.</EmptyDescription></EmptyHeader><EmptyContent><Button size="sm"><FoundationIcon name="add" data-icon="inline-start" decorative />Record session</Button></EmptyContent></Empty></ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="overlays-heading">
        <CategoryHeader id="overlays" index="05" title="Overlays" description="Focus enters with intent, stays contained and returns to the trigger." />
        <div className="component-grid">
          <ComponentSection id="dialog" title="Dialog" description="A focused task with discoverable title and dismissal." importPath="@allfitone/react/components/dialog"><Dialog><DialogTrigger render={<Button variant="outline" />}>Edit member</DialogTrigger><DialogContent><DialogHeader><DialogTitle>Edit member</DialogTitle><DialogDescription>Update the display name without changing training history.</DialogDescription></DialogHeader><Field><FieldLabel htmlFor="dialog-name">Display name</FieldLabel><Input id="dialog-name" defaultValue="Alex Morgan" /></Field><DialogFooter showCloseButton><Button>Save changes</Button></DialogFooter></DialogContent></Dialog></ComponentSection>
          <ComponentSection id="alert-dialog" title="AlertDialog" description="Destructive decisions name the consequence before confirmation." importPath="@allfitone/react/components/alert-dialog"><AlertDialog><AlertDialogTrigger render={<Button variant="destructive" />}>Remove access</AlertDialogTrigger><AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Remove organization access?</AlertDialogTitle><AlertDialogDescription>The person keeps their history, but this organization will no longer see it.</AlertDialogDescription></AlertDialogHeader><AlertDialogFooter><AlertDialogCancel>Keep access</AlertDialogCancel><AlertDialogAction variant="destructive">Remove access</AlertDialogAction></AlertDialogFooter></AlertDialogContent></AlertDialog></ComponentSection>
          <ComponentSection id="sheet" title="Sheet" description="Secondary workflows stay connected to the workspace context." importPath="@allfitone/react/components/sheet"><Sheet><SheetTrigger render={<Button variant="outline" />}>Open filters</SheetTrigger><SheetContent><SheetHeader><SheetTitle>Activity filters</SheetTitle><SheetDescription>Narrow the workspace without leaving the current view.</SheetDescription></SheetHeader><div className="sheet-body"><Field><FieldLabel htmlFor="sheet-search">Member</FieldLabel><Input id="sheet-search" placeholder="Search members" /></Field></div><SheetFooter><Button>Apply filters</Button></SheetFooter></SheetContent></Sheet></ComponentSection>
          <ComponentSection id="tooltip" title="Tooltip" description="Supplementary text appears on pointer and keyboard focus." importPath="@allfitone/react/components/tooltip"><Tooltip><TooltipTrigger render={<IconButton aria-label="About activity score" variant="outline" />}><FoundationIcon name="info" decorative /></TooltipTrigger><TooltipContent>Calculated from consistency and training load.</TooltipContent></Tooltip></ComponentSection>
        </div>
      </section>

      <section className="catalog-category" aria-labelledby="feedback-heading">
        <CategoryHeader id="feedback" index="06" title="Feedback" description="Progress and outcomes are announced without stealing focus." />
        <div className="component-grid">
          <ComponentSection id="spinner" title="Spinner" description="A named status indicator composes inside actions and surfaces." importPath="@allfitone/react/components/spinner"><div className="demo-row"><Spinner /><Button disabled><Spinner data-icon="inline-start" label="Saving" />Saving</Button></div></ComponentSection>
          <ComponentSection id="toast" title="Sonner / Toast" description="Polite, textual feedback follows the active ALLFIT ONE theme." importPath="@allfitone/react/components/sonner"><div className="demo-row"><Button onClick={() => toast.success("Session saved", { description: "The member history is up to date." })}>Show success</Button><Button variant="outline" onClick={() => toast.error("Sync failed", { description: "Check the connection and try again." })}>Show error</Button></div></ComponentSection>
        </div>
      </section>
    </div>
  );
}
