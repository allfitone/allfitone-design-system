"use client";

import { useState } from "react";

import { IconButton } from "@allfitone/react/components/icon-button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@allfitone/react/components/sheet";
import { FoundationIcon } from "@allfitone/react/icons";

const foundations = [
  { code: "COL", label: "Color", id: "color" },
  { code: "TYP", label: "Typography", id: "type" },
  { code: "ICO", label: "Iconography", id: "icons" },
  { code: "SPC", label: "Spacing", id: "space" },
  { code: "RAD", label: "Radius", id: "radius" },
  { code: "SHD", label: "Shadow", id: "shadow" },
  { code: "MOT", label: "Motion", id: "motion" },
  { code: "APL", label: "Applied sample", id: "applied" },
] as const;

export function FoundationIndex() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<IconButton className="foundation-index__trigger" aria-label="Open foundation index" variant="outline" />}>
        <FoundationIcon name="menu" decorative />
      </SheetTrigger>
      <SheetContent className="catalog-index foundation-index" side="right">
        <SheetHeader>
          <SheetTitle>Foundation index</SheetTitle>
          <SheetDescription>Jump directly to a token family or applied sample.</SheetDescription>
        </SheetHeader>
        <nav className="catalog-index__nav foundation-index__nav" aria-label="Mobile foundation index">
          {foundations.map((foundation) => (
            <a key={foundation.id} className="catalog-index__category" href={`#${foundation.id}`} onClick={() => setOpen(false)}>
              <span>{foundation.code}</span>{foundation.label}
            </a>
          ))}
          <a className="catalog-index__category" href="/components" onClick={() => setOpen(false)}>
            <span>CMP</span>Components
          </a>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
