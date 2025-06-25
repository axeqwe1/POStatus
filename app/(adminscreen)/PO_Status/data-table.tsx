"use client";
import { useEffect, useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns, getSubColumns } from "./columns";
import { PO_Details, PO_Status, Product, Variant } from "@/types/datatype";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Drawer } from "vaul";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { SaveStatusDownload } from "@/lib/api/po";
import { toast } from "sonner";

interface DataTableProps {
  data: PO_Status[];
  onSuccess: () => void;
}
export default function DataTable({ data, onSuccess }: DataTableProps) {
  const [datas, setDatas] = useState(data);
  const [subDatas, setSubDatas] = useState<PO_Details[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [originalFinalETA, setOriginalFInalETA] = useState<Date | null>(null);

  const [editItem, setEditItem] = useState<string>("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDelete = (id: string) => {
    setDatas((prev) => prev.filter((u) => u.PONo !== id));
  };

  const handleEdit = async (id: string) => {
    console.log(id);
    await toast.promise(
      new Promise((resolve, rejects) => {
        SaveStatusDownload(id).then((res: any) => {
          console.log(res);
          if (res.status === 200) {
            resolve("Confirm Success");
            onSuccess();
          }
        });
      }),
      {
        loading: "Process...",
        success: "Confirm Complete",
        error: (err: any) => {
          return `Error: ${err.message}`; // แสดง message ใน toast
        },
      }
    );
  };

  useEffect(() => {
    setDatas(data);
  }, [data]);

  const columns = getColumns(
    handleDelete,
    isEdit,
    setIsEdit,
    editItem,
    handleEdit,
    isDesktop
  );
  const subColumns = getSubColumns(
    originalFinalETA ? originalFinalETA : new Date(),
    setOriginalFInalETA
  );

  const findSubtableData = (rowId: any) => {
    console.log("findSubtableData", rowId);

    // datas.find((item) => item.id === rowId);
    datas.find((item) => {
      console.log(item.PONo, rowId);
      if (item.PONo === rowId) {
        setSubDatas(item.PODetails);
        setOriginalFInalETA(item.finalETADate ? item.finalETADate : new Date());
        console.log("Found Data", item.PODetails);
        // setSubDatas(item.PONo);
        return true;
      }
      return false;
    });
  };
  return (
    <>
      <div className="">
        <CustomDataTable<PO_Status, PO_Details>
          className="rounded-lg border "
          data={datas}
          columns={columns}
          collapse={true}
          subtableData={subDatas}
          subColumns={subColumns}
          findSubtableData={findSubtableData}
        />
        {/* {isEdit && <DrawerDialogDemo id={"1"} />} */}
      </div>
    </>
  );
}
