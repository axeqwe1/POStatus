"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PO_DeliveryLogs } from "@/types/datatype";
import {
  ColumnDef,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { flexRender } from "@tanstack/react-table";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import CustomTableFooter from "@/components/CustomTableFooter";
interface ETtableProps {
  data: PO_DeliveryLogs[];
}

// 1️⃣ กำหนด column
const columns: ColumnDef<PO_DeliveryLogs>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <div>
          <Button
            className="cursor-pointer "
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
          >
            No.
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: ({ row }) => {
      return <div className="text-center">{row.original.id}</div>;
    },
  },
  {
    accessorKey: "etc",
    header: "ETC",
    cell: (info) => {
      const val = info.getValue() as Date | string | null | undefined;
      return val ? new Date(val).toLocaleDateString() : "No Date";
    },
  },
  {
    accessorKey: "etd",
    header: "ETD",
    cell: (info) => {
      const val = info.getValue() as Date | string | null | undefined;
      return val ? new Date(val).toLocaleDateString() : "No Date";
    },
  },
  {
    accessorKey: "eta",
    header: "ETA",
    cell: (info) => {
      const val = info.getValue() as Date | string | null | undefined;
      return val ? new Date(val).toLocaleDateString() : "No Date";
    },
  },
  {
    accessorKey: "etaFinal",
    header: "Delivery",
    cell: (info) => {
      const val = info.getValue() as Date | string | null | undefined;
      return val ? new Date(val).toLocaleDateString() : "No Date";
    },
  },
  {
    accessorKey: "remark",
    header: "Remark",
    cell: ({ row }) => {
      return <div>{row.original.remark}</div>;
    },
  },
  {
    accessorKey: "createDate",
    header: ({ column }) => {
      return (
        <div>
          <Button
            className="cursor-pointer"
            variant={"ghost"}
            onClick={() => column.toggleSorting(column.getIsSorted() == "asc")}
          >
            CreateDateTime
            <ArrowUpDown />
          </Button>
        </div>
      );
    },
    cell: (info) => {
      const val = info.getValue() as Date | string | null | undefined;

      if (!val) {
        return <div className="text-center">No Date</div>;
      }

      const date = new Date(val); // รองรับทั้ง Date และ string
      const formatted = date.toLocaleString("th-TH", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // 24 ชม.
      });

      return <div className="text-center">{formatted}</div>;
    },
  },
  {
    accessorKey: "createBy",
    header: ({ column }) => {
      return <div className="text-left">CreateBy</div>;
    },
    cell: ({ row }) => {
      return <div className="text-left">{row.original.createBy}</div>;
    },
  },
];

export function ETtable({ data }: ETtableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "id", desc: true }, // เริ่มมาก -> น้อย
  ]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //initial page index
    pageSize: 10, //default page size
  });
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      pagination,
    },
    // initialState: {
    //   sorting: [
    //     {
    //       id: "id",
    //       desc: true,
    //     },
    //   ],
    // },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(), //provide a sorting row model
    onSortingChange: setSorting,
    // getPaginationRowModel: getPaginationRowModel(),
    // onPaginationChange: setPagination,
  });

  return (
    <div className=" w-full min-h-[100px] max-h-[400px] xl:max-h-[500px] max-w-[345px] sm:max-w-[700px] lg:max-w-[850px] overflow-auto overflow-x-auto">
      <table className="w-full  caption-bottom text-sm">
        <TableHeader className="sticky top-0 ">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr className="bg-accent!" key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </tr>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row, index) => {
            const rows = table.getRowModel().rows;

            // หา max จาก column "No"
            const maxNo = Math.max(
              ...rows.map((r) => Number(r.getValue("id")))
            );

            const isLatest = Number(row.getValue("id")) === maxNo;

            return (
              <TableRow
                className={`${
                  isLatest
                    ? "bg-primary text-white hover:text-black font-bold dark:bg-accent/70! dark:hover:text-white! sticky top-[40px]"
                    : ""
                }`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            );
          })}
        </TableBody>
        {/* <TableFooter className="fixed bottom-0">
          <TableRow>
            <TableCell colSpan={3}>Total Rows</TableCell>
            <TableCell className="text-right">{data.length}</TableCell>
          </TableRow>
        </TableFooter> */}
      </table>
      <div className="sticky left-0 bottom-0 grid grid-cols-3 bg-accent p-2 w-full">
        <div className="col-span-2">Total Rows</div>
        <div className="col-span-1">{data.length} rows</div>
      </div>
      {/* <CustomTableFooter table={table} /> */}
    </div>
  );
}
