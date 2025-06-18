import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PO_Status, Product, User, Variant } from "@/types/datatype"; // สมมุติ
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

const dowloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (
  onDelete?: (id: number) => void,
  isEdit?: boolean,
  setIsEdit?: (isEdit: boolean) => void,
  editItem?: User | null,
  setEditItem?: (item: User | null) => void,
  isDesktop?: boolean
): ColumnDef<User>[] => [
  {
    id: "Id",
    accessorKey: "userId",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        ID
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    cell: ({ row }) => <span className="pl-1">{row.original.userId}</span>,
  },
  {
    id: "Fullname",
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Fullname
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    // filterFn: (row, columnId, filterValue) => {
    //   if (!filterValue || filterValue.length === 0) return true;
    //   // ในกรณีที่ filterValue เป็น array
    //   return filterValue.includes(row.getValue(columnId));
    // },
    cell: ({ row }) => (
      <span>
        {row.original.firstName} {row.original.lastName}
      </span>
    ),
    // (optional) enableFacetedValues: true,
  },
  {
    id: "Email",
    accessorKey: "email",
    header: ({ column }) => (
      <div className="flex items-center gap-2">
        Email
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    cell: ({ row }) => {
      return <span className="pl-1">{row.original.email}</span>;
    },
  },
  {
    id: "Role",
    accessorKey: "role",
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Role
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return <Badge className="text-xs text-white">{row.original.role}</Badge>;
    },
  },
  {
    // id: "SupplierCode",
    accessorKey: "supplierCode",
    header: ({ column, table }) => {
      // const uniqueValues = column.getFacetedUniqueValues()
      //   ? Array.from(column.getFacetedUniqueValues().values())
      //   : [];
      // console.log("Unique Values:", column.getFacetedUniqueValues());
      return (
        <div className="flex items-center gap-2">
          Supplier
          <ColumnCheckboxFilter column={column} table={table} />
        </div>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return (
        <span className="pl-1">
          {row.original.supplierCode ? (
            row.original.supplierCode
          ) : (
            <span className="text-muted-foreground">No Supplier</span>
          )}
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
                className="hover:bg-slate-200 p-1 rounded-md hover:cursor-pointer"
                onClick={
                  () =>
                    setEditItem?.(
                      row.original
                    ) /* เปิด Dialog/Drawer เพื่อแก้ไข */
                }
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:cursor-pointer p-1 rounded-md"
                onClick={() => onDelete?.(row.original.userId)}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        {/* Dialog/Drawer อยู่ภายนอก Dropdown */}
      </>
    ),
  },
];
