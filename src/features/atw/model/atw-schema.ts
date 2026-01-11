import { z } from "zod"

export const orderItemSchema = z.object({
  lineId: z.number(),
  docid: z.number(),
  itemCode: z.string(),
  description: z.string(),
  qty: z.number().min(1),
  numperuom: z.number(), 
  wt: z.number().min(0),
  uom: z.string(), 
  lineStatus: z.string(),
})

export const orderSchema = z.object({
  customerGroup: z.string(),
  shipTo: z.string(),
  orderDate: z.string(),
  docid: z.number(),
  docno: z.string(), 
  docDate: z.string(),
  deliveryDate: z.string(),
  docStatus: z.string(),
  items: z.array(orderItemSchema).min(1),
})

export const schema = z.array(orderSchema)
