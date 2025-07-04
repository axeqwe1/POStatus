"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns } from "./columns";
import {
  FileItem,
  PO_Details,
  PO_Status,
  Product,
  Variant,
} from "@/types/datatype";
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
import { GetPOByPONo, GetPODetail, SaveStatusDownload } from "@/lib/api/po";
import { toast } from "sonner";
import { ServerSideDataTable } from "@/components/CustomServerTable";
import { ColumnDef } from "@tanstack/react-table";

interface DataTableProps {
  data: PO_Status[];
  totalCount: number;
  isLoading: boolean;
  onSuccess: () => void;
  uploadFiles: (
    filed: FileList,
    PONo: string,
    uploadType: number
  ) => Promise<void>;
  deleteFile: (fileId: string) => Promise<void>;
  onPaginChange?: (pageIndex: number, pageSize: number) => void;
  updateDescriptionFile?: (
    FileId: string,
    description: string,
    PONo: string
  ) => Promise<void>;
}
export default function DataTable({
  data,
  totalCount,
  isLoading,
  onSuccess,
  uploadFiles,
  deleteFile,
  onPaginChange,
  updateDescriptionFile,
}: DataTableProps) {
  const [datas, setDatas] = useState(data);
  const [subDatas, setSubDatas] = useState<PO_Details[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [originalFinalETA, setOriginalFInalETA] = useState<Date | null>(null);
  const [editItem, setEditItem] = useState<string>("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [openPopoverPONo, setOpenPopoverPONo] = useState<string | null>(null);
  const [uploadedFilesMap, setUploadedFilesMap] = useState<
    Record<string, FileItem[]>
  >({});
  const [popoverState, setPopoverState] = useState<{
    open: boolean;
    anchorRect: DOMRect | null;
    row: PO_Status | null;
  }>({ open: false, anchorRect: null, row: null });
  // pagin
  useEffect(() => {
    setDatas(data);
    // console.log(data);
  }, [data]);
  const handleDelete = async (fileId: string) => {
    setDatas((prev) => prev.filter((u) => u.PONo !== fileId));
  };

  const handleEdit = (PONo: string) => {
    setEditItem(PONo);
    setIsEdit(true);
  };
  const handleDeleteFile = (PONo: string) => {
    deleteFile(PONo);
  };
  useEffect(() => {
    setDatas(data);
  }, [data]);

  const columns = useMemo(
    () =>
      getColumns(
        handleDelete,
        isEdit,
        setIsEdit,
        editItem,
        handleEdit,
        isDesktop
      ),
    [handleDelete, isEdit, setIsEdit, editItem, handleEdit, isDesktop]
  );
  // const subColumns = getSubColumns(
  //   originalFinalETA ? originalFinalETA : new Date(),
  //   setOriginalFInalETA
  // );

  return (
    <>
      <div className="">
        <CustomDataTable<PO_Status, null>
          className="rounded-lg border "
          data={datas}
          columns={columns}
          collapse={false}
        />

        {/* <ServerSideDataTable
          data={data}
          columns={columns}
          pageIndex={pageIndex}
          pageSize={pageSize}
          totalCount={totalCount}
          onPaginationChange={({ pageIndex, pageSize }) => {
            setPageIndex(pageIndex);
            setPageSize(pageSize);
            onPaginChange?.(pageIndex, pageSize);
          }}
          isLoading={isLoading}
          
        /> */}
        {/* {isEdit && <DrawerDialogDemo id={"1"} />} */}
      </div>
    </>
  );
}
