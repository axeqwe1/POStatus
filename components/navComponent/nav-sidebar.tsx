"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { SidebarItem } from "@/types/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

interface NavProductProps {
  items: SidebarItem[];
  LabelName: string;
}

export function NavSidebar({ items, LabelName }: NavProductProps) {
  const pathname = usePathname();
  const firstPath = pathname.split("/").filter(Boolean)[0]; // "product"
  return (
    <SidebarGroup>
      <SidebarGroupLabel>{LabelName}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) =>
          item.items && item.items.length > 0 ? (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={`/${firstPath}` == item.url}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="group-data-[state=open]/collapsible:bg-primary-foreground"
                  >
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <Link href={subItem.url} passHref>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname == subItem.url}
                          >
                            <span>{subItem.title}</span>
                          </SidebarMenuSubButton>
                        </Link>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            // กรณีไม่มี sub-menu
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                className={`hover:cursor-pointer ${
                  pathname === item.url
                    ? "bg-primary text-white hover:bg-primary hover:text-white"
                    : "hover:bg-muted"
                }`}
                tooltip={item.title}
                asChild
                // isActive={pathname == item.url}
              >
                <Link href={item.url} passHref>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
