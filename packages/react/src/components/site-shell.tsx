"use client"

import * as React from "react"
import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"

import { cn } from "../lib/utils.js"

/*
 * The public chrome shared by Allfit product sites (space.allfit.one,
 * studio.allfit.one): a fixed header and a closing footer.
 *
 * Nothing here picks a surface. Every colour is a semantic token, so the same
 * header reads as Space on `data-afo-theme="dark"` and as Studio on
 * `data-afo-theme="light"`. Products bring their own lockup, copy, routes and
 * actions; links accept `render` so a framework router can own navigation.
 */

/** The content column every region of a product site lines up with. */
const siteColumn =
  "mx-auto w-[min(81rem,calc(100%_-_2*clamp(1.25rem,5vw,4.5rem)))]"

function SiteContainer({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-container"
      className={cn(siteColumn, className)}
      {...props}
    />
  )
}

/** Past this many pixels of scroll the header gains its backdrop. */
const SCROLLED_THRESHOLD = 24

function SiteHeader({
  className,
  children,
  ...props
}: React.ComponentProps<"header">) {
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const update = () => setScrolled(window.scrollY > SCROLLED_THRESHOLD)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <header
      data-slot="site-header"
      data-scrolled={scrolled ? "true" : undefined}
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b border-transparent text-foreground",
        "transition-[background-color,border-color,backdrop-filter] duration-[var(--afo-motion-transition-duration)] ease-[var(--afo-motion-transition-easing)] motion-reduce:transition-none",
        "data-[scrolled=true]:border-border data-[scrolled=true]:bg-[color-mix(in_srgb,var(--afo-site-surface,var(--background))_86%,transparent)] data-[scrolled=true]:backdrop-blur-lg data-[scrolled=true]:backdrop-saturate-150",
        "forced-colors:data-[scrolled=true]:bg-[Canvas]",
        className,
      )}
      {...props}
    >
      <div
        data-slot="site-header-bar"
        className={cn(siteColumn, "flex h-21 items-center justify-between gap-6")}
      >
        {children}
      </div>
    </header>
  )
}

/** The product lockup, linking home. Give it an accessible name. */
function SiteHeaderHome({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "inline-flex min-h-11 shrink-0 items-center rounded-md [&_svg]:h-8 [&_svg]:w-auto [&_img]:h-8 [&_img]:w-auto",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "site-header-home" },
  })
}

/** Section links. They step aside below 960px, where the page itself is the menu. */
function SiteHeaderNav({
  className,
  children,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="site-header-nav"
      className={cn("ml-auto hidden min-[60rem]:block", className)}
      {...props}
    >
      <ul className="m-0 flex list-none items-center gap-8 p-0">{children}</ul>
    </nav>
  )
}

function SiteHeaderLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  const link = useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "relative inline-flex min-h-11 items-center text-[0.9375rem] font-medium text-foreground no-underline opacity-85 transition-opacity hover:opacity-100",
          "after:absolute after:inset-x-0 after:bottom-2 after:h-[1.5px] after:origin-right after:scale-x-0 after:bg-[var(--afo-color-border-accent)] after:transition-transform after:duration-[var(--afo-motion-enter-duration)] after:ease-[var(--afo-motion-enter-easing)] after:content-['']",
          "hover:after:origin-left hover:after:scale-x-100 motion-reduce:after:transition-none",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "site-header-link" },
  })
  return <li className="flex">{link}</li>
}

/** Language switch and the product's own action sit together at the end. */
function SiteHeaderActions({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-header-actions"
      className={cn("ml-auto flex items-center gap-4 min-[60rem]:ml-8 min-[60rem]:gap-6", className)}
      {...props}
    />
  )
}

/** A segmented switch; each option opens the same page in another language. */
function SiteLanguageSwitch({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  return (
    <nav
      data-slot="site-language-switch"
      className={cn(
        "inline-flex rounded-full border border-[color-mix(in_srgb,var(--foreground)_22%,transparent)] p-1",
        className,
      )}
      {...props}
    />
  )
}

function SiteLanguageLink({
  className,
  render,
  current = false,
  ...props
}: useRender.ComponentProps<"a"> & { current?: boolean }) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        "aria-current": current ? "true" : undefined,
        className: cn(
          "grid min-h-11 min-w-11 place-items-center rounded-full px-2.5 text-[0.8125rem] font-bold tracking-[0.08em] text-muted-foreground no-underline transition-colors hover:text-foreground",
          "aria-[current=true]:bg-foreground aria-[current=true]:text-background",
          "forced-colors:aria-[current=true]:bg-[Highlight] forced-colors:aria-[current=true]:text-[HighlightText]",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "site-language-link" },
  })
}

function SiteFooter({ className, ...props }: React.ComponentProps<"footer">) {
  return (
    <footer
      data-slot="site-footer"
      className={cn("border-t border-border text-foreground", className)}
      {...props}
    />
  )
}

/** A centred partner credit: the product passes the badge image and copy. */
function SiteFooterPartner({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-partner"
      className={cn(
        siteColumn,
        "grid justify-items-center gap-6 py-16 text-center [&_img]:h-auto [&_img]:w-50",
        className,
      )}
      {...props}
    />
  )
}

function SiteFooterPartnerText({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="site-footer-partner-text"
      className={cn("m-0 text-xl font-semibold text-balance", className)}
      {...props}
    />
  )
}

function SiteFooterPartnerLegal({
  className,
  ...props
}: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="site-footer-partner-legal"
      className={cn(
        "m-0 mt-2 max-w-[70ch] text-[0.8125rem] leading-relaxed text-balance text-muted-foreground",
        className,
      )}
      {...props}
    />
  )
}

function SiteFooterBar({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="site-footer-bar"
      className={cn(
        siteColumn,
        "flex flex-wrap items-center justify-between gap-6 py-10",
        className,
      )}
      {...props}
    />
  )
}

/** The way back to Allfit One, as a quiet ghost action aligned to the column. */
function SiteFooterParent({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  return useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "-ms-3.5 inline-flex min-h-11 items-center gap-1.5 rounded-[var(--afo-radius-action)] px-3.5 text-xs whitespace-nowrap text-foreground no-underline transition-colors hover:bg-[var(--afo-color-action-secondary-hover)]",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "site-footer-parent" },
  })
}

function SiteFooterLinks({
  className,
  children,
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      data-slot="site-footer-links"
      className={cn(
        "m-0 flex list-none flex-wrap items-center gap-x-7 gap-y-2 p-0 text-sm text-muted-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </ul>
  )
}

function SiteFooterLink({
  className,
  render,
  ...props
}: useRender.ComponentProps<"a">) {
  const link = useRender({
    defaultTagName: "a",
    props: mergeProps<"a">(
      {
        className: cn(
          "inline-flex min-h-11 items-center gap-1.5 text-inherit no-underline transition-colors hover:text-foreground",
          className,
        ),
      },
      props,
    ),
    render,
    state: { slot: "site-footer-link" },
  })
  return <li>{link}</li>
}

/** The closing line, centred and last. */
function SiteFooterMeta({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="site-footer-meta"
      className={cn(
        siteColumn,
        "my-0 border-t border-border py-6 text-center text-[0.6875rem] font-bold tracking-[0.16em] text-muted-foreground uppercase",
        className,
      )}
      {...props}
    />
  )
}

export {
  SiteContainer,
  SiteFooter,
  SiteFooterBar,
  SiteFooterLink,
  SiteFooterLinks,
  SiteFooterMeta,
  SiteFooterParent,
  SiteFooterPartner,
  SiteFooterPartnerLegal,
  SiteFooterPartnerText,
  SiteHeader,
  SiteHeaderActions,
  SiteHeaderHome,
  SiteHeaderLink,
  SiteHeaderNav,
  SiteLanguageLink,
  SiteLanguageSwitch,
}
