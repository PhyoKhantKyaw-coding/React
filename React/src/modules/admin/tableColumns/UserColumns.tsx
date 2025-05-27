import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown } from "lucide-react";

export const userColumns: ColumnDef<User>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-black hover:text-black hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.name || "Unknown"}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-black hover:text-black hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Email
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.email || "No email"}</div>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-black hover:text-white hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Phone Number
        <ArrowUpDown className="h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.phoneNumber}</div>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-black hover:text-white hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Status
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
];
export default userColumns;
