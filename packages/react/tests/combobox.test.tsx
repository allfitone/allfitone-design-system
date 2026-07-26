import { cleanup, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { axe } from "jest-axe"
import { afterEach, describe, expect, it } from "vitest"

import {
  Combobox,
  ComboboxActions,
  ComboboxChip,
  ComboboxChipRemove,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxClear,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxInputGroup,
  ComboboxItem,
  ComboboxList,
  ComboboxStatus,
  ComboboxTrigger,
  ComboboxValue,
} from "../src/components/combobox.js"
import { Field, FieldLabel } from "../src/components/field.js"
import { Spinner } from "../src/components/spinner.js"

type Person = {
  id: string
  name: string
  role: string
}

const people: Person[] = [
  { id: "coach-camila", name: "Camila Torres", role: "Strength coach" },
  { id: "coach-mateo", name: "Mateo Ruiz", role: "Mobility coach" },
  {
    id: "coach-valentina",
    name: "Valentina Gómez de la Torre",
    role: "Conditioning coach",
  },
]

afterEach(cleanup)

function PersonOption({ person }: { person: Person }) {
  return (
    <span className="flex min-w-0 flex-col">
      <strong>{person.name}</strong>
      <small>{person.role}</small>
    </span>
  )
}

function SingleComboboxHarness() {
  return (
    <Field>
      <FieldLabel htmlFor="lead-coach">Lead coach</FieldLabel>
      <Combobox
        items={people}
        itemToStringLabel={(person: Person) => person.name}
      >
        <ComboboxInputGroup>
          <ComboboxInput
            id="lead-coach"
            placeholder="Search coaches"
          />
          <ComboboxActions>
            <ComboboxClear aria-label="Clear lead coach" />
            <ComboboxTrigger aria-label="Open lead coach options" />
          </ComboboxActions>
        </ComboboxInputGroup>
        <ComboboxContent>
          <ComboboxStatus />
          <ComboboxEmpty>No coaches found.</ComboboxEmpty>
          <ComboboxList>
            {(person: Person) => (
              <ComboboxItem key={person.id} value={person}>
                <PersonOption person={person} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

function MultipleComboboxHarness() {
  return (
    <Field>
      <FieldLabel htmlFor="session-coaches">Session coaches</FieldLabel>
      <Combobox
        items={people}
        itemToStringLabel={(person: Person) => person.name}
        multiple
        defaultValue={[people[0]!]}
      >
        <ComboboxInputGroup>
          <ComboboxChips>
            <ComboboxValue>
              {(value: Person[]) => (
                <>
                  {value.map((person) => (
                    <ComboboxChip key={person.id}>
                      {person.name}
                      <ComboboxChipRemove
                        aria-label={`Remove ${person.name}`}
                      />
                    </ComboboxChip>
                  ))}
                  <ComboboxChipsInput
                    id="session-coaches"
                    placeholder={value.length === 0 ? "Add coaches" : ""}
                  />
                </>
              )}
            </ComboboxValue>
          </ComboboxChips>
          <ComboboxActions>
            <ComboboxTrigger aria-label="Open session coach options" />
          </ComboboxActions>
        </ComboboxInputGroup>
        <ComboboxContent aria-busy>
          <ComboboxStatus variant="loading">
            <Spinner label="Searching coaches" />
            Searching coaches
          </ComboboxStatus>
          <ComboboxEmpty>No coaches found.</ComboboxEmpty>
          <ComboboxList>
            {(person: Person) => (
              <ComboboxItem key={person.id} value={person}>
                <PersonOption person={person} />
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </Field>
  )
}

describe("Combobox", () => {
  it("filters and selects a single long option with keyboard controls", async () => {
    const user = userEvent.setup()
    const { container } = render(<SingleComboboxHarness />)
    const view = within(container)
    const input = view.getByRole("combobox", { name: "Lead coach" })

    await user.click(input)
    await user.type(input, "Valentina")
    const option = screen.getByRole("option", { name: /Valentina/ })
    expect(option).toBeVisible()

    await user.keyboard("{ArrowDown}{Enter}")
    expect(input).toHaveValue(people[2]!.name)
    expect(view.getByRole("button", { name: "Clear lead coach" })).toBeVisible()

    await user.click(view.getByRole("button", { name: "Clear lead coach" }))
    expect(input).toHaveValue("")
    expect(await axe(container)).toHaveNoViolations()
  })

  it("supports multiple selection, removable chips and async status", async () => {
    const user = userEvent.setup()
    const { container } = render(<MultipleComboboxHarness />)
    const view = within(container)

    expect(
      view.getByRole("button", { name: "Remove Camila Torres" })
    ).toHaveAttribute("data-slot", "combobox-chip-remove")

    const input = view.getByRole("combobox", { name: "Session coaches" })
    await user.click(input)
    await user.type(input, "remote")
    expect(
      document.querySelector('[data-slot="combobox-status"]')
    ).toHaveTextContent("Searching coaches")
    await user.clear(input)

    await user.click(screen.getByRole("option", { name: /Mateo Ruiz/ }))
    expect(
      view.getByRole("button", { name: "Remove Mateo Ruiz" })
    ).toBeInTheDocument()

    await user.keyboard("{Escape}")
    await user.click(
      view.getByRole("button", { name: "Remove Camila Torres" })
    )
    expect(
      view.queryByRole("button", { name: "Remove Camila Torres" })
    ).not.toBeInTheDocument()
    expect(await axe(container)).toHaveNoViolations()
  })
})
