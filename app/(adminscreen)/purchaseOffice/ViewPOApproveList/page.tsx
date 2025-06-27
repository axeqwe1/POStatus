"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import DataTable from "./data-table";
import { GetAllPO, GetPO } from "@/lib/api/po";
import { PO_Details, PO_Status } from "@/types/datatype";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonTable } from "@/components/SkeletonTable";

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
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      console.log("store", storedUser);
      setUserData(JSON.parse(storedUser));
    }
  }, []);

  const fetchPO = useCallback(async () => {
    setIsLoading(true);
    const res = await GetAllPO();
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
      }));
      console.log(list);
      // console.log(`Detail : ${detailList}`);
      setMasterData(list);
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
      setPoData(list); // default view
    }
    setIsLoading(false);
  }, []);

  // useEffect(() => {
  //   console.log(userData);
  //   if (userData != null) fetchPO(userData.supplierId);
  // }, [userData]);

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
    [filterByTab, masterData, tab]
  );

  const handdlerSetPageCount = (pageIndex: number, pageSize: number) => {
    console.log("Page Index : ", pageIndex);
    setPage(pageIndex);
    setPageSize(pageSize);
  };

  const handleRefreshData = async () => {
    // if (userData?.supplierId) {
    // await fetchPO();
    // }
  };

  useEffect(() => {
    fetchPO();
  }, []);

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
        <div className="h-[90vh] bg-white flex justify-center items-center">
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
          />
        </Suspense>
      )}
    </div>
  );
}
