"use client";

import * as React from "react";
import {
  IconBox,
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
import { NavSidebar } from "./nav-sidebar";
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
import { useAuth } from "@/context/authContext";
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "PO Status",
      url: "/PO_Status",
      icon: IconReceipt,
    },
    // {
    //   title: "Example-Data-Table",
    //   url: "/payments",
    //   icon: IconListDetails,
    // },
    {
      title: "User",
      url: "/users",
      icon: IconUsers,
    },
    // {
    //   title: "Supplier",
    //   url: "/Supplier",
    //   icon: IconBox,
    // },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // const masterdataSidebar = sidebarData.find(
  //   (item) => item.label.replace(/\s+/g, "").toLowerCase() === "masterdata"
  // );
  const [fillterNav, setFilterNav] = React.useState<any[]>([]);
  const { user } = useAuth();
  console.log(user);
  React.useEffect(() => {
    const filteredNavMain = data.navMain.filter((item) => {
      // ถ้าไม่ใช่ Admin → ซ่อนเมนู "User"
      if (user?.role !== "Admin" && item.title === "User") {
        return false;
      }
      return true;
    });
    setFilterNav(filteredNavMain);
  }, [user]);
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
                  src="/PO_Logo.png"
                  alt="Image"
                  className="dark:brightness-[0.2] dark:grayscale h-[60px]"
                />
                <span className="text-base font-semibold">
                  <span className="text-secondary">P</span>
                  <span>O Purchase Order.</span>
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="">
        <NavMain items={fillterNav} />
        {/* <NavSidebar items={userDataSideBar} LabelName={"User"} /> */}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSidebar items={masterDataSidebar} LabelName={"Master Data"} />
        <NavSidebar items={organizeDataSideBar} LabelName={"Organization"} />
        <NavSidebar items={stockDataSideBar} LabelName={"Stock"} />
        <NavSidebar items={userDataSideBar} LabelName={"User"} /> */}

        {/* <NavSecondary items={data.navSecondary} className="" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
