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

export function NavUser({ user }: { user: UserDTO | null }) {
  const { isMobile } = useSidebar();
  const { logout } = useAuth();
  const router = useRouter();
  const handleLogout = async () => {
    // Call your logout function here, e.g., signOut()
    // await signOut();
    await logout();
  };
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
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
              <IconDotsVertical className="ml-auto size-4" />
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
              <DropdownMenuItem
                onClick={() => router.push("/FullNotifications")}
              >
                <IconBell />
                Notifications
              </DropdownMenuItem>
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
