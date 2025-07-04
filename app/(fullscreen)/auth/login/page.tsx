"use client";
import { GalleryVerticalEnd } from "lucide-react";

import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/authContext";

export default function LoginPage() {
  const router = useRouter();
  const pathname = usePathname();
  const refAuth = useAuth();
  // Redirect ไป dashboard ถ้า login แล้ว (หลังโหลดเสร็จ)
  useEffect(() => {
    if (!refAuth.isLoading && refAuth.isAuthenticated) {
      if (refAuth.user?.role === "User") {
        console.warn("User role detected, redirecting to PO_Status");
        router.replace("/PO_Status");
      } else {
        router.replace("/purchaseOffice/ViewPOApproveList");
      }
    }
  }, [refAuth.isLoading, refAuth.isAuthenticated, pathname]);

  if (refAuth.isLoading || refAuth.isAuthenticated) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }
  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-violet-200 to-violet-400">
      <div className=" p-6 md:p-10 h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-sm ">
          <Card className="w-full mx-auto ">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-center gap-2 md:justify-start">
                  <a href="#" className="flex items-center gap-2 font-medium">
                    <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                      <GalleryVerticalEnd className="size-4" />
                    </div>
                    PO Status Tracking.
                  </a>
                </div>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
