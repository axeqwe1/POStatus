"use client";
import { useEffect, useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns } from "./columns";
import { PO_Status, Product, Variant } from "@/types/datatype";
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

interface DataTableProps {
  data: PO_Status[];
  onSuccess: () => void;
}
export default function DataTable({ data, onSuccess }: DataTableProps) {
  const [datas, setDatas] = useState(data);
  const [isEdit, setIsEdit] = useState(false);

  const [editItem, setEditItem] = useState<string>("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleDelete = (id: string) => {
    setDatas((prev) => prev.filter((u) => u.PONo !== id));
  };

  const handleEdit = (id: string) => {
    console.log(id);
    SaveStatusDownload(id);
    onSuccess();
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

  return (
    <>
      <div className="">
        <CustomDataTable<PO_Status, null>
          className="rounded-lg border "
          data={datas}
          columns={columns}
          collapse={false}
        />
        {/* {isEdit && <DrawerDialogDemo id={"1"} />} */}
      </div>
    </>
  );
}
