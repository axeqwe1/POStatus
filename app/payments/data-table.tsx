"use client";
import React, { useCallback, useMemo, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  ColumnFiltersState,
  PaginationState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { getColumns, User } from "./columns";
import CustomFilterDropdown from "@/components/CustomFilterDropdown";
import CustomTableFooter from "@/components/CustomTableFooter";

interface DataTableProps {
  data: User[];
}

export function DataTable({ data: initialData }: DataTableProps) {
  const [data, setData] = useState(initialData);
  const [editingRowId, setEditingRowId] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<Partial<User>>({});
  // Responsive: no need to change these
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const deleteRow = (rowId: string) => {
    setData((prev) => prev.filter((item) => item.id != rowId));
  };

  const getEditRow = useCallback(() => editRow, [editRow]);

  const columns = useMemo(() => getColumns(setData, deleteRow), [setData]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  return (
    <div className="max-w-[1100px] mx-auto">
      <div className="flex items-center gap-2 relative justify-between flex-row-reverse mb-2">
        <CustomFilterDropdown table={table} />
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-slate-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
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
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CustomTableFooter table={table} />
    </div>
  );
}
