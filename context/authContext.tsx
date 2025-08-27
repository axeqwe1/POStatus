"use client";

import { UserDTO } from "@/data/dataDTO";
import { me, signIn, signOut } from "@/lib/api/auth";
import { getSuppliers } from "@/lib/api/supplier";
import { apiService } from "@/lib/axios";
import { AxiosResponse } from "axios";
import React, { ReactNode, useEffect } from "react";
import { useState, createContext } from "react";
import { checkDomainOfScale } from "recharts/types/util/ChartUtils";

interface AuthContextProps {
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>; // ใช้สำหรับการเปลี่ยนแปลงสถานะการล็อกอิน
  isLoading: boolean;
  user: UserDTO | null;
  setUser: React.Dispatch<React.SetStateAction<UserDTO | null>>; // ใช้สำหรับการเปลี่ยนแปลงข้อมูลผู้ใช้
  login: (username: string, password: string) => Promise<AxiosResponse | null>; // เพิ่มฟังก์ชัน login ถ้าต้องการ
  logout: () => Promise<void>; // เพิ่มฟังก์ชัน logout ถ้าต้องการ
}

const AuthContext = React.createContext<AuthContextProps | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // ⬅️ เพิ่ม
  const [user, setUser] = React.useState<UserDTO | null>(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await me(); // 🔁 เรียก API /auth/me
        if (!document.cookie.includes("auth_status")) {
          console.log("not auth");
          setUser(null); // ถ้าไม่มี refreshToken ใน cookie ให้ user เป็น null
          setIsAuthenticated(false); // และสถานะการล็อกอินเป็น false
          return;
        }
        console.log(res);
        if (res.status === 200) {
          // console.log("User data:", res);
          const data: UserDTO = {
            id: res.data.userId,
            name: res.data.firstname + " " + res.data.lastname,
            email: res.data.email,
            supplierId: res.data.supplierId,
            supplierName: res.data.supplierName,
            username: res.data.username,
            role: res.data.roleName, // สมมติว่า API ส่ง role มาด้วย
          };
          localStorage.setItem("user", JSON.stringify(data)); // Save user data to localStorage
          setUser(data);
          setIsAuthenticated(true);
          setIsLoading(false);
        } else {
          setIsAuthenticated(false);
        }
      } catch (err) {
        console.error("Failed to fetch user", err);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false); // ✅ โหลดเสร็จแล้ว
      }
    };

    fetchMe();
  }, []);

  const login = async (
    username: string,
    password: string
  ): Promise<AxiosResponse | null> => {
    try {
      const res = await signIn(username, password);
      if (res.status === 200) {
        console.log(res.data);
        const data: UserDTO = {
          id: res.data.userId,
          name: res.data.firstname + " " + res.data.lastname,
          email: res.data.email,
          supplierId: res.data.supplierId,
          supplierName: res.data.supplierName,
          username: res.data.username,
          role: res.data.roleName, // สมมติว่า API ส่ง role มาด้วย
        };
        localStorage.setItem("user", JSON.stringify(data)); // Save user data to localStorage
        setUser(data);
        setIsAuthenticated(true); // Set authenticated state

        // Handle successful login, e.g., redirect to dashboard
        console.log("Login successful:", res.data);
      }
      return res; // <--- คืนค่า response
    } catch (err: any) {
      console.error("Login error", err);
      return err.response || null; // คืน error response
    }
  };

  const logout = async () => {
    try {
      const res = await signOut();
      if (res.status === 200) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("user");

        // // ✅ ตั้ง flag ว่า logout ไปแล้ว
        // sessionStorage.setItem("force_logout", "true");

        // ✅ redirect ไปหน้า login
        const isProd = process.env.NODE_ENV === "production";
        window.location.href = isProd
          ? "/PO_Website/auth/login"
          : "/auth/login";
      }
    } catch (err) {
      console.error("Logout error", err);
    }
  };
  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        user,
        login,
        setUser,
        isLoading,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
