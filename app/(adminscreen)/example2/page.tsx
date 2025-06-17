"use client";
import { Suspense } from "react";
import DataTable from "./data-table";
import { ListProduct, tShirt } from "@/data/dummyData"; // หรือ fetch API
// import { EditDrawer } from "./edit-dialog";

export default function page() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading Table...</div>}>
        <DataTable data={ListProduct} />
      </Suspense>
      {/* <EditDrawer item={tShirt} /> */}
    </div>
  );
}
