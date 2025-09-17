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
];
interface CardStatusProps {
  deliveryData: PO_Delivery | null;
}
export function CardStatus({ deliveryData }: CardStatusProps) {
  const [progress, setProgress] = useState(0);
  const [warning, setWarning] = useState<string[]>([]);
  const [isWarning, setIsWarning] = useState<boolean>(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      if (deliveryData) {
        if (deliveryData.etc) setProgress(10);
        if (deliveryData.etd) setProgress(36);
        if (deliveryData.eta) setProgress(66);
        if (deliveryData.etaFinal) setProgress(100);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [deliveryData]);
  useEffect(() => {
    if (!deliveryData) return;

    const strArr: string[] = [];
    const { etc, etd, eta, etaFinal } = deliveryData;

    // ตรวจสอบ field ว่างทั่วไป
    if (etc == null) strArr.push("Supplier still not enter ETC Information");
    if (etd == null) strArr.push("Supplier still not enter ETD Information");
    if (eta == null) strArr.push("Supplier still not enter ETA Information");
    if (etaFinal == null)
      strArr.push("Supplier still not enter Delivery Information");

    // ตรวจสอบการข้าม Step
    const steps = [etc, etd, eta, etaFinal];
    const stepNames = ["ETC", "ETD", "ETA", "ETAFinal"];
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
      <CardContent>
        <div className="flex justify-center items-center ">
          <div className="flex flex-row justify-between items-center w-full">
            {progressList.map((item, index) => {
              const isActive =
                (item.mode === "ETC" && deliveryData?.etc) ||
                (item.mode === "ETD" && deliveryData?.etd) ||
                (item.mode === "ETA" && deliveryData?.eta) ||
                (item.mode === "ETAFinal" && deliveryData?.etaFinal);
              return (
                <div className="text-center" key={`${index}+${item.label}`}>
                  <div
                    className={`mx-auto flex size-10 items-center justify-center rounded-full text-lg lg:size-12 
                    ${
                      isActive
                        ? "bg-green-500 text-white dark:bg-green-900"
                        : "bg-gray-300 text-gray-600 dark:bg-gray-700"
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
                    </svg>
                  </div>
                  <div className="text-xs mt-2">
                    {(() => {
                      if (!deliveryData) return "";

                      // mapping mode -> field ของ deliveryData
                      const modeFieldMap: Record<
                        string,
                        Date | string | null | undefined
                      > = {
                        ETC: deliveryData.etc,
                        ETD: deliveryData.etd,
                        ETA: deliveryData.eta,
                        ETAFinal: deliveryData.etaFinal,
                      };

                      const dateValue = modeFieldMap[item.mode];
                      if (!dateValue) return "";

                      return new Date(dateValue).toLocaleString("th-TH", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      });
                    })()}
                  </div>
                  <div className="mt-2 text-xs">{item.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <div className="space-y-6 w-full">
          <Progress value={progress} className="w-full" />
          <div className="text-xs mb-2 flex flex-row gap-2 items-center justify-start">
            Progress :{" "}
            <Badge
              className={`${
                deliveryData
                  ? deliveryData?.etaFinal
                    ? isWarning
                      ? "bg-red-400 dark:bg-red-900"
                      : "bg-green-400 dark:bg-green-900"
                    : "bg-yellow-400 dark:bg-yellow-900"
                  : "bg-accent"
              }`}
              variant={"outline"}
            >
              {deliveryData
                ? deliveryData?.etaFinal
                  ? isWarning
                    ? "Error"
                    : "Delivered"
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
        </div>
      </CardFooter>
    </Card>
  );
}
