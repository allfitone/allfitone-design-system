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
  external: { source: "ArrowUpRight", category: "navigation" },
  menu: { source: "Menu", category: "action" },
  close: { source: "X", category: "action" },
  add: { source: "Plus", category: "action" },
  edit: { source: "Pencil", category: "action" },
  remove: { source: "Trash2", category: "action" },
  search: { source: "Search", category: "action" },
  success: { source: "CircleCheck", category: "status" },
  warning: { source: "TriangleAlert", category: "status" },
  error: { source: "CircleX", category: "status" },
  info: { source: "Info", category: "status" },
  calendar: { source: "CalendarDays", category: "object" },
  time: { source: "Clock3", category: "object" },
  person: { source: "UserRound", category: "object" },
  people: { source: "UsersRound", category: "object" },
  settings: { source: "Settings", category: "object" },
  activity: { source: "Activity", category: "object" },
} as const;

export type IconName = keyof typeof iconCatalog;
export type IconSize = keyof typeof iconSize;
export type IconCategory = (typeof iconCatalog)[IconName]["category"];
