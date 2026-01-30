import * as React from "react";
import {  
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconCircleCheckFilled, IconPaperclip, IconPlus, IconRefresh, IconUpload 
} from "@tabler/icons-react";
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState } from "@tanstack/react-table";
import { 
  flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable 
} from "@tanstack/react-table";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OrderDrawer } from "./orderDrawer";
import type { Order } from "@/features/atw/model/atw-types";
import { useAtwStore } from "../store/atwStore";

// ---------------------- COLUMNS ----------------------
const columns: ColumnDef<Order>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "docno",
    header: "Document No.",
    cell: ({ row }) => <TableCellViewer item={row.original} mode="edit" />,
    enableHiding: false,
  },
  {
    accessorKey: "shipTo",
    header: "Ship To",
    cell: ({ row }) => <Label>{row.original.shipTo}</Label>,
  },
  {
    accessorKey: "customerGroup",
    header: "Customer Group",
    cell: ({ row }) => <Label>{row.original.customerGroup}</Label>,
  },
  {
    accessorKey: "deliveryDate",
    header: "Delivery Date",
    cell: ({ row }) => <Label>{row.original.deliveryDate}</Label>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.docStatus === "C" ? (
          <>
            <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" /> Close
          </>
        ) : (
          <>
            <IconPaperclip /> Open
          </>
        )}
      </Badge>
    ),
  },
  {
    accessorKey: "qty",
    header: "Forecast Qty",
    cell: ({ row }) => <Label>{row.original.items?.[0]?.qty ?? 0}</Label>,
  },
  {
    accessorKey: "numperuom",
    header: "Hds/Pcks",
    cell: ({ row }) => <Label>{row.original.items?.[0]?.numperuom ?? 0}</Label>,
  },
  {
    accessorKey: "wt",
    header: "WT",
    cell: ({ row }) => <Label>{row.original.items?.[0]?.wt ?? 0} kg</Label>,
  },
  {
    accessorKey: "uom",
    header: "UOM",
    cell: ({ row }) => <Label>{row.original.items?.[0]?.uom ?? "-"}</Label>,
  },
];

// ---------------------- TABLE COMPONENT ----------------------
export function AtwDataTable() {
  const { orders, loading, error, fetchOrders } = useAtwStore();
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 });
  const [filterColumn, setFilterColumn] = React.useState<string>("");
  const [filterValue, setFilterValue] = React.useState<string>("");
  const [openCreate, setOpenCreate] = React.useState(false);
 
  React.useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const table = useReactTable({
    data: orders,
    columns,
    state: { sorting, columnVisibility, rowSelection, columnFilters, pagination },
    getRowId: (row) => row.docid?.toString() ?? crypto.randomUUID(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
 
  React.useEffect(() => {
    if (filterColumn && filterValue) {
      table.setColumnFilters([{ id: filterColumn, value: filterValue }]);
    } else {
      table.setColumnFilters([]);
    }
  }, [filterColumn, filterValue, table]);

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      toast.success(`Excel file "${file.name}" uploaded successfully`);
      event.target.value = "";  
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:px-0 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-2"> 
        <div className="flex-1 px-5">
          <Label htmlFor="excel-upload" className="mb-2 block text-sm font-medium">Upload Excel File</Label>
          <div className="flex gap-2">
            <Input
              id="excel-upload"
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleExcelUpload}
              className="flex-1"
            />
            <Button variant="outline" size="sm">
              <IconUpload className="h-4 w-4" /> <span className="hidden sm:inline">Upload</span>
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 px-5">
          <Label className="mb-2 block text-sm font-medium">Filters</Label>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filterColumn} onValueChange={setFilterColumn}>
              <SelectTrigger className="w-44"><SelectValue placeholder="Select column" /></SelectTrigger>
              <SelectContent>
                {table.getAllLeafColumns().map(col => (
                  <SelectItem key={col.id} value={col.id}>
                    {typeof col.columnDef.header === "string" ? col.columnDef.header : col.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input
              placeholder="Filter value..."
              value={filterValue}
              onChange={(e) => setFilterValue(e.target.value)}
            />
          </div>
        </div>
      </div>

      <Tabs defaultValue="atwno" className="w-full flex-col gap-6">
        <div className="flex flex-col gap-3 px-4 lg:flex-row lg:items-center lg:justify-between lg:px-6">
          <TabsList className="flex items-center gap-4" hidden>
            <TabsTrigger value="atwno">List of Atw</TabsTrigger>
            <TabsTrigger value="Planned">Planned</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setOpenCreate(true)}>
              <IconPlus className="mr-2 h-4 w-4" /> Create Order
            </Button>
            <OrderDrawer open={openCreate} onOpenChange={setOpenCreate} mode="create" />
            <Button variant="outline" onClick={fetchOrders}>
              <IconRefresh />
            </Button>
          </div>
        </div>
 
        <TabsContent value="atwno" className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6">
          <div className="overflow-hidden rounded-lg border">
            <Table>
              <TableHeader className="bg-muted sticky top-0 z-10">
                {table.getHeaderGroups().map(headerGroup => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map(header => (
                      <TableHead key={header.id} colSpan={header.colSpan}>
                        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {orders.length > 0 ? (
                  table.getRowModel().rows.map(row => (
                    <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center text-muted-foreground">
                      {loading ? "Loading ATW orders…" : error ? "Offline — no cached ATW data available" : "No ATW orders found"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
           <div className="flex items-center justify-between px-4">
                <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
                    {table.getFilteredSelectedRowModel().rows.length} of {" "}
                    {table.getFilteredRowModel().rows.length} row(s) selected.
                </div>
                <div className="flex w-full items-center gap-8 lg:w-fit">
                    <div className="hidden items-center gap-2 lg:flex">
                    <Label htmlFor="rows-per-page" className="text-sm font-medium">
                        Rows per page
                    </Label>
                    <Select
                        value={`${table.getState().pagination.pageSize}`}
                        onValueChange={(value) => {
                        table.setPageSize(Number(value))
                        }}
                    >
                        <SelectTrigger size="sm" className="w-20" id="rows-per-page">
                        <SelectValue
                            placeholder={table.getState().pagination.pageSize}
                        />
                        </SelectTrigger>
                        <SelectContent side="top">
                        {[10, 20, 30, 40, 50].map((pageSize) => (
                            <SelectItem key={pageSize} value={`${pageSize}`}>
                            {pageSize}
                            </SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    </div>
                    <div className="flex w-fit items-center justify-center text-sm font-medium">
                    Page {table.getState().pagination.pageIndex + 1} of {" "}
                    {table.getPageCount()}
                    </div>
                    <div className="ml-auto flex items-center gap-2 lg:ml-0">
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        onClick={() => table.setPageIndex(0)}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to first page</span>
                        <IconChevronsLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.previousPage()}
                        disabled={!table.getCanPreviousPage()}
                    >
                        <span className="sr-only">Go to previous page</span>
                        <IconChevronLeft />
                    </Button>
                    <Button
                        variant="outline"
                        className="size-8"
                        size="icon"
                        onClick={() => table.nextPage()}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to next page</span>
                        <IconChevronRight />
                    </Button>
                    <Button
                        variant="outline"
                        className="hidden size-8 lg:flex"
                        size="icon"
                        onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                        disabled={!table.getCanNextPage()}
                    >
                        <span className="sr-only">Go to last page</span>
                        <IconChevronRight />
                    </Button>
                    </div>
                </div>
                </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Drawer viewer
function TableCellViewer({ item, mode }: { item: Order; mode: "view" | "edit" | "create" }) {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="link" className="px-0" onClick={() => setOpen(true)}>
        {item.docno}
      </Button>
      <OrderDrawer open={open} onOpenChange={setOpen} item={item} mode={mode} />
    </>
  );
}
