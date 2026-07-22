import { forwardRef } from "react";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronUp,
  CircleCheck,
  CircleX,
  Clock3,
  Info,
  LoaderCircle,
  Menu,
  Minus,
  Pencil,
  Plus,
  Search,
  Settings,
  Trash2,
  TriangleAlert,
  UserRound,
  UsersRound,
  X,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";

import { iconSize, iconStrokeWidth, type IconName, type IconSize } from "./index.js";

const iconComponents: Record<IconName, LucideIcon> = {
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
  calendar: CalendarDays,
  time: Clock3,
  person: UserRound,
  people: UsersRound,
  settings: Settings,
  activity: Activity,
};

export type FoundationIconProps = Omit<LucideProps, "size"> & {
  name: IconName;
  size?: IconSize | number;
  decorative?: boolean;
};

export const FoundationIcon = forwardRef<SVGSVGElement, FoundationIconProps>(function FoundationIcon(
  { name, size = "md", strokeWidth = iconStrokeWidth.default, decorative, "aria-label": ariaLabel, ...props },
  ref,
) {
  const Icon = iconComponents[name];
  const resolvedSize = typeof size === "number" ? size : iconSize[size];
  const isDecorative = decorative ?? !ariaLabel;

  return (
    <Icon
      {...props}
      ref={ref}
      size={resolvedSize}
      strokeWidth={strokeWidth}
      aria-label={ariaLabel}
      aria-hidden={isDecorative}
      role={isDecorative ? "presentation" : "img"}
    />
  );
});
