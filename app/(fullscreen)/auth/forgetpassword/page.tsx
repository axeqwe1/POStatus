"use client";
import { ForgetPasswordForm } from "@/components/forgot-password-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { IconArrowBigLeft } from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
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
  useEffect(() => {
    console.log(token);
  }, []);
  return (
    <div className="h-screen w-screen bg-gradient-to-tr from-violet-200 to-violet-400 ">
      <div className=" p-6 md:p-10 h-full flex flex-col items-center justify-center">
        <div className="w-full max-w-sm ">
          <Card className="w-full mx-auto ">
            <CardHeader>
              <CardTitle>
                <div className="flex justify-center gap-2 md:justify-start">
                  <a
                    onClick={() => router.back()}
                    className="flex items-center gap-2 font-medium hover:cursor-pointer"
                  >
                    <IconArrowBigLeft className="size-4 text-primary" />
                    Back
                  </a>
                </div>
              </CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <ForgetPasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
