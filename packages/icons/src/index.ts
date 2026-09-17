export const designSystemVersion = "0.2.0" as const;

export const iconSize = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
} as const;

export const iconStrokeWidth = {
  default: 1.75,
  compact: 2,
  display: 1.5,
} as const;

export const iconCatalog = {
  back: { source: "ArrowLeft", category: "navigation" },
  forward: { source: "ArrowRight", category: "navigation" },
  expand: { source: "ChevronDown", category: "navigation" },
  collapse: { source: "ChevronUp", category: "navigation" },
  external: { source: "ArrowUpRight", category: "navigation" },
  menu: { source: "Menu", category: "action" },
  close: { source: "X", category: "action" },
  add: { source: "Plus", category: "action" },
  edit: { source: "Pencil", category: "action" },
  remove: { source: "Trash2", category: "action" },
  search: { source: "Search", category: "action" },
  check: { source: "Check", category: "action" },
  indeterminate: { source: "Minus", category: "action" },
  loading: { source: "LoaderCircle", category: "status" },
  success: { source: "CircleCheck", category: "status" },
  warning: { source: "TriangleAlert", category: "status" },
  error: { source: "CircleX", category: "status" },
  info: { source: "Info", category: "status" },
  more: { source: "Ellipsis", category: "action" },
  panel: { source: "PanelLeft", category: "navigation" },
  overview: { source: "LayoutDashboard", category: "navigation" },
  calendar: { source: "CalendarDays", category: "object" },
  time: { source: "Clock3", category: "object" },
  person: { source: "UserRound", category: "object" },
  people: { source: "UsersRound", category: "object" },
  organization: { source: "Building2", category: "object" },
  training: { source: "Dumbbell", category: "object" },
  operation: { source: "ClipboardList", category: "object" },
  business: { source: "ChartNoAxesCombined", category: "object" },
  permissions: { source: "ShieldCheck", category: "object" },
  settings: { source: "Settings", category: "object" },
  activity: { source: "Activity", category: "object" },
  weight: { source: "Weight", category: "object" },
  race: { source: "Flag", category: "object" },
  heart: { source: "Heart", category: "object" },
  home: { source: "House", category: "navigation" },
  history: { source: "History", category: "navigation" },
  next: { source: "ChevronRight", category: "navigation" },
  notification: { source: "Bell", category: "status" },
  create: { source: "CirclePlus", category: "action" },
  camera: { source: "Camera", category: "action" },
  freestyle: { source: "Zap", category: "object" },
  checklist: { source: "ListChecks", category: "object" },
  nutrition: { source: "Utensils", category: "object" },
  progress: { source: "ChartLine", category: "object" },
  frequency: { source: "Repeat", category: "object" },
  level: { source: "Medal", category: "object" },
  start: { source: "Play", category: "action" },
  // Its own glyph and not a toggled `start`: a control that stops moving content is
  // a WCAG 2.2.2 obligation, so it has to be nameable on its own.
  pause: { source: "Pause", category: "action" },
  target: { source: "Target", category: "object" },
  rest: { source: "Moon", category: "object" },
  locked: { source: "Lock", category: "object" },
  explore: { source: "Compass", category: "navigation" },
  // `remove` is a trash can: it deletes a thing. A stepper takes one away from a
  // number, which is a different act and needs a different glyph.
  subtract: { source: "Minus", category: "action" },
  // The grip somebody drags a row by. Not `panel` and not `more`: those open
  // something, and this one is held rather than pressed.
  reorder: { source: "GripVertical", category: "action" },
} as const;

export type IconName = keyof typeof iconCatalog;
export type IconSize = keyof typeof iconSize;
export type IconStroke = keyof typeof iconStrokeWidth;
export type IconSource = (typeof iconCatalog)[IconName]["source"];
export type IconCategory = (typeof iconCatalog)[IconName]["category"];
