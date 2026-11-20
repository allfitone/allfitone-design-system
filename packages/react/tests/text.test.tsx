/**
 * `Text` is the web counterpart of the React Native component: a role plus a
 * size is the whole API, so two screens cannot give one intent two line
 * heights.
 *
 * jsdom applies no stylesheet, so these assert the contract where it lives
 * here: the element, the data attributes and the token each class reads.
 */
import { cleanup, render, screen } from "@testing-library/react";
import { axe } from "jest-axe";
import { afterEach, describe, expect, it } from "vitest";

import { Text } from "../src/components/text.js";
import { typography, typographyRole } from "../src/tokens.js";

const roles = Object.keys(typographyRole) as Array<keyof typeof typographyRole>;
const sizes = Object.keys(typography.size) as Array<keyof typeof typography.size>;
const colors = [
  "primary",
  "secondary",
  "muted",
  "disabled",
  "inverse",
  "accent",
  "danger",
  "success",
] as const;

afterEach(cleanup);

describe("Text", () => {
  it("is body copy in a paragraph unless told otherwise", () => {
    render(<Text>Lo que te autorizó a consultar.</Text>);

    const text = screen.getByText("Lo que te autorizó a consultar.");
    expect(text.tagName).toBe("P");
    expect(text).toHaveAttribute("data-slot", "text");
    expect(text).toHaveAttribute("data-role", "body");
    expect(text).toHaveAttribute("data-size", "md");
    expect(text.className).toContain("--afo-typography-body-font-family");
    expect(text.className).toContain("--afo-font-size-md");
    expect(text.className).toContain("--afo-color-text-primary");
  });

  it("clears the paragraph margin itself, since no reset is guaranteed", () => {
    render(<Text>Sin margen</Text>);

    expect(screen.getByText("Sin margen").className.split(" ")).toContain("m-0");
  });

  it("renders the element the document needs without changing how it looks", () => {
    render(
      <Text as="h2" role="heading" size="xl">
        Semana a semana
      </Text>,
    );

    const heading = screen.getByRole("heading", { level: 2, name: "Semana a semana" });
    expect(heading).toHaveAttribute("data-role", "heading");
    expect(heading.className).toContain("--afo-typography-heading-font-family");
    expect(heading.className).toContain("--afo-font-size-xl");
  });

  it.each(roles)("reads the %s role from its own tokens", (role) => {
    render(<Text role={role}>Rol</Text>);

    const className = screen.getByText("Rol").className;
    for (const property of ["font-family", "font-weight", "line-height", "letter-spacing"]) {
      expect(className).toContain(`--afo-typography-${role}-${property}`);
    }
  });

  it.each(sizes)("reads the %s size from the scale", (size) => {
    render(<Text size={size}>Tamaño</Text>);

    expect(screen.getByText("Tamaño").className).toContain(`--afo-font-size-${size})`);
  });

  it.each(colors)("offers %s as a text colour", (color) => {
    render(<Text color={color}>Color</Text>);

    expect(screen.getByText("Color").className).toContain(`--afo-color-text-${color})`);
  });

  it("sets figures in tabular numerals for the data role only", () => {
    render(
      <>
        <Text role="data">7.820</Text>
        <Text>57 min</Text>
      </>,
    );

    expect(screen.getByText("7.820").className.split(" ")).toContain("tabular-nums");
    expect(screen.getByText("57 min").className.split(" ")).not.toContain("tabular-nums");
  });

  it("leans only the poster role", () => {
    render(
      <>
        <Text role="poster">Ana</Text>
        <Text role="display">Progreso</Text>
      </>,
    );

    expect(screen.getByText("Ana").className.split(" ")).toContain("italic");
    expect(screen.getByText("Progreso").className.split(" ")).not.toContain("italic");
  });

  it("opens the tracking for one use and leaves the role's own otherwise", () => {
    render(
      <>
        <Text role="display" tracking={0.01}>
          Abierto
        </Text>
        <Text role="display">Propio</Text>
      </>,
    );

    expect(screen.getByText("Abierto")).toHaveStyle({ letterSpacing: "0.01em" });
    expect(screen.getByText("Propio").style.letterSpacing).toBe("");
  });

  it("aligns and uppercases on request", () => {
    render(
      <Text align="end" uppercase>
        Volumen
      </Text>,
    );

    const classes = screen.getByText("Volumen").className.split(" ");
    expect(classes).toContain("text-end");
    expect(classes).toContain("uppercase");
  });

  it("keeps the typographic role out of the ARIA role", () => {
    render(<Text role="label">Alcance</Text>);

    expect(screen.getByText("Alcance")).not.toHaveAttribute("role");
  });

  it("forwards native attributes and merges a caller's class", () => {
    render(
      <Text id="intro" className="max-w-prose">
        Con atributos
      </Text>,
    );

    const text = screen.getByText("Con atributos");
    expect(text).toHaveAttribute("id", "intro");
    expect(text.className.split(" ")).toContain("max-w-prose");
  });

  it("has no accessibility violations as a heading with its copy", async () => {
    const { container } = render(
      <main>
        <Text as="h1" role="display" size="5xl" uppercase>
          Ana Álvarez
        </Text>
        <Text color="secondary">Vínculo desde 4/03/2025</Text>
      </main>,
    );

    expect(await axe(container)).toHaveNoViolations();
  });
});
