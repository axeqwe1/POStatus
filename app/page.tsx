// ตัวอย่างใน app/page.tsx หรือ components/SomeForm.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
export default function Home() {
  const router = useRouter();
  return (
    <main>
      <h1 className="text-2xl font-bold mb-4">Welcome Dashboard</h1>
      <Input placeholder="ค้นหา..." className="mb-2" />
      <div className="flex flex-wrap items-center gap-2 md:flex-row pl-3">
        <Button onClick={() => router.push("./dashboard")} variant="outline">
          Button
        </Button>
      </div>
    </main>
  );
}
