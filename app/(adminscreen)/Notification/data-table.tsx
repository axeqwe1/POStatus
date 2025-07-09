"use client";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { CustomDataTable } from "@/components/CustomDataTable";
import { getColumns } from "./columns";
import {
  FileItem,
  NotificationReceivers,
  Notifications,
  PO_Details,
  PO_Status,
  Product,
  Variant,
} from "@/types/datatype";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Drawer } from "vaul";
import { Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { TabsTrigger } from "@radix-ui/react-tabs";
import { GetPOByPONo, GetPODetail, SaveStatusDownload } from "@/lib/api/po";
import { toast } from "sonner";
import { ServerSideDataTable } from "@/components/CustomServerTable";
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  Table as ReactTableType,
  useReactTable,
  VisibilityState,
  getFacetedRowModel,
  getFacetedUniqueValues,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnFilter } from "@/components/ColumnFilter";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import CustomTableFooter from "@/components/CustomTableFooter";
import { apiService } from "@/lib/axios";
import { MarkAsRead } from "@/lib/api/notify";

interface DataTableProps {
  data: NotificationReceivers[];
  isLoading: boolean;
  markAsRead: (
    recvId: string[],
    table: ReactTableType<NotificationReceivers>
  ) => void;
}
export default function DataTable({
  data,
  isLoading,
  markAsRead,
}: DataTableProps) {
  const [datas, setDatas] = useState(data);
  const [isEdit, setIsEdit] = useState(false);
  const [editItem, setEditItem] = useState<string>("");
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  // pagin
  useEffect(() => {
    setDatas(data);
    // console.log(data);
  }, [data]);

  const handleDelete = async (fileId: string) => {
    // setDatas((prev) => prev.filter((u) => u.PONo !== fileId));
  };

  const handleEdit = (PONo: string) => {
    setEditItem(PONo);
    setIsEdit(true);
  };

  useEffect(() => {
    setDatas(data);
  }, [data]);

  const columns = useMemo(() => getColumns(), [isEdit, editItem, isDesktop]);

  const table = useReactTable({
    data,
    columns,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination, // ✅ เพิ่มตรงนี้
    getPaginationRowModel: getPaginationRowModel(), // ✅ สำหรับ client-side pagin
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });
  useEffect(() => {
    const rows = table.getSelectedRowModel().rows.map((item) => item.original);
    const recvId = rows.map((item) => item.noti_recvId);
    // console.log(recvId);
    markAsRead(recvId, table);
  }, [table.getState().rowSelection]);

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <ColumnFilter table={table} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div>
          {/*  */}
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={`${row.original.noti_id}-${row.original.noti_recvId}`}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <CustomTableFooter table={table} />
      </div>
    </>
  );
}
