"use client";
import React, { useEffect } from "react";
import { useAuth } from "../../context/authContext"; // สมมติคุณมี custom hook ใช้ context
import { useRouter, usePathname } from "next/navigation";
import { motion } from "motion/react";
import LoadingCircleSpinner from "../ui/LoadingCircleSpinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading, setUser } = useAuth();
  const refAuth = useAuth(); // ใช้ hook เพื่อเข้าถึง context
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    if (
      !isAuthenticated &&
      !isLoading &&
      pathname !== "/auth/login" &&
      pathname !== "/auth/resetpassword" &&
      pathname !== "/auth/forgetpassword"
    ) {
      console.log("Trigger ");
      const isProd = process.env.NODE_ENV === "production";
      window.location.href = isProd ? "/PO_Website/auth/login" : "/auth/login";
    } else {
      console.log(refAuth.user);
      if (!refAuth.isLoading && refAuth.isAuthenticated) {
        if (refAuth.user?.role === "User") {
          console.warn("User role detected, redirecting to PO_Status");
          router.replace("/PO_Status");
        } else {
          router.replace("/purchaseOffice/ViewPOApproveList");
        }
      }
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    // ตรวจจับจาก bfcache
    const handlePageShow = (event: PageTransitionEvent) => {
      if (event.persisted) {
        window.location.reload(); // 🔁 บังคับ refresh
      }
    };

    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (!userData) return;
    const user = JSON.parse(userData);
    setUser(user);
  }, []);

  // // ดัก pageshow จาก bfcache
  // useEffect(() => {
  //   const handlePageShow = (event: PageTransitionEvent) => {
  //     if (event.persisted) {
  //       const isForceLogout = sessionStorage.getItem("force_logout");
  //       if (isForceLogout === "true") {
  //         console.log("Restored from bfcache. Redirecting...");
  //         router.replace("/login");
  //       }
  //     }
  //   };

  //   window.addEventListener("pageshow", handlePageShow);
  //   return () => window.removeEventListener("pageshow", handlePageShow);
  // }, []);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <LoadingCircleSpinner />
      </div>
    ); // ✅ หรือ Skeleton UI ก็ได้
  }

  // if (!isAuthenticated && !isLoading) {
  //   router.replace("/login");
  //   return null; // 🛑 หยุด render
  // }

  // ถ้ายังไม่ล็อกอิน แสดง Loading หรืออะไรชั่วคราวก่อน
  //   if (!isAuthenticated) {
  //     return <div>Loading...</div>;
  //   }

  // ถ้าล็อกอินแล้ว แสดง children
  return <>{children}</>;
};

export default AuthGuard;
