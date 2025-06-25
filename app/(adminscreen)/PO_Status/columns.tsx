import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PO_Details, PO_Status, Product, Variant } from "@/types/datatype"; // สมมุติ
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
  IconCheck,
  IconCircleCheckFilled,
  IconClock,
  IconCross,
  IconDotsVertical,
  IconLoader,
  IconX,
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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Target } from "lucide-react";
import { DateRangeFilter } from "@/components/CustomDateFilter";

const downloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (
  onCancel?: (id: string) => void,
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
        {/* PONo */}
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
        <Button
          className="hover:cursor-pointer !p-0"
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          PO Number
          <ArrowUpDown />
        </Button>
      </div>
    ),
    cell: ({ row }) => (
      <a
        href={`${downloadUrl}pono=${row.original.PONo}&Company=POMatr`}
        // onMouseDown={() => {
        //   if (!row.original.Supreceive) {
        //     setEditItem?.(row.original.PONo);
        //   }
        //   window.open(
        //     `${downloadUrl}pono=${row.original.PONo}&Company=POMatr`,
        //     "_blank"
        //   );
        // }}
        target="_blank"
        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline"
      >
        {row.original.PONo}
      </a>
    ),
  },
  {
    accessorKey: "Status",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Status
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
          <IconClock className="fill-yellow-500 dark:fill-yellow-400" />
        )}
        {row.original.Supreceive ? "Confirm" : "Pending"}
      </Badge>
    ),

    // (optional) enableFacetedValues: true,
  },
  {
    accessorKey: "sendDate",
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Send Date
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.sendDate;
      return (
        <span className="pl-1">
          {new Date(row.original.sendDate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
          {/* {date ? new Date(date).toLocaleDateString() : "Not downloaded"} */}
        </span>
      );
    },
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue?.from) return true;

      const rowDate = new Date(row.getValue(columnId));
      const from = filterValue.from;
      const to = filterValue.to ?? from; // กรณีเลือกวันเดียว

      return rowDate >= from && rowDate <= to;
    },
    meta: {
      filterElement: DateRangeFilter, // custom meta key สำหรับ filter
    },
  },
  {
    accessorKey: "confirmDate",
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Confirm Date
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.confirmDate;
      return (
        <span className="pl-1">
          {date
            ? new Date(row.original.confirmDate).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Not Confirm"}
        </span>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <>
        {!row.original.Supreceive ? (
          <div className="flex gap-3">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button className="w-[30px] h-[30px] bg-neutral-200 hover:bg-neutral-300/70 hover:cursor-pointer">
                  <IconCheck className="text-green-500 font-bold" size={40} />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogPortal>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you want to Confirm PO?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently
                      Confirm yourdata and Confirm your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        type="button"
                        className="hover:cursor-pointer text-white"
                        onClick={() => setEditItem?.(row.original.PONo)}
                      >
                        Confirm
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogPortal>
            </AlertDialog>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant={"destructive"}
                  className="w-[30px] h-[30px] hover:cursor-pointer"
                >
                  <IconX />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogPortal>
                <AlertDialogContent className="sm:max-w-[425px]">
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you want to Cancel PO?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently Cancel
                      yourdata and Cancel your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="hover:cursor-pointer">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button
                        type="button"
                        className="hover:cursor-pointer text-white bg-red-500 hover:bg-red-500/90"
                        onClick={() => onCancel?.(row.original.PONo)}
                      >
                        Confirm
                      </Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialogPortal>
            </AlertDialog>
          </div>
        ) : (
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
                  onMouseDown={() => {
                    if (!row.original.Supreceive) {
                      setEditItem?.(row.original.PONo);
                    }
                    window.open(
                      `${downloadUrl}pono=${row.original.PONo}&Company=POMatr`,
                      "_blank"
                    );
                  }}
                  className="hover:bg-slate-200 p-1 rounded-md hover:cursor-pointer"
                >
                  Dowload
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        )}

        {/* Dialog/Drawer อยู่ภายนอก Dropdown */}
      </>
    ),
  },
];

export const getSubColumns = (
  originalFinalETA?: Date,
  setOriginalFInalETA?: (date: Date) => void
): ColumnDef<PO_Details>[] => [
  {
    accessorKey: "Delivery", // ยังคงไว้เพื่อกรณีอื่นใช้
    accessorFn: (row) => {
      const finalEta = originalFinalETA
        ? new Date(originalFinalETA).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Not Found Delivery Date";

      return row.finalETADate
        ? new Date(row.finalETADate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : finalEta;
    },

    header: ({ column, table }) => {
      return (
        <>
          <div>
            Delivery
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ getValue }) => {
      const value = getValue() as string;

      return (
        <>
          <div>{value}</div>
        </>
      );
    },
  },
  {
    id: "MatrClass",
    accessorKey: "matrClass",
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        {/* PONo */}
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
        <div>
          MatrClass
          <ColumnCheckboxFilter column={column} table={table} />
        </div>
      </div>
    ),
    cell: ({ row }) => (
      <>
        <div>{row.original.matrClass}</div>
      </>
    ),
  },
  {
    id: "MatrCode",
    accessorKey: "matrCode",
    header: ({ column, table }) => {
      return (
        <>
          <div>
            MatrCode
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.matrCode}</div>
        </>
      );
    },
  },
  {
    id: "Color",
    accessorKey: "color",
    header: ({ column, table }) => {
      return (
        <>
          <div>
            Color
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.color ? `${row.original.color}` : ``}</div>
        </>
      );
    },
  },
  {
    id: "Size",
    accessorKey: "size",
    header: ({ column, table }) => {
      return (
        <>
          <div>
            Size
            <ColumnCheckboxFilter column={column} table={table} />
          </div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.size ? `${row.original.size}` : ``}</div>
        </>
      );
    },
  },
  {
    // id: "description",
    accessorKey: "description",
    header: ({ column }) => {
      return (
        <>
          <div>Description</div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.description}</div>
        </>
      );
    },
  },
];
