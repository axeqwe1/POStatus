"use client";

import * as React from "react";
import {
  IconCamera,
  IconChartBar,
  IconDashboard,
  IconDatabase,
  IconFileAi,
  IconFileDescription,
  IconFileWord,
  IconFolder,
  IconHelp,
  IconInnerShadowTop,
  IconListDetails,
  IconReceipt,
  IconReceiptDollar,
  IconReport,
  IconSearch,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";

import { NavDocuments } from "@/components/navComponent/nav-documents";
import { NavMain } from "@/components/navComponent/nav-main";
import { NavUser } from "@/components/navComponent/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavSidebar } from "./navComponent/nav-sidebar";
import {
  BookAIcon,
  Bot,
  Settings2,
  SquareActivityIcon,
  TruckElectricIcon,
} from "lucide-react";
import {
  masterDataSidebar,
  stockDataSideBar,
  userDataSideBar,
  organizeDataSideBar,
} from "@/data/sidebar-menu";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: IconDashboard,
    },
    {
      title: "Example-Data-Table",
      url: "/payments",
      icon: IconListDetails,
    },
    {
      title: "Order",
      url: "/order",
      icon: IconReceiptDollar,
    },
    {
      title: "Shipments",
      url: "/Shipments",
      icon: TruckElectricIcon,
    },
  ],
  // navClouds: [
  //   {
  //     title: "Capture",
  //     icon: IconCamera,
  //     isActive: true,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Proposal",
  //     icon: IconFileDescription,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Prompts",
  //     icon: IconFileAi,
  //     url: "#",
  //     items: [
  //       {
  //         title: "Active Proposals",
  //         url: "#",
  //       },
  //       {
  //         title: "Archived",
  //         url: "#",
  //       },
  //     ],
  //   },
  // ],
  // navProduct: [
  //   {
  //     title: "ProductManagement",
  //     url: "#",
  //     icon: SquareActivityIcon,
  //     // isActive: true,
  //     items: [],
  //   },
  //   {
  //     title: "Models",
  //     url: "#",
  //     icon: Bot,
  //     items: [
  //       {
  //         title: "Genesis",
  //         url: "#",
  //       },
  //       {
  //         title: "Explorer",
  //         url: "#",
  //       },
  //       {
  //         title: "Quantum",
  //         url: "#",
  //       },
  //     ],
  //   },
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: Settings2,
  //     items: [
  //       // {
  //       //   title: "General",
  //       //   url: "#",
  //       // },
  //       // {
  //       //   title: "Team",
  //       //   url: "#",
  //       // },
  //       // {
  //       //   title: "Billing",
  //       //   url: "#",
  //       // },
  //       // {
  //       //   title: "Limits",
  //       //   url: "#",
  //       // },
  //     ],
  //   },
  // ],
  // navSecondary: [
  //   {
  //     title: "Settings",
  //     url: "#",
  //     icon: IconSettings,
  //   },
  //   {
  //     title: "Get Help",
  //     url: "#",
  //     icon: IconHelp,
  //   },
  //   {
  //     title: "Search",
  //     url: "#",
  //     icon: IconSearch,
  //   },
  // ],
  // documents: [
  //   {
  //     name: "Data Library",
  //     url: "#",
  //     icon: IconDatabase,
  //   },
  //   {
  //     name: "Reports",
  //     url: "#",
  //     icon: IconReport,
  //   },
  //   {
  //     name: "Word Assistant",
  //     url: "#",
  //     icon: IconFileWord,
  //   },
  // ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const masterdataSidebar = sidebarData.find(
  //   (item) => item.label.replace(/\s+/g, "").toLowerCase() === "masterdata"
  // );
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <img
                  src="/background-coporate-transparent.png"
                  alt="Image"
                  className="dark:brightness-[0.2] dark:grayscale h-[60px]"
                />
                <span className="text-base font-semibold">
                  <span className="text-red-700">N</span>
                  <span>DS Coporate.</span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavDocuments items={data.documents} /> */}
        <NavSidebar items={masterDataSidebar} LabelName={"Master Data"} />
        <NavSidebar items={organizeDataSideBar} LabelName={"Organization"} />
        <NavSidebar items={stockDataSideBar} LabelName={"Stock"} />
        <NavSidebar items={userDataSideBar} LabelName={"User"} />

        {/* <NavSecondary items={data.navSecondary} className="" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
