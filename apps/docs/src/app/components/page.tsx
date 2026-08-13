import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";

import { Badge } from "@allfitone/react/components/badge";
import { PulseMark } from "@allfitone/react/components/pulse-mark";
import { FoundationIcon } from "@allfitone/react/icons";

import {
  ComponentIndex,
  LegacyCatalogHashRedirect,
} from "@/components/component-explorer-tools";
import {
  DesignSystemFooter,
  DesignSystemLayout,
} from "@/components/design-system-shell";
import { MovementSequence } from "@/components/movement-sequence";

export const metadata: Metadata = {
  title: "Components | Allfit One Design System",
  description: "Accessible React components for the Allfit One web ecosystem.",
};

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
      <LegacyCatalogHashRedirect />
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

          <Suspense fallback={<div className="component-manifest component-index" aria-hidden="true" />}>
            <ComponentIndex />
          </Suspense>
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

        <DesignSystemFooter label="React components" />
      </div>
    </DesignSystemLayout>
  );
}
