"use client";
import { DataTable } from "./data-table";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CustomTabs from "@/components/CustomTabs";
import { IconLayoutColumns } from "@tabler/icons-react";
import { users } from "@/data/dummyData";
export default function Page() {
  return (
    <div className="max-w-[1400px]">
      <DataTable data={users} />
    </div>
  );
}
