import {
  forwardRef,
  type ForwardedRef,
  type ForwardRefExoticComponent,
  type RefAttributes,
} from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ChartLine,
  Check,
  Camera,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CircleCheck,
  CircleX,
  CirclePlus,
  ClipboardList,
  Clock3,
  Compass,
  Dumbbell,
  Ellipsis,
  Flag,
  Heart,
  History,
  House,
  Info,
  LayoutDashboard,
  ListChecks,
  LoaderCircle,
  Lock,
  Medal,
  Menu,
  Minus,
  Moon,
  Pencil,
  Play,
  Plus,
  PanelLeft,
  Repeat,
  Search,
  Settings,
  Target,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  Utensils,
  UserRound,
  UsersRound,
  Weight,
  X,
  Zap,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

import {
  iconCatalog,
  iconSize,
  iconStrokeWidth,
  type IconName,
  type IconSize,
  type IconSource,
  type IconStroke,
} from "./index.js";

const sourceComponents = {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Bell,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  ChartLine,
  Check,
  Camera,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  CircleCheck,
  CircleX,
  CirclePlus,
  ClipboardList,
  Clock3,
  Compass,
  Dumbbell,
  Ellipsis,
  Flag,
  Heart,
  History,
  House,
  Info,
  LayoutDashboard,
  ListChecks,
  LoaderCircle,
  Lock,
  Medal,
  Menu,
  Minus,
  Moon,
  PanelLeft,
  Pencil,
  Play,
  Plus,
  Repeat,
  Search,
  Settings,
  ShieldCheck,
  Target,
  Trash2,
  TriangleAlert,
  Utensils,
  UserRound,
  UsersRound,
  Weight,
  X,
  Zap,
} satisfies Record<IconSource, LucideIcon>;

type IconSizeProps =
  | { size?: IconSize | undefined; customSize?: never }
  | { size?: never; customSize: number };

type IconStrokeProps =
  | { strokeScale?: IconStroke | undefined; customStrokeWidth?: never }
  | { strokeScale?: never; customStrokeWidth: number };

export type SemanticIconProps = Omit<LucideProps, "size" | "strokeWidth"> &
  IconSizeProps &
  IconStrokeProps & {
    decorative?: boolean | undefined;
  };

export type FoundationIconProps = SemanticIconProps & {
  name: IconName;
};

function positiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive finite number.`);
  }
  return value;
}

function renderIcon(
  Icon: LucideIcon,
  {
    size,
    customSize,
    strokeScale,
    customStrokeWidth,
    decorative,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-hidden": ariaHidden,
    role,
    ...props
  }: SemanticIconProps,
  ref: ForwardedRef<SVGSVGElement>,
) {
  const resolvedSize = customSize === undefined
    ? iconSize[size ?? "md"]
    : positiveFinite(customSize, "customSize");
  const resolvedStrokeWidth = customStrokeWidth === undefined
    ? iconStrokeWidth[strokeScale ?? "default"]
    : positiveFinite(customStrokeWidth, "customStrokeWidth");
  const hasAccessibleName = Boolean(ariaLabel || ariaLabelledBy);
  const explicitlyHidden = ariaHidden === true || ariaHidden === "true";
  const explicitlyVisible = ariaHidden === false || ariaHidden === "false";
  const isDecorative = explicitlyHidden
    ? true
    : explicitlyVisible
      ? false
      : decorative ?? !hasAccessibleName;

  return (
    <Icon
      {...props}
      ref={ref}
      size={resolvedSize}
      strokeWidth={resolvedStrokeWidth}
      aria-label={isDecorative ? undefined : ariaLabel}
      aria-labelledby={isDecorative ? undefined : ariaLabelledBy}
      aria-hidden={isDecorative}
      role={role ?? (isDecorative ? "presentation" : "img")}
    />
  );
}

export const FoundationIcon = forwardRef<SVGSVGElement, FoundationIconProps>(
  function FoundationIcon({ name, ...props }, ref) {
    const source = iconCatalog[name].source;
    return renderIcon(sourceComponents[source], props, ref);
  },
);

function createSemanticIcon(
  displayName: string,
  Icon: LucideIcon,
): ForwardRefExoticComponent<SemanticIconProps & RefAttributes<SVGSVGElement>> {
  const Component = forwardRef<SVGSVGElement, SemanticIconProps>(
    function SemanticFoundationIcon(props, ref) {
      return renderIcon(Icon, props, ref);
    },
  );
  Component.displayName = displayName;
  return Component;
}

export const BackIcon = /* @__PURE__ */ createSemanticIcon("BackIcon", ArrowLeft);
export const ForwardIcon = /* @__PURE__ */ createSemanticIcon("ForwardIcon", ArrowRight);
export const ExpandIcon = /* @__PURE__ */ createSemanticIcon("ExpandIcon", ChevronDown);
export const CollapseIcon = /* @__PURE__ */ createSemanticIcon("CollapseIcon", ChevronUp);
export const ExternalIcon = /* @__PURE__ */ createSemanticIcon("ExternalIcon", ArrowUpRight);
export const MenuIcon = /* @__PURE__ */ createSemanticIcon("MenuIcon", Menu);
export const CloseIcon = /* @__PURE__ */ createSemanticIcon("CloseIcon", X);
export const AddIcon = /* @__PURE__ */ createSemanticIcon("AddIcon", Plus);
export const EditIcon = /* @__PURE__ */ createSemanticIcon("EditIcon", Pencil);
export const RemoveIcon = /* @__PURE__ */ createSemanticIcon("RemoveIcon", Trash2);
export const SearchIcon = /* @__PURE__ */ createSemanticIcon("SearchIcon", Search);
export const CheckIcon = /* @__PURE__ */ createSemanticIcon("CheckIcon", Check);
export const IndeterminateIcon = /* @__PURE__ */ createSemanticIcon("IndeterminateIcon", Minus);
export const LoadingIcon = /* @__PURE__ */ createSemanticIcon("LoadingIcon", LoaderCircle);
export const SuccessIcon = /* @__PURE__ */ createSemanticIcon("SuccessIcon", CircleCheck);
export const WarningIcon = /* @__PURE__ */ createSemanticIcon("WarningIcon", TriangleAlert);
export const ErrorIcon = /* @__PURE__ */ createSemanticIcon("ErrorIcon", CircleX);
export const InfoIcon = /* @__PURE__ */ createSemanticIcon("InfoIcon", Info);
export const MoreIcon = /* @__PURE__ */ createSemanticIcon("MoreIcon", Ellipsis);
export const PanelIcon = /* @__PURE__ */ createSemanticIcon("PanelIcon", PanelLeft);
export const OverviewIcon = /* @__PURE__ */ createSemanticIcon("OverviewIcon", LayoutDashboard);
export const CalendarIcon = /* @__PURE__ */ createSemanticIcon("CalendarIcon", CalendarDays);
export const TimeIcon = /* @__PURE__ */ createSemanticIcon("TimeIcon", Clock3);
export const PersonIcon = /* @__PURE__ */ createSemanticIcon("PersonIcon", UserRound);
export const PeopleIcon = /* @__PURE__ */ createSemanticIcon("PeopleIcon", UsersRound);
export const OrganizationIcon = /* @__PURE__ */ createSemanticIcon("OrganizationIcon", Building2);
export const TrainingIcon = /* @__PURE__ */ createSemanticIcon("TrainingIcon", Dumbbell);
export const OperationIcon = /* @__PURE__ */ createSemanticIcon("OperationIcon", ClipboardList);
export const BusinessIcon = /* @__PURE__ */ createSemanticIcon("BusinessIcon", ChartNoAxesCombined);
export const PermissionsIcon = /* @__PURE__ */ createSemanticIcon("PermissionsIcon", ShieldCheck);
export const SettingsIcon = /* @__PURE__ */ createSemanticIcon("SettingsIcon", Settings);
export const TargetIcon = /* @__PURE__ */ createSemanticIcon("TargetIcon", Target);
export const RestIcon = /* @__PURE__ */ createSemanticIcon("RestIcon", Moon);
export const LockedIcon = /* @__PURE__ */ createSemanticIcon("LockedIcon", Lock);
export const ExploreIcon = /* @__PURE__ */ createSemanticIcon("ExploreIcon", Compass);
export const SubtractIcon = /* @__PURE__ */ createSemanticIcon("SubtractIcon", Minus);
export const ActivityIcon = /* @__PURE__ */ createSemanticIcon("ActivityIcon", Activity);
export const WeightIcon = /* @__PURE__ */ createSemanticIcon("WeightIcon", Weight);
export const RaceIcon = /* @__PURE__ */ createSemanticIcon("RaceIcon", Flag);
export const HeartIcon = /* @__PURE__ */ createSemanticIcon("HeartIcon", Heart);
export const HomeIcon = /* @__PURE__ */ createSemanticIcon("HomeIcon", House);
export const HistoryIcon = /* @__PURE__ */ createSemanticIcon("HistoryIcon", History);
export const NextIcon = /* @__PURE__ */ createSemanticIcon("NextIcon", ChevronRight);
export const NotificationIcon = /* @__PURE__ */ createSemanticIcon("NotificationIcon", Bell);
export const CreateIcon = /* @__PURE__ */ createSemanticIcon("CreateIcon", CirclePlus);
export const CameraIcon = /* @__PURE__ */ createSemanticIcon("CameraIcon", Camera);
export const FreestyleIcon = /* @__PURE__ */ createSemanticIcon("FreestyleIcon", Zap);
export const ChecklistIcon = /* @__PURE__ */ createSemanticIcon("ChecklistIcon", ListChecks);
export const NutritionIcon = /* @__PURE__ */ createSemanticIcon("NutritionIcon", Utensils);
export const ProgressIcon = /* @__PURE__ */ createSemanticIcon("ProgressIcon", ChartLine);
export const FrequencyIcon = /* @__PURE__ */ createSemanticIcon("FrequencyIcon", Repeat);
export const LevelIcon = /* @__PURE__ */ createSemanticIcon("LevelIcon", Medal);
export const StartIcon = /* @__PURE__ */ createSemanticIcon("StartIcon", Play);
