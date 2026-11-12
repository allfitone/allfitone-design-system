import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../src/components/card.js";

/**
 * A card drops its own bottom padding when it has a footer, because the footer
 * supplies its own. The rule has to look at the card's *children*: written as a
 * descendant match it fired on any card that merely contained one, however
 * deep, so an outer card lost its padding because something nested inside it
 * had a footer.
 *
 * These assert the class rather than the rendered padding on purpose. The rule
 * is a selector, Tailwind emits it at build time, and jsdom applies no
 * stylesheet — so the class list is where the contract actually lives here. The
 * emitted CSS is `:has(>[data-slot=card-footer]){padding-bottom:0}`.
 */
describe("Card", () => {
  it("looks for a footer among its own children, not anywhere beneath it", () => {
    render(
      <Card data-testid="outer">
        <CardHeader>
          <CardTitle>Lo que te autorizó</CardTitle>
        </CardHeader>
        <CardContent>
          <Card data-testid="inner">
            <CardContent>Her training</CardContent>
            <CardFooter>See the profile</CardFooter>
          </Card>
        </CardContent>
      </Card>,
    );

    const outer = screen.getByTestId("outer");
    expect(outer.className).toContain("has-[>[data-slot=card-footer]]:pb-0");
    // The descendant form is the defect: it matches the inner card's footer
    // from the outer card and takes the outer card's padding away.
    expect(outer.className).not.toContain("has-data-[slot=card-footer]:pb-0");
  });

  it("gives a card and a small card the same footer rule", () => {
    const { rerender } = render(<Card data-testid="card" />);
    const rule = "has-[>[data-slot=card-footer]]:pb-0";
    expect(screen.getByTestId("card").className).toContain(rule);

    rerender(<Card data-testid="card" size="sm" />);
    const small = screen.getByTestId("card");
    expect(small).toHaveAttribute("data-size", "sm");
    expect(small.className).toContain(rule);
    // One rule, not two. `size="sm"` only changes the spacing scale, so a
    // second copy of the same declaration behind `data-[size=sm]` said nothing
    // the first did not.
    expect(small.className.match(/has-\[>\[data-slot=card-footer\]\]:pb-0/g)).toHaveLength(1);
  });
});
