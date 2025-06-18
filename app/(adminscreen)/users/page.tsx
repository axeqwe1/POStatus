"use client";
import { Suspense, useEffect, useState } from "react";
import DataTable from "./(data-table)/data-table";
import { ListProduct, tShirt, ListPo } from "@/data/dummyData"; // หรือ fetch API
import { getUserAll } from "@/lib/api/user";
import { User } from "@/types/datatype";
// import { EditDrawer } from "./edit-dialog";

export default function page() {
  const [data, setData] = useState<User[]>([]); // ใช้ ListProduct หรือ fetch API ตามที่คุณต้องการ
  useEffect(() => {
    // Simulate fetching data
    // In a real app, you might fetch this data from an API
    // For example: fetch('/api/products').then(res => res.json()).then(data => setData(data));
    // Here we're just using dummy data
    const fetchUser = async () => {
      console.log("Fetching user data...");
      const res = await getUserAll();
      if (res.data.length > 0) {
        setData(res.data); // Assuming res is an array of User objects
        console.log("User data:", res.data);
      } else {
        console.error("Failed to fetch user data:", res);
      }
    };
    console.log("Data fetched: ");
    fetchUser();
  }, []);

  return (
    <div className="">
      <Suspense fallback={<div>Loading Table...</div>}>
        <DataTable data={data} />
      </Suspense>
      {/* <EditDrawer item={tShirt} /> */}
    </div>
  );
}
