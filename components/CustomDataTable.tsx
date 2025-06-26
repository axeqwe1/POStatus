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
import { Button } from "./ui/button";
import { SkeletonTable } from "./SkeletonTable";

interface CustomDataTableProps<TData, TSubData = TData> {
  data: TData[];
  pageCount?: number;
  totalCount?: number; // ✅ ใช้คำนวณจำนวนหน้า
  manualPagination?: boolean; // ✅ เพิ่ม flag
  // pageCount?: number; // ✅ ใช้เฉพาะตอน manual
  columns: ColumnDef<TData, any>[];
  subColumns?: ColumnDef<TSubData, any>[];
  initialPageSize?: number;
  className?: string;
  collapse?: boolean;
  openModal?: boolean;
  setOpenModal?: (isOpen: boolean) => void;
  subtableData?: TSubData[] | any[];
  findSubtableData?: (rowId: string) => void;
  showSubFooter?: boolean; // Optional prop to control footer visibility
  setSubShowFooter?: (show: boolean) => void; // Optional prop to control footer visibility from parent'
  showAddBtn?: boolean;
  Key?: string;
  setKey?: (key: string) => void;
  onPaginationChange?: (pageIndex: number, pageSize: number) => void;
}

export function CustomDataTable<TData, TSubData>({
  data,
  pageCount = 0,
  totalCount = 0, // ✅ ใช้คำนวณจำนวนหน้า
  manualPagination = false, // ✅ เพิ่ม flag
  columns,
  subColumns = [],
  initialPageSize = 10,
  className,
  collapse = true,
  subtableData = [], // Default to empty array if not provided
  showSubFooter = true,
  openModal = false,
  showAddBtn = false,
  setOpenModal = (isOpen: boolean) => {},
  findSubtableData = (rowId: string) => {},
  onPaginationChange = (pageIndex: number, pageSize: number) => {},
}: CustomDataTableProps<TData, TSubData>) {
  const [openRow, setOpenRow] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(true);
  const table = useReactTable({
    data,
    columns,
    manualPagination: manualPagination, // ✅ สำคัญ
    pageCount: manualPagination
      ? Math.ceil(totalCount / pagination.pageSize)
      : undefined,
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
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    ...(manualPagination
      ? {}
      : {
          getPaginationRowModel: getPaginationRowModel(), // 👈 client-side เท่านั้น
        }),
  });

  useEffect(() => {
    if (subtableData.length > 0) {
      // If subColumns are provided, set the subtableData to an empty array initially
      setIsLoading(false);
      console.log("Subtable columns provided, initializing subtable data.");
    }
  }, [subtableData, subColumns]);

  return (
    <div className={className}>
      <div className="flex flex-row justify-between my-3 px-3">
        <ColumnFilter table={table} />
        <div className="flex flex-col-reverse md:flex-row sm:justify-center md:items-center gap-2">
          <CustomFilterDropdown table={table} />
          {showAddBtn ? (
            <Button
              onClick={() => {
                setOpenModal(true);
              }}
              className="text-white hover:cursor-pointer"
            >
              Add Data
            </Button>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="flex flex-row justify-between my-3 px-3">
        {table.getAllColumns().map((column) =>
          column.columnDef.meta?.filterElement ? (
            <div key={column.id}>
              <column.columnDef.meta.filterElement column={column} />
            </div>
          ) : null
        )}
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
                {table.getRowModel().rows.map((row, index) => {
                  let key: string[] = Object.keys(row.original);
                  let value: string[] = Object.values(row.original);
                  return (
                    <TableRow key={`!collapse-${value[0]}-${index}`}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="pl-6">
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  );
                })}
              </>
            ) : (
              <React.Fragment>
                {table.getRowModel().rows.map((row, index) => {
                  let key: string[] = Object.keys(row.original);
                  let value: string[] = Object.values(row.original);
                  return (
                    <React.Fragment key={`collapse-${value[0]}-${index}`}>
                      <TableRow>
                        <TableCell>
                          <button
                            onClick={() => {
                              setOpenRow(
                                openRow === value[0] ? null : value[0]
                              );

                              findSubtableData(value[0]);
                              if (openRow === null) {
                                subColumns = [];
                                setIsLoading(true);
                              }
                              console.log(row);
                            }}
                            className="bg-transparent border-0"
                          >
                            <ChevronDown
                              className={`transition-transform ${
                                openRow === value[0] ? "rotate-180" : ""
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
                      {openRow === value[0] && (
                        <TableRow className="bg-muted">
                          <TableCell colSpan={row.getVisibleCells().length + 1}>
                            {/* Sub Table หรือเนื้อหาเพิ่มเติม */}
                            {isLoading ? (
                              <div className=" flex justify-center items-center">
                                <SkeletonTable cols={3} rows={5} />
                              </div>
                            ) : (
                              <CustomDataTable
                                className="rounded-lg border"
                                data={subtableData}
                                columns={subColumns} // หรือจะส่ง columns ใหม่ก็ได้ถ้า subtable ต่างจาก main table
                                collapse={false}
                                showSubFooter={true}
                              />
                            )}
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  );
                })}
              </React.Fragment>
            )}
          </TableBody>
        </Table>
      </div>
      {showSubFooter && (
        <CustomTableFooter
          table={table}
          manualPagination={manualPagination}
          totalCount={totalCount}
        />
      )}
    </div>
  );
}
