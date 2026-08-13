import type { IconName } from "@allfitone/react/icons";

export type ComponentCategorySlug =
  | "actions"
  | "navigation"
  | "forms"
  | "selection"
  | "data-display"
  | "signature"
  | "overlays"
  | "feedback";

export type ComponentCatalogItem = {
  id: string;
  title: string;
  description: string;
  importPath: string;
  contract: readonly string[];
  category: ComponentCategorySlug;
};

export type ComponentCategory = {
  slug: ComponentCategorySlug;
  code: string;
  label: string;
  description: string;
  icon: IconName;
  components: readonly ComponentCatalogItem[];
};

const item = (
  category: ComponentCategorySlug,
  id: string,
  title: string,
  description: string,
  importPath: string,
  contract: readonly string[],
): ComponentCatalogItem => ({
  category,
  id,
  title,
  description,
  importPath,
  contract,
});

export const componentCategories = [
  {
    slug: "actions",
    code: "ACT",
    label: "Actions",
    description: "Clear hierarchy, persistent focus and movement-sized targets.",
    icon: "add",
    components: [
      item("actions", "button", "Button", "Semantic hierarchy and movement-safe sizes for product actions.", "@allfitone/react/components/button", ["Hover / focus / active", "Disabled", "Loading", "Long content"]),
      item("actions", "icon-button", "IconButton", "Icon-only actions require an accessible name at compile time.", "@allfitone/react/components/icon-button", ["Required aria-label", "44 px target", "Disabled"]),
    ],
  },
  {
    slug: "navigation",
    code: "NAV",
    label: "Navigation",
    description: "Current location stays explicit across dense workspaces, nested resources and mobile transitions.",
    icon: "menu",
    components: [
      item("navigation", "breadcrumb", "Breadcrumb", "Resource hierarchy stays readable without competing with the page title.", "@allfitone/react/components/breadcrumb", ["Current page", "Collapsed path", "Router composition", "44 px links"]),
      item("navigation", "navigation-menu", "NavigationMenu", "Top-level product areas expose related destinations without hiding the active context.", "@allfitone/react/components/navigation-menu", ["Arrow keys", "Escape", "Active trajectory", "Long labels"]),
      item("navigation", "dropdown-menu", "DropdownMenu", "Compact contextual actions keep organization and account controls close to their trigger.", "@allfitone/react/components/dropdown-menu", ["Arrow keys", "Typeahead", "Grouped items", "Destructive text"]),
      item("navigation", "pagination", "Pagination", "Large operational lists expose position, direction and the active page.", "@allfitone/react/components/pagination", ["Current page", "Previous / next", "Accessible labels", "Mobile collapse"]),
      item("navigation", "drawer", "Drawer", "Mobile navigation enters from the physical edge and preserves the workspace beneath it.", "@allfitone/react/components/drawer", ["Required title", "Swipe / Escape", "Focus return", "Mobile navigation"]),
      item("navigation", "workspace-shell", "Sidebar + WorkspaceShell", "The application frame keeps organization, product area and current task in one disciplined hierarchy.", "@allfitone/react/components/workspace-shell", ["Desktop sidebar", "Mobile sheet", "Collapsed state", "Landmark order"]),
      item("navigation", "command", "Command + CommandDialog", "A shared keyboard-first command model moves through the workspace inline or inside a focused global Dialog.", "@allfitone/react/components/command", ["Filtering / groups", "Arrow keys / Enter", "Empty / disabled", "Dialog focus return"]),
    ],
  },
  {
    slug: "forms",
    code: "FRM",
    label: "Forms",
    description: "Persistent labels, explicit errors and resilient text entry.",
    icon: "edit",
    components: [
      item("forms", "label", "Label", "Visible naming remains separate from placeholder content.", "@allfitone/react/components/label", ["Persistent name", "Native association", "Disabled context"]),
      item("forms", "input", "Input", "A 44 px target with theme-aware boundaries.", "@allfitone/react/components/input", ["Hover / focus", "Disabled", "Invalid", "Placeholder is not a label"]),
      item("forms", "textarea", "Textarea", "Content grows without clipping essential instructions.", "@allfitone/react/components/textarea", ["Focus", "Disabled", "Invalid", "Long content"]),
      item("forms", "field", "Field", "Label, help and error text form one accessible relationship.", "@allfitone/react/components/field", ["Description relationship", "Textual error", "aria-invalid", "Error announcement"]),
    ],
  },
  {
    slug: "selection",
    code: "SEL",
    label: "Selection",
    description: "State is visible through shape, position and semantics—not color alone.",
    icon: "check",
    components: [
      item("selection", "checkbox", "Checkbox", "Checked and indeterminate states retain a 44 px target.", "@allfitone/react/components/checkbox", ["Checked", "Indeterminate", "Disabled", "44 px target"]),
      item("selection", "radio-group", "RadioGroup", "Arrow-key selection follows the established composite pattern.", "@allfitone/react/components/radio-group", ["Arrow navigation", "Selected", "Disabled", "Group label"]),
      item("selection", "switch", "Switch", "Track and thumb expose state through position as well as color.", "@allfitone/react/components/switch", ["On / off", "Disabled", "Visible label", "44 px target"]),
      item("selection", "toggle-group", "ToggleGroup", "Compact modes and filters share one restrained signal rail without losing their pressed semantics.", "@allfitone/react/components/toggle-group", ["Single / multiple", "Arrow navigation", "Pressed state", "Disabled"]),
      item("selection", "select", "Select", "Grouped options support keyboard traversal and explicit labels.", "@allfitone/react/components/select", ["Open / closed", "Arrow navigation", "Grouped options", "Invalid"]),
      item("selection", "combobox", "Combobox", "Filterable predefined options support rich items, grouped directories and multiple selection without becoming a free-form search field.", "@allfitone/react/components/combobox", ["Keyboard filtering", "Single / multiple", "Grouped rich options", "Loading / empty / error"]),
      item("selection", "date-picker", "DatePicker", "Typed dates and the calendar share one controlled value, visible format guidance and explicit unavailable or invalid states.", "@allfitone/react/components/date-picker", ["Typed parsing", "Controlled / uncontrolled", "Unavailable dates", "Visible format and error"]),
      item("selection", "calendar", "Calendar", "Session dates and training blocks preserve a 44 px grid, explicit unavailable days and keyboard navigation across months.", "@allfitone/react/components/calendar", ["Single / range", "Disabled modifiers", "Locale / timezone ready", "Arrow and page keys"]),
      item("selection", "tabs", "Tabs", "The selected state combines exposed state, weight and trajectory.", "@allfitone/react/components/tabs", ["Arrow navigation", "Selected trajectory", "Disabled", "Long labels"]),
    ],
  },
  {
    slug: "data-display",
    code: "DAT",
    label: "Data display",
    description: "Compact information that stays readable under pressure.",
    icon: "business",
    components: [
      item("data-display", "table", "Table", "Operational records keep native table relationships, explicit selection and a focusable overflow region.", "@allfitone/react/components/table", ["Comfortable / compact", "Selection and sorting", "Loading / empty / error", "320 px overflow"]),
      item("data-display", "data-table", "DataTable", "Composable controls add filtering, column visibility, selection actions and client or server pagination without replacing Table.", "@allfitone/react/components/data-table", ["Headless controlled state", "Filter and sort", "Column visibility", "Selection and pagination"]),
      item("data-display", "avatar", "Avatar", "Member and coach identity survives image failure, while presence remains recognizable without relying on color.", "@allfitone/react/components/avatar", ["Named / decorative", "Image fallback", "Icon plus presence label", "Group and count"]),
      item("data-display", "badge", "Badge", "Short status labels always state their meaning in words.", "@allfitone/react/components/badge", ["Text plus color", "Long status", "Interactive target"]),
      item("data-display", "card", "Card", "Structured composition keeps title, action, content and footer predictable.", "@allfitone/react/components/card", ["Default / active", "Action slot", "Long content", "Responsive"]),
      item("data-display", "skeleton", "Skeleton", "Decorative loading placeholders respect reduced motion.", "@allfitone/react/components/skeleton", ["Decorative only", "Reduced motion", "Content-shaped"]),
      item("data-display", "empty", "Empty", "Empty states explain what happened and provide the next action.", "@allfitone/react/components/empty", ["Clear reason", "Next action", "Long content"]),
    ],
  },
  {
    slug: "signature",
    code: "SIG",
    label: "Signature",
    description: "Ink & Signal brand elements: one signal per screen, athletic numerals and the pulse motif.",
    icon: "activity",
    components: [
      item("signature", "accent-block", "AccentBlock", "The single accent surface per screen carries the next action on the signal gradient.", "@allfitone/react/components/accent-block", ["One per screen", "Theme-invariant gradient", "On-accent ink text", "Dot texture"]),
      item("signature", "stat-strip", "StatStrip", "Big session metrics divided by hairlines, set in condensed tabular numerals.", "@allfitone/react/components/stat-strip", ["Tabular numerals", "Hairline dividers", "Equal-width items", "Long values"]),
      item("signature", "tick-ring", "TickRing", "Bezel-style progress built from tick dashes with a single signal arc.", "@allfitone/react/components/tick-ring", ["role=meter", "0–100 clamp", "Center label slot", "Reference geometry"]),
      item("signature", "pulse-mark", "PulseMark", "The training signal remains a secondary interface motif, separate from the canonical product logos.", "@allfitone/react/components/pulse-mark", ["aria-hidden by default", "Optional label", "currentColor stroke"]),
      item("signature", "class-cards", "Class cards", "Patrón de reservas del producto: clase destacada, inscrita y no disponible — AccentBlock, Card, Badge y Button compuestos.", "@allfitone/react (composición)", ["Destacada única", "Estados de reserva", "CTA invertido", "Dark / light"]),
    ],
  },
  {
    slug: "overlays",
    code: "OVR",
    label: "Overlays",
    description: "Focus enters with intent and returns predictably to the trigger.",
    icon: "panel",
    components: [
      item("overlays", "dialog", "Dialog", "A focused task with discoverable title and dismissal.", "@allfitone/react/components/dialog", ["Focus trap", "Escape", "Inert background", "Focus return"]),
      item("overlays", "alert-dialog", "AlertDialog", "Destructive decisions name the consequence before confirmation.", "@allfitone/react/components/alert-dialog", ["Consequence named", "Cancel path", "Focus trap", "Focus return"]),
      item("overlays", "sheet", "Sheet", "Secondary workflows stay connected to the workspace context.", "@allfitone/react/components/sheet", ["Escape", "Inert background", "Focus return", "Responsive edge"]),
      item("overlays", "tooltip", "Tooltip", "Supplementary text appears on pointer and keyboard focus.", "@allfitone/react/components/tooltip", ["Pointer / keyboard", "Supplementary only", "Escape dismisses"]),
      item("overlays", "popover", "Popover", "Anchored, non-modal context supports quick inspection and bounded edits without obscuring the workspace.", "@allfitone/react/components/popover", ["Solid raised surface", "Placement / collision", "Escape / outside press", "Focus return"]),
    ],
  },
  {
    slug: "feedback",
    code: "FDB",
    label: "Feedback",
    description: "Progress and outcomes are announced without stealing focus.",
    icon: "info",
    components: [
      item("feedback", "progress", "Progress", "Training work and background operations expose their current state as readable data, not color alone.", "@allfitone/react/components/progress", ["Determinate / indeterminate", "Visible value", "Full / compact", "Reduced motion"]),
      item("feedback", "alert", "Alert", "Operational callouts pair plain-language meaning with a distinct icon and restrained status signal.", "@allfitone/react/components/alert", ["Info / success / warning / danger", "Icon plus text", "Optional action", "Explicit live priority"]),
      item("feedback", "spinner", "Spinner", "A named status indicator composes inside actions and surfaces.", "@allfitone/react/components/spinner", ["Named status", "Reduced motion", "Composed loading"]),
      item("feedback", "toast", "Sonner / Toast", "Polite, textual feedback follows the active ALLFIT ONE theme.", "@allfitone/react/components/sonner", ["Live region", "No focus steal", "Text plus color", "Dismissible"]),
    ],
  },
] as const satisfies readonly ComponentCategory[];

export const componentCategorySlugs = componentCategories.map((category) => category.slug);

export const componentCatalogItems = componentCategories.flatMap((category) => category.components);

const categoriesBySlug = new Map(componentCategories.map((category) => [category.slug, category]));
const itemsById = new Map(componentCatalogItems.map((component) => [component.id, component]));

export function isComponentCategorySlug(value: string): value is ComponentCategorySlug {
  return categoriesBySlug.has(value as ComponentCategorySlug);
}

export function getComponentCategory(slug: ComponentCategorySlug) {
  return categoriesBySlug.get(slug)!;
}

export function getComponentById(id: string) {
  return itemsById.get(id);
}

export function getComponentHref(component: ComponentCatalogItem) {
  return `/components/${component.category}#${component.id}`;
}
