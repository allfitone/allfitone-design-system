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

import { iconCatalog, iconSize, iconStrokeWidth, type IconName, type IconSize } from "@allfitone/icons";

const iconComponents: Record<IconName, ComponentType<LucideProps>> = {
  back: ArrowLeft,
  forward: ArrowRight,
  expand: ChevronDown,
  collapse: ChevronUp,
  external: ArrowUpRight,
  menu: Menu,
  close: X,
  add: Plus,
  edit: Pencil,
  remove: Trash2,
  search: Search,
  check: Check,
  indeterminate: Minus,
  loading: LoaderCircle,
  success: CircleCheck,
  warning: TriangleAlert,
  error: CircleX,
  info: Info,
  more: Ellipsis,
  panel: PanelLeft,
  overview: LayoutDashboard,
  calendar: CalendarDays,
  time: Clock3,
  person: UserRound,
  people: UsersRound,
  organization: Building2,
  training: Dumbbell,
  operation: ClipboardList,
  business: ChartNoAxesCombined,
  permissions: ShieldCheck,
  settings: Settings,
  activity: Activity,
};

export type FoundationIconProps = Omit<LucideProps, "color" | "size"> & {
  name: IconName;
  color: string;
  size?: IconSize | number;
  decorative?: boolean;
  accessibilityLabel?: string;
};

export function FoundationIcon({
  name,
  color,
  size = "md",
  strokeWidth = iconStrokeWidth.default,
  decorative,
  accessibilityLabel,
  ...props
}: FoundationIconProps) {
  const Icon = iconComponents[name];
  const resolvedSize = typeof size === "number" ? size : iconSize[size];
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
      strokeWidth={strokeWidth}
    />
  );
}

export { iconCatalog, iconSize, iconStrokeWidth };
export type { IconCategory, IconName, IconSize } from "@allfitone/icons";
