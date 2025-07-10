// components/ColumnCheckboxFilter.tsx
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { useEffect } from "react";

type Props<TData> = {
  column: any; // คุณสามารถใช้ Column<TData, TValue> ถ้า import type มาถูกต้อง
  table: Table<TData>;
};

export function ColumnCheckboxFilter<TData>({ column, table }: Props<TData>) {
  // เอาค่า unique จาก facetedUniqueValues ของคอลัมน์นั้น
  const valuesMap = column.getFacetedUniqueValues();
  const values: string[] = valuesMap ? Array.from(valuesMap.keys()) : [];
  // ค่าที่ถูกเลือกไว้
  const selected = (column.getFilterValue() as string[]) ?? [];

  const toggleValue = (val: string) => {
    const next = selected.includes(val)
      ? selected.filter((v) => v !== val)
      : [...selected, val];
    console.log(next);
    column.setFilterValue(next.length ? next : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="max-h-64 overflow-y-auto">
        {values.map((val, index) => (
          <div key={index} className="flex items-center gap-2 px-2 py-1">
            {val !== "" ? (
              <>
                <Checkbox
                  checked={selected.includes(val)}
                  onCheckedChange={() => toggleValue(val)}
                  id={`filter-${column.id}-${val}`}
                />
                <label
                  htmlFor={`filter-${column.id}-${val}`}
                  className="text-sm cursor-pointer"
                >
                  {val}
                </label>
              </>
            ) : null}
          </div>
        ))}
        {values.length === 0 && (
          <span className="text-muted-foreground px-2 py-1 text-xs">
            No values
          </span>
        )}
        <div className="flex justify-end p-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => column.setFilterValue(undefined)}
          >
            Clear
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
