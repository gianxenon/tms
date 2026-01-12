
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { z } from "zod"
import type { orderItemSchema } from "../model/atw-schema"
import { Button } from "@/components/ui/button"

type OrderItem = z.infer<typeof orderItemSchema>

interface Props {
  items: OrderItem[]
  editable: boolean
  onChange?: (items: OrderItem[]) => void
}

export function OrderItemsTable({ items, editable, onChange }: Props) {
  const updateQty = (index: number, qty: number) => {
    if (!onChange) return
    const next = [...items]
    next[index] = { ...next[index], qty }
    onChange(next)
  }
  const deleteRow = (index: number) => {
    if (!onChange) return
    const next = items.filter((_, i) => i !== index)
    onChange(next)
  }
  
  return (
    <Table className="h-52">
      <TableHeader>
        <TableRow>
          <TableHead>Item</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Qty</TableHead>
          <TableHead className="text-right">Hds/Pks</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {items.map((item, i) => (
          <TableRow key={item.lineId}>
            <TableCell>{item.itemCode}</TableCell>
            <TableCell>{item.description}</TableCell>
            <TableCell className="text-right">
              {editable ? (
                <Input
                  type="number"
                  value={item.qty}
                  onChange={(e) => updateQty(i, Number(e.target.value))}
                  className="w-20 text-right"
                />
              ) : (
                item.qty
              )}
            </TableCell>
            <TableCell className="text-right">
              {editable ? (
                <Input
                  type="number"
                  value={item.numperuom * item.qty} 
                  className="w-20 text-right"
                  readOnly
                />
              ) : (
                item.qty
              )}
            </TableCell>
            {editable && (
              <TableCell>
                <Button size="sm" variant="destructive" onClick={() => deleteRow(i)}>
                  Delete
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
