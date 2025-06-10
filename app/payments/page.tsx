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
    <div>
      <Card className="bg-gradient-to-br from-white to-slate-50">
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
          <CardDescription>Card Description</CardDescription>
          <CardAction>Card Action</CardAction>
        </CardHeader>
        <CardContent>
          <DataTable data={users} />
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}
