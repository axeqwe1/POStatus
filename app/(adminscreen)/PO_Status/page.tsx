"use client";
import { Suspense, useCallback, useEffect, useState } from "react";
import DataTable from "./data-table";
import { GetPO } from "@/lib/api/po";
import { PO_Status } from "@/types/datatype";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SkeletonTable } from "@/components/SkeletonTable";

export default function Page() {
  const [masterData, setMasterData] = useState<PO_Status[]>([]);
  const [poData, setPoData] = useState<PO_Status[]>([]);
  const [countNotDownload, setCountNotDownload] = useState(0);
  const [countDownload, setCountDownload] = useState(0);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userData = localStorage.getItem("user");
  if (!userData) return;
  const { supplierId } = JSON.parse(userData);

  const fetchPO = async (suppCode: string) => {
    setIsLoading(true);
    const res = await GetPO(suppCode);
    if (res.status === 200) {
      const list: PO_Status[] = res.data.map((item: any) => ({
        PONo: item.poInfo.poNo,
        Supreceive: item.receiveInfo?.suppRcvPO ?? false,
        downloadDate: item.receiveInfo?.suppRcvDate ?? "",
        approveDate: item.poInfo?.items[0].approveDate ?? "",
      }));
      setMasterData(list);
      console.log(list);
      const notDownloaded = list.filter((item) => !item.Supreceive);
      const downloaded = list.filter((item) => item.Supreceive);

      setCountNotDownload(notDownloaded.length);
      setCountDownload(downloaded.length);

      setPoData(notDownloaded); // default view
      setIsLoading(false);
    }
  };
  const filterByTab = useCallback((value: string, data: PO_Status[]) => {
    if (value === "notdownload") {
      return data.filter((item) => !item.Supreceive);
    }
    if (value === "download") {
      return data.filter((item) => item.Supreceive);
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
    await fetchPO(supplierId);
  };

  useEffect(() => {
    fetchPO(supplierId);
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <Tabs
        onValueChange={handleChangeTab}
        defaultValue="notdownload"
        className="w-[400px]"
      >
        <TabsList>
          <TabsTrigger value="notdownload">
            <p>{`NotDownload (${countNotDownload})`}</p>
          </TabsTrigger>
          <TabsTrigger value="download">
            <p>{`Downloaded (${countDownload})`}</p>
          </TabsTrigger>
        </TabsList>
      </Tabs>
      {isLoading ? (
        <div className="h-[90vh] bg-white flex justify-center items-center">
          <SkeletonTable cols={3} rows={9} />
        </div>
      ) : (
        <Suspense fallback={<div>Loading Table...</div>}>
          <DataTable data={poData} onSuccess={handleRefreshData} />
        </Suspense>
      )}
    </div>
  );
}
