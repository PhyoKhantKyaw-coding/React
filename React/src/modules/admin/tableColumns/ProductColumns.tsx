import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

interface ProductTableProps {
  setSelectedProductId: React.Dispatch<React.SetStateAction<string | null>>;
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>; // For View Details
  setIsUpdateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>; // For Update
}

export const productColumns = ({ setSelectedProductId, setIsDialogOpen, setIsUpdateDialogOpen }: ProductTableProps): ColumnDef<Product>[] => [
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
    accessorKey: "productImage",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Image
        <ArrowUpDown className="ml-0 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div>
        <img
          src={
            row.original.image
              ? `${"https://localhost:7164"}${row.original.image}`
              : "/fallback-image.jpg"
          }
          alt={row.original.productName || "Product Image"}
          className="w-20 h-20 ml-7 object-cover rounded"
        />
      </div>
    ),
  },
  {
    accessorKey: "productName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Product Name
        <ArrowUpDown className="ml-0 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => <div>{row.original.productName || "Unnamed Product"}</div>,
  },
  {
    accessorKey: "stock",
    header: "Stock",
    cell: ({ row }) => <div>{row.getValue("stock")}</div>,
  },
  {
    accessorKey: "price",
    header: () => <div className="text-right">Price</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "cost",
    header: () => <div className="text-right">Cost</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("cost"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "profit",
    header: () => <div className="text-right">Profit</div>,
    cell: ({ row }) => {
      const profit = row.getValue("profit");
      const formatted = profit
        ? new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
          }).format(parseFloat(String(profit)))
        : "N/A";
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => (
      <div className="w-[100px] whitespace-normal">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const product = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.productId)}
            >
              Copy Product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setSelectedProductId(product.productId);
                setIsDialogOpen(true);
              }}
            >
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedProductId(product.productId);
                setIsUpdateDialogOpen(true);
              }}
            >
              Update
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default productColumns;