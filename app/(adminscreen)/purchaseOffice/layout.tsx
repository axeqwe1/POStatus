"use client";
import { useAuth } from "@/context/authContext";
import { redirect, useRouter } from "next/navigation";
import React, { useEffect } from "react";

interface LayoutProps {
  children?: React.ReactNode;
}
export default function layout({ children }: LayoutProps) {
  const { user } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (user && user.role === "User") {
      router.replace("/PO_Status"); // ✅ ป้องกันไปต่อ
    }
  }, [user]);

  if (user && user.role === "User") return null;
  return <>{children}</>;
}
