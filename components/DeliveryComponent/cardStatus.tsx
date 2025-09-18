import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PO_Delivery } from "@/types/datatype";
import { de } from "date-fns/locale";
import { Badge } from "../ui/badge";
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
import { ReceiveDelivery } from "@/lib/api/po";
import { ReceiveDeliveryRequest } from "@/data/dataDTO";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";

const progressList = [
  {
    label: "Progress(ETC)",
    Icon: "lucide-circle-check-big",
    mode: "ETC",
  },
  {
    label: "Shipped(ETD)",
    Icon: "lucide-truck",
    mode: "ETD",
  },
  {
    label: "Out for Delivery(ETA)",
    Icon: "lucide-truck",
    mode: "ETA",
  },
  {
    label: "Delivered(ETAFinal)",
    Icon: "lucide-circle-check",
    mode: "ETAFinal",
  },
  {
    label: "Receive",
    Icon: "lucide-check-check",
    mode: "Receive",
  },
];
interface CardStatusProps {
  deliveryData: PO_Delivery | null;
  POno: string;
  receiveCallback: () => void;
  supplierMode: boolean;
}
export function CardStatus({
  deliveryData,
  POno,
  receiveCallback,
  supplierMode,
}: CardStatusProps) {
  const [progress, setProgress] = useState(0);
  const [warning, setWarning] = useState<string[]>([]);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  const { user } = useAuth();
  const onReceive = async (DeliveryID: number, POno: string) => {
    const request: ReceiveDeliveryRequest = {
      PO_DeliveryID: DeliveryID,
      POno: POno,
      CreateBy: user ? user.name : "System",
    };
    console.log(deliveryData);
    const res = await ReceiveDelivery(request);

    if (res.status === 200) {
      toast.success(res.data);
      receiveCallback();
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (deliveryData) {
        if (deliveryData.etc) setProgress(0);
        if (deliveryData.etd) setProgress(30);
        if (deliveryData.eta) setProgress(53);
        if (deliveryData.etaFinal) setProgress(75);
        if (deliveryData.pO_ReceiveDelivery) setProgress(100);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [deliveryData]);
  useEffect(() => {
    if (!deliveryData) return;

    const strArr: string[] = [];
    const { etc, etd, eta, etaFinal, pO_ReceiveDelivery } = deliveryData;

    // ตรวจสอบ field ว่างทั่วไป
    if (etc == null) strArr.push("Supplier still not enter ETC Information");
    if (etd == null) strArr.push("Supplier still not enter ETD Information");
    if (eta == null) strArr.push("Supplier still not enter ETA Information");
    if (etaFinal == null)
      strArr.push("Supplier still not enter Delivery Information");
    if (pO_ReceiveDelivery == null)
      strArr.push("Purchase Officer still not receive");
    // ตรวจสอบการข้าม Step
    const steps = [etc, etd, eta, etaFinal];
    const stepNames = ["ETC", "ETD", "ETA", "ETAFinal", "Receive"];
    const skippedSteps: string[] = [];

    for (let i = 0; i < steps.length; i++) {
      // ถ้า step ปัจจุบันว่าง แต่ step หลังมีค่า → ข้าม step
      if (!steps[i] && steps.slice(i + 1).some((v) => v)) {
        skippedSteps.push(stepNames[i]);
      }
    }

    if (skippedSteps.length > 0) {
      setIsWarning(true);
      //   skippedSteps.forEach((s) => strArr.push(`Step ${s} is skipped!`));
    } else {
      setIsWarning(false);
    }

    setWarning(strArr);
  }, [deliveryData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Delivery Status</CardTitle>
        <CardDescription></CardDescription>
        <CardAction>{/* <Button variant="link">Sign Up</Button> */}</CardAction>
      </CardHeader>
      <CardContent className="px-3 sm:px-6">
        <div className="flex justify-center items-center ">
          <div className="flex justify-between w-full gap-1 sm:gap-4 py-2">
            {progressList.map((item, index) => {
              const isActive =
                (item.mode === "ETC" && deliveryData?.etc) ||
                (item.mode === "ETD" && deliveryData?.etd) ||
                (item.mode === "ETA" && deliveryData?.eta) ||
                (item.mode === "ETAFinal" && deliveryData?.etaFinal) ||
                (item.mode === "Receive" && deliveryData?.pO_ReceiveDelivery);
              return (
                <div className=" text-center w-full" key={index}>
                  <div
                    className="text-center w-full"
                    key={`${index}+${item.label}`}
                  >
                    <div
                      className={`mx-auto flex items-center justify-center rounded-full 
                        w-8 h-8 sm:w-12 sm:h-12 lg:w-14 lg:h-14 text-xs sm:text-base lg:text-xl
                        ${
                          isWarning && isActive
                            ? "bg-red-300 text-red-700"
                            : isActive
                            ? progress != 100
                              ? deliveryData.etaFinal
                                ? "bg-yellow-300 text-blue-700"
                                : "bg-blue-300 text-blue-700"
                              : "bg-green-300 text-green-800"
                            : "bg-gray-300 text-gray-600"
                        }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={`lucide ${item.Icon} size-4 lg:size-5`}
                        aria-hidden="true"
                      >
                        {(item.mode === "ETA" || item.mode === "ETD") && (
                          <>
                            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"></path>
                            <path d="M15 18H9"></path>
                            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"></path>
                            <circle cx="17" cy="18" r="2"></circle>
                            <circle cx="7" cy="18" r="2"></circle>
                          </>
                        )}
                        {(item.mode === "ETC" || item.mode === "ETAFinal") && (
                          <>
                            <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
                            <path d="m9 11 3 3L22 4"></path>
                          </>
                        )}
                        {item.mode === "Receive" && (
                          <>
                            <path d="M18 6 7 17l-5-5" />
                            <path d="m22 10-7.5 7.5L13 16" />
                          </>
                        )}
                      </svg>
                    </div>
                    <div className="text-[8px] sm:text-xs mt-1 line-clamp-2">
                      {(() => {
                        if (!deliveryData) return "No Date";

                        // mapping mode -> field ของ deliveryData
                        const modeFieldMap: Record<
                          string,
                          Date | string | null | undefined
                        > = {
                          ETC: deliveryData.etc,
                          ETD: deliveryData.etd,
                          ETA: deliveryData.eta,
                          ETAFinal: deliveryData.etaFinal,
                          Receive: deliveryData.pO_ReceiveDelivery
                            ? deliveryData.pO_ReceiveDelivery.createDate
                            : undefined,
                        };
                        // if (deliveryData.pO_ReceiveDelivery)
                        //   // console.log(modeFieldMap);
                        const dateValue = modeFieldMap[item.mode];
                        if (!dateValue) return "No Date";

                        return new Date(dateValue).toLocaleString("th-TH", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                        });
                      })()}
                    </div>
                    <div className="text-[8px] sm:text-xs mt-1 font-medium">
                      {item.label}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-3 sm:px-6">
        <div className="space-y-6 w-full">
          <Progress value={progress} className="w-full" />
          <div className="text-xs mb-2 flex flex-row gap-2 items-center justify-start">
            Progress :{" "}
            <Badge
              className={`${
                isWarning
                  ? "bg-red-400 dark:bg-red-900" // 🟥 ถ้า Warning มาก่อนเลย
                  : deliveryData
                  ? deliveryData?.etaFinal && !deliveryData.pO_ReceiveDelivery
                    ? "bg-yellow-400 dark:bg-yellow-900" // ✅ Delivered
                    : deliveryData.pO_ReceiveDelivery
                    ? "bg-green-400 dark:bg-green-900"
                    : "bg-blue-400 dark:bg-blue-900" // ⏳ In progress
                  : "bg-accent" // 🔘 ยังไม่เริ่ม
              }`}
              variant={"outline"}
            >
              {isWarning
                ? "Error"
                : deliveryData
                ? deliveryData?.etaFinal && !deliveryData.pO_ReceiveDelivery
                  ? "Waiting to Receive"
                  : deliveryData.pO_ReceiveDelivery
                  ? "Receive"
                  : "Progress"
                : "Not Progress"}
            </Badge>
            <div className="font-bold">
              {deliveryData
                ? deliveryData?.etaFinal
                  ? new Date(deliveryData?.etaFinal).toLocaleString("th-TH", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                    })
                  : ""
                : ""}
            </div>
          </div>
          {isWarning && (
            <Alert variant={"destructive"} className="text-xs">
              <AlertTitle>Warning!!</AlertTitle>
              <AlertDescription className="text-xs">
                Warning not enter information and step are skip
                <ul>
                  {warning.map((item, index) => (
                    <li key={`${index}+${item}`}>{item}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          {!isWarning &&
            deliveryData?.etaFinal &&
            !deliveryData?.pO_ReceiveDelivery &&
            !supplierMode && (
              <div className="flex flex-row justify-center items-center mt-3 sm:mt-6">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      className="p-6 w-full ring-1 text-white ring-green-500 dark:ring-green-900 bg-green-500 dark:bg-green-900 cursor-pointer"
                      variant={"outline"}
                    >
                      RECEIVE!
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently save
                        data to our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild>
                        <Button
                          className=" text-white bg-green-500 dark:bg-green-900 cursor-pointer"
                          variant={"outline"}
                          onClick={async () => {
                            await onReceive(deliveryData.id, POno);
                          }}
                        >
                          RECEIVE!
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
