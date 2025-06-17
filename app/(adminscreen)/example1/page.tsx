import { Suspense } from "react";
import DataTable from "./data-table";
import { users } from "@/data/dummyData"; // หรือ fetch API

export default function PaymentsPage() {
  return (
    <div className="">
      <Suspense fallback={<div>Loading Table...</div>}>
        <DataTable data={users} />
      </Suspense>
    </div>
  );
}
