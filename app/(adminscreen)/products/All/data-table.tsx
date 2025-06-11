"use client";
import { useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns } from "./columns";
import { User } from "@/data/dummyData";
export default function DataTable({ data }: { data: User[] }) {
  const [users, setUsers] = useState(data);

  const handleDelete = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const columns = getColumns(handleDelete);

  return (
    <div className="max-w-[1200px] mx-auto">
      <CustomDataTable data={users} columns={columns} />
    </div>
  );
}
