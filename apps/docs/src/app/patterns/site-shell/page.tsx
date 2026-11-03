import type { Metadata } from "next"

import { ProductLockup } from "@allfitone/react/brand"
import { buttonVariants } from "@allfitone/react/components/button"
import {
  SiteContainer,
  SiteFooter,
  SiteFooterBar,
  SiteFooterLink,
  SiteFooterLinks,
  SiteFooterMeta,
  SiteFooterParent,
  SiteHeader,
  SiteHeaderActions,
  SiteHeaderHome,
  SiteHeaderLink,
  SiteHeaderNav,
  SiteLanguageLink,
  SiteLanguageSwitch,
} from "@allfitone/react/components/site-shell"
import { ExternalIcon } from "@allfitone/react/icons"

export const metadata: Metadata = {
  title: "Site shell pattern | Allfit One Design System",
  description:
    "Shared header and footer for Allfit product sites on dark and light surfaces.",
}

/**
 * One page per surface would hide the point: it is the same component. The
 * Space header is fixed, as on the real site; the Studio one is shown in place
 * below it, so both can be compared on one screen.
 */
export default function SiteShellPatternPage() {
  return (
    <div className="min-h-svh">
      <section data-afo-theme="dark" className="bg-background pb-24 text-foreground">
        <SiteHeader>
          <SiteHeaderHome href="#space" aria-label="Allfit Space, inicio">
            <ProductLockup product="space" surface="dark" aria-hidden="true" />
          </SiteHeaderHome>
          <SiteHeaderNav aria-label="Secciones de Allfit Space">
            <SiteHeaderLink href="#space">La app</SiteHeaderLink>
            <SiteHeaderLink href="#space">Programas</SiteHeaderLink>
            <SiteHeaderLink href="#space">Privacidad</SiteHeaderLink>
          </SiteHeaderNav>
          <SiteHeaderActions>
            <SiteLanguageSwitch aria-label="Idioma">
              <SiteLanguageLink href="#space" hrefLang="es" lang="es" current>
                ES
              </SiteLanguageLink>
              <SiteLanguageLink href="#space" hrefLang="en" lang="en">
                EN
              </SiteLanguageLink>
            </SiteLanguageSwitch>
          </SiteHeaderActions>
        </SiteHeader>
        <SiteContainer id="space" className="pt-40">
          <h1 className="m-0 font-display text-6xl font-bold uppercase">Site shell</h1>
          <p className="mt-4 max-w-xl text-muted-foreground">
            The same header and footer on Allfit Space (dark) and Allfit Studio
            (light). Products supply the lockup, sections, languages and action.
          </p>
        </SiteContainer>
      </section>

      <section
        data-afo-theme="light"
        className="bg-[var(--afo-color-background-surface)] text-foreground"
        aria-label="Allfit Studio"
      >
        <SiteHeader className="relative">
          <SiteHeaderHome href="#studio" aria-label="Allfit Studio, inicio">
            <ProductLockup product="studio" surface="light" aria-hidden="true" />
          </SiteHeaderHome>
          <SiteHeaderNav aria-label="Secciones de Allfit Studio">
            <SiteHeaderLink href="#studio">Cómo funciona</SiteHeaderLink>
            <SiteHeaderLink href="#studio">Módulos</SiteHeaderLink>
          </SiteHeaderNav>
          <SiteHeaderActions>
            <a
              data-slot="button"
              data-variant="outline"
              className={buttonVariants({ variant: "outline" })}
              href="#studio"
            >
              Entrar
            </a>
          </SiteHeaderActions>
        </SiteHeader>
        <SiteContainer id="studio" className="py-24" />
        <SiteFooter>
          <SiteFooterBar>
            <SiteFooterParent href="#studio">
              Allfit One
              <ExternalIcon size="sm" decorative />
            </SiteFooterParent>
            <SiteFooterLinks aria-label="Productos">
              <SiteFooterLink href="#space">Allfit Space</SiteFooterLink>
            </SiteFooterLinks>
          </SiteFooterBar>
          <SiteFooterMeta>© 2026 Allfit One</SiteFooterMeta>
        </SiteFooter>
      </section>
    </div>
  )
}
