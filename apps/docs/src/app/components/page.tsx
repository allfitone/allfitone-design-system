import type { Metadata } from "next";
import Link from "next/link";

import { BrandLockup } from "@allfitone/react/brand";

import { ComponentCatalog } from "@/components/component-catalog";
import { ThemeToggle } from "@/components/theme-toggle";

export const metadata: Metadata = {
  title: "Components | Allfit One Design System",
  description: "Accessible React components for the Allfit One web ecosystem.",
};

export default function ComponentsPage() {
  return (
    <main className="catalog-page" id="catalog-top">
      <header className="topbar page-shell catalog-topbar">
        <Link className="brand" href="/" aria-label="Back to Allfit One foundations">
          <span className="brand-lockup" aria-hidden="true">
            <BrandLockup className="brand-lockup__asset brand-lockup__asset--dark" surface="dark" />
            <BrandLockup className="brand-lockup__asset brand-lockup__asset--light" surface="light" />
          </span>
          <i>COMPONENTS</i>
        </Link>
        <nav aria-label="Component categories">
          <a href="#actions">Actions</a>
          <a href="#forms">Forms</a>
          <a href="#selection">Selection</a>
          <a href="#data-display">Data</a>
          <a href="#overlays">Overlays</a>
          <a href="#feedback">Feedback</a>
        </nav>
        <ThemeToggle />
      </header>

      <section className="catalog-hero page-shell">
        <div>
          <p className="eyebrow">React / Base UI / Accessible by default</p>
          <h1>Controls built<br />for <em>movement.</em></h1>
          <p className="catalog-hero__description">
            Production primitives for Allfit OS. Every state, target and focus path is part of the contract.
          </p>
        </div>
        <dl className="catalog-status" aria-label="Component library status">
          <div><dt>Components</dt><dd>21</dd></div>
          <div><dt>Target</dt><dd>44 PX</dd></div>
          <div><dt>Baseline</dt><dd>WCAG AA</dd></div>
        </dl>
      </section>

      <ComponentCatalog />

      <footer className="catalog-footer page-shell">
        <span>ALLFIT ONE / WEB COMPONENTS</span>
        <a href="#catalog-top">Back to top</a>
      </footer>
    </main>
  );
}
