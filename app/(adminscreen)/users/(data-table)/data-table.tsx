"use client";
import { useState } from "react";
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

interface DataTableProps {
  data: PO_Status[];
}
export default function DataTable({ data }: DataTableProps) {
  const [datas, setDatas] = useState(data);
  const [isEdit, setIsEdit] = useState(false);

  const [editItem, setEditItem] = useState<PO_Status | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const handleDelete = (id: string) => {
    setDatas((prev) => prev.filter((u) => u.PONo !== id));
  };
  const handleEdit = (id: boolean) => {
    setIsEdit(id);
  };

  const columns = getColumns(
    handleDelete,
    isEdit,
    setIsEdit,
    editItem,
    setEditItem,
    isDesktop
  );

  return (
    <>
      <div className="max-w-[1200px] mx-auto">
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
