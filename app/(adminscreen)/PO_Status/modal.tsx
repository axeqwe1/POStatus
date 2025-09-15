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

export function FormET() {
  const [tab, setTab] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  React.useEffect(() => {
    setTab("View");
  }, []);
  const handleChangeTab = (tab: string) => {
    // console.log(tab);
    setTab(tab);
  };
  if (isDesktop) {
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
              className="text-xs cursor-pointer pointer-events-none"
            >
              <Package size={12} />
              <span className="text-xs">ET</span>
            </Badge>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[725px]">
          <DialogHeader>
            <DialogTitle>ET Modal</DialogTitle>
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
                      <p className="text-xs">Form ET</p>
                    </div>
                  </TabsTrigger>
                  <TabsTrigger value="View">
                    <div>
                      <p className="text-xs">View ET Log</p>
                    </div>
                  </TabsTrigger>

                  {/* <TabsTrigger value="cancel">
            <p>{`Cancel (${countCancel})`}</p>
          </TabsTrigger> */}
                </TabsList>
              </Tabs>
            </div>
          </DialogHeader>
          <ProfileForm tab={tab} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-12 p-0 hover:cursor-pointer"
        >
          <Badge
            variant="outline"
            className="text-xs cursor-pointer pointer-events-none"
          >
            <Package size={12} />
            <span className="text-xs">ET</span>
          </Badge>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>ET Modal</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DrawerDescription>
        </DrawerHeader>
        <div className="w-full flex flex-row justify-center items-center mb-6">
          <Tabs
            value={tab}
            onValueChange={handleChangeTab}
            defaultValue="View"
            className="max-w-[400px] mb-1"
          >
            <TabsList>
              <TabsTrigger value="Form">
                <div>
                  <p className="text-xs">Form ET</p>
                </div>
              </TabsTrigger>
              <TabsTrigger value="View">
                <div>
                  <p className="text-xs">View ET Log</p>
                </div>
              </TabsTrigger>

              {/* <TabsTrigger value="cancel">
            <p>{`Cancel (${countCancel})`}</p>
          </TabsTrigger> */}
            </TabsList>
          </Tabs>
        </div>
        <ProfileForm className="px-4" tab={tab} />

        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
type ProfileFormProps = React.ComponentProps<"form"> & {
  tab: string;
};
function ProfileForm({ className, tab, ...props }: ProfileFormProps) {
  const [etc, setETC] = React.useState<Date>();
  const [etd, setETD] = React.useState<Date>();
  const [eta, setETA] = React.useState<Date>();
  const [etaFinal, setETAFinal] = React.useState<Date>();
  const [remark, setRemark] = React.useState<string>("");
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
    try {
      console.log(etc, etd, eta, etaFinal, remark);
    } catch (err: any) {}
  };
  return (
    <React.Fragment>
      {tab == "View" && (
        <div>
          <ETtable />
        </div>
      )}
      {tab == "Form" && (
        <form
          onSubmit={submit}
          className={cn(
            "flex flex-col justify-center items-start gap-6 w-full",
            className
          )}
        >
          <div className="flex flex-row flex-wrap justify-start items-center gap-3 w-full">
            <div className="flex flex-row flex-wrap gap-3 w-full">
              <PickDate onChange={pickETCDate} label="Pick ETC Date" />
              <PickDate onChange={pickETDDate} label="Pick ETD Date" />
              <PickDate onChange={pickETADate} label="Pick ETA Date" />
              <PickDate
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

          <Button className="w-full" type="submit">
            Save changes
          </Button>
        </form>
      )}
    </React.Fragment>
  );
}
