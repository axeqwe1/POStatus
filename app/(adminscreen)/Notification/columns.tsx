import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FileItem,
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

const downloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (
  onCancel?: (PONo: string, Remark: string) => void,
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
        <span className="flex flex-row items-center gap-1 text-xs text-gray-500">
          <IconPaperclip size={16} />
          PO Files
        </span>
      </div>
    ),
    cell: ({ row }) => {
      return <div>test</div>;
    },
  },
  {
    accessorKey: "supplierName",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        SupplierName
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      return <div>{row.original.supplierName}</div>;
    },

    // (optional) enableFacetedValues: true,
  },
  {
    accessorKey: "Status",
    accessorFn: (row) =>
      row.cancelStatus === 1
        ? "RequestCancel"
        : row.cancelStatus === 2
        ? "Cancel"
        : row.Supreceive
        ? "Confirm"
        : !row.ClosePO
        ? "Process.. "
        : "Pending",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Status
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    cell: ({ row }) => {
      const isConfirmed = row.original.Supreceive;
      const isCancel = row.original.cancelStatus;
      return (
        <Badge
          variant="outline"
          className={`text-muted-foreground px-1.5 ${
            isCancel
              ? "bg-red-200 dark:bg-red-900"
              : isConfirmed
              ? "bg-green-200 dark:bg-green-900"
              : row.original.ClosePO
              ? "bg-yellow-200 dark:bg-yellow-900"
              : "bg-blue-200 dark:bg-blue-900"
          }`}
        >
          {isCancel ? (
            <IconCancel className="fill-red-500 dark:fill-red-400" />
          ) : isConfirmed ? (
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
          ) : row.original.ClosePO ? (
            <IconClock className="fill-yellow-500 dark:fill-yellow-400" />
          ) : (
            <IconAutomation className="fill-blue-500 dark:fill-blue-400" />
          )}
          {isCancel === 1
            ? "RequestCancel"
            : isCancel === 2
            ? "Cancel"
            : isConfirmed
            ? "Confirm"
            : row.original.ClosePO
            ? "Pending"
            : "Process.. "}
        </Badge>
      );
    },

    // (optional) enableFacetedValues: true,
  },

  {
    accessorKey: "ApproveDate",
    accessorFn: (row) => {
      return !row.ClosePO
        ? "Not Approved"
        : row.sendDate
        ? new Date(row.sendDate).toLocaleDateString("th-TH", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "Not Approved";
    },
    header: ({ column }) => (
      <Button
        className="hover:cursor-pointer !p-0"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Lastest Approve Date
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => {
      const date = row.original.sendDate;
      return (
        <span className="pl-1">
          {!row.original.ClosePO
            ? "Not Approved"
            : row.original.sendDate
            ? new Date(row.original.sendDate).toLocaleDateString("th-TH", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Not Approved"}
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
    header: ({ column, table }) => {
      return <div>Confirm/Cancel</div>;
    },
    cell: ({ row }) => {
      const [remark, setRemark] = useState("");
      const [isOpen, setIsOpen] = useState(false);
      const [shouldClose, setShouldClose] = useState(false);

      const handleSubmit = (e: any) => {
        if (remark.trim() === "") {
          toast.error("Please enter a reason for cancellation.");
          return;
        }

        toast.success("Send request success.");
        onCancel?.(row.original.PONo, remark);

        setShouldClose(true);
        setTimeout(() => {
          setIsOpen(false);
          setShouldClose(false);
        }, 1000); // ตรงกับ duration
        e.preventDefault();
      };

      return (
        <>
          <div className="flex gap-3 pl-4">
            {row.original.ClosePO ? (
              <>
                {/* Confirm PO Button */}
                {!row.original.Supreceive && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="w-[25px] h-[25px] bg-neutral-200 hover:bg-neutral-300/70 hover:cursor-pointer">
                        <IconCheck
                          className="text-green-500 font-bold"
                          size={40}
                        />
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
                            confirm your data.
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
                )}

                {/* Cancel PO Button */}
                <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      className="w-[25px] h-[25px] hover:cursor-pointer"
                    >
                      <IconX />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogPortal>
                    <AlertDialogContent className="sm:max-w-[425px] z-50">
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you want to Cancel PO?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently
                          cancel your data.
                          <Label className="mt-3">Reason</Label>
                          <Textarea
                            className="mt-2"
                            placeholder="Enter reason for cancel"
                            onChange={(e) => {
                              setRemark?.(e.target.value);
                            }}
                          />
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="hover:cursor-pointer">
                          Cancel
                        </AlertDialogCancel>
                        <Button
                          type="button"
                          className="hover:cursor-pointer text-white bg-red-500 hover:bg-red-500/90"
                          onClick={handleSubmit}
                        >
                          Confirm
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogPortal>
                </AlertDialog>
              </>
            ) : (
              <span>Not Available</span>
            )}
          </div>

          {/* Dialog/Drawer อยู่ภายนอก Dropdown */}
        </>
      );
    },
  },
];
