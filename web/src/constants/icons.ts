import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Menu,
  X,
  type LucideIcon,
} from 'lucide-react';

export const ICONS = {
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  error: CircleAlert,
  menu: Menu,
  passwordHide: EyeOff,
  passwordShow: Eye,
  success: CircleCheck,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_SIZE = {
  sm: 16,
  md: 20,
  lg: 24,
} as const;

export type IconSize = keyof typeof ICON_SIZE;
