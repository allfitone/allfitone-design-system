import { cleanup, render, screen, within } from "@testing-library/react"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it } from "vitest"

import { BarList } from "../src/components/bar-list.js"

afterEach(cleanup)

const coaches = [
  { id: "laura", label: "Laura Gómez", value: 14 },
  { id: "andres", label: "Andrés Ruiz", value: 7 },
  { id: "sofia", label: "Sofía Peña", value: 0 },
]

function barWidths(container: HTMLElement) {
  return [...container.querySelectorAll<HTMLElement>('[data-slot="bar-list-bar"]')].map(
    (bar) => bar.style.width
  )
}

describe("BarList", () => {
  it("lists every row by name and figure, with the bar as decoration", async () => {
    const { container } = render(
      <BarList aria-label="Clients per coach" items={coaches} />
    )

    const list = screen.getByRole("list", { name: "Clients per coach" })
    const rows = within(list).getAllByRole("listitem")
    expect(rows.map((row) => row.textContent)).toEqual([
      "Laura Gómez14",
      "Andrés Ruiz7",
      "Sofía Peña0",
    ])
    for (const track of container.querySelectorAll('[data-slot="bar-list-track"]')) {
      expect(track).toHaveAttribute("aria-hidden", "true")
    }
    expect(await axe(container)).toHaveNoViolations()
  })

  it("draws each bar against the largest value, and nothing for a zero", () => {
    const { container } = render(
      <BarList aria-label="Clients per coach" items={coaches} />
    )

    expect(barWidths(container)).toEqual(["100%", "50%", "0%"])
  })

  it("keeps the order it was given", () => {
    render(
      <BarList
        aria-label="Clients per coach"
        items={[coaches[2]!, coaches[0]!, coaches[1]!]}
      />
    )

    expect(
      screen.getAllByRole("listitem").map((row) => row.textContent)
    ).toEqual(["Sofía Peña0", "Laura Gómez14", "Andrés Ruiz7"])
  })

  it("measures against a stated ceiling when one is given", () => {
    const { container } = render(
      <BarList aria-label="Clients per coach" items={coaches} max={28} />
    )

    expect(barWidths(container)).toEqual(["50%", "25%", "0%"])
  })

  it("never draws past the row or below it", () => {
    const { container } = render(
      <BarList
        aria-label="Clients per coach"
        max={10}
        items={[
          { id: "over", label: "Over", value: 40 },
          { id: "under", label: "Under", value: -3 },
        ]}
      />
    )

    expect(barWidths(container)).toEqual(["100%", "0%"])
  })

  it("draws no bar at all when every value is zero", () => {
    const { container } = render(
      <BarList
        aria-label="Clients per coach"
        items={[
          { id: "a", label: "A", value: 0 },
          { id: "b", label: "B", value: 0 },
        ]}
      />
    )

    expect(barWidths(container)).toEqual(["0%", "0%"])
  })

  it("formats the figure the way the product asks", () => {
    render(
      <BarList
        aria-label="Clients per coach"
        items={coaches.slice(0, 1)}
        formatValue={(value) => `${value} clients`}
      />
    )

    expect(screen.getByText("14 clients")).toBeVisible()
  })

  it("renders nothing for an empty list", () => {
    const { container } = render(<BarList aria-label="Clients per coach" items={[]} />)

    expect(container).toBeEmptyDOMElement()
  })
})
