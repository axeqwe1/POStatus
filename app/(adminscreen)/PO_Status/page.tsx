"use client";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import DataTable from "./data-table";
import { GetPO, GetPOByPONo } from "@/lib/api/po";
import { FileItem, PO_Details, PO_Status } from "@/types/datatype";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonTable } from "@/components/SkeletonTable";
import { toast } from "sonner";
import {
  deleteFile,
  UpdateDescription,
  uploadFile,
} from "@/lib/api/uploadFile";
import { useAuth } from "@/context/authContext";

export default function Page() {
  const [masterData, setMasterData] = useState<PO_Status[]>([]);
  const [poData, setPoData] = useState<PO_Status[]>([]);
  const [poDetailData, setPoDetailData] = useState<PO_Details[]>([]);
  const [countPending, setCountPending] = useState(0);
  const [countConfirm, setCountConfirm] = useState(0);
  const [countCancel, setCountCancel] = useState(0);
  const [countProcess, setCountProcess] = useState(0);
  const [countAll, setCountAll] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userData, setUserData] = useState<any>(null); // เพิ่ม state สำหรับ user

  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [tab, SetTab] = useState<string>("all");
  const { user } = useAuth();
  const masterDataRef = useRef<PO_Status[]>([]);
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("store", storedUser);
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const fetchPO = useCallback(async (supplierId: string) => {
    setIsLoading(true);
    console.log(user);
    if (user != null && user?.supplierId == "") {
      setIsLoading(false);
      return;
    }
    const res = await GetPO(supplierId);
    if (res.status === 200) {
      console.log(res.data);
      const list: PO_Status[] = res.data.items.map((item: any) => ({
        PONo: item.poNo,
        Supreceive: item.receiveInfo?.suppRcvPO ?? false,
        confirmDate: item.receiveInfo?.suppRcvDate ?? "",
        cancelStatus: item.receiveInfo?.suppCancelPO ?? 0,
        sendDate: item?.approveDate ?? "",
        finalETADate: item?.finalETADate,
        supplierName: item?.supplierName,
        POReady: item?.poReady,
        ClosePO: item?.closePO,
        attachedFiles:
          item?.files.map((item: any) => {
            return {
              id: item.id,
              name: item.originalName,
              size: item.fileSize,
              type: item.type,
              uploadDate: new Date(item.uploadDate),
              url: item.url,
              remark: item.remark || "", // เพิ่ม remark ถ้ามี
              uploadType: item.uploadByType, // เพิ่ม uploadType ถ้ามี
            } as FileItem;
          }) ?? [],
      }));
      // console.log(`Detail : ${detailList}`);
      masterDataRef.current = [...list]; // เก็บข้อมูล masterData ใน ref เพื่อไม่ให้เกิดการ re-render ทุกครั้งที่เปลี่ยนแปลง
      setMasterData([...list]);
      // setPoDetailData(detailList);
      const pendding = list.filter(
        (item) => !item.Supreceive && item.ClosePO && item.cancelStatus === 0
      );
      const confirm = list.filter(
        (item) => item.Supreceive && item.ClosePO && item.cancelStatus === 0
      );
      const process = list.filter(
        (item) => !item.ClosePO && item.cancelStatus === 0
      );
      const cancel = list.filter((item) => item.cancelStatus === 1);
      setCountPending(pendding.length);
      setCountConfirm(confirm.length);
      setCountAll(list.length);
      setCountCancel(cancel.length);
      setCountProcess(process.length);
      setPoData([...list]); // <-- เปลี่ยน reference → React รู้ว่าต้อง re-render
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    console.log(userData);
    if (userData != null) fetchPO(userData.supplierId);
  }, [userData]);

  const filterByTab = useCallback((value: string, data: PO_Status[]) => {
    if (value === "pending") {
      return data.filter(
        (item) => !item.Supreceive && item.ClosePO && item.cancelStatus === 0
      );
    }
    if (value === "confirm") {
      return data.filter(
        (item) => item.Supreceive && item.ClosePO && item.cancelStatus === 0
      );
    }
    if (value === "cancel") {
      return data.filter((item) => item.cancelStatus === 1);
    }
    if (value === "process") {
      return data.filter((item) => !item.ClosePO && item.cancelStatus === 0);
    }
    return data;
  }, []);

  const handleChangeTab = useCallback(
    (value: string) => {
      const filtered = filterByTab(value, masterData);
      setPoData(filtered);
    },
    [filterByTab, masterData]
  );

  const handleRefreshData = async () => {
    if (userData?.supplierId) {
      await fetchPO(userData.supplierId);
      await handleChangeTab(tab);
    }
  };

  // useEffect(() => {
  //   fetchPO(userData.supplierId);
  // }, [userData]);

  const handdlerSetPageCount = (pageIndex: number, pageSize: number) => {
    console.log("Page Index : ", pageIndex);
    setPage(pageIndex);
    setPageSize(pageSize);
  };

  const uploadFiles = async (
    files: FileList,
    PONo: string,
    uploadType: number
  ) => {
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const res = await uploadFile(files, uploadType, PONo);
          const resFiles = await GetPOByPONo(PONo);
          console.log(resFiles);
          const newFiles = resFiles.data.items.files.map((item: any) => ({
            id: item.id,
            name: item.originalName,
            size: item.fileSize,
            type: item.type,
            uploadDate: new Date(item.uploadDate),
            url: item.url,
            uploadType: item.uploadByType, // เพิ่ม uploadType ถ้ามี
          }));

          // อัปเดต masterData (ref และ state)
          masterDataRef.current = masterDataRef.current.map((po: any) =>
            po.PONo === PONo ? { ...po, attachedFiles: newFiles } : po
          );
          setMasterData((prev: any) =>
            prev.map((po: any) =>
              po.PONo === PONo ? { ...po, attachedFiles: newFiles } : po
            )
          );
          setPoData((prev) =>
            prev.map((po) => {
              if (po.PONo !== PONo) return po;
              // เปลี่ยนเฉพาะค่าใน field `attachedFiles` แต่ไม่สร้าง object ใหม่ (หรือให้น้อยที่สุด)
              return {
                ...po,
                attachedFiles: newFiles,
              };
            })
          );
          resolve();
        } catch (error: any) {
          reject(error);
        }
      }),
      {
        loading: "Uploading...",
        success: "Upload Success",
        error: (err: any) =>
          err?.response?.data?.message || err?.message || "File upload failed",
      }
    );
  };

  const updateDescription = async (
    fileId: string,
    description: string,
    PONo: string
  ) => {
    try {
      toast.promise(
        new Promise((resolve, reject) => {
          UpdateDescription(fileId, description).then(async (res) => {
            if (res.status === 200) {
              const resFiles = await GetPOByPONo(PONo);
              console.log(resFiles);
              const newFiles = resFiles.data.items.files.map((item: any) => ({
                id: item.id,
                name: item.originalName,
                size: item.fileSize,
                type: item.type,
                uploadDate: new Date(item.uploadDate),
                url: item.url,
                remark: item.remark, // ✅ ใส่ description ใหม่ถ้ามี
                uploadType: item.uploadByType, // เพิ่ม uploadType ถ้ามี
              }));

              // update masterDataRef
              // อัปเดตทั้ง masterDataRef และ poData
              masterDataRef.current = masterDataRef.current.map((po: any) =>
                po.PONo === PONo ? { ...po, attachedFiles: newFiles } : po
              );

              setPoData((prev: any) =>
                prev.map((po: any) =>
                  po.PONo === PONo ? { ...po, attachedFiles: newFiles } : po
                )
              );

              resolve("Description updated successfully");
            } else {
              reject(new Error("Failed to update description"));
            }
          });
        }),
        {
          loading: "Updating description...",
          success: "Description updated successfully",
          error: (err: any) => `Error: ${err.message}`,
        }
      );
    } catch (error: any) {
      console.error(error);
      throw new Error(
        error?.response?.data?.message ||
          error?.message ||
          "Failed to update description"
      );
    }
  };
  const deleteFiles = async (fileId: string) => {
    await toast.promise(
      new Promise<void>(async (resolve, reject) => {
        try {
          const res = await deleteFile(fileId);
          if (res.status === 200) {
            // อัปเดต masterData (ref และ state)
            masterDataRef.current = masterDataRef.current.map((po: any) => ({
              ...po,
              attachedFiles: po.attachedFiles.filter(
                (file: FileItem) => file.id !== fileId
              ),
            }));
            setMasterData((prev: any) =>
              prev.map((po: any) => ({
                ...po,
                attachedFiles: po.attachedFiles.filter(
                  (file: FileItem) => file.id !== fileId
                ),
              }))
            );
            setPoData((prev: any) =>
              prev.map((po: any) => ({
                ...po,
                attachedFiles: po.attachedFiles.filter(
                  (file: FileItem) => file.id !== fileId
                ),
              }))
            );
            resolve();
          } else {
            reject(new Error(res?.data.response || "Failed to delete file"));
          }
        } catch (err: any) {
          reject(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to delete file"
          );
        }
      }),
      {
        loading: "Deleting file...",
        success: "File deleted successfully",
        error: (msg) => msg,
      }
    );
  };

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <Tabs
        onValueChange={handleChangeTab}
        defaultValue="all"
        className="w-[400px] mb-1"
      >
        <TabsList>
          <TabsTrigger value="all">
            <p>{`ALL (${countAll})`}</p>
          </TabsTrigger>
          <TabsTrigger value="process">
            <p>{`Process (${countProcess})`}</p>
          </TabsTrigger>
          <TabsTrigger value="pending">
            <p>{`Pending (${countPending})`}</p>
          </TabsTrigger>
          <TabsTrigger value="confirm">
            <p>{`Confirm (${countConfirm})`}</p>
          </TabsTrigger>
          <TabsTrigger value="cancel">
            <p>{`Cancel (${countCancel})`}</p>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {isLoading ? (
        <div className="h-[90vh] flex justify-center items-center">
          <SkeletonTable cols={3} rows={9} />
        </div>
      ) : (
        <Suspense fallback={<div>Loading Table...</div>}>
          <DataTable
            data={poData}
            onSuccess={handleRefreshData}
            onPaginChange={handdlerSetPageCount}
            isLoading={isLoading}
            totalCount={countAll}
            uploadFiles={uploadFiles}
            deleteFile={deleteFiles}
            updateDescriptionFile={updateDescription}
          />
        </Suspense>
      )}
    </div>
  );
}
