import {
    Balloon,
    Bell,
    Cake,
    Calendar,
    ChartPie,
    CheckCircle,
    ChevronDown,
    ChevronRight,
    Clock,
    Code,
    Disc,
    EllipsisVertical,
    Gift,
    Heart,
    Hourglass,
    House,
    Layers2,
    Menu,
    Play,
    Plus,
    Search,
    Send,
    User,
    X,
} from "lucide-react-native";
import React from "react";
import { OpaqueColorValue } from "react-native";

type LucideIcon = React.ComponentType<{
  size?: number;
  color?: string | OpaqueColorValue;
}>;

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
  Play: Play,
  X: X,
};

export type IconName = keyof typeof ICONS;

type IconProps = {
  name: IconName;
  size?: number;
  color?: string | OpaqueColorValue;
};

export function AppIcon({ name, size = 24, color = "#4772FA" }: IconProps) {
  const IconComponent: LucideIcon = ICONS[name];
  return <IconComponent size={size} color={color} />;
}
