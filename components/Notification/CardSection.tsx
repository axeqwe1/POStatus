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

interface CardSectionProps {
  onMarkAllAsRead?: () => void;
}
export default function CardSection({ onMarkAllAsRead }: CardSectionProps) {
  const [cooldown, setCooldown] = useState<number>(0);
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
      <Card className="w-full p-6  shadow-md rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between">
          {/* <CardDescription>test</CardDescription> */}
          <CardTitle className="text-lg font-semibold">
            Notification {"(0)"}
          </CardTitle>
          <CardAction>
            <Button
              onClick={handleMarkAllAsRead}
              variant="secondary"
              className="text-white"
              size={"lg"}
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
                Mark all as Read
              </span>
            </Button>
          </CardAction>
        </CardHeader>
      </Card>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 mt-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card">
        <Card className="@container/card w-full p-6  shadow-md rounded-lg justify-center">
          <CardHeader className="flex flex-row items-center justify-between">
            {/* <CardDescription>test</CardDescription> */}
            <CardTitle className="text-lg font-semibold">Not Read</CardTitle>
            <CardAction>
              <Badge variant={"destructive"} className="w-35 h-10 text-white">
                <span className="text-lg">10 Not Read</span>
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
              <Badge variant={"default"} className="w-35 h-10 text-white">
                <span className="text-lg">10 Readable</span>
              </Badge>
            </CardAction>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
