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
  IconAutomation,
  IconCancel,
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown, Target } from "lucide-react";
import { DateRangeFilter } from "@/components/CustomDateFilter";
import { Textarea } from "@/components/ui/textarea";

const downloadUrl = process.env.NEXT_PUBLIC_PO_URL;

export const getColumns = (
  onCancel?: (id: string, remark: string) => void,
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
    cell: ({ row }) => {
      return row.original.Supreceive ? (
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
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="hover:cursor-default">{row.original.PONo}</span>
          </TooltipTrigger>
          <TooltipContent className="bg-neutral-800 text-white ">
            <span className="text-white ">
              Please Confirm PO before download.
            </span>
          </TooltipContent>
        </Tooltip>
      );
    },
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
    header: ({ column, table }) => {
      return (
        <>
          <div>Confirm/Cancel</div>
        </>
      );
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
          <div className="pl-[15px]">
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
        <div className="pl-[15px]">
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
          <div className="pl-[15px]">
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
          <div className="pl-[15px]">
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
          <div className="pl-[15px]">
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
          <div className="pl-[15px]">Description</div>
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
