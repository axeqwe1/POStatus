"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ETtable } from "./ETtable";
import { PickDate } from "./calendar";
import { CardStatus } from "./cardStatus";
import { UpdateDeliveryRequest } from "@/data/dataDTO";
import { useAuth } from "@/context/authContext";
import {
  GetPODeliveryData,
  GetPODeliveryLOGByPONo,
  UpdateDelivery,
} from "@/lib/api/po";
import { toast } from "sonner";
import { PO_Delivery, PO_DeliveryLogs } from "@/types/datatype";
import { et } from "date-fns/locale";
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

interface FormETProps {
  POno: string;
  supplierMode: boolean;
}

export function FormET({ POno, supplierMode }: FormETProps) {
  const [tab, setTab] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [deliveryData, setDeliveryData] = React.useState<PO_Delivery | null>(
    null
  );
  const [isWarning, setIsWarning] = React.useState<boolean>(false);
  const fetchData = async () => {
    const res = await GetPODeliveryData(POno);
    // console.log(res);
    setDeliveryData(res.data.data);
  };

  React.useEffect(() => {
    fetchData();
    setTab("Status");
  }, []);
  const handleChangeTab = (tab: string) => {
    // console.log(tab);
    setTab(tab);
  };
  const handleSubmit = async () => {
    await fetchData();
    console.log("submit");
  };
  const handleReceive = async () => {
    await fetchData();
  };
  React.useEffect(() => {
    if (!deliveryData) return;

    const strArr: string[] = [];
    const { etc, etd, eta, etaFinal, pO_ReceiveDelivery } = deliveryData;

    // ตรวจสอบการข้าม Step
    const steps = [etc, etd, eta, etaFinal, pO_ReceiveDelivery];
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
  }, [deliveryData]);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-12 p-0 hover:cursor-pointer"
        >
          <Badge
            variant="outline"
            className={`text-xs cursor-pointer pointer-events-none ${
              deliveryData
                ? isWarning
                  ? "bg-red-400 dark:bg-red-900"
                  : deliveryData.pO_ReceiveDelivery
                  ? "bg-green-400 dark:bg-green-900"
                  : deliveryData.etaFinal
                  ? "bg-yellow-400 dark:bg-yellow-900"
                  : "bg-blue-400 dark:bg-blue-900"
                : "bg-accent/70"
            } `}
          >
            <Package size={12} />
            <span className="text-xs">Delivery</span>
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[400px] sm:max-w-[925px] overflow-auto">
        <DialogHeader>
          <DialogTitle>Delivery Modal</DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="w-full flex flex-row justify-center items-center">
            <Tabs
              value={tab}
              onValueChange={handleChangeTab}
              defaultValue="View"
              className="max-w-[400px] mb-1"
            >
              <TabsList>
                <TabsTrigger value="Form">
                  <div>
                    <p className="text-xs">Delivery Form</p>
                  </div>
                </TabsTrigger>
                {!supplierMode && (
                  <TabsTrigger value="View">
                    <div>
                      <p className="text-xs">Delivery Log</p>
                    </div>
                  </TabsTrigger>
                )}

                <TabsTrigger value="Status">
                  <div>
                    <p className="text-xs">Delivery Status</p>
                  </div>
                </TabsTrigger>

                {/* <TabsTrigger value="cancel">
            <p>{`Cancel (${countCancel})`}</p>
          </TabsTrigger> */}
              </TabsList>
            </Tabs>
          </div>
        </DialogHeader>
        <div className="w-full">
          <ProfileForm
            tab={tab}
            POno={POno}
            supplierMode={supplierMode}
            DeliveryData={deliveryData}
            submitCallback={handleSubmit}
            onReceiveCallback={handleReceive}
          />
        </div>
      </DialogContent>
    </Dialog>
  );

  // return (
  //   <Drawer open={open} onOpenChange={setOpen}>
  //     <DrawerTrigger asChild>
  //       <Button
  //         variant="ghost"
  //         size="sm"
  //         className="h-8 w-12 p-0 hover:cursor-pointer"
  //       >
  //         <Badge
  //           variant="outline"
  //           className="text-xs cursor-pointer pointer-events-none"
  //         >
  //           <Package size={12} />
  //           <span className="text-xs">ET</span>
  //         </Badge>
  //       </Button>
  //     </DrawerTrigger>
  //     <DrawerContent>
  //       <DrawerHeader className="text-left">
  //         <DrawerTitle>ET Modal</DrawerTitle>
  //         <DrawerDescription>
  //           Make changes to your profile here. Click save when you&apos;re done.
  //         </DrawerDescription>
  //       </DrawerHeader>
  //       <div className="w-full flex flex-row justify-center items-center mb-6">
  //         <Tabs
  //           value={tab}
  //           onValueChange={handleChangeTab}
  //           defaultValue="View"
  //           className="max-w-[400px] mb-1"
  //         >
  //           <TabsList>
  //             <TabsTrigger value="Form">
  //               <div>
  //                 <p className="text-xs">Delivery</p>
  //               </div>
  //             </TabsTrigger>
  //             <TabsTrigger value="View">
  //               <div>
  //                 <p className="text-xs">Delivery Log</p>
  //               </div>
  //             </TabsTrigger>

  //             {/* <TabsTrigger value="cancel">
  //           <p>{`Cancel (${countCancel})`}</p>
  //         </TabsTrigger> */}
  //           </TabsList>
  //         </Tabs>
  //       </div>
  //       <div className="max-h-[300px] overflow-auto">
  //         <ProfileForm className="px-4" tab={tab} POno={POno} />
  //       </div>

  //       <DrawerFooter className="pt-2">
  //         <DrawerClose asChild>
  //           <Button variant="outline">Cancel</Button>
  //         </DrawerClose>
  //       </DrawerFooter>
  //     </DrawerContent>
  //   </Drawer>
  // );
}

// FORM
type ProfileFormProps = React.ComponentProps<"form"> & {
  tab: string;
  POno: string;
  DeliveryData: PO_Delivery | null;
  supplierMode: boolean;
  submitCallback: () => void;
  onReceiveCallback: () => void;
};
function ProfileForm({
  className,
  tab,
  POno,
  DeliveryData,
  submitCallback,
  onReceiveCallback,
  supplierMode,
  ...props
}: ProfileFormProps) {
  const [etc, setETC] = React.useState<Date | null>(null);
  const [etd, setETD] = React.useState<Date | null>(null);
  const [eta, setETA] = React.useState<Date | null>(null);
  const [etaFinal, setETAFinal] = React.useState<Date | null>(null);
  const [remark, setRemark] = React.useState<string>("");
  const [deliRequest, setDeliRequest] =
    React.useState<UpdateDeliveryRequest | null>(null);

  const [logs, setLogs] = React.useState<PO_DeliveryLogs[]>([]);
  const { user } = useAuth();
  const formRef = React.useRef<HTMLFormElement>(null);
  const pickETCDate = (date: Date) => {
    console.log(date);
    setETC(date);
  };
  const pickETADate = (date: Date) => {
    console.log(date);
    setETA(date);
  };
  const pickETDDate = (date: Date) => {
    console.log(date);
    setETD(date);
  };
  const pickETAFinalDate = (date: Date) => {
    console.log(date);
    setETAFinal(date);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ✅ Validation: remark ต้องไม่ว่าง
    if (!remark || remark.trim() === "") {
      toast.warning("Please enter remark.");
      return;
    }

    try {
      console.log(etc, etd, eta, etaFinal, remark);
      if (deliRequest) {
        const res = await UpdateDelivery(deliRequest);
        if (res.status === 200) {
          toast.success(res.data);
          await fetchData();
          submitCallback();
        } else {
          toast.warning("Please enter the field");
        }
      } else {
        toast.error("Fail to update Deliery Data");
      }
    } catch (err: any) {
      toast.error("Fail to update Deliery Data " + err);
    }
  };
  const handleReceive = async () => {
    onReceiveCallback();
    await fetchData();
  };
  const fetchData = async () => {
    const [logResult] = await Promise.all([
      GetPODeliveryLOGByPONo(POno),
      // GetPODeliveryData(POno),
    ]);

    // console.log(logResult.data);

    if (logResult.data) {
      setLogs(logResult.data);
    }
  };
  React.useEffect(() => {
    fetchData();
  }, [POno]);
  React.useEffect(() => {
    const data: UpdateDeliveryRequest = {
      POno: POno,
      ETC: etc,
      ETD: etd,
      ETA: eta,
      ETAFinal: etaFinal,
      Remark: remark,
      CreateBy: user!.name,
    };

    setDeliRequest(data);
  }, [POno, etc, etd, eta, etaFinal, remark]);
  React.useEffect(() => {
    console.log(DeliveryData);
    if (DeliveryData) {
      const data = DeliveryData;
      if (data.eta) {
        setETA(data.eta);
      }
      if (data.etd) {
        setETD(data.etd);
      }
      if (data.etc) {
        setETC(data.etc);
      }
      if (data.etaFinal) {
        setETAFinal(data.etaFinal);
      }
      if (data.remark) {
        setRemark(data.remark);
      }
    }
  }, [DeliveryData]);

  return (
    <React.Fragment>
      {tab == "Status" && (
        <div className="w-full flex justify-center items-center ">
          <CardStatus
            supplierMode={supplierMode}
            receiveCallback={handleReceive}
            POno={POno}
            deliveryData={DeliveryData}
          />
        </div>
      )}
      {tab == "View" && (
        <div className="flex justify-center items-center">
          <ETtable data={logs} />
        </div>
      )}
      {tab == "Form" && (
        <form
          ref={formRef}
          onSubmit={submit}
          className={cn(
            "flex flex-col justify-center items-start gap-6 w-full",
            className
          )}
        >
          <div className="flex flex-row flex-wrap justify-start items-center gap-3 w-full">
            <div className="flex flex-row flex-wrap gap-3 w-full">
              <PickDate
                initialData={etc}
                onChange={pickETCDate}
                label="Pick ETC Date"
              />
              <PickDate
                initialData={etd}
                onChange={pickETDDate}
                label="Pick ETD Date"
              />
              <PickDate
                initialData={eta}
                onChange={pickETADate}
                label="Pick ETA Date"
              />
              <PickDate
                initialData={etaFinal}
                onChange={pickETAFinalDate}
                label="Pick Delivery Date"
              />
              <div className="w-full flex flex-col gap-2">
                <Label>Remark</Label>
                <Input
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                  className="w-full"
                  type="text"
                  placeholder="Remark"
                />
              </div>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="w-full cursor-pointer">Save changes</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently save data
                  to our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer"
                  onClick={async (e) => {
                    await formRef.current?.requestSubmit();
                  }}
                >
                  Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </form>
      )}
    </React.Fragment>
  );
}
