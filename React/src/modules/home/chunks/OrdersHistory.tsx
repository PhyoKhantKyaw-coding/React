// src/modules/home/chunks/OrdersHistory.tsx
import * as React from "react";
import { useState } from "react";
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { orderHistoryColumns } from "@/modules/home/columns/orderHistoryColumns";
import ShowSaleDetailsDialog from "@/modules/admin/chunks/ShowSaleDetailsDialog";
import { useNavigate } from "react-router-dom";
import api from "@/api";
import useAuth from "@/hooks/useAuth";

// interface OrdersHistoryProps {
//   data: Sale[] | [];
// }

const OrdersHistory: React.FC = () => {
  const decodedUserData = useAuth().decodedUserData;
  const {data = []} = api.sale.GetSalesByUserId.useQuery(decodedUserData?.nameIdentifier || "");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedSaleId, setSelectedSaleId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const navigate = useNavigate();

  const table = useReactTable({
    data: data || [],
    columns: orderHistoryColumns({ setSelectedSaleId, setIsDetailsDialogOpen }),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <div className="bg-gray-800/50 text-white align-middle rounded-2xl p-4 mt-3 shadow-md">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Order History</h1>
          <Button
            variant="outline"
            onClick={() => navigate(-1)}
            className=" border-white hover:bg-gray-700"
          >
            Back
          </Button>
        </div>
        {data.length === 0 && !columnFilters.length && (
          <div className="text-center py-4">Loading orders or no orders found.</div>
        )}
        <div className="w-full">
          <div className="flex items-center py-4 gap-4 ">
            <Input
              placeholder="Filter by username..."
              value={(table.getColumn("userName")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("userName")?.setFilterValue(event.target.value)}
              className="max-w-sm placeholder:text-white"
            />
            <Input
              placeholder="Filter by date (MM/DD/YYYY)..."
              value={(table.getColumn("saleDate")?.getFilterValue() as string) ?? ""}
              onChange={(event) => table.getColumn("saleDate")?.setFilterValue(event.target.value)}
              className="max-w-sm placeholder:text-white"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="text--black">
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
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="text-white">
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
                    <TableCell
                      colSpan={orderHistoryColumns.length}
                      className="h-24 text-center "
                    >
                      No orders found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-4">
              <Button
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>
      <ShowSaleDetailsDialog
        isOpen={isDetailsDialogOpen}
        setIsOpen={setIsDetailsDialogOpen}
        saleId={selectedSaleId}
        onClose={() => setSelectedSaleId(null)}
      />
    </div>
  );
};

export default OrdersHistory;