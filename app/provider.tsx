// app/providers.tsx
"use client";

import { AuthProvider } from "@/context/authContext";
import AuthGuard from "@/components/AuthGuard/AuthGuard";
import { NotifyProvider } from "@/context/notifyContext";
import NavProvider from "@/context/navContext";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
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
            <NavProvider>
              {children}
              <Toaster position="top-center" richColors={true} />
            </NavProvider>
          </NotifyProvider>
        </AuthGuard>
      </AuthProvider>
    </ThemeProvider>
  );
}
