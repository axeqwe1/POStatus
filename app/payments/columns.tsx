import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ColumnCheckboxFilter } from "../../components/ColumnCheckboxFilter";
export type User = {
  id: string;
  name: string;
  email: string;
};

export const getColumns = (
  setData: (updater: (prev: User[]) => User[]) => void,
  deleteRow: (rowId: string) => void
): ColumnDef<User>[] => [
  {
    accessorKey: "id",
    header: "Id",
    cell: ({ row }) => (
      <Input
        className="w-30"
        defaultValue={row.original.id}
        onBlur={(e) => {
          setData((prev) =>
            prev.map((r) =>
              r.id === row.original.id ? { ...r, id: e.target.value } : r
            )
          );
        }}
      />
    ),
  },
  {
    accessorKey: "name",
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Name
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // value ใน cell
      const value = row.getValue(columnId);
      // filterValue เป็น array
      return filterValue.includes(value);
    },
    cell: ({ row }) => (
      <Input
        defaultValue={row.original.name}
        onBlur={(e) => {
          setData((prev) =>
            prev.map((r) =>
              r.id === row.original.id ? { ...r, name: e.target.value } : r
            )
          );
        }}
      />
    ),
  },
  {
    accessorKey: "email",
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Email
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),
    filterFn: (row, columnId, filterValue) => {
      if (!filterValue || filterValue.length === 0) return true;
      // value ใน cell
      const value = row.getValue(columnId);
      // filterValue เป็น array
      return filterValue.includes(value);
    },
    cell: ({ row }) => (
      <Input
        defaultValue={row.original.email}
        onBlur={(e) => {
          setData((prev) =>
            prev.map((r) =>
              r.id === row.original.id ? { ...r, email: e.target.value } : r
            )
          );
        }}
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <Button
        size="sm"
        variant="destructive"
        onClick={() => deleteRow(row.original.id)}
      >
        Delete
      </Button>
    ),
  },
];
