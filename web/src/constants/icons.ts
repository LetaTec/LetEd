import {
  ArrowRight,
  BookOpenText,
  ChartSpline,
  Dices,
  Grid3x3,
  Landmark,
  ReceiptIndianRupee,
  Scale,
  Search,
  TrendingDown,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Menu,
  Pause,
  Play,
  X,
  type LucideIcon,
} from 'lucide-react';

export const ICONS = {
  arrowRight: ArrowRight,
  arrowUpRight: ArrowUpRight,
  check: Check,
  chevronLeft: ChevronLeft,
  chevronRight: ChevronRight,
  close: X,
  error: CircleAlert,
  menu: Menu,
  pause: Pause,
  play: Play,
  passwordHide: EyeOff,
  passwordShow: Eye,
  search: Search,
  success: CircleCheck,
  topicBank: Landmark,
  topicDemandSupply: ChartSpline,
  topicDepreciation: TrendingDown,
  topicGst: ReceiptIndianRupee,
  topicJournal: BookOpenText,
  topicMatrices: Grid3x3,
  topicProbability: Dices,
  topicTrialBalance: Scale,
} as const satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof ICONS;

export const ICON_SIZE = {
  sm: 16,
  md: 20,
  lg: 24,
  xl: 44,
} as const;

export type IconSize = keyof typeof ICON_SIZE;
