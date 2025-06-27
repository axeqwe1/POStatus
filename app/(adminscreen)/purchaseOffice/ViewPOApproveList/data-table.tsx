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
import { GetPODetail, SaveStatusDownload } from "@/lib/api/po";
import { toast } from "sonner";
import { ServerSideDataTable } from "@/components/CustomServerTable";

interface DataTableProps {
  data: PO_Status[];
  totalCount: number;
  isLoading: boolean;
  onSuccess: () => void;
  onPaginChange?: (pageIndex: number, pageSize: number) => void;
}
export default function DataTable({
  data,
  totalCount,
  isLoading,
  onSuccess,
  onPaginChange,
}: DataTableProps) {
  const [datas, setDatas] = useState(data);
  const [subDatas, setSubDatas] = useState<PO_Details[]>([]);
  const [isEdit, setIsEdit] = useState(false);
  const [originalFinalETA, setOriginalFInalETA] = useState<Date | null>(null);
  const [editItem, setEditItem] = useState<string>("");
  const isDesktop = useMediaQuery("(min-width: 768px)");

  // pagin
  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(10);
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
        {/* <CustomDataTable<PO_Status, PO_Details>
          className="rounded-lg border "
          data={datas}
          columns={columns}
          collapse={true}
          subtableData={subDatas}
          subColumns={subColumns}
          findSubtableData={findSubtableData}

        /> */}
        <ServerSideDataTable
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
        />
        ;{/* {isEdit && <DrawerDialogDemo id={"1"} />} */}
      </div>
    </>
  );
}
