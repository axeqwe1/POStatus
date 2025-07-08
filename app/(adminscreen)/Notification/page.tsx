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
import React, { useEffect, useState } from "react";
import DataTable from "./data-table";
import { GetNotifyData } from "@/lib/api/notify";
import { useAuth } from "@/context/authContext";
import { NotificationReceivers } from "@/types/datatype";

export default function page() {
  const [readable, setReadable] = useState<number>(0);
  const [notRead, setNotRead] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<NotificationReceivers[]>([]);
  const { user } = useAuth();
  const handleMarkAllAsRead = async () => {
    try {
      // asd
      console.log("Marking all notifications as read...");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  useEffect(() => {
    const fetchNoti = async () => {
      //
      if (user != null) {
        const res = await GetNotifyData(user.id);
        console.log(res.data);
        const tempdata = res.data;
        const object: NotificationReceivers[] = tempdata
          .map((item: any) => {
            return {
              noti_id: item.noti_id,
              noti_recvId: item.noti_recvId,
              isRead: item.isRead,
              isArchived: item.isArchived,
              notification: item.notification,
            };
          })
          .sort((a: NotificationReceivers, b: NotificationReceivers) => {
            return (
              new Date(b.notification.createAt).getTime() -
              new Date(a.notification.createAt).getTime()
            );
          })
          .sort(
            (a: NotificationReceivers, b: NotificationReceivers) =>
              Number(a.isRead) - Number(b.isRead)
          );
        const readable = object.filter((item) => item.isRead).length;
        const notreadable = object.filter((item) => !item.isRead).length;
        const total = object.length;
        setReadable(readable);
        setNotRead(notreadable);
        setTotal(total);
        setData(object);
      }
    };
    fetchNoti();
  }, []);

  return (
    <div>
      <div className=" max-w-6xl mx-auto *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <CardSection
          Readable={readable}
          notRead={notRead}
          total={total}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        <DataTable data={data} isLoading />
      </div>
    </div>
  );
}
