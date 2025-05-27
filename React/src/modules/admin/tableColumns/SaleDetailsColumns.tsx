import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";

export const saleDetailsColumns: ColumnDef<SaleDetails>[] = [
  {
    id: "no",
    header: "No",
    cell: ({ row }) => <div>{row.index + 1}</div>,
    enableSorting: false,
  },
  {
    accessorKey: "ProductName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-white hover:text-white hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.productName || "Unnamed Product"}</div>,
  },
  {
    accessorKey: "CatName",
    header: "Category",
    cell: ({ row }) => <div>{row.original.catName || "Unknown"}</div>,
  },
  {
    accessorKey: "Quantity",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="text-white hover:text-white hover:bg-gray-600"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Quantity
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.quantity}</div>,
  },
  {
    accessorKey: "Description",
    header: "Description",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.description || "No description"}</div>
    ),
  },
  {
    accessorKey: "TotalPrice",
    header: () => <div className="text-right">Total Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.totalPrice.toString() || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "TotalCost",
    header: () => <div className="text-right">Total Cost</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.original.totalCost.toString() || "0");
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right">{formatted}</div>;
    },
  },
];
export default saleDetailsColumns;