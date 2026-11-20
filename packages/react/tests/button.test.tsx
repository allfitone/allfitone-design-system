/**
 * A button's label is set in the `control` role, the same one the React Native
 * button uses, and its resting boundary has to show on both themes.
 *
 * jsdom applies no stylesheet, so the class list is where this contract lives.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { Button, buttonVariants } from "../src/components/button.js";

afterEach(cleanup);

describe("Button", () => {
  it("sets its label in the control role, not at regular weight", () => {
    render(<Button>Guardar observación</Button>);

    const className = screen.getByRole("button", { name: "Guardar observación" }).className;
    expect(className).toContain("--afo-typography-control-font-weight");
    expect(className).toContain("--afo-typography-control-line-height");
    expect(className.split(" ")).not.toContain("font-normal");
  });

  it("keeps the 44 px target at the default size and grows for a large action", () => {
    expect(buttonVariants().split(" ")).toContain("min-h-11");

    const large = buttonVariants({ size: "lg" }).split(" ");
    expect(large).toContain("min-h-12");
    expect(large).toContain("text-base");
    expect(large).not.toContain("text-sm");
  });

  it("sizes its label like the React Native button: body size, one step down when small", () => {
    expect(buttonVariants().split(" ")).toContain("text-base");
    expect(buttonVariants({ size: "sm" }).split(" ")).toContain("text-sm");
    expect(buttonVariants({ size: "xs" }).split(" ")).toContain("text-xs");
  });

  it("lets a button's own size win over the application reset", () => {
    const reset = readFileSync(resolve("src/styles/app.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
    const layered = reset.slice(reset.indexOf("@layer afo-base {"), reset.indexOf("\n}\n", reset.indexOf("@layer afo-base {")));
    const unlayered = reset.replace(layered, "");

    expect(layered).toMatch(/\n {2}button \{\s+font-family: inherit;\s+font-size: inherit;\s+line-height: inherit;/);
    // Unlayered, the reset outranked every `text-*` utility a component declared.
    expect(unlayered).not.toMatch(/(^|[\s,])button\s*[,{]/);
    expect(unlayered).toMatch(/input,\s+select,\s+textarea \{\s+font-family: inherit;\s+font-size: inherit;/);
  });

  it.each(["outline", "secondary"] as const)(
    "draws the %s boundary with the control border, which shows on both themes",
    (variant) => {
      const classes = buttonVariants({ variant }).split(" ");
      expect(classes).toContain("border-input");
      // The subtle border is 14 % of a cool grey: on the dark surface it vanished.
      expect(classes).not.toContain("border-border");
    },
  );
});
