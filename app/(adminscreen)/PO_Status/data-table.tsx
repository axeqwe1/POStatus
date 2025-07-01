"use client";
import { useEffect, useMemo, useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns, getSubColumns } from "./columns";
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
import { GetPODetail, SaveStatusDownload } from "@/lib/api/po";
import { toast } from "sonner";

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
    console.log(data);
  }, [data]);
  const handleDelete = async (fileId: string) => {
    setDatas((prev) => prev.filter((u) => u.PONo !== fileId));
  };

  const handleEdit = async (id: string) => {
    await toast.promise(
      new Promise((resolve, reject) => {
        SaveStatusDownload(id)
          .then((res: any) => {
            if (res.status === 200) {
              onSuccess?.();
              resolve("Confirm Success");
            } else {
              onSuccess?.();
              reject(new Error(res.message || "Unknown error"));
            }
          })
          .catch((error) => {
            onSuccess?.();
            // ในกรณี error อาจไม่มี response.data.message เสมอ
            const msg =
              error?.response?.data?.message ||
              error?.message ||
              "Error occurred";
            reject(new Error(msg));
          });
      }),
      {
        loading: "Process...",
        success: "Confirm Complete ำำำำ",
        error: (err: any) => {
          // รับ error object จาก reject
          return `Error: ${err.message}`;
        },
      }
    );
  };

  const handleReaponseUpload = async (
    filed: FileList,
    PONo: string,
    uploadType: number
  ) => {
    console.log("handleReaponseUpload");
    await uploadFiles(filed, PONo, uploadType);
  };

  // const handleQueryChange = async ({
  //     pageIndex:
  //     pageSize:
  //     sorting:
  //     columnFilters
  // }) => {
  //   const res = await fetchDataFromAPI({
  //     pageIndex,
  //     pageSize,
  //     sorting,
  //     columnFilters,
  //   });
  //   setData(res.items);
  //   setTotalCount(res.total);
  // };
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
        isDesktop,
        openPopoverPONo,
        setOpenPopoverPONo,
        handleReaponseUpload,
        handleDeleteFile,
        updateDescriptionFile
      ),
    [
      handleDelete,
      isEdit,
      setIsEdit,
      editItem,
      handleEdit,
      isDesktop,
      openPopoverPONo,
      setOpenPopoverPONo,
      handleReaponseUpload,
      handleDeleteFile,
      updateDescriptionFile,
    ]
  );
  const subColumns = getSubColumns(
    originalFinalETA ? originalFinalETA : new Date(),
    setOriginalFInalETA
  );

  const findSubtableData = async (rowId: any) => {
    console.log("findSubtableData", rowId);
    setSubDatas([]);
    // datas.find((item) => item.id === rowId);
    const res = await GetPODetail(rowId);
    const item = res.data;
    console.log(res.data);

    const newItem = item.details.map((detail: PO_Details) => {
      const originalFinalETA = datas.find((rowId) => {
        return rowId.PONo === detail.poNo;
      })?.finalETADate;
      detail.finalETADate == null
        ? (detail.finalETADate = originalFinalETA)
        : detail.finalETADate;
      return { ...detail };
    });
    console.log(newItem);
    setSubDatas(newItem);
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
