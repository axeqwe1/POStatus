"use client";
import { ChangePasswordForm } from "@/components/change-password-form";
import { LoginForm } from "@/components/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { IconArrowAutofitLeft, IconArrowBigLeft } from "@tabler/icons-react";
import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

export default function page() {
  const router = useRouter();
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
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
