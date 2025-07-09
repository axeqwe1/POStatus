import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileItem,
  NotificationReceivers,
  Notifications,
  PO_Details,
  PO_Status,
  Product,
  Variant,
} from "@/types/datatype"; // สมมุติ
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
  IconAutomation,
  IconCancel,
  IconCheck,
  IconCircleCheckFilled,
  IconClock,
  IconCloudUpload,
  IconCross,
  IconDotsVertical,
  IconDownload,
  IconLoader,
  IconLoader2,
  IconPaperclip,
  IconPencil,
  IconPlus,
  IconTrash,
  IconX,
  IconXPowerY,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Target } from "lucide-react";
import { DateRangeFilter } from "@/components/CustomDateFilter";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { FileIcon } from "@/utils/fileIcon";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  deleteFile,
  DownloadFile,
  getFilePo,
  UpdateDescription,
  uploadFile,
} from "@/lib/api/uploadFile";
import { formatDate, formatFileSize } from "@/utils/utilFunction";
import { GetPOByPONo } from "@/lib/api/po";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { useAuth } from "@/context/authContext";

const downloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (): ColumnDef<NotificationReceivers>[] => [
  {
    id: "select",
    header: ({ table, column }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => {
      return (
        <>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </>
      );
    },
    enableSorting: false,
    enableHiding: false,
    meta: {
      label: "Select",
    },
  },
  {
    id: "title",
    accessorFn: (row) => row.notification.title,
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Title
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (
        !filterValue ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      )
        return true;
      const title = row.original.notification.title
        ?.toString()
        .toLowerCase()
        .trim();

      if (Array.isArray(filterValue)) {
        return filterValue
          .map((f) =>
            typeof f === "string"
              ? f.toLowerCase().trim()
              : (f.value ?? "").toLowerCase().trim()
          )
          .includes(title);
      } else {
        // กรณี string (text input)
        return title.includes(filterValue.toString().toLowerCase().trim());
      }
    },
    cell: ({ row }) => {
      const isRead = row.original.isRead;
      return (
        <div className="relative">
          {row.original.notification.title}
          {!isRead && (
            <span className="absolute bg-red-500 p-1 rounded -left-2 -top-0"></span>
          )}
        </div>
      );
    },
    meta: {
      label: "Title",
    },
    // (optional) enableFacetedValues: true,
  },
  {
    id: "refId",
    accessorFn: (row) => row.notification.refId, // ✅ แก้ตรงนี้
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ReferenceId
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const { user } = useAuth();
      const Url =
        user?.role === "User"
          ? "/PO_Status"
          : "/purchaseOffice/ViewPOApproveList";
      return (
        <>
          {row.original.notification.type === "PO" && (
            <Link
              key={row.original.noti_id}
              target="_blank"
              href={`${Url}?PONo=${row.original.notification.refId}`}
              className="dark:text-blue-300 text-blue-700 hover:underline"
            >
              {row.original.notification.refId}
            </Link>
          )}
          {row.original.notification.type === "UploadFile" && (
            <Link
              key={row.original.noti_id}
              target="_blank"
              href={`${Url}?PONo=${row.original.notification.refId}`}
              className="dark:text-blue-300 text-blue-700 hover:underline"
            >
              {row.original.notification.refId}
            </Link>
          )}
          {row.original.notification.type === "Update" && (
            <Link
              key={row.original.noti_id}
              target="_blank"
              href={`${Url}?PONo=${row.original.notification.refId}`}
              className="dark:text-blue-300 text-blue-700 hover:underline"
            >
              {row.original.notification.refId}
            </Link>
          )}
        </>

        // <span className="pl-1">
        //   {row.original.notification.refId}
        //   </span>
      );
    },
    meta: {
      label: "ReferenceId",
    },
  },
  {
    accessorKey: "type",
    accessorFn: (row) => `${row.notification?.type ?? ""}`.trim(),
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Type
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (
        !filterValue ||
        (Array.isArray(filterValue) && filterValue.length === 0)
      )
        return true;
      const type = row.original.notification.type
        ?.toString()
        .toLowerCase()
        .trim();

      if (Array.isArray(filterValue)) {
        return filterValue
          .map((f) =>
            typeof f === "string"
              ? f.toLowerCase().trim()
              : (f.value ?? "").toLowerCase().trim()
          )
          .includes(type);
      } else {
        // กรณี string (text input)
        return type.includes(filterValue.toString().toLowerCase().trim());
      }
    },
    cell: ({ row }) => {
      // const isConfirmed = row.original.Supreceive;
      // const isCancel = row.original.cancelStatus;
      return (
        <Badge variant="outline" className={`text-muted-foreground px-1.5 `}>
          {row.original.notification.type}
        </Badge>
      );
    },

    // (optional) enableFacetedValues: true,
  },

  {
    id: "message",
    accessorKey: "Message",
    header: ({ column }) => (
      <div className="hover:cursor-pointer !p-0">Message</div>
    ),
    cell: ({ row }) => {
      return (
        <span className="pl-1">
          {row.original.notification.message}
          {/* {date ? new Date(date).toLocaleDateString() : "Not downloaded"} */}
        </span>
      );
    },

    enableSorting: false,
    enableHiding: false,
    meta: {
      // filterElement: DateRangeFilter, // custom meta key สำหรับ filter
      label: "Message",
    },

    // filterFn: (row, columnId, filterValue) => {
    //   if (!filterValue?.from) return true;

    //   const rowDate = new Date(row.getValue(columnId));
    //   const from = filterValue.from;
    //   const to = filterValue.to ?? from; // กรณีเลือกวันเดียว

    //   return rowDate >= from && rowDate <= to;
    // },
  },

  {
    id: "createAt",
    accessorFn: (row) => new Date(row.notification.createAt), // ✅ เปลี่ยนตรงนี้
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Date
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const data = new Date(row.original.notification.createAt);
      // console.log(row.original.notification.createAt);
      return (
        <span className="pl-1">
          {data.toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })}
        </span>
      );
    },
    meta: {
      label: "ReferenceId",
    },
  },
];
