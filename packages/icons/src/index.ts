export const designSystemVersion = "0.3.0" as const;

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
  // Turning a card over, not reloading it. Lucide has no two-sided glyph, so the
  // circling arrows carry it, as Phosphor's `arrows-clockwise` does on the canvas.
  flip: { source: "RefreshCw", category: "action" },
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
  // Copying a thing to start from it. `add` begins on a blank, and `edit` changes
  // the one that is already there; this one makes a second out of the first.
  duplicate: { source: "Copy", category: "action" },
  // Las doce portadas de una rutina dicen de qué va, no con qué se hace. Cuatro de
  // ellas reutilizan glifos que ya existían —`training`, `freestyle`, `level`, `time`—
  // y estas ocho son las que faltaban.
  // Correr, y no un cuerpo de pie: la huella dice movimiento y el
  // cuerpo dice anatomía, que es otra cosa y ya tiene su dibujo.
  run: { source: "Footprints", category: "object" },
  cycling: { source: "Bike", category: "object" },
  // Trabajo por tiempo. `time` es un reloj que dice qué hora es;
  // esto es una cuenta que alguien puso en marcha.
  interval: { source: "Timer", category: "object" },
  // El corazón trabajando. `heart` es el órgano y este es el
  // esfuerzo, que son dos cosas distintas en la misma pantalla.
  cardio: { source: "HeartPulse", category: "object" },
  burn: { source: "Flame", category: "object" },
  mountain: { source: "Mountain", category: "object" },
  // Movilidad y calma. El prototipo dibuja un yin-yang que Lucide
  // no tiene; la flor dice lo mismo sin pedir prestado un símbolo ajeno.
  mobility: { source: "Flower", category: "object" },
  swim: { source: "WavesHorizontal", category: "object" },
  // La segunda tanda de portadas. Siguen diciendo de qué va una rutina, no con qué
  // se hace, y varias reutilizan glifos que ya existían: `target`, `rest`, `weight`.
  // El brazo trabajando, no un músculo del atlas: la figura anatómica
  // ya dice qué entrena una rutina y esto dice de qué va.
  arms: { source: "BicepsFlexed", category: "object" },
  endurance: { source: "Infinity", category: "object" },
  pace: { source: "Gauge", category: "object" },
  energy: { source: "BatteryFull", category: "object" },
  focus: { source: "Brain", category: "object" },
  // Recuperar. `rest` es una noche y esto es el día suave que la sigue.
  recovery: { source: "Leaf", category: "object" },
  morning: { source: "Sunrise", category: "object" },
  evening: { source: "Sunset", category: "object" },
  cold: { source: "Snowflake", category: "object" },
  outdoor: { source: "Tent", category: "object" },
  route: { source: "Route", category: "object" },
  // La escalera de una piscina. `swim` son las olas: nadar en cualquier
  // parte frente a nadar en una.
  pool: { source: "WavesLadder", category: "object" },
  team: { source: "Volleyball", category: "object" },
  record: { source: "Trophy", category: "object" },
  favourite: { source: "Star", category: "object" },
  light: { source: "Feather", category: "object" },
  // Tiempo que se acaba. `time` es un reloj y `interval` una cuenta que
  // alguien puso en marcha; esto es el final acercándose.
  countdown: { source: "Hourglass", category: "object" },
} as const;

export type IconName = keyof typeof iconCatalog;
export type IconSize = keyof typeof iconSize;
export type IconStroke = keyof typeof iconStrokeWidth;
export type IconSource = (typeof iconCatalog)[IconName]["source"];
export type IconCategory = (typeof iconCatalog)[IconName]["category"];
