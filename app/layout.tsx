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
import NavProvider from "@/context/navContext";
import Head from "next/head";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/authContext";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { ThemeProvider } from "@/components/theme/theme-provider";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PO Status Tracking",
  description: "PO Status Tracking",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <Head>
        <title>NDS Coporate</title>
      </Head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <AuthGuard>
              <NavProvider>
                {children}
                <Toaster position="top-center" richColors={true} />
              </NavProvider>
            </AuthGuard>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
