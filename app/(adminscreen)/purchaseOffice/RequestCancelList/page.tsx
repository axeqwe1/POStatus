"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";

interface RequestCancelItem {
  id: string;
  requester: string;
  reason: string;
  date: string;
  status: "Pending" | "Approved" | "Rejected";
}

const mockData: RequestCancelItem[] = [
  {
    id: "REQ001",
    requester: "John Doe",
    reason: "Duplicate order",
    date: "2025-06-25",
    status: "Pending",
  },
  {
    id: "REQ002",
    requester: "Jane Smith",
    reason: "Incorrect details",
    date: "2025-06-24",
    status: "Approved",
  },
  {
    id: "REQ003",
    requester: "Mark Johnson",
    reason: "Customer request",
    date: "2025-06-23",
    status: "Rejected",
  },
];

export default function RequestCancelPage() {
  return (
    <div className="p-6 space-y-6">
      {/* Summary Card */}
      <Card className="bg-muted shadow">
        <CardHeader>
          <CardTitle>Total Request To Cancel</CardTitle>
          <CardDescription>จำนวนคำขอยกเลิกทั้งหมด</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{mockData.length}</div>
        </CardContent>
      </Card>

      {/* Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <Input
          className="w-full md:w-1/3"
          placeholder="ค้นหาโดยชื่อหรือหมายเลขคำขอ..."
        />
        <Select>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="เลือกสถานะ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Card List */}
      <ScrollArea className="h-[500px] border rounded-2xl p-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockData.map((item) => (
            <Card key={item.id} className="shadow-sm border">
              <CardHeader>
                <CardTitle>{item.id}</CardTitle>
                <CardDescription>{item.date}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-medium">Requester: {item.requester}</p>
                <p className="text-sm text-muted-foreground">
                  Reason: {item.reason}
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                {/* <Badge
                  variant="outline"
                  className={`${
                    item.status === "Pending"
                      ? "bg-yellow-200 dark:bg-yellow-900"
                      : item.status === "Approved"
                      ? "bg-green-200 dark:bg-green-900"
                      : "bg-red-200 dark:bg-red-900"
                  }`}
                >
                  {item.status}
                </Badge> */}
                <div className="flex flex-row gap-3">
                  <Button className="text-white hover:cursor-pointer">
                    Confirm
                  </Button>
                  <Button
                    className="hover:cursor-pointer"
                    variant={"destructive"}
                  >
                    Reject
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}
