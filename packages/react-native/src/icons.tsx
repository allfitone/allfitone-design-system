import type { ComponentType } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock3,
  Dumbbell,
  Ellipsis,
  Info,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  Minus,
  PanelLeft,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserRound,
  UsersRound,
  X,
  type LucideProps,
} from "lucide-react-native";

import {
  iconCatalog,
  iconSize,
  iconStrokeWidth,
  type IconName,
  type IconSize,
  type IconSource,
  type IconStroke,
} from "@allfitone/icons";

const sourceComponents = {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Building2,
  CalendarDays,
  ChartNoAxesCombined,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  ClipboardList,
  Clock3,
  Dumbbell,
  Ellipsis,
  Info,
  LayoutDashboard,
  LoaderCircle,
  Menu,
  Minus,
  PanelLeft,
  Pencil,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  TriangleAlert,
  UserRound,
  UsersRound,
  X,
} satisfies Record<IconSource, ComponentType<LucideProps>>;

type IconSizeProps =
  | { size?: IconSize | undefined; customSize?: never }
  | { size?: never; customSize: number };

type IconStrokeProps =
  | { strokeScale?: IconStroke | undefined; customStrokeWidth?: never }
  | { strokeScale?: never; customStrokeWidth: number };

export type FoundationIconProps = Omit<
  LucideProps,
  "color" | "size" | "strokeWidth"
> &
  IconSizeProps &
  IconStrokeProps & {
    name: IconName;
    color: string;
    decorative?: boolean | undefined;
    accessibilityLabel?: string | undefined;
  };

function positiveFinite(value: number, label: string) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new RangeError(`${label} must be a positive finite number.`);
  }
  return value;
}

export function FoundationIcon({
  name,
  color,
  size,
  customSize,
  strokeScale,
  customStrokeWidth,
  decorative,
  accessibilityLabel,
  ...props
}: FoundationIconProps) {
  const Icon = sourceComponents[iconCatalog[name].source];
  const resolvedSize = customSize === undefined
    ? iconSize[size ?? "md"]
    : positiveFinite(customSize, "customSize");
  const resolvedStrokeWidth = customStrokeWidth === undefined
    ? iconStrokeWidth[strokeScale ?? "default"]
    : positiveFinite(customStrokeWidth, "customStrokeWidth");
  const isAccessible = !decorative && Boolean(accessibilityLabel);
  const accessibilityProps = isAccessible && accessibilityLabel
    ? { accessible: true, accessibilityLabel }
    : { accessible: false };

  return (
    <Icon
      {...props}
      {...accessibilityProps}
      color={color}
      size={resolvedSize}
      strokeWidth={resolvedStrokeWidth}
    />
  );
}

export { iconCatalog, iconSize, iconStrokeWidth };
export type {
  IconCategory,
  IconName,
  IconSize,
  IconSource,
  IconStroke,
} from "@allfitone/icons";
