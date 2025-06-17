"use client";
import React from "react";
import { useAuth } from "../../context/authContext"; // สมมติคุณมี custom hook ใช้ context
import { useRouter, usePathname } from "next/navigation";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const AuthGuard: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login"); // ถ้าไม่ล็อกอิน ให้ไปหน้า login
    }
  }, [isAuthenticated, router, pathname]);

  // ถ้ายังไม่ล็อกอิน แสดง Loading หรืออะไรชั่วคราวก่อน
  //   if (!isAuthenticated) {
  //     return <div>Loading...</div>;
  //   }

  // ถ้าล็อกอินแล้ว แสดง children
  return <>{children}</>;
};

export default AuthGuard;
