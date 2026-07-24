"use client";

import { useState } from "react";

import { IconButton } from "@allfitone/react/components/icon-button";
import { Input } from "@allfitone/react/components/input";
import { Label } from "@allfitone/react/components/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@allfitone/react/components/sheet";
import { FoundationIcon } from "@allfitone/react/icons";

const catalog = [
  { code: "ACT", label: "Actions", id: "actions", items: ["Button", "IconButton"] },
  { code: "NAV", label: "Navigation", id: "navigation", items: ["Breadcrumb", "NavigationMenu", "DropdownMenu", "Pagination", "Drawer", "WorkspaceShell"] },
  { code: "FRM", label: "Forms", id: "forms", items: ["Label", "Input", "Textarea", "Field"] },
  { code: "SEL", label: "Selection", id: "selection", items: ["Checkbox", "RadioGroup", "Switch", "Select", "Tabs"] },
  { code: "DAT", label: "Data display", id: "data-display", items: ["Badge", "Card", "Skeleton", "Empty"] },
  { code: "SIG", label: "Signature", id: "signature", items: ["AccentBlock", "StatStrip", "TickRing", "PulseMark"] },
  { code: "OVR", label: "Overlays", id: "overlays", items: ["Dialog", "AlertDialog", "Sheet", "Tooltip"] },
  { code: "FDB", label: "Feedback", id: "feedback", items: ["Spinner", "Toast"] },
] as const;

const toId = (name: string) => name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();

export function CatalogIndex() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visible = catalog
    .map((category) => ({
      ...category,
      items: category.items.filter((item) => !normalized || item.toLowerCase().includes(normalized) || category.label.toLowerCase().includes(normalized)),
    }))
    .filter((category) => category.items.length > 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<IconButton className="catalog-index__trigger" aria-label="Open component index" variant="outline" />}>
        <FoundationIcon name="menu" decorative />
      </SheetTrigger>
      <SheetContent className="catalog-index" side="right">
        <SheetHeader>
          <SheetTitle>Component index</SheetTitle>
          <SheetDescription>Jump directly to a category or component.</SheetDescription>
        </SheetHeader>
        <div className="catalog-index__search">
          <Label htmlFor="component-search">Find a component</Label>
          <Input id="component-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Button, dialog, field..." />
        </div>
        <nav className="catalog-index__nav" aria-label="Mobile component index">
          {visible.map((category) => (
            <section key={category.id}>
              <a className="catalog-index__category" href={`#${category.id}`} onClick={() => setOpen(false)}>
                <span>{category.code}</span>{category.label}
              </a>
              <div>
                {category.items.map((item) => (
                  <a key={item} href={`#${toId(item)}`} onClick={() => setOpen(false)}>
                    {item === "Toast" ? "Sonner / Toast" : item}
                  </a>
                ))}
              </div>
            </section>
          ))}
          {visible.length === 0 && <p>No components match “{query}”.</p>}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
