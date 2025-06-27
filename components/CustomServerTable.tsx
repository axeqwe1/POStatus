// ✅ SERVER-SIDE VERSION OF CustomDataTable
// แตกต่างหลักๆ: ใช้ manualPagination และ onPaginationChange trigger API

"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  type ColumnDef,
  type PaginationState,
  flexRender,
} from "@tanstack/react-table";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
  TableHead,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  ChevronFirst as IconChevronsLeft,
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
  ChevronLast as IconChevronsRight,
} from "lucide-react";

interface ServerSideDataTableProps<TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  totalCount: number;
  pageSize: number;
  pageIndex: number;
  onPaginationChange: (pagination: PaginationState) => void;
  isLoading?: boolean;
}

export function ServerSideDataTable<TData>({
  data,
  columns,
  totalCount,
  pageSize,
  pageIndex,
  onPaginationChange,
  isLoading = false,
}: ServerSideDataTableProps<TData>) {
  const handlePaginChange = (
    updaterOrValue: SetStateAction<PaginationState>
  ) => {
    if (typeof updaterOrValue === "function") {
      const newPagination = (
        updaterOrValue as (old: PaginationState) => PaginationState
      )({
        pageIndex,
        pageSize,
      });
      onPaginationChange(newPagination);
    } else {
      // direct value
      onPaginationChange(updaterOrValue);
    }
  };
  const table = useReactTable({
    data,
    columns,
    pageCount: Math.ceil(totalCount / pageSize),
    state: {
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: true,
    onPaginationChange: handlePaginChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  const canPreviousPage = table.getCanPreviousPage();
  const canNextPage = table.getCanNextPage();

  return (
    <div className="w-full overflow-x-auto">
      <Table className="min-w-[700px]">
        <TableHeader className="bg-muted">
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
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Loading...
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="flex items-center justify-between px-4 py-2 border-t">
        <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
          Showing page {pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className="flex w-full items-center gap-8 lg:w-fit">
          <div className="hidden items-center gap-2 lg:flex">
            <Label htmlFor="rows-per-page" className="text-sm font-medium">
              Rows per page
            </Label>
            <Select
              value={String(pageSize)}
              onValueChange={(value) =>
                onPaginationChange({ pageIndex: 0, pageSize: Number(value) })
              }
            >
              <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                <SelectValue placeholder={String(pageSize)} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex w-fit items-center justify-center text-sm font-medium">
            Page {pageIndex + 1} of {table.getPageCount()}
          </div>
          <div className="ml-auto flex items-center gap-2 lg:ml-0">
            <Button
              variant="outline"
              className="hidden h-8 w-8 p-0 lg:flex hover:cursor-pointer"
              onClick={() => onPaginationChange({ pageIndex: 0, pageSize })}
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to first page</span>
              <IconChevronsLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8 hover:cursor-pointer"
              size="icon"
              onClick={() =>
                onPaginationChange({ pageIndex: pageIndex - 1, pageSize })
              }
              disabled={!canPreviousPage}
            >
              <span className="sr-only">Go to previous page</span>
              <IconChevronLeft />
            </Button>
            <Button
              variant="outline"
              className="size-8 hover:cursor-pointer"
              size="icon"
              onClick={() =>
                onPaginationChange({ pageIndex: pageIndex + 1, pageSize })
              }
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to next page</span>
              <IconChevronRight />
            </Button>
            <Button
              variant="outline"
              className="hidden size-8 lg:flex hover:cursor-pointer"
              size="icon"
              onClick={() =>
                onPaginationChange({
                  pageIndex: table.getPageCount() - 1,
                  pageSize,
                })
              }
              disabled={!canNextPage}
            >
              <span className="sr-only">Go to last page</span>
              <IconChevronsRight />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
