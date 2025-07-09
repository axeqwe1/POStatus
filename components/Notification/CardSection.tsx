import React, { useEffect, useState } from "react";
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
import { useIsMobile } from "@/hooks/use-mobile";

interface CardSectionProps {
  onMarkAllAsRead?: () => void;
  notRead: number;
  Readable: number;
  archived: number;
  total: number;
}
export default function CardSection({
  onMarkAllAsRead,
  notRead,
  Readable,
  archived,
  total,
}: CardSectionProps) {
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
  const handleMarkAllAsRead = () => {
    if (onMarkAllAsRead) {
      onMarkAllAsRead();
      setCooldown(5);
    }
  };
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2 mt-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card w-full p-6  shadow-md rounded-lg justify-center">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardDescription>test</CardDescription> */}
            <CardTitle className="text-lg font-semibold">
              Notification is not archived
            </CardTitle>
            <CardAction>
              <Badge className="w-10 h-10 rounded-full bg-blue-500 text-white">
                <span className="text-lg">{total}</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="@container/card w-full p-6  shadow-md rounded-lg justify-center">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardDescription>test</CardDescription> */}
            <CardTitle className="text-lg font-semibold">Not Read</CardTitle>
            <CardAction>
              <Badge
                variant={"destructive"}
                className="w-10 h-10 rounded-full text-white"
              >
                <span className="text-lg">{notRead}</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="@container/card w-full p-6  shadow-md rounded-lg justify-center">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardDescription>test</CardDescription> */}

            <CardTitle className="text-lg font-semibold flex flex-row items-center gap-2">
              Readable
              <IconPencil size={18} />
            </CardTitle>
            <CardAction>
              <Badge
                variant={"default"}
                className="w-10 h-10 rounded-full text-white"
              >
                <span className="text-lg">{Readable}</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
        <Card className="@container/card w-full p-6  shadow-md rounded-lg justify-center">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardDescription>test</CardDescription> */}

            <CardTitle className="text-lg font-semibold flex flex-row items-center gap-2">
              Archived
              <IconPencil size={18} />
            </CardTitle>
            <CardAction>
              <Badge
                variant={"secondary"}
                className="w-10 h-10 rounded-full text-white"
              >
                <span className="text-lg">{archived}</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
