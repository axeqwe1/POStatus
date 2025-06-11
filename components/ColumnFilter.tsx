import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table } from "@tanstack/react-table";
import { Fragment, useEffect, useState } from "react";

interface ColumnFilterProps<TData> {
  table: Table<TData>;
}

export function ColumnFilter<TData>({ table }: ColumnFilterProps<TData>) {
  const firstChoice = table
    .getAllColumns()
    .map((column) => column.columnDef.id)[0] as string;
  const [selectedColumn, setSelectedColumn] = useState<string>(firstChoice);
  useEffect(() => {
    const firstChoice = table
      .getAllColumns()
      .map((column) => column.columnDef.id);
    console.log(firstChoice);
  }, []);
  return (
    <div className="flex items-center gap-2 max-w-sm">
      <Select value={selectedColumn} onValueChange={setSelectedColumn}>
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Select column" />
        </SelectTrigger>
        <SelectContent>
          {table
            .getAllColumns()
            .filter((column) => column.getCanFilter())
            .map((column, index) => (
              <Fragment key={index}>
                {column.columnDef.id != undefined && (
                  <SelectItem key={index} value={column.id}>
                    {column.columnDef.id as string}
                  </SelectItem>
                )}
              </Fragment>
            ))}
        </SelectContent>
      </Select>
      <Input
        placeholder={`Filter ${selectedColumn}...`}
        value={
          (table.getColumn(selectedColumn)?.getFilterValue() as string) ?? ""
        }
        onChange={(event) =>
          table.getColumn(selectedColumn)?.setFilterValue(event.target.value)
        }
        className="flex-1"
      />
    </div>
  );
}
