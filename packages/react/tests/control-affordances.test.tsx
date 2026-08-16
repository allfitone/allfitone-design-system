/**
 * Controls that can render as an anchor must not inherit the user agent's link
 * underline. The published stylesheet ships without Tailwind's preflight, so
 * nothing resets `text-decoration` for us: every control variant that a product
 * may hand an `<a>` has to opt out explicitly, or the same action looks
 * different depending on whether it navigates.
 *
 * The sidebar collapse tests cover the second gap: between the mobile
 * breakpoint and a comfortable desktop width the expanded sidebar takes a fifth
 * of the viewport away from the content it frames.
 */
import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";

import { Button, buttonVariants } from "../src/components/button.js";
import {
  Sidebar,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "../src/components/sidebar.js";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "../src/components/navigation-menu.js";

function setViewportWidth(width: number) {
  Object.defineProperty(window, "innerWidth", {
    configurable: true,
    writable: true,
    value: width,
  });
  Object.defineProperty(window, "matchMedia", {
    configurable: true,
    value: (query: string) => {
      const max = /max-width:\s*(\d+)px/.exec(query);
      return {
        matches: max ? width <= Number(max[1]) : false,
        media: query,
        onchange: null,
        addEventListener: () => {},
        removeEventListener: () => {},
        addListener: () => {},
        removeListener: () => {},
        dispatchEvent: () => false,
      } as unknown as MediaQueryList;
    },
  });
}

function SidebarStateProbe() {
  const { state } = useSidebar();
  return <span data-testid="sidebar-state">{state}</span>;
}

afterEach(() => {
  cleanup();
  setViewportWidth(1440);
});

describe("controls rendered as anchors", () => {
  it("does not underline a link that carries button styling", () => {
    render(
      <a href="/team" className={buttonVariants()}>
        Invite a member
      </a>,
    );

    expect(screen.getByRole("link", { name: "Invite a member" })).toHaveClass("no-underline");
  });

  it("keeps the underline affordance on the link variant", () => {
    const classes = buttonVariants({ variant: "link" });

    expect(classes).toContain("hover:underline");
    expect(classes).toContain("text-[var(--afo-color-text-accent)]");
  });

  it("does not underline a sidebar destination", () => {
    render(
      <SidebarProvider>
        <Sidebar>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton render={<a href="/team">Team</a>}>Team</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </Sidebar>
      </SidebarProvider>,
    );

    expect(screen.getByRole("link", { name: "Team" })).toHaveClass("no-underline");
  });

  it("does not underline a navigation menu destination", () => {
    render(
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink render={<a href="/roles">Roles</a>}>Roles</NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>,
    );

    expect(screen.getByRole("link", { name: "Roles" })).toHaveClass("no-underline");
  });
});

describe("sidebar collapse below a comfortable width", () => {
  it("forwards mobile element props and theme to the portaled panel", async () => {
    setViewportWidth(390);
    const user = userEvent.setup();

    render(
      <SidebarProvider>
        <SidebarTrigger aria-label="Open navigation" />
        <Sidebar
          className="product-sidebar"
          data-afo-theme="dark"
          data-product="studio"
          style={{ opacity: 0.9 }}
        >
          Navigation
        </Sidebar>
      </SidebarProvider>,
    );

    await user.click(screen.getByRole("button", { name: "Open navigation" }));
    const panel = document.querySelector('[data-slot="sidebar"][data-mobile="true"]');

    expect(panel).toHaveClass("product-sidebar");
    expect(panel).toHaveAttribute("data-afo-theme", "dark");
    expect(panel).toHaveAttribute("data-product", "studio");
    expect(panel).toHaveStyle({ opacity: "0.9" });
  });

  it("starts collapsed when the viewport is narrower than collapseBelow", () => {
    setViewportWidth(1024);

    render(
      <SidebarProvider collapseBelow={1100}>
        <SidebarStateProbe />
      </SidebarProvider>,
    );

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("collapsed");
  });

  it("stays expanded at the same width when the product does not opt in", () => {
    setViewportWidth(1024);

    render(
      <SidebarProvider>
        <SidebarStateProbe />
      </SidebarProvider>,
    );

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
  });

  it("stays expanded above collapseBelow", () => {
    setViewportWidth(1440);

    render(
      <SidebarProvider collapseBelow={1100}>
        <SidebarStateProbe />
      </SidebarProvider>,
    );

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
  });

  it("leaves a controlled sidebar under the product's control", () => {
    setViewportWidth(1024);

    render(
      <SidebarProvider collapseBelow={1100} open onOpenChange={() => {}}>
        <SidebarStateProbe />
      </SidebarProvider>,
    );

    expect(screen.getByTestId("sidebar-state")).toHaveTextContent("expanded");
  });
});

describe("button still behaves as a button", () => {
  it("keeps its accessible role and label", () => {
    render(<Button>Save</Button>);

    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });
});
