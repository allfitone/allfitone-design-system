"use client";

import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";

import { BrandLockup } from "@allfitone/react/brand";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@allfitone/react/components/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@allfitone/react/components/sidebar";
import { FoundationIcon, type IconName } from "@allfitone/react/icons";

import { ThemeToggle } from "@/components/theme-toggle";

type GuideSection = "foundations" | "components";

type Chapter = {
  id: GuideSection;
  label: string;
  href: string;
  icon: IconName;
  sections: readonly {
    code: string;
    label: string;
    hash: string;
  }[];
};

const chapters: readonly Chapter[] = [
  {
    id: "foundations",
    label: "UI Foundation",
    href: "/ui-foundation",
    icon: "overview",
    sections: [
      { code: "OVR", label: "Overview", hash: "overview" },
      { code: "BRD", label: "Brand assets", hash: "brand-assets" },
      { code: "COL", label: "Color", hash: "color" },
      { code: "TYP", label: "Typography", hash: "type" },
      { code: "ICO", label: "Iconography", hash: "icons" },
      { code: "SPC", label: "Spacing", hash: "space" },
      { code: "RAD", label: "Radius", hash: "radius" },
      { code: "SHD", label: "Shadow", hash: "shadow" },
      { code: "MOT", label: "Motion", hash: "motion" },
      { code: "APL", label: "Applied sample", hash: "applied" },
    ],
  },
  {
    id: "components",
    label: "Components",
    href: "/components",
    icon: "operation",
    sections: [
      { code: "OVR", label: "Overview", hash: "catalog-top" },
      { code: "ACT", label: "Actions", hash: "actions" },
      { code: "NAV", label: "Navigation", hash: "navigation" },
      { code: "FRM", label: "Forms", hash: "forms" },
      { code: "SEL", label: "Selection", hash: "selection" },
      { code: "DAT", label: "Data display", hash: "data-display" },
      { code: "SIG", label: "Signature", hash: "signature" },
      { code: "OVR", label: "Overlays", hash: "overlays" },
      { code: "FDB", label: "Feedback", hash: "feedback" },
    ],
  },
];

const guideMeta = {
  foundations: {
    eyebrow: "UI Foundation",
    title: "Core reference",
    meta: "Web + native · v0.1",
  },
  components: {
    eyebrow: "Component library",
    title: "React reference",
    meta: "Accessible · v0.1",
  },
} as const;

function AdaptiveBrandLockup() {
  return (
    <span className="brand-lockup" aria-hidden="true">
      <BrandLockup className="brand-lockup__asset brand-lockup__asset--dark" surface="dark" />
      <BrandLockup className="brand-lockup__asset brand-lockup__asset--light" surface="light" />
    </span>
  );
}

function chapterSectionHref(chapter: Chapter, hash: string, current: GuideSection) {
  return chapter.id === current ? `#${hash}` : `${chapter.href}#${hash}`;
}

function DesignSystemSidebar({ current }: { current: GuideSection }) {
  const currentMeta = guideMeta[current];
  const { isMobile, setOpenMobile } = useSidebar();
  const closeMobileNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };
  const overviewHref = current === "foundations" ? "#overview" : "#catalog-top";

  return (
    <Sidebar className="design-system-sidebar" aria-label="Design system navigation">
      <div className="design-system-sidebar__signal" aria-hidden="true">
        <span /><span /><span /><span /><span />
      </div>

      <SidebarHeader className="design-system-sidebar__header">
        <Link className="design-system-sidebar__brand" href="/ui-foundation" aria-label="Allfit One Design System home">
          <AdaptiveBrandLockup />
          <span>Design system</span>
        </Link>

        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="design-system-sidebar__edition"
              size="lg"
              variant="outline"
              isActive
              render={<a href={overviewHref} onClick={closeMobileNavigation} />}
            >
              <span className="design-system-sidebar__edition-mark" aria-hidden="true">
                <FoundationIcon name={current === "foundations" ? "overview" : "operation"} decorative />
              </span>
              <span className="design-system-sidebar__edition-copy">
                <small>{currentMeta.eyebrow}</small>
                <strong>{currentMeta.title}</strong>
                <small>{currentMeta.meta}</small>
              </span>
              <FoundationIcon name="forward" decorative />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Reference</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chapters.map((chapter) => {
                const isCurrent = chapter.id === current;

                return (
                  <Collapsible
                    key={chapter.id}
                    className="design-system-sidebar__collapsible"
                    defaultOpen={isCurrent}
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger
                        render={
                          <SidebarMenuButton
                            className="design-system-sidebar__chapter"
                            isActive={isCurrent}
                          />
                        }
                      >
                        <FoundationIcon name={chapter.icon} decorative />
                        <span>{chapter.label}</span>
                        <FoundationIcon
                          className="design-system-sidebar__chapter-chevron"
                          name="expand"
                          decorative
                        />
                      </CollapsibleTrigger>

                      <CollapsibleContent className="design-system-sidebar__collapsible-content">
                        <SidebarMenuSub>
                          {chapter.sections.map((section) => (
                            <SidebarMenuSubItem key={section.hash}>
                              <SidebarMenuSubButton
                                className="design-system-sidebar__subsection"
                                render={<a href={chapterSectionHref(chapter, section.hash, current)} onClick={closeMobileNavigation} />}
                                size="sm"
                              >
                                <span>{section.code}</span>
                                <span>{section.label}</span>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Resources</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton render={<a href="/design/ink-and-signal.html" onClick={closeMobileNavigation} />}>
                  <FoundationIcon name="activity" decorative />
                  <span>Ink &amp; Signal</span>
                  <FoundationIcon name="external" decorative />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="design-system-sidebar__footer">
        <ThemeToggle />
        <span>Allfit One system</span>
      </SidebarFooter>
    </Sidebar>
  );
}

function DesignSystemMobileHeader({ label, homeHref }: { label: string; homeHref: string }) {
  return (
    <header className="design-system-mobile-header">
      <Link className="brand" href={homeHref} aria-label={`Allfit One ${label} home`}>
        <AdaptiveBrandLockup />
        <i>{label}</i>
      </Link>
      <div className="catalog-toolbar">
        <ThemeToggle />
        <SidebarTrigger aria-label="Open design system navigation" />
      </div>
    </header>
  );
}

export function DesignSystemLayout({
  current,
  id,
  className,
  label,
  homeHref,
  skipHref,
  skipLabel,
  children,
}: {
  current: GuideSection;
  id: string;
  className: string;
  label: string;
  homeHref: string;
  skipHref: string;
  skipLabel: string;
  children: ReactNode;
}) {
  return (
    <SidebarProvider
      className="design-system-shell"
      style={{ "--sidebar-width": "17.5rem" } as CSSProperties}
    >
      <a className="skip-link" href={skipHref}>{skipLabel}</a>
      <DesignSystemSidebar current={current} />
      <SidebarInset as="main" id={id} className={className}>
        <DesignSystemMobileHeader label={label} homeHref={homeHref} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}

export function DesignSystemFooter({ label, topHref }: { label: string; topHref: string }) {
  return (
    <footer className="guide-footer">
      <div className="brand"><AdaptiveBrandLockup /></div>
      <p>{label} / v0.1</p>
      <a href={topHref}>Back to top ↑</a>
    </footer>
  );
}
