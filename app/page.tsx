import { redirect } from "next/navigation";

export default function Page() {
  // ถ้าไม่ล็อกอิน ให้ redirect ไปหน้า login
  // ถ้าใช้ useAuth ต้อง import useAuth จาก context/authContext.tsx
  redirect("/auth/login");
}
