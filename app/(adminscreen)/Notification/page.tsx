"use client";
import CardSection from "@/components/Notification/CardSection";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  IconCheck,
  IconCircleCheckFilled,
  IconCircleX,
  IconPencil,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import React, { useState } from "react";

export default function page() {
  const [readable, setReadable] = useState<number>(0);
  const [notRead, setNotRead] = useState<number>(0);

  const handleMarkAllAsRead = async () => {
    try {
      // asd
      console.log("Marking all notifications as read...");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  return (
    <div>
      <div className="h-screen max-w-6xl mx-auto *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <CardSection onMarkAllAsRead={handleMarkAllAsRead} />
        <h1 className="text-2xl font-bold">Notification</h1>
        <p className="text-gray-600">This page is under construction.</p>
      </div>
    </div>
  );
}
