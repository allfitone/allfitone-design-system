import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it } from "vitest"

import {
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
} from "../src/components/site-shell.js"

function ProductSite() {
  return (
    <>
      <SiteHeader>
        <SiteHeaderHome href="/es" aria-label="Allfit Studio, inicio">
          Allfit Studio
        </SiteHeaderHome>
        <SiteHeaderNav aria-label="Principal">
          <SiteHeaderLink href="#como-funciona">Cómo funciona</SiteHeaderLink>
          <SiteHeaderLink href="#modulos">Módulos</SiteHeaderLink>
        </SiteHeaderNav>
        <SiteHeaderActions>
          <SiteLanguageSwitch aria-label="Idioma">
            <SiteLanguageLink href="/es" hrefLang="es" lang="es" current>
              ES
            </SiteLanguageLink>
            <SiteLanguageLink href="/en" hrefLang="en" lang="en">
              EN
            </SiteLanguageLink>
          </SiteLanguageSwitch>
          <a href="/entrar">Entrar</a>
        </SiteHeaderActions>
      </SiteHeader>
      <main>
        <SiteContainer>
          <h1>Allfit Studio</h1>
        </SiteContainer>
      </main>
      <SiteFooter>
        <SiteFooterPartner>
          <SiteFooterPartnerText>Allfit One es miembro de NVIDIA Inception.</SiteFooterPartnerText>
          <SiteFooterPartnerLegal lang="en">Trademark notice.</SiteFooterPartnerLegal>
        </SiteFooterPartner>
        <SiteFooterBar>
          <SiteFooterParent href="https://www.allfit.one/es">Allfit One</SiteFooterParent>
          <SiteFooterLinks aria-label="Enlaces">
            <SiteFooterLink href="https://space.allfit.one/es">Allfit Space</SiteFooterLink>
          </SiteFooterLinks>
        </SiteFooterBar>
        <SiteFooterMeta>© 2026 Allfit One</SiteFooterMeta>
      </SiteFooter>
    </>
  )
}

describe("SiteShell", () => {
  afterEach(cleanup)

  it("composes an accessible product-site header and footer", async () => {
    const { container } = render(<ProductSite />)

    expect(screen.getByRole("banner")).toBeInTheDocument()
    expect(screen.getByRole("contentinfo")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Allfit Studio, inicio" }),
    ).toHaveAttribute("href", "/es")

    const sections = screen.getByRole("navigation", { name: "Principal" })
    expect(sections.querySelectorAll("li > a")).toHaveLength(2)

    expect(screen.getByRole("link", { name: "ES" })).toHaveAttribute(
      "aria-current",
      "true",
    )
    expect(screen.getByRole("link", { name: "EN" })).not.toHaveAttribute(
      "aria-current",
    )

    const footerLinks = screen.getByRole("list", { name: "Enlaces" })
    expect(footerLinks.querySelectorAll("li > a")).toHaveLength(1)

    expect(await axe(container)).toHaveNoViolations()
  })

  it("marks the header once the page has scrolled", () => {
    render(<ProductSite />)
    const header = screen.getByRole("banner")
    expect(header).not.toHaveAttribute("data-scrolled")

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 120, configurable: true })
      fireEvent.scroll(window)
    })
    expect(header).toHaveAttribute("data-scrolled", "true")

    act(() => {
      Object.defineProperty(window, "scrollY", { value: 0, configurable: true })
      fireEvent.scroll(window)
    })
    expect(header).not.toHaveAttribute("data-scrolled")
  })

  it("lets a router own navigation through render", () => {
    render(
      <SiteHeaderHome
        aria-label="Inicio"
        render={<a href="/router-home" data-router="true" />}
      />,
    )
    const home = screen.getByRole("link", { name: "Inicio" })
    expect(home).toHaveAttribute("href", "/router-home")
    expect(home).toHaveAttribute("data-slot", "site-header-home")
  })
})
