import { LucideIcon } from "lucide-react";

export type SidebarItem = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: SidebarItem[]; // ถ้ามี sub-menu ก็ใช้ array นี้
};

export type SidebarSection = {
  label: string;
  items: SidebarItem[];
};

export type SidebarData = SidebarSection[];
