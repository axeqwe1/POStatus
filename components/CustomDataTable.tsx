import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  type ColumnDef,
  type PaginationState,
  type SortingState,
  type VisibilityState,
  type RowSelectionState,
  type ColumnFiltersState,
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
import CustomTableFooter from "@/components/CustomTableFooter";
import CustomFilterDropdown from "./CustomFilterDropdown";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { Input } from "./ui/input";
import { ColumnFilter } from "./ColumnFilter";

interface CustomDataTableProps<TData, TSubData = TData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  subColumns?: ColumnDef<TSubData, any>[];
  initialPageSize?: number;
  className?: string;
  collapse?: boolean;
  subtableData?: TSubData[] | any[];
  findSubtableData?: (rowId: string) => void;
  showSubFooter?: boolean; // Optional prop to control footer visibility
  setSubShowFooter?: (show: boolean) => void; // Optional prop to control footer visibility from parent
}

export function CustomDataTable<TData, TSubData>({
  data,
  columns,
  subColumns = [],
  initialPageSize = 10,
  className,
  collapse = true,
  subtableData = [], // Default to empty array if not provided
  showSubFooter = true,
  findSubtableData = (rowId: string) => {},
}: CustomDataTableProps<TData, TSubData>) {
  const [openRow, setOpenRow] = React.useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

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
    getRowId: (row: any) => row.id?.toString() ?? row.key?.toString() ?? "",
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

  // useEffect(() => {
  //   if (subColumns.length > 0) {
  //     // If subColumns are provided, set the subtableData to an empty array initially
  //     setOpenRow(null);
  //   }
  // }, [subtableData, subColumns]);

  return (
    <div className={className}>
      <div className="flex flex-row justify-between my-3 px-3">
        <ColumnFilter table={table} />
        <CustomFilterDropdown table={table} />
      </div>
      <div className="w-full overflow-x-auto">
        <Table className="min-w-[700px]">
          <TableHeader className="bg-muted">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {collapse && <TableHead></TableHead>}
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
            {!collapse ? (
              <>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </>
            ) : (
              <React.Fragment>
                {table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow>
                      <TableCell>
                        <button
                          onClick={() => {
                            setOpenRow(openRow === row.id ? null : row.id);
                            findSubtableData(row.id);
                            console.log(openRow, row.id, subtableData);
                          }}
                          className="bg-transparent border-0"
                        >
                          <ChevronDown
                            className={`transition-transform ${
                              openRow === row.id ? "rotate-180" : ""
                            }`}
                            size={18}
                          />
                        </button>
                      </TableCell>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                    {openRow === row.id && (
                      <TableRow className="bg-muted">
                        <TableCell colSpan={row.getVisibleCells().length + 1}>
                          {/* Sub Table หรือเนื้อหาเพิ่มเติม */}
                          <CustomDataTable
                            className="rounded-lg border"
                            data={subtableData}
                            columns={subColumns} // หรือจะส่ง columns ใหม่ก็ได้ถ้า subtable ต่างจาก main table
                            collapse={false}
                            showSubFooter={true}
                          />
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </React.Fragment>
            )}
          </TableBody>
        </Table>
      </div>
      {showSubFooter && <CustomTableFooter table={table} />}
    </div>
  );
}
