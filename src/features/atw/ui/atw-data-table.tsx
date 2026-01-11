import * as React from "react"
 
import {  IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled,    IconPaperclip,     IconPlus,    IconUpload } from "@tabler/icons-react"  
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, } from "@tanstack/react-table" 
import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table" 
import { toast } from "sonner"
import { z } from "zod"  
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button" 
import { Checkbox } from "@/components/ui/checkbox"
 
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs" 
import { orderSchema  } from "@/features/atw/model/atw-schema" 
import { OrderDrawer } from "./orderDrawer"
import type { Order } from "@/features/atw/model/atw-types"
import { useAtwStore } from "../store/atwStore" 

// ---------------------- COLUMNS ----------------------
const columns: ColumnDef<Order>[] = [ 
  { 
    id: "select",
    header: ({ table }) => (
      <div className="flex items-center justify-center">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
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
    cell: ({ row }) => {
      return (
        <TableCellViewer
          item={row.original}
          mode="edit"
        />
      )
    },
    enableHiding: false,
  },
  { 
    accessorKey: "shipTo",
    header: "Ship To",
    cell: ({ row }) => (
      <div className="w-32">
         <Label> 
          {row.original.shipTo}
        </Label>
      </div>
    ),
  },{
    accessorKey: "customerGroup",
    header: "Customer Group",
    cell: ({ row }) => (
      <div className="w-32">
        <Label> 
          {row.original.customerGroup}
        </Label>
      </div>
    ),
  },{
    accessorKey: "deliveryDate",
    header: "Delivery Date",
    cell: ({ row }) => (
      <div className="w-32">
        <Label>
          {row.original.deliveryDate}
        </Label>
      </div>
    ),
  },{
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant="outline" className="text-muted-foreground px-1.5">
        {row.original.docStatus === "C" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconPaperclip />
        )}
        {row.original.docStatus === "C" ? "Planned"  : "Open"}
      </Badge>
    ),
  },{
    accessorKey: "qty",
    header: "Forecast Qty",
    cell: ({ row }) => (
       
      <div className="w-32">
         <Label>
          {row.original.items[0].qty}
        </Label>
      </div>
    ),
  },{
    accessorKey: "numperuom",
    header: "Hds/Pcks",
    cell: ({ row }) => ( 
      <div className="w-32">
        <Label>
          {row.original.items[0].numperuom}
        </Label> 
      </div>
    ),
  },{
    accessorKey: "wt",
    header: "WT",
    cell: ({ row }) => ( 
      <div className="w-32"> 
        <Label> {row.original.items[0].wt} kg </Label>  
      </div>
    ),
  },{
    accessorKey: "uom",
    header: "UOM",
    cell: ({ row }) => ( 
      <div className="w-32"> 
        <Label> {row.original.items[0].uom} </Label>  
      </div>
    ),
  } 
]
 // ---------------------- TABLE COMPONENT ----------------------
export function AtwDataTable() 
{  
  const { orders } = useAtwStore(); 
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({pageIndex: 0,pageSize: 10,})
  const [filterColumn, setFilterColumn] = React.useState<string>("")
  const [filterValue, setFilterValue] = React.useState<string>("")
  const [openCreate, setOpenCreate] = React.useState(false)

  const table = useReactTable({
        data: orders,
        columns,
        state: {sorting,columnVisibility,rowSelection,columnFilters,pagination,},
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
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
    })
 

    const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file) {
          toast.success(`Excel file "${file.name}" uploaded successfully`)
          // Add parsing logic here if needed (e.g., XLSX)
        }
    }

    const filteredRows = React.useMemo(() => {
        if (!filterColumn || !filterValue) return table.getRowModel().rows

        return table.getRowModel().rows.filter((row) => {
        const value = String(row.getValue(filterColumn) ?? "").toLowerCase()
        return value.includes(filterValue.toLowerCase())
        })
    }, [table, filterColumn, filterValue])
   
    return ( 
        <div className="flex flex-col gap-4 px-5 lg:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-2  ">
            {/* Excel Upload */}
            <div className="flex-1 px-5">
                <Label htmlFor="excel-upload" className="mb-2 block text-sm font-medium ">
                Upload Excel File
                </Label>
                <div className="flex gap-2">
                <Input
                    id="excel-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleExcelUpload}
                    className="flex-1"
                />
                <Button variant="outline" size="sm">
                    <IconUpload className="h-4 w-4" />
                    <span className="hidden sm:inline">Upload</span>
                </Button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex-1 px-5">
                <Label className="mb-2 block text-sm font-medium">Filters</Label>
                <div className="flex gap-2">
                <Select value={filterColumn} onValueChange={setFilterColumn}>
                    <SelectTrigger className="w-44">
                    <SelectValue placeholder="Select column" />
                    </SelectTrigger>
                    <SelectContent>
                    {table
                        .getAllLeafColumns()
                        .filter(col => col.id)
                        .map(col => (
                        <SelectItem key={col.id} value={col.id}>
                             {typeof col.columnDef.header === "string"
                              ? col.columnDef.header
                              : col.id}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Input
                    placeholder="Filter value..."
                    value={filterValue}
                    onChange={(e) => setFilterValue(e.target.value)}
                />

                <Button
                    variant="outline"
                    onClick={() => {
                    setFilterColumn("")
                    setFilterValue("")
                    }}
                >
                    Clear
                </Button>
                </div>
            </div>
            </div>

            <Tabs defaultValue="atwno" className="w-full flex-col justify-start gap-6" >
                <div className="flex items-center justify-between px-4 lg:px-6">
                    <Label htmlFor="view-selector" className="sr-only">
                      View
                    </Label> 
                    {/* Table Tabber */}
                    <TabsList className="**:data-[slot=badge]:bg-muted-foreground/30 hidden **:data-[slot=badge]:size-5 **:data-[slot=badge]:rounded-full **:data-[slot=badge]:px-1 @4xl/main:flex">
                      <TabsTrigger value="atwno">List of Atw</TabsTrigger>
                      <TabsTrigger value="past-performance">
                          Planned{/* Planned <Badge variant="secondary">3</Badge> */}
                      </TabsTrigger>
                    </TabsList>

                    {/* Create Order Button */}
                    <div className="flex items-center gap-2">
                        <Button
                        variant="outline"
                        onClick={() => {
                          setFilterColumn("")
                          setFilterValue("")
                          setOpenCreate(true)
                        }}>
                          <IconPlus className="mr-2 h-4 w-4" /> Create Order
                        </Button>
                        <OrderDrawer
                          open={openCreate}
                          onOpenChange={setOpenCreate}
                          mode="create"
                        />
                    </div>
                </div>

                <TabsContent
                    value="atwno"
                    className="relative flex flex-col gap-4 overflow-auto px-4 lg:px-6"
                >
                    <div className="overflow-hidden rounded-lg border"> 
                        <Table>
                            <TableHeader className="bg-muted sticky top-0 z-10">
                                {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </TableHead>
                                    )
                                    })}
                                </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody className="**:data-[slot=table-cell]:first:w-8">
                                {filteredRows.length ? (
                                  filteredRows.map((row) => (
                                    <TableRow
                                      key={row.id}
                                      data-state={row.getIsSelected() && "selected"}
                                    >
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
                                    <TableCell
                                      colSpan={columns.length}
                                      className="h-24 text-center"
                                    >
                                      No results.
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
                                <IconChevronsRight />
                            </Button>
                          </div>
                      </div>
                    </div>
                </TabsContent> 
            </Tabs>
        </div> 
    )
}



function TableCellViewer({ item,mode }: { item: z.infer<typeof orderSchema> , mode: "view" | "edit" | "create"}) {
  const [open, setOpen] = React.useState(false)

  return (
    <>
      <Button
        variant="link"
        className="px-0"
        onClick={() => setOpen(true)}
      >
        {item.docno}
      </Button>

      <OrderDrawer
        open={open}
        onOpenChange={setOpen}
        item={item}
        mode={mode}
      />
    </>
  )
}


 

