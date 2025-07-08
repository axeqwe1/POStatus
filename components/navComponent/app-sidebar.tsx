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
  useSidebar,
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
  purchasingOfficerSideBar,
  UserManagement,
} from "@/data/sidebar-menu";
import { useAuth } from "@/context/authContext";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useSidebarState } from "@/hooks/useSidebarState";
import { useNotify } from "@/context/notifyContext";
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
    // {
    //   title: "User",
    //   url: "/users",
    //   icon: IconUsers,
    // },
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
  const [fillterNav, setFilterNav] = useState<any[]>([]);
  const { user } = useAuth();
  const isProd = process.env.NODE_ENV === "production";
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  const { state } = useSidebar();
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const { countNotify } = useNotify();
  useEffect(() => {
    const filteredNavMain = data.navMain.filter((item) => {
      // ถ้าไม่ใช่ Admin → ซ่อนเมนู "User"
      if (user?.role !== "Admin" && item.title === "User") {
        return false;
      }
      return true;
    });
    setFilterNav(filteredNavMain);
    console.log("User Role:", user?.role);
  }, [user]);
  useEffect(() => {
    if (state === "collapsed") {
      setIsCollapsed(true);
    } else {
      setIsCollapsed(false);
    }
  }, [state, isCollapsed]);
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex flex-row  items-center gap-3">
                  <img
                    src={`${basePath}/PO_Logo.png`}
                    alt="Image"
                    className={`rounded ${
                      isCollapsed ? "max-h-[30px]" : "max-h-[60px]"
                    } object-cover`}
                  />
                  <div className="">
                    <span className="text-base font-semibold">
                      <span className="text-secondary">P</span>
                      <span>O Purchase Order.</span>
                    </span>
                    <p className="text-xs">{user?.supplierName}</p>
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="">
        {/* <NavMain items={fillterNav} /> */}
        <NavSidebar items={fillterNav} LabelName={"Supplier Menu"} />
        {(user?.role === "Admin" ||
          user?.role === "PurchaseOfficer" ||
          user?.role === "SupperAdmin") && (
          <NavSidebar
            items={purchasingOfficerSideBar}
            LabelName={"Purchasing Officer Menu"}
          />
        )}

        {(user?.role === "Admin" || user?.role === "SupperAdmin") && (
          <NavSidebar items={UserManagement} LabelName={"User Management"} />
        )}

        {/* <NavSidebar items={userDataSideBar} LabelName={"User"} /> */}
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSidebar items={masterDataSidebar} LabelName={"Master Data"} />
        <NavSidebar items={organizeDataSideBar} LabelName={"Organization"} />
        <NavSidebar items={stockDataSideBar} LabelName={"Stock"} />
        <NavSidebar items={userDataSideBar} LabelName={"User"} /> */}
        {/* <NavSecondary items={data.navSecondary} className="" /> */}
      </SidebarContent>
      <SidebarFooter className="relative">
        <NavUser user={user} />
        {countNotify > 0 && state == "collapsed" && (
          <span className="flex flex-row items-center justify-center absolute top-1.5 right-1 h-1.75 w-1.75 rounded-full bg-red-500 text-white text-[9px]"></span>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
