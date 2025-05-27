import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

interface OrderHistoryTableProps {
  setSelectedSaleId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDetailsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const orderHistoryColumns = ({ setSelectedSaleId, setIsDetailsDialogOpen }: OrderHistoryTableProps): ColumnDef<Sale>[] => [
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
    accessorKey: "saleDate",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-white hover:text-white hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Sale Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("saleDate"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "userName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-white hover:text-white hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Username
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.userName || "Unknown User"}</div>,
  },
  {
    accessorKey: "totalAmount",
    header: () => <div className="text-right">Total Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalProfit",
    header: () => <div className="text-right">Total Profit</div>,
    cell: ({ row }) => {
      const profit = parseFloat(row.getValue("totalProfit"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(profit);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "totalCost",
    header: () => <div className="text-right">Total Cost</div>,
    cell: ({ row }) => {
      const cost = parseFloat(row.getValue("totalCost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(cost);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const sale = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-1000">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(sale.saleId)}
            >
              Copy Sale ID
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedSaleId(sale.saleId);
                setIsDetailsDialogOpen(true);
              }}
            >
              View Details
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

  export default orderHistoryColumns;