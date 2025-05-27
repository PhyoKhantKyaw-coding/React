import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "@/api";
import { saleDetailsColumns } from "@/modules/admin/tableColumns/SaleDetailsColumns";

interface ShowSaleDetailsDialogProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  saleId: string | null;
  onClose?: () => void; // Optional callback to notify parent
}

const ShowSaleDetailsDialog: React.FC<ShowSaleDetailsDialogProps> = ({
  isOpen,
  setIsOpen,
  saleId,
  onClose,
}) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const { data: saleDetails = [], isLoading, error } = api.sale.GetSaleDetailsBySaleId.useQuery(saleId || "", {
    enabled: isOpen && !!saleId, // Fetch only when dialog is open and saleId is valid
  });

  const table = useReactTable({
    data: saleDetails,
    columns: saleDetailsColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: {
      sorting,
    },
  });

  // Handle dialog close
  const handleClose = () => {
    setIsOpen(false);
    if (onClose) {
      onClose(); // Notify parent to clear saleId
    }
  };

  console.log("Sale ID:", saleId);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="p-4 rounded-2xl shadow-md bg-gray-500 min-w-[1000px] z-[1000]">
        <DialogHeader>
          <DialogTitle className="text-white">Sale Details</DialogTitle>
        </DialogHeader>
        {isLoading && <div className="text-center text-white">Loading sale details...</div>}
        {error && (
          <div className="text-center text-red-500">
            Failed to load sale details: {error.message}
          </div>
        )}
        {!isLoading && !error && (
          <div className="text-white">
            {saleDetails.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <TableRow key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <TableHead key={header.id} className="text-white">
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                          </TableHead>
                        ))}
                      </TableRow>
                    ))}
                  </TableHeader>
                  <TableBody>
                    {table.getRowModel().rows.length ? (
                      table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id}>
                          {row.getVisibleCells().map((cell) => (
                            <TableCell key={cell.id}>
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={saleDetailsColumns.length} className="h-24 text-center text-white">
                          No sale details found.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center text-white">No sale details found.</div>
            )}
            <DialogClose asChild>
              <Button
                variant="outline"
                className="w-full mt-4 text-white border-white hover:bg-gray-700"
                onClick={handleClose}
              >
                Close
              </Button>
            </DialogClose>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ShowSaleDetailsDialog;