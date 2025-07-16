"use client";

import {
  IconBell,
  IconCreditCard,
  IconDotsVertical,
  IconLogout,
  IconNotification,
  IconPasswordUser,
  IconUserCircle,
} from "@tabler/icons-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { useAuth } from "@/context/authContext";
import { UserDTO } from "@/data/dataDTO";
import { useNotify } from "@/context/notifyContext";

export function NavUser({ user }: { user: UserDTO | null }) {
  const { isMobile, state } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    // Call your logout function here, e.g., signOut()
    // await signOut();
    await logout();
  };
  const { countNotify } = useNotify();
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg grayscale">
                  <AvatarImage src={""} alt={user ? user.name : "NO Name"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
              </div>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">
                  {user ? user.name : "NO Name"}
                </span>
                <span className="text-muted-foreground truncate text-xs">
                  {user
                    ? user.supplierName
                      ? user.supplierName
                      : "NO Supplier"
                    : "No Data"}
                </span>
              </div>
              <div className="relative">
                <IconDotsVertical className="ml-auto size-4" />
                {countNotify > 0 && (
                  <span className="flex flex-row items-center justify-center absolute -top-1.25 -right-0.5 h-1.5 w-1.5 rounded-full bg-red-500 text-white text-[9px]"></span>
                )}
              </div>
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={""} alt={user ? user.name : "NO Name"} />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">
                    {user ? user.name : "NO Name"}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {user
                      ? user.supplierName
                        ? user.supplierName
                        : "NO Supplier"
                      : "No Data"}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {/* <DropdownMenuItem>
                <IconUserCircle />
                Account
              </DropdownMenuItem> */}
              <DropdownMenuItem
                onClick={() => router.push("/auth/changepassword")}
              >
                <IconPasswordUser />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/Notification")}>
                <div className="flex flex-row items-center gap-2 relative">
                  <IconBell />
                  {countNotify > 0 && (
                    <span className="absolute -top-0.5 left-1.75 w-3.5 h-3.5 rounded-full text-white text-[6px] bg-red-500 flex items-center justify-center">
                      {!(countNotify > 99) ? countNotify : "99+"}
                    </span>
                  )}
                  <span className="flex flex-row items-center justify-center gap-1">
                    Notifications{" "}
                  </span>
                </div>
              </DropdownMenuItem>
              {/* <DropdownMenuItem
                onClick={() => router.push("/FullNotifications")}
              >
                <IconBell />
                test signalR
              </DropdownMenuItem> */}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <IconLogout className="text-red-500" />
              <span className="">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
