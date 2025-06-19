import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PO_Status, Product, Variant } from "@/types/datatype"; // สมมุติ
import { ColumnCheckboxFilter } from "@/components/ColumnCheckboxFilter";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label";
import {
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLoader,
} from "@tabler/icons-react";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@radix-ui/react-dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerPortal,
  DrawerTitle,
} from "@/components/ui/drawer";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";

const downloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (
  onDelete?: (id: string) => void,
  isEdit?: boolean,
  setIsEdit?: (isEdit: boolean) => void,
  editItem?: string,
  setEditItem?: (item: string) => void,
  isDesktop?: boolean
): ColumnDef<PO_Status>[] => [
  {
    id: "PONo",
    accessorKey: "PONo",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        PONo
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    cell: ({ row }) => (
      <a
        href={`${downloadUrl}pono=${row.original.PONo}&Company=POMatr`}
        onMouseDown={() => {
          if (!row.original.Supreceive) {
            setEditItem?.(row.original.PONo);
          }
          window.open(
            `${downloadUrl}pono=${row.original.PONo}&Company=POMatr`,
            "_blank"
          );
        }}
        target="_blank"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
      >
        {row.original.PONo}
      </a>
    ),
  },
  {
    accessorKey: "Dowload",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Download
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    // filterFn: (row, columnId, filterValue) => {
    //   if (!filterValue || filterValue.length === 0) return true;
    //   // ในกรณีที่ filterValue เป็น array
    //   return filterValue.includes(row.getValue(columnId));
    // },
    cell: ({ row }) =>
      row.original.Supreceive ? (
        <Badge
          variant="outline"
          className={`text-muted-foreground px-1.5 ${
            row.original.Supreceive
              ? "bg-green-200 dark:bg-green-900"
              : "bg-yellow-200 dark:bg-yellow-900"
          }`}
        >
          {row.original.Supreceive ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : (
            <IconLoader />
          )}
          {row.original.Supreceive ? "Download" : " "}
        </Badge>
      ) : (
        " "
      ),
    // (optional) enableFacetedValues: true,
  },
  {
    accessorKey: "approvedate",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Approve Date
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.approveDate;
      return (
        <span className="pl-1">
          {new Date(row.original.approveDate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          {/* {date ? new Date(date).toLocaleDateString() : "Not downloaded"} */}
        </span>
      );
    },
  },
  {
    accessorKey: "downloaddate",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Download Date
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.downloadDate;
      return (
        <span className="pl-1">
          {date ? new Date(date).toLocaleDateString() : "Not downloaded"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
              size="icon"
            >
              <IconDotsVertical />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuPortal>
            <DropdownMenuContent
              align="end"
              side="bottom"
              className="z-50 p-4 border-1 rounded-2xl bg-slate-50"
            >
              <DropdownMenuItem
                onClick={() => {
                  window.open(
                    `${downloadUrl}pono=${row.original.PONo}&Company=POMatr`,
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="hover:bg-slate-200 p-1 rounded-md hover:cursor-pointer"
              >
                Dowload
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        {/* Dialog/Drawer อยู่ภายนอก Dropdown */}
      </>
    ),
  },
];
