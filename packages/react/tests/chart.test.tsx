import { cleanup, fireEvent, render, screen, within } from "@testing-library/react"
import { axe } from "jest-axe"
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from "vitest"

import { AreaChart, BarChart } from "../src/components/chart.js"

/*
 * jsdom lays nothing out, so the plot measures itself at 0 × 0 and draws no
 * marks. The tests that count marks need a box to draw in, and this is the one
 * place the plot reads it from.
 */
beforeAll(() => {
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockImplementation(
    () => new DOMRect(0, 0, 480, 224)
  )
})

afterAll(() => {
  vi.restoreAllMocks()
})

afterEach(cleanup)

const adherence = [
  { week: "21 sep", rate: 79, logged: 11, planned: 14 },
  { week: "28 sep", rate: null, logged: 0, planned: 0 },
  { week: "5 oct", rate: 100, logged: 9, planned: 9 },
]

const changes = [
  { month: "jun", started: 4, ended: 1 },
  { month: "jul", started: 2, ended: 3 },
  { month: "ago", started: 0, ended: 0 },
]

function tableRows(table: HTMLElement) {
  return within(table)
    .getAllByRole("row")
    .map((row) =>
      [...(row as HTMLTableRowElement).cells].map((cell) => cell.textContent)
    )
}

describe("AreaChart", () => {
  it("names the figure and repeats every value in a table", async () => {
    const { container } = render(
      <AreaChart
        aria-label="Adherence by week"
        data={adherence}
        index="week"
        indexLabel="Week"
        series={[{ key: "rate", label: "Sessions logged" }]}
        formatValue={(value) => `${value}%`}
        missingLabel="Nothing was due"
      />
    )

    expect(screen.getByRole("figure", { name: "Adherence by week" })).toBeVisible()

    const table = screen.getByRole("table", { name: "Adherence by week" })
    expect(tableRows(table)).toEqual([
      ["Week", "Sessions logged"],
      ["21 sep", "79%"],
      ["28 sep", "Nothing was due"],
      ["5 oct", "100%"],
    ])
    expect(await axe(container)).toHaveNoViolations()
  })

  it("says more than the axis can where the product has more to say", () => {
    render(
      <AreaChart
        aria-label="Adherence by week"
        data={adherence}
        index="week"
        indexLabel="Week"
        series={[{ key: "rate", label: "Sessions logged" }]}
        formatValue={(value) => `${value}%`}
        describeValue={(value, datum) =>
          `${value}% (${datum.logged} of ${datum.planned})`
        }
        formatIndex={(week) => `Week of ${week}`}
      />
    )

    const table = screen.getByRole("table", { name: "Adherence by week" })
    expect(tableRows(table).slice(1)).toEqual([
      ["Week of 21 sep", "79% (11 of 14)"],
      ["Week of 28 sep", "—"],
      ["Week of 5 oct", "100% (9 of 9)"],
    ])
  })

  it("leaves a gap where a value is missing instead of drawing a zero", () => {
    const { container } = render(
      <AreaChart
        aria-label="Adherence by week"
        data={adherence}
        index="week"
        indexLabel="Week"
        series={[{ key: "rate", label: "Sessions logged" }]}
      />
    )

    // One marker per value that exists: the week with nothing due has none.
    expect(container.querySelectorAll(".recharts-area-dot")).toHaveLength(2)
  })

  it("reads each position out on the arrow keys, a missing one included", () => {
    const { container } = render(
      <AreaChart
        aria-label="Adherence by week"
        data={adherence}
        index="week"
        indexLabel="Week"
        series={[{ key: "rate", label: "Sessions logged" }]}
        formatValue={(value) => `${value}%`}
        missingLabel="Nothing was due"
      />
    )

    const plot = container.querySelector(".recharts-surface") as SVGElement
    fireEvent.focus(plot)

    const readout = () =>
      within(container.querySelector('[data-slot="chart-plot"]') as HTMLElement)
        .getByRole("status")
    expect(readout()).toHaveTextContent("21 sep79%")

    fireEvent.keyDown(plot, { key: "ArrowRight" })
    expect(readout()).toHaveTextContent("28 sepNothing was due")
    expect(readout()).toBeVisible()
  })

  it("renders nothing without data, so the product says why instead", () => {
    const { container } = render(
      <AreaChart
        aria-label="Adherence by week"
        data={[]}
        index="week"
        indexLabel="Week"
        series={[{ key: "rate", label: "Sessions logged" }]}
      />
    )

    expect(container).toBeEmptyDOMElement()
  })

  it("needs no legend for a single series", () => {
    const { container } = render(
      <AreaChart
        aria-label="Adherence by week"
        data={adherence}
        index="week"
        indexLabel="Week"
        series={[{ key: "rate", label: "Sessions logged" }]}
      />
    )

    expect(container.querySelector('[data-slot="chart-legend"]')).toBeNull()
  })
})

describe("BarChart", () => {
  it("names both series in a legend and in the table", async () => {
    const { container } = render(
      <BarChart
        aria-label="Clients joining and leaving by month"
        data={changes}
        index="month"
        indexLabel="Month"
        series={[
          { key: "started", label: "Joined" },
          { key: "ended", label: "Left" },
        ]}
      />
    )

    const legend = container.querySelector<HTMLElement>('[data-slot="chart-legend"]')
    expect(legend).not.toBeNull()
    expect(
      within(legend as HTMLElement)
        .getAllByRole("listitem")
        .map((item) => item.textContent)
    ).toEqual(["Joined", "Left"])

    const table = screen.getByRole("table", {
      name: "Clients joining and leaving by month",
    })
    expect(tableRows(table)).toEqual([
      ["Month", "Joined", "Left"],
      ["jun", "4", "1"],
      ["jul", "2", "3"],
      ["ago", "0", "0"],
    ])
    expect(await axe(container)).toHaveNoViolations()
  })

  it("wears the two chart colours in order, never a colour of its own", () => {
    const { container } = render(
      <BarChart
        aria-label="Clients joining and leaving by month"
        data={changes}
        index="month"
        indexLabel="Month"
        series={[
          { key: "started", label: "Joined" },
          { key: "ended", label: "Left" },
        ]}
      />
    )

    const fills = new Set(
      [...container.querySelectorAll(".recharts-bar-rectangle path")].map((mark) =>
        mark.getAttribute("fill")
      )
    )
    expect([...fills]).toEqual(["var(--chart-1)", "var(--chart-2)"])
  })

  it("draws nothing it cannot name: a third series is not plotted", () => {
    const { container } = render(
      <BarChart
        aria-label="Clients joining and leaving by month"
        data={changes}
        index="month"
        indexLabel="Month"
        // @ts-expect-error The palette validates two series, so the type stops at two.
        series={[
          { key: "started", label: "Joined" },
          { key: "ended", label: "Left" },
          { key: "started", label: "Third" },
        ]}
      />
    )

    expect(
      within(container.querySelector('[data-slot="chart-legend"]') as HTMLElement)
        .getAllByRole("listitem")
        .map((item) => item.textContent)
    ).toEqual(["Joined", "Left"])
  })
})
