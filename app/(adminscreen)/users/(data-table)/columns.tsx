import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PO_Status, Product, User, UserEmail, Variant } from "@/types/datatype"; // สมมุติ
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
import { ArrowUpDown } from "lucide-react";
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
      <Button
        className="hover:cursor-pointer"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        ID
        <ArrowUpDown />
      </Button>
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
    // id: "Role",
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
      return (
        <Badge
          className={`text-xs text-white w-15 ${
            row.original.role == "Admin"
              ? "bg-secondary"
              : row.original.role == "SupperAdmin"
              ? "bg-amber-500"
              : row.original.role == "PurchaseOfficer"
              ? "bg-blue-500"
              : "bg-primary"
          }`}
        >
          {row.original.role == "SupperAdmin"
            ? "SupAdmin"
            : row.original.role == "PurchaseOfficer"
            ? "Purchase"
            : row.original.role}
        </Badge>
      );
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
              className="z-50 p-4 border-1 rounded-2xl bg-accent"
            >
              <DropdownMenuItem
                className="hover:bg-slate-200 p-1 rounded-md hover:cursor-pointer"
                onClick={() => {
                  setIsEdit?.(true);
                  setEditItem?.(
                    row.original
                  ); /* เปิด Dialog/Drawer เพื่อแก้ไข */
                }}
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="text-red-600 hover:bg-red-50 hover:text-red-700 p-1 rounded-md hover:cursor-pointer"
                  >
                    Delete
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogPortal>
                  <AlertDialogContent className="sm:max-w-[425px]">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure to delete?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        Delete yourdata and delete your data from our servers.
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
                          onClick={() => onDelete?.(row.original.userId)}
                        >
                          Submit
                        </Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialogPortal>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>

        {/* Dialog/Drawer อยู่ภายนอก Dropdown */}
      </>
    ),
  },
];

export const getSubColumns = (
  setActive: (emailId: string, bool: boolean) => void
): ColumnDef<UserEmail>[] => [
  {
    id: "email",
    accessorKey: "email",
    header: () => {
      return (
        <>
          <div className="pl-4">Email</div>
        </>
      );
    },
    cell: ({ row }) => {
      return (
        <>
          <div>{row.original.email}</div>
        </>
      );
    },
  },
  {
    id: "isActive",
    accessorKey: "isActive",
    header: () => {
      return (
        <>
          <div className="pl-4">Active</div>
        </>
      );
    },
    cell: ({ row }) => {
      const isActive = row.original.isActive;

      return (
        <>
          <div>
            {isActive ? (
              <>
                <Badge className="bg-green-500 dark:bg-green-900 text-white">
                  <span> Active </span>
                </Badge>
              </>
            ) : (
              <>
                <Badge className="bg-red-500 dark:bg-red-900 text-white">
                  <span> Deactive </span>
                </Badge>
              </>
            )}
          </div>
        </>
      );
    },
  },
  {
    id: "action",
    cell: ({ row }) => {
      const isActive = row.original.isActive;
      return (
        <div className="flex flex-row-reverse pr-6">
          <DropdownMenu modal={false}>
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
                className="z-50 p-4 border-1 rounded-2xl bg-accent"
              >
                {isActive ? (
                  <>
                    <DropdownMenuItem
                      onClick={() => setActive(row.original.emailId, false)}
                      className="hover:bg-slate-200 p-1 rounded-md hover:cursor-pointer text-red-500"
                    >
                      SET Deactive
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem
                      onClick={() => setActive(row.original.emailId, true)}
                      className="hover:bg-slate-200 p-1 rounded-md hover:cursor-pointer text-green-500"
                    >
                      SET Active
                    </DropdownMenuItem>
                  </>
                )}

                <DropdownMenuSeparator />
              </DropdownMenuContent>
            </DropdownMenuPortal>
          </DropdownMenu>
        </div>
      );
    },
  },
];
