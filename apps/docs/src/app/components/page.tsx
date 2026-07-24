import type { Metadata } from "next";
import Link from "next/link";

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

export default function ComponentsPage() {
  return (
    <DesignSystemLayout
      current="components"
      id="catalog-top"
      className="design-system-workspace component-guide"
      label="Components"
      homeHref="#catalog-top"
      skipHref="#catalog-content"
      skipLabel="Skip to component catalog"
    >
      <div id="catalog-content" className="design-system-content component-guide__content">
          <section className="component-overview">
            <div className="component-overview__copy">
              <p className="eyebrow">Allfit One / Component library</p>
              <h1>Components</h1>
              <p>
                Production-ready React building blocks for Allfit OS. Browse by purpose, inspect real states, and use each component contract as the implementation baseline.
              </p>
              <div className="guide-overview__links">
                <a href="#actions">Browse components</a>
                <Link href="/ui-foundation">Review foundations <span aria-hidden="true">↗</span></Link>
              </div>
            </div>

            <aside className="guide-overview__reference" aria-label="Component library reference">
              <div className="guide-overview__status"><span />Library is current</div>
              <dl>
                <div><dt>Runtime</dt><dd>React 19</dd></div>
                <div><dt>Categories</dt><dd>8 groups</dd></div>
                <div><dt>Entries</dt><dd>32 references</dd></div>
                <div><dt>Base target</dt><dd>44 px</dd></div>
              </dl>
            </aside>
          </section>

          <section className="component-guide__contract" aria-labelledby="contract-preview-title">
            <div className="component-guide__contract-heading">
              <div>
                <p className="section-index">A11Y</p>
                <h2 id="contract-preview-title">Interaction contract</h2>
              </div>
              <p>Every component documents default, hover, focus and disabled behavior before product composition.</p>
            </div>
            <MovementSequence />
          </section>

          <ComponentCatalog />

        <DesignSystemFooter label="React components" topHref="#catalog-top" />
      </div>
    </DesignSystemLayout>
  );
}
