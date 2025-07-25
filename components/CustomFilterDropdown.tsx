import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuPortal,
} from "@radix-ui/react-dropdown-menu";
import {
  IconLayoutColumns,
  IconChevronDown,
  IconCheck,
} from "@tabler/icons-react";
import { Button } from "./ui/button";
import { useEffect } from "react";

export default function CustomFilterDropdown({ table }: any) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className=" border-1">
          <IconLayoutColumns />
          <span className="hidden lg:inline">Customize Columns</span>
          <span className="lg:hidden">Columns</span>
          <IconChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent align="end" className="w-56 border-3">
          {table
            .getAllColumns()
            .filter(
              (column: any) =>
                typeof column.accessorFn !== "undefined" && column.getCanHide()
            )
            .map((column: any) => (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize hover:cursor-pointer px-4 py-2 pl-8 relative bg-accent" // <-- pl-8 เพื่อเว้นซ้ายให้ icon
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {/* Check icon, only visible when checked */}
                {column.getIsVisible() && (
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none ">
                    <IconCheck size={18} className="text-primary" />
                  </span>
                )}
                <span className="">
                  {column.columnDef.meta?.label ?? column.id}
                </span>
              </DropdownMenuCheckboxItem>
            ))}
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}
