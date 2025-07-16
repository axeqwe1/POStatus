"use client";
import { LoginForm } from "@/components/login-form";
import { ResetPasswordForm } from "@/components/AuthForm/reset-password-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/context/authContext";
import { IconArrowBigLeft } from "@tabler/icons-react";
import { GalleryVerticalEnd } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { resetPasswordToken } from "@/lib/api/auth";
import { toast } from "sonner";
import { resetPassword } from "@/lib/api/user";

export default function page() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();
  const pathname = usePathname();
  const refAuth = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [userId, setUserId] = useState<number | null>();
  const [remainingTime, setRemainingTime] = useState<number>(0);
  const [expire, setExpire] = useState<string>("");
  const [email, setEmail] = useState<string>("");
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
    const targetTime = new Date(expire).getTime();
    const interval = setInterval(() => {
      const now = Date.now();
      const diff = Math.max(0, targetTime - now);
      setRemainingTime(diff);
      if (diff <= 0) {
        clearInterval(interval);
        alert("Time out");
        router.replace("/auth/forgetpassword"); // ✅ เปลี่ยนไปหน้าที่ต้องการ
      }
    }, 1000); // update ทุก 1 วิ

    return () => clearInterval(interval); // cleanup
  }, [expire, router]);
  const checkToken = async (token: string): Promise<boolean> => {
    const res = await resetPasswordToken(token);
    console.log(res);
    setUserId(res.userId);
    setExpire(res.expires);
    setEmail(res.email);
    if (res.code && res.code == "ERR_BAD_REQUEST") {
      setOpen(false);
      router.replace("/auth/forgetpassword");
      return false;
    }
    setOpen(true);
    return true;
  };
  useEffect(() => {
    console.log(token);
    checkToken(token!);
  }, []);

  const handleSubmit = async (newPassword: string, confirmPassword: string) => {
    //
    if (newPassword != confirmPassword) {
      toast.error("New password and confirm password is incorrect.");
      return;
    }
    const valid = checkToken(token!);
    if (!valid) {
      return;
    }

    const res = await resetPassword(
      userId!,
      newPassword,
      token as string,
      email
    );
    if (res.status == 200) {
      toast.success("Change password success.");
      router.replace("/auth/login");
    } else {
      toast.error(res.statusText);
    }

    console.log(newPassword, " ", confirmPassword);
  };
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
              <ResetPasswordForm open={open} resetPassword={handleSubmit} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
