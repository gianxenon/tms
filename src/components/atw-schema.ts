import { z } from "zod"

export const orderItemSchema = z.object({
  lineId: z.number(),
  docid: z.number(),
  itemCode: z.string(),
  description: z.string(),
  qty: z.number().min(1),
  uom: z.string(),
  price: z.number().min(0),
  wt: z.number().min(0),
  lineStatus: z.enum(["O", "C"]),
})

export const orderSchema = z.object({
  customerGroup: z.string(),
  shipTo: z.string(),
  orderDate: z.string(),
  docid: z.number(),
  docno: z.string(),
  docDate: z.string(),
  deliveryDate: z.string(),
  docStatus: z.enum(["Draft", "Confirmed", "Posted"]),
  items: z.array(orderItemSchema).min(1),
})

export const schema = z.array(orderSchema)
