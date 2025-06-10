import DataTable from "./data-table";
import { users } from "@/data/dummyData"; // หรือ fetch API

export default function PaymentsPage() {
  return (
    <div className="">
      <DataTable data={users} />
    </div>
  );
}
