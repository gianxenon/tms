import * as React from "react"
// import { closestCenter, DndContext, KeyboardSensor, MouseSensor, TouchSensor, useSensor, useSensors, type DragEndEvent, type UniqueIdentifier } from "@dnd-kit/core"
// import { restrictToVerticalAxis } from "@dnd-kit/modifiers"
// import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy, } from "@dnd-kit/sortable"
// import { CSS } from "@dnd-kit/utilities"
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled, IconLayoutColumns,    IconPaperclip,     IconTrendingUp, IconUpload } from "@tabler/icons-react"  
import type { ColumnDef, ColumnFiltersState, SortingState, VisibilityState, } from "@tanstack/react-table"

import { flexRender, getCoreRowModel, getFacetedRowModel, getFacetedUniqueValues, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, useReactTable, } from "@tanstack/react-table"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { toast } from "sonner"
import { z } from "zod"

import { useIsMobile } from "@/hooks/use-mobile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import type { ChartConfig } from "@/components/ui/chart"
import { ChartContainer, ChartTooltip, ChartTooltipContent, } from "@/components/ui/chart"
import { Checkbox } from "@/components/ui/checkbox"
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger, } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,  DropdownMenuTrigger, } from "@/components/ui/dropdown-menu" //DropdownMenuItem, DropdownMenuSeparator,
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger, } from "@/components/ui/tabs"

import { orderSchema  } from "@/components/atw-schema"
 
type Order = z.infer<typeof orderSchema>
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
      return <TableCellViewer item={row.original} />
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
        {row.original.docStatus === "Planned" ? (
          <IconCircleCheckFilled className="fill-green-500 dark:fill-green-400" />
        ) : (
          <IconPaperclip />
        )}
        {row.original.docStatus}
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
    accessorKey: "uom",
    header: "Hds/Pcks",
    cell: ({ row }) => (
       
      <div className="w-32">
        <Label>
          {row.original.items[0].uom}
        </Label> 
      </div>
    ),
  },{
    accessorKey: "wt",
    header: "WT",
    cell: ({ row }) => (
       
      <div className="w-32">
        {/* <Badge variant="outline" className="text-muted-foreground px-1.5"> */}
        <Label> {row.original.items[0].wt} kg </Label> 
        {/* </Badge> */}
      </div>
    ),
  }
  // {
  //   accessorKey: "salesorderid",
  //   header: "Sales Order",
  //   cell: ({ row }) => (
  //     <div className="w-32">
  //       <Badge variant="outline" className="text-muted-foreground px-1.5">
  //         {row.original.salesorderid}
  //       </Badge>
  //     </div>
  //   ),
  // },
  // {
  //   accessorKey: "customersname",
  //   header: "Customers Name",
  //   cell: ({ row }) => (
  //     <div className="w-32">
  //       <Badge variant="outline" className="text-muted-foreground px-1.5">
  //         {row.original.customersname}
  //       </Badge>
  //     </div>
  //   ),
  // }, 
  // {
  //   accessorKey: "salesmanid",
  //   header: "SalesMan",
  //   cell: ({ row }) => (
  //     <div className="w-32">
  //       <Badge variant="outline" className="text-muted-foreground px-1.5">
  //         {row.original.salesmanid}
  //       </Badge>
  //     </div>
  //   ),
  // }, {
  //   accessorKey: "forecastqty",
  //   header: () => <div className="w-full text-right">Forecast Qty</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.forecastqty}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-forecastqty`} className="sr-only">
  //         Forecast Qty
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.forecastqty}
  //         id={`${row.original.id}-forecastqty`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "finalorderqty",
  //   header: () => <div className="w-full text-right">Final Order Qty</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.finalorderqty}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-finalorderqty`} className="sr-only">
  //         Final Order Qty
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.finalorderqty}
  //         id={`${row.original.id}-finalorderqty`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "kilos",
  //   header: () => <div className="w-full text-right">Kilos</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.kilos}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-kilos`} className="sr-only">
  //         Kilos
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.kilos}
  //         id={`${row.original.id}-kilos`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "uoms",
  //   header: () => <div className="w-full text-right">Crate/Box/Sacks</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.uoms}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-uoms`} className="sr-only">
  //         Crate/Box/Sacks
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.uoms}
  //         id={`${row.original.id}-uoms`}
  //       />
  //     </form>
  //   ),
  // },
  // {
  //   accessorKey: "secondplantid",
  //   header: "Second Plant",
  //   cell: ({ row }) => {
  //       const value = row.original.secondplantid;

  //       // Show dropdown if value is empty or null
  //       const showDropdown = !value || value === "";

  //       if (!showDropdown) {
  //       return value; // show the assigned plant
  //       }

  //       return (
  //       <>
  //           <Label
  //           htmlFor={`${row.original.id}-secondplantid`}
  //           className="sr-only"
  //           >
  //           Source Plant
  //           </Label>
  //           <Select>
  //           <SelectTrigger
  //               className="w-38 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
  //               size="sm"
  //               id={`${row.original.id}-secondplantid`}
  //           >
  //               <SelectValue placeholder="Assign Source Plant" />
  //           </SelectTrigger>
  //           <SelectContent align="end">
  //               <SelectItem value="1">PULILAN-OCS</SelectItem>
  //               <SelectItem value="22">TARLAC</SelectItem>
  //           </SelectContent>
  //           </Select>
  //       </>
  //       );
  //   },
  //   }, {
  //   accessorKey: "allocatedqty",
  //   header: () => <div className="w-full text-right">allocatedqty</div>,
  //   cell: ({ row }) => (
  //     <form
  //       onSubmit={(e) => {
  //         e.preventDefault()
  //         toast.promise(new Promise((resolve) => setTimeout(resolve, 1000)), {
  //           loading: `Saving ${row.original.allocatedqty}`,
  //           success: "Done",
  //           error: "Error",
  //         })
  //       }}
  //     >
  //       <Label htmlFor={`${row.original.id}-allocatedqty`} className="sr-only">
  //         uoms
  //       </Label>
  //       <Input
  //         className="hover:bg-input/30 focus-visible:bg-background dark:hover:bg-input/30 dark:focus-visible:bg-input/30 h-8 w-16 border-transparent bg-transparent text-right shadow-none focus-visible:border dark:bg-transparent"
  //         defaultValue={row.original.allocatedqty}
  //         id={`${row.original.id}-allocatedqty`}
  //       />
  //     </form>
  //   ),
  // },
   
  // {
  //   id: "actions",
  //   cell: () => (
  //     <DropdownMenu>
  //       <DropdownMenuTrigger asChild>
  //         <Button
  //           variant="ghost"
  //           className="data-[state=open]:bg-muted text-muted-foreground flex size-8"
  //           size="icon"
  //         >
  //           <IconDotsVertical />
  //           <span className="sr-only">Open menu</span>
  //         </Button>
  //       </DropdownMenuTrigger>
  //       <DropdownMenuContent align="end" className="w-32">
  //         <DropdownMenuItem>Edit</DropdownMenuItem>
  //         <DropdownMenuItem>Make a copy</DropdownMenuItem>
  //         <DropdownMenuItem>Favorite</DropdownMenuItem>
  //         <DropdownMenuSeparator />
  //         <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
  //       </DropdownMenuContent>
  //     </DropdownMenu>
  //   ),
  // },
]

 

export function DataTable({
  data: initialData,
}: {
  data: z.infer<typeof orderSchema>[]
}) 
{ 
 
    const [data] = React.useState(() => initialData)
    const [rowSelection, setRowSelection] = React.useState({})
    const [columnVisibility, setColumnVisibility] =
        React.useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
        []
    )
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [pagination, setPagination] = React.useState({
        pageIndex: 0,
        pageSize: 10,
    })

    // New filter states
    const [filterColumn, setFilterColumn] = React.useState<string>("")
    const [filterValue, setFilterValue] = React.useState<string>("")
 
    const table = useReactTable({
        data,
        columns,
        state: {
        sorting,
        columnVisibility,
        rowSelection,
        columnFilters,
        pagination,
        },
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
                            {col.id}
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

                    {/* Customize Columns filter */}
                    <div className="flex items-center gap-2">
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <IconLayoutColumns />
                                <span className="hidden lg:inline">Customize Columns</span>
                                <span className="lg:hidden">Columns</span>
                                <IconChevronDown />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                              {table
                                  .getAllColumns()
                                  .filter(
                                  (column) =>
                                      typeof column.accessorFn !== "undefined" &&
                                      column.getCanHide()
                                  )
                                  .map((column) => {
                                  return (
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
                                  )
                              })}
                          </DropdownMenuContent>
                      </DropdownMenu> 
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

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig

function TableCellViewer({
  item,
}: {
  item: z.infer<typeof orderSchema>
}) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? "bottom" : "right"}>
      <DrawerTrigger asChild>
        <Button variant="link" className="text-foreground w-fit px-0 text-left">
          {item.docno}
        </Button>
      </DrawerTrigger>

      <DrawerContent>
        <DrawerHeader className="gap-1">
          <DrawerTitle>{item.docno}</DrawerTitle>
          <DrawerDescription>
            Showing total visitors for the last 6 months
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm">
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}
                >
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) => value.slice(0, 3)}
                    hide
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent indicator="dot" />}
                  />
                  <Area
                    dataKey="mobile"
                    type="natural"
                    fill="var(--color-mobile)"
                    fillOpacity={0.6}
                    stroke="var(--color-mobile)"
                    stackId="a"
                  />
                  <Area
                    dataKey="desktop"
                    type="natural"
                    fill="var(--color-desktop)"
                    fillOpacity={0.4}
                    stroke="var(--color-desktop)"
                    stackId="a"
                  />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className="grid gap-2">
                <div className="flex gap-2 leading-none font-medium">
                  Trending up by 5.2% this month {" "}
                  <IconTrendingUp className="size-4" />
                </div>
                <div className="text-muted-foreground">
                  Showing total visitors for the last 6 months. This is just
                  some random text to test the layout. It spans multiple lines
                  and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              <Label htmlFor="header">Source Plant</Label>
              <Input id="header" defaultValue={item.docno} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="type">Type</Label>
                <Select defaultValue={item.docStatus}>
                  <SelectTrigger id="type" className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Table of Contents">Table of Contents</SelectItem>
                    <SelectItem value="Executive Summary">Executive Summary</SelectItem>
                    <SelectItem value="Technical Approach">Technical Approach</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Capabilities">Capabilities</SelectItem>
                    <SelectItem value="Focus Documents">Focus Documents</SelectItem>
                    <SelectItem value="Narrative">Narrative</SelectItem>
                    <SelectItem value="Cover Page">Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="status">Status</Label>
                <Select defaultValue={item.docStatus}>
                  <SelectTrigger id="status" className="w-full">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Done">Done</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="target">Target</Label>
                <Input id="target" defaultValue={item.docid} />
              </div>
              <div className="flex flex-col gap-3">
                <Label htmlFor="limit">Limit</Label>
                <Input id="limit" defaultValue={item.docid} />
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <Label htmlFor="reviewer">Reviewer</Label>
              <Select defaultValue={item.customerGroup}>
                <SelectTrigger id="reviewer" className="w-full">
                  <SelectValue placeholder="Select a reviewer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Eddie Lake">Eddie Lake</SelectItem>
                  <SelectItem value="Jamik Tashpulatov">Jamik Tashpulatov</SelectItem>
                  <SelectItem value="Emily Whalen">Emily Whalen</SelectItem>
                </SelectContent>
              </Select>
             </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant="outline">Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
