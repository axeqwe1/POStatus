"use client";
import { Suspense, useEffect, useState } from "react";
import DataTable from "./(data-table)/data-table";
import { getUserAll } from "@/lib/api/user";
import { User } from "@/types/datatype";
import LoadingCircleSpinner from "@/components/ui/LoadingCircleSpinner";
import { SkeletonTable } from "@/components/SkeletonTable";
// import { EditDrawer } from "./edit-dialog";

export default function page() {
  const [data, setData] = useState<User[]>([]); // ใช้ ListProduct หรือ fetch API ตามที่คุณต้องการ
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const fetchUser = async () => {
    setIsLoading(true);
    console.log("Fetching user data...");
    const res = await getUserAll();
    if (res.data.length > 0) {
      setData(res.data); // Assuming res is an array of User objects
      console.log("User data:", res.data);
      setIsLoading(false);
    } else {
      console.error("Failed to fetch user data:", res);
      setIsLoading(false);
    }
  };
  const onSuccessSubmit = () => {
    fetchUser();
  };
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <div>
      {isLoading ? (
        <div className="h-[90vh] flex justify-center items-center">
          <SkeletonTable cols={3} rows={9} />
        </div>
      ) : (
        <Suspense fallback={<div>Loading Table...</div>}>
          <DataTable data={data} onSuccess={onSuccessSubmit} />
        </Suspense>
      )}

      {/* <EditDrawer item={tShirt} /> */}
    </div>
  );
}
