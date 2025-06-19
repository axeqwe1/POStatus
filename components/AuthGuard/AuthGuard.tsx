"use client";
import React from "react";
import { useAuth } from "../../context/authContext"; // สมมติคุณมี custom hook ใช้ context
import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";
import LoadingCircleSpinner from "../ui/LoadingCircleSpinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  React.useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingCircleSpinner />
      </div>
    ); // ✅ หรือ Skeleton UI ก็ได้
  }

  // ถ้ายังไม่ล็อกอิน แสดง Loading หรืออะไรชั่วคราวก่อน
  //   if (!isAuthenticated) {
  //     return <div>Loading...</div>;
  //   }

  // ถ้าล็อกอินแล้ว แสดง children
  return <>{children}</>;
};

export default AuthGuard;
