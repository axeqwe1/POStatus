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
import { useSearchParams } from "next/navigation";
interface ColumnFilterProps<TData> {
  table: Table<TData>;
}

export function ColumnFilter<TData>({ table }: ColumnFilterProps<TData>) {
  const searchParams = useSearchParams();
  const poNo = searchParams.get("PONo");
  const firstChoice = table
    .getAllColumns()
    .filter((column) => column.getCanFilter())
    .map((column) => column.columnDef.id)
    .filter((item) => item != undefined)[0] as string;
  useEffect(() => {
    console.log(poNo);
    if (poNo) {
      console.log(table);
      table.getColumn("PONo")?.setFilterValue(poNo);
    }
  }, []);
  const [selectedColumn, setSelectedColumn] = useState<string>(firstChoice);
  return (
    <>
      {firstChoice && (
        <div className="grid grid-cols-1 md:flex items-center gap-2 max-w-sm">
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
              (table.getColumn(selectedColumn)?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn(selectedColumn)
                ?.setFilterValue(event.target.value)
            }
            className="flex-1"
          />
        </div>
      )}
    </>
  );
}
