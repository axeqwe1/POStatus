import { ColumnDef } from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
    accessorKey: "name",
    header: "Name",
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
    header: "Email",
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
