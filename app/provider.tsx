// app/providers.tsx
"use client";

import { AuthProvider } from "@/context/authContext";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { NotifyProvider } from "@/context/notifyContext";
import NavProvider from "@/context/navContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { createPortal } from "react-dom";
import { useEffect, useState } from "react";
import PortalDebug from "@/components/Portal/NotificationToastPortal";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true); // ✅ DOM พร้อมแล้ว
  }, []);
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <AuthGuard>
          <NotifyProvider>
            <NavProvider>{children}</NavProvider>
            <div id="portal-root" /> {/* 👈 ปลายสุด */}
            <Toaster position="top-center" richColors={true} />
          </NotifyProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
