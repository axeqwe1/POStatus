import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User } from "@/types/datatype"; // สมมุติ
import { ColumnCheckboxFilter } from "@/components/ColumnCheckboxFilter";
import { ArrowUpDown } from "lucide-react";

export const getColumns = (
  onDelete?: (id: number) => void
): ColumnDef<User>[] => [
  {
    id: "id",
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <ArrowUpDown />
        </Button>
      );
    },
    cell: ({ row }) => <span>{row.original.userId}</span>,
  },
  {
    id: "name",
    accessorKey: "name",
    // ใส่ filter header dropdown!
    header: ({ column, table }) => (
      <div className="flex items-center gap-2">
        Name
        <ColumnCheckboxFilter column={column} table={table} />
      </div>
    ),

    cell: ({ row }) => <span>{row.original.firstName}</span>,
    // (optional) enableFacetedValues: true,
  },
  {
    id: "email",
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) =>
      onDelete ? (
        <Button
          size="sm"
          variant="destructive"
          onClick={() => onDelete(row.original.userId)}
        >
          Delete
        </Button>
      ) : null,
  },
];
