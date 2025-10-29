import { IconBoxMultiple, IconCalculator, IconChartDonut, IconFish, IconHome, IconHome2, IconPackage, IconSettings } from "@tabler/icons-react";

export enum SidebarItems {
  Launch = "Launch",
  Calculator = "Calculator",
  MultiToon = "Multi-Toon",
  Suits = "Cog Suits",
  Fishing = "Fishing",
  ResourcePks = "Resource Packs",
  Settings = "Settings",
}

export interface NavbarLinkProps {
  icon: typeof IconHome;
  label: string;
  active?: boolean;
  onClick?: () => void;
  page: SidebarItems
}

export const NavbarData = [
  { icon: IconHome2, label: 'Home', page: SidebarItems.Launch },
  { icon: IconBoxMultiple, label: 'Multi-Toon', page: SidebarItems.MultiToon },
  { icon: IconCalculator, label: 'Calculator', page: SidebarItems.Calculator},
  { icon: IconChartDonut, label: 'Cog Suits', page: SidebarItems.Suits},
  { icon: IconFish, label: 'Fishing', page: SidebarItems.Fishing},
  { icon: IconPackage, label: 'Resource Packs', page: SidebarItems.ResourcePks},
  { icon: IconSettings, label: 'Settings', page: SidebarItems.Settings},
]
