import { Dispatch, SetStateAction } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  ChevronFirst as IconChevronsLeft,
  ChevronLeft as IconChevronLeft,
  ChevronRight as IconChevronRight,
  ChevronLast as IconChevronsRight,
} from "lucide-react";

// Pagination Controls (shadcn style)
type TablePaginationProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
};

function TablePagination({
  page,
  pageCount,
  onPageChange,
}: TablePaginationProps) {
  return (
    <div className="flex items-center gap-2">
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => onPageChange(0)}
        disabled={page === 0}
      >
        <span className="sr-only">Go to first page</span>
        <IconChevronsLeft />
      </Button>
      <Button
        variant="outline"
        className="size-8"
        size="icon"
        onClick={() => onPageChange(page - 1)}
        disabled={page === 0}
      >
        <span className="sr-only">Go to previous page</span>
        <IconChevronLeft />
      </Button>
      <span className="px-2 text-sm font-medium">
        Page {page + 1} of {pageCount}
      </span>
      <Button
        variant="outline"
        className="size-8"
        size="icon"
        onClick={() => onPageChange(page + 1)}
        disabled={page + 1 >= pageCount}
      >
        <span className="sr-only">Go to next page</span>
        <IconChevronRight />
      </Button>
      <Button
        variant="outline"
        className="hidden h-8 w-8 p-0 lg:flex"
        onClick={() => onPageChange(pageCount - 1)}
        disabled={page + 1 >= pageCount}
      >
        <span className="sr-only">Go to last page</span>
        <IconChevronsRight />
      </Button>
    </div>
  );
}

// Select (จำนวนแถวต่อหน้า หรือ filter)
type PageSizeSelectProps = {
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
};

function PageSizeSelect({ pageSize, setPageSize }: PageSizeSelectProps) {
  return (
    <Select
      value={String(pageSize)}
      onValueChange={(val) => setPageSize(Number(val))}
    >
      <SelectTrigger className="w-24" size="sm">
        <SelectValue placeholder={String(pageSize)} />
      </SelectTrigger>
      <SelectContent>
        {[10, 20, 30, 40, 50].map((num) => (
          <SelectItem key={num} value={String(num)}>
            {num} แถว/หน้า
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type ExampleTableFooterProps = {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
};

export function ExampleTableFooter({
  page,
  pageCount,
  onPageChange,
  pageSize,
  setPageSize,
}: ExampleTableFooterProps) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2 border-t">
      <PageSizeSelect pageSize={pageSize} setPageSize={setPageSize} />
      <TablePagination
        page={page}
        pageCount={pageCount}
        onPageChange={onPageChange}
      />
    </div>
  );
}
