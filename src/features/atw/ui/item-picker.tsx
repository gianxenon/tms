import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface OrderItem {
  lineId: number
  itemCode: string
  description: string
  qty: number
  uom: string
  numperuom: number
  wt: number
  lineStatus: string
  docid: number
}

interface ItemPickerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (item: OrderItem) => void
}

export function ItemPicker({ open, onOpenChange, onSelect }: ItemPickerProps) {
  const [items, setItems] = useState<OrderItem[]>([])
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const pageSize = 50 // show 50 items per page

  useEffect(() => {
    import("@/lib/stock-data.json").then((res) => setItems(res.default))
  }, [])

  const filteredItems = useMemo(() => {
    return items.filter(
      (item) =>
        item.itemCode.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    )
  }, [items, query])

  const pageCount = Math.ceil(filteredItems.length / pageSize)

  const paginatedItems = useMemo(() => {
    const start = (page - 1) * pageSize
    return filteredItems.slice(start, start + pageSize)
  }, [filteredItems, page])

  const handleSelect = (item: OrderItem) => {
    onSelect(item)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Select Item</DialogTitle>
        </DialogHeader>

        {/* Search */}
        <div className="mb-2">
          <Input
            placeholder="Search items..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setPage(1) // reset page when searching
            }}
          />
        </div>

        {/* Scrollable Table */}
        {paginatedItems.length === 0 ? (
          <p>No items found.</p>
        ) : (
          <div className="border rounded overflow-y-auto max-h-[250px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedItems.map((item) => (
                  <TableRow key={item.lineId}>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.qty}</TableCell>
                    <TableCell>
                      <Button size="sm" onClick={() => handleSelect(item)}>
                        Select
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex justify-between items-center mt-2">
            <Button
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span>
              Page {page} of {pageCount}
            </span>
            <Button
              size="sm"
              disabled={page === pageCount}
              onClick={() => setPage((prev) => Math.min(prev + 1, pageCount))}
            >
              Next
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
