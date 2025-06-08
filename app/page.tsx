// ตัวอย่างใน app/page.tsx หรือ components/SomeForm.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <main>
      <SidebarTrigger/>
      <h1 className="text-2xl font-bold mb-4">Welcome Dashboard</h1>
      <Input placeholder="ค้นหา..." className="mb-2" />
      <div className="flex flex-wrap items-center gap-2 md:flex-row pl-3">
        <Button variant="outline">Button</Button>
      </div>
    </main>
  );
}