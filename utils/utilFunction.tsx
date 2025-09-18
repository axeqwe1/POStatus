import { PO_Delivery } from "@/types/datatype";

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

export const formatDate = (date: Date): string => {
  return date.toLocaleDateString("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

export function getDeliveryStatus(row: PO_Delivery | null): string {
  const deliveryData = row;
  let isWarning = false;
  if (!deliveryData) return "Not Progress";

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
    isWarning = true;
    //   skippedSteps.forEach((s) => strArr.push(`Step ${s} is skipped!`));
  } else {
    isWarning = false;
  }

  if (isWarning) return "Error";

  if (!deliveryData) return "Not Progress";

  if (deliveryData?.pO_ReceiveDelivery) return "Receive";

  if (deliveryData?.etaFinal) return "Waiting to Receive";

  return "Progress";
}
