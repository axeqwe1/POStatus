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
  IconArchiveFilled,
  IconCheck,
  IconCircleCheckFilled,
  IconCircleX,
  IconPencil,
  IconTrendingUp,
  IconX,
} from "@tabler/icons-react";
import React, { useEffect, useRef, useState } from "react";
import DataTable from "./data-table";
import { Archived, GetNotifyData, MarkAsRead } from "@/lib/api/notify";
import { useAuth } from "@/context/authContext";
import { NotificationReceivers } from "@/types/datatype";
import { toast } from "sonner";
import { Table } from "@tanstack/react-table";
import { useNotify } from "@/context/notifyContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useIsMobile } from "@/hooks/use-mobile";
import { any } from "zod";

export default function page() {
  const [readable, setReadable] = useState<number>(0);
  const [notRead, setNotRead] = useState<number>(0);
  const [archived, setArchived] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [data, setData] = useState<NotificationReceivers[]>([]);
  const { user } = useAuth();
  // const [markRead, setMarkRead] = useState<string[]>([]);
  const markRead = useRef<string[]>([]);
  const tableRef = useRef<Table<NotificationReceivers> | null>(null);
  const [selectData, setSelecttData] = useState<number>(0);
  const { countNotify } = useNotify();
  const [cooldown, setCooldown] = useState<number>(0);
  const mobile = useIsMobile();
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [cooldown]);

  const fetchNoti = async () => {
    //
    if (user != null) {
      const res = await GetNotifyData(user.id);
      console.log(res.data);
      const tempdata = res.data.notify;
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
      const readable = res.data.countIsRead;
      const notreadable = res.data.countIsNotRead;
      const archived = res.data.countIsArchived;
      const total = object.length;
      console.log(object);
      setReadable(readable);
      setNotRead(notreadable);
      setArchived(archived);
      setTotal(total);
      setData(object);
    }
  };
  const handleMarkAsRead = async (
    recvId: string[],
    table: Table<NotificationReceivers>
  ) => {
    markRead.current = recvId;
    setSelecttData(recvId.length);
    tableRef.current = table;
  };

  const handleMarkAllAsRead = async () => {
    try {
      // asd
      if (markRead.current.length <= 0) {
        toast.warning("Please select data to mark as read");
        return;
      }
      const res = await MarkAsRead(markRead.current);
      if (res.success) {
        const table = tableRef.current;
        if (table != null) table.toggleAllRowsSelected(false);
        setCooldown(5);
        await fetchNoti();
        toast.success(res.message);
      }
      console.log("Marking all notifications as read...");
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleArchivedAll = async () => {
    try {
      // asd
      if (markRead.current.length <= 0) {
        toast.warning("Please select data to archived");
        return;
      }
      const res = await Archived(markRead.current);
      if (res.success) {
        const table = tableRef.current;
        if (table != null) table.toggleAllRowsSelected(false);
        await fetchNoti();
        toast.success(res.message);
      }
    } catch (error) {
      console.error("Error archived:", error);
      toast.error(`Error archived: ${error}`);
    }
  };
  useEffect(() => {
    fetchNoti();
  }, [countNotify]);

  return (
    <div className="px-2">
      <div className=" max-w-6xl mx-auto *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <CardSection
          Readable={readable}
          notRead={notRead}
          archived={archived}
          total={total}
          onMarkAllAsRead={handleMarkAllAsRead}
        />
        {selectData > 0 && (
          <div className="flex flex-row justify-between items-center px-5 bg-blue-200 dark:bg-blue-800 shadow-md w-full h-10 rounded">
            <div className="flex flex-col items-center justify-center ">
              <div>
                <span className="md:text-xl text-sm">
                  Notification selects {selectData} rows.
                </span>
              </div>
            </div>
            <div className="flex flex-row justify-center items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size={"sm"} className="bg-accent">
                    <IconArchiveFilled />
                    Archive
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      <span className="text-lg">Are you absolutely sure?</span>
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      <span className="text-md">
                        The notification you select will not show to table
                        forever
                      </span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        onClick={handleArchivedAll}
                        className="bg-green-500 hover:bg-green-500/50 hover:cursor-pointer rounded text-white"
                      >
                        Confirm
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button
                onClick={handleMarkAllAsRead}
                variant="secondary"
                className="text-white"
                size={"sm"}
                disabled={cooldown > 0}
                data-slot="card"
              >
                <span className="flex flex-row items-center justify-center gap-2">
                  <div className="flex items-center justify-center w-[18px] h-[18px]">
                    {cooldown > 0 ? (
                      <span className="flex items-center">{cooldown}</span>
                    ) : (
                      <IconCircleCheckFilled size={18} />
                    )}
                  </div>
                  Mark all {mobile ? "" : "as Read"}
                </span>
              </Button>
            </div>
          </div>
        )}

        <DataTable
          data={data}
          markAsRead={handleMarkAsRead}
          isLoading={false}
        />
      </div>
    </div>
  );
}
