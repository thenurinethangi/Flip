import React from "react";
import { OpaqueColorValue } from "react-native";
import {
  House,
  Send,
  Code,
  ChevronRight,
  Bell,
  User,
  Search,
  Layers2,
  Calendar,
  Disc,
  Menu,
  EllipsisVertical,
  ChevronDown,
  Plus,
  Clock,
  CheckCircle,
  Hourglass,
  Heart,
  Cake,
  Gift,
  Balloon,
  ChartPie,
  Play,
} from "lucide-react-native";

type LucideIcon = React.ComponentType<{
  size?: number;
  color?: string | OpaqueColorValue;
}>;

/**
 * Define your app icon names here (no platform mapping needed)
 */
const ICONS = {
  home: House,
  send: Send,
  code: Code,
  chevronRight: ChevronRight,
  ChevronDown: ChevronDown,
  bell: Bell,
  user: User,
  search: Search,
  layers: Layers2,
  Calendar: Calendar,
  Disc: Disc,
  Menu: Menu,
  EllipsisVertical: EllipsisVertical,
  Plus: Plus,
  Clock: Clock,
  CheckCircle: CheckCircle,
  Hourglass: Hourglass,
  Heart: Heart,
  Cake: Cake,
  Gift: Gift,
  Balloon: Balloon,
  ChartPie: ChartPie,
  Play: Play
};

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string | OpaqueColorValue;
};

/**
 * Unified Icon component using Lucide icons
 * Works on iOS, Android, Web (Expo)
 */
export function AppIcon({
  name,
  size = 24,
  color = "#4772FA",
}: IconProps) {
  const IconComponent: LucideIcon = ICONS[name];
  return <IconComponent size={size} color={color} />;
}
