import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "@/styles/globals.css";
import {
  Sidebar,
  SidebarProvider,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navComponent/app-sidebar";
import { Navbar } from "@/components/navbar";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/site-header";
import { Suspense } from "react";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { useAuth } from "@/context/authContext";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "PO Status Tracking",
  description: "PO Status Tracking",
};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="sidebar" collapsible="icon" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
