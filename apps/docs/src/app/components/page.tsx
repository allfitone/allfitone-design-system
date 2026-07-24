import type { Metadata } from "next";
import Link from "next/link";

import { Badge } from "@allfitone/react/components/badge";
import { PulseMark } from "@allfitone/react/components/pulse-mark";
import { FoundationIcon, type IconName } from "@allfitone/react/icons";
import { designSystemVersion } from "@allfitone/react/tokens";

import { ComponentCatalog } from "@/components/component-catalog";
import {
  DesignSystemFooter,
  DesignSystemLayout,
} from "@/components/design-system-shell";
import { MovementSequence } from "@/components/movement-sequence";

export const metadata: Metadata = {
  title: "Components | Allfit One Design System",
  description: "Accessible React components for the Allfit One web ecosystem.",
};

const componentCategories = [
  { code: "ACT", label: "Actions", count: 2, hash: "actions", icon: "add" },
  { code: "NAV", label: "Navigation", count: 6, hash: "navigation", icon: "menu" },
  { code: "FRM", label: "Forms", count: 4, hash: "forms", icon: "edit" },
  { code: "SEL", label: "Selection", count: 5, hash: "selection", icon: "check" },
  { code: "DAT", label: "Data display", count: 4, hash: "data-display", icon: "business" },
  { code: "SIG", label: "Signature", count: 5, hash: "signature", icon: "activity" },
  { code: "OVR", label: "Overlays", count: 4, hash: "overlays", icon: "panel" },
  { code: "FDB", label: "Feedback", count: 2, hash: "feedback", icon: "info" },
] as const satisfies ReadonlyArray<{
  code: string;
  label: string;
  count: number;
  hash: string;
  icon: IconName;
}>;

export default function ComponentsPage() {
  return (
    <DesignSystemLayout
      current="components"
      id="overview"
      className="design-system-workspace component-guide"
      label="Components"
      homeHref="#overview"
      topHref="#overview"
      skipHref="#catalog-content"
      skipLabel="Skip to component catalog"
    >
      <div id="catalog-content" className="design-system-content component-guide__content">
        <section className="component-overview">
          <div className="component-overview__copy">
            <div className="component-overview__eyebrow">
              <PulseMark />
              <span>Allfit One / React system</span>
            </div>
            <h1>Components</h1>
            <p className="component-overview__thesis">Built to hold up under pressure.</p>
            <p>
              Inspect behavior, keyboard states, responsive pressure, and the exact public import before a component enters the product.
            </p>
            <div className="guide-overview__links">
              <a href="#actions">Enter the catalog</a>
              <Link href="/ui-foundation">Review foundations <FoundationIcon name="external" decorative /></Link>
            </div>
          </div>

          <nav className="component-manifest" aria-label="Component categories">
            <header className="component-manifest__header">
              <div>
                <span className="component-manifest__pulse" aria-hidden="true" />
                <span>Library manifest</span>
              </div>
              <Badge variant="outline">v{designSystemVersion}</Badge>
            </header>
            <div className="component-manifest__list">
              {componentCategories.map((category) => (
                <a key={category.code} href={`#${category.hash}`}>
                  <FoundationIcon name={category.icon} decorative />
                  <span className="component-manifest__code">{category.code}</span>
                  <strong>{category.label}</strong>
                  <span className="component-manifest__count">{String(category.count).padStart(2, "0")}</span>
                  <FoundationIcon name="forward" decorative />
                </a>
              ))}
            </div>
            <dl className="component-manifest__contract">
              <div><dt>Target</dt><dd>44 px</dd></div>
              <div><dt>Baseline</dt><dd>WCAG 2.2 AA</dd></div>
              <div><dt>Runtime</dt><dd>React 19</dd></div>
            </dl>
          </nav>
        </section>

        <section className="component-guide__contract" aria-labelledby="contract-preview-title">
          <div className="component-guide__contract-heading">
            <div className="component-guide__contract-index">
              <PulseMark width={48} />
              <p>Behavior before polish</p>
            </div>
            <div>
              <Badge variant="code">A11Y</Badge>
              <h2 id="contract-preview-title">Interaction contract</h2>
              <p>Every component exposes its state, preserves keyboard intent, and names the outcome before it enters product composition.</p>
            </div>
          </div>
          <MovementSequence />
        </section>

        <ComponentCatalog />

        <DesignSystemFooter label="React components" />
      </div>
    </DesignSystemLayout>
  );
}
