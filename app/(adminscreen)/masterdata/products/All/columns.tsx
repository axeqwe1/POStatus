import { ColumnDef, RowExpanding } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Product, Variant } from "@/types/datatype"; // สมมุติ
import { ColumnCheckboxFilter } from "@/components/ColumnCheckboxFilter";
import { ProductForm } from "./edit-dialog";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuPortal,
} from "@radix-ui/react-dropdown-menu";
import { Label } from "@/components/ui/label";
import { IconDotsVertical } from "@tabler/icons-react";
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

export const getColumns = (
  onDelete?: (id: string) => void,
  isEdit?: boolean,
  setIsEdit?: (isEdit: boolean) => void,
  editItem?: Product | Variant | null,
  setEditItem?: (item: Product | Variant | null) => void,
  isDesktop?: boolean
): ColumnDef<Product>[] => [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => <span>{row.original.id}</span>,
  },
  {
    id: "name",
    accessorKey: "name",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Name
        {/* <ColumnCheckboxFilter column={column} table={table} /> */}
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    // filterFn: (row, columnId, filterValue) => {
    //   if (!filterValue || filterValue.length === 0) return true;
    //   // ในกรณีที่ filterValue เป็น array
    //   return filterValue.includes(row.getValue(columnId));
    // },
    cell: ({ row }) => <span>{row.original.name}</span>,
    // (optional) enableFacetedValues: true,
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => <span>{row.original.description}</span>,
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => <span>{row.original.price}</span>,
  },
  {
    accessorKey: "category",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Category
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
  },
  // {
  //   id: "actions",
  //   header: "Actions",
  //   cell: ({ row }) =>
  //     onDelete ? (
  //       <Button
  //         size="sm"
  //         variant="destructive"
  //         onClick={() => onDelete(row.original.id)}
  //       >
  //         Delete
  //       </Button>
  //     ) : null,
  // },
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
                  setEditItem ? setEditItem(row.original) : undefined; // Trigger state outside Dropdown
                }}
                className="hover:bg-slate-200 p-1 rounded-md hover:cursor-pointer"
              >
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-slate-200 p-1 rounded-md">
                Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:cursor-pointer p-1 rounded-md"
                onClick={() => onDelete?.(row.original.id)}
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

export const getSubColumns = (
  onDelete?: (id: string) => void,
  onEdit?: (id: string) => void
): ColumnDef<Variant>[] => [
  {
    accessorKey: "Image",
    header: "Image",
    cell: ({ row }) => (
      <img className="w-[80px] h-[38px]" src={row.original.imageUrl}></img>
    ),
  },
  {
    accessorKey: "size",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Size
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    // (optional) enableFacetedValues: true,
  },
  {
    accessorKey: "color",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Color
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    // รองรับ filter แบบ multi-checkbox
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // ในกรณีที่ filterValue เป็น array
      return filterValue.includes(row.getValue(columnId));
    },
    // (optional) enableFacetedValues: true,
  },
  // {
  //   accessorKey: "Color",
  //   header: "Color",
  //   cell: ({ row }) => <span>{row.original.color}</span>,
  // },
  {
    accessorKey: "Unit",
    header: "Unit",
    cell: ({ row }) => {
      const [value, setValue] = useState(row.original.unit);

      const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
          console.log(`Saving ${row.original.id} with value: ${value}`);
          e.preventDefault();
          toast.promise(
            new Promise((resolve) => setTimeout(resolve, 1000)), // your save logic here
            {
              loading: `Saving ${row.original.id}`,
              success: "Done",
              error: "Error",
            }
          );
        }
      };

      return (
        <Input
          className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
          defaultValue={value}
          onKeyDown={handleKeyDown}
          onChange={(e: any) => setValue(e.target.value)}
          id={`${row.original.id}-unit`}
        />
      );
    },
  },
  {
    accessorKey: "Sku",
    header: "Sku",
    cell: ({ row }) => <span>{row.original.sku}</span>,
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
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 hover:text-red-700 hover:cursor-pointer p-1 rounded-md"
                onClick={() => onDelete?.(row.original.id)}
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
