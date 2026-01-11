import type { z } from "zod"
import { orderSchema, orderItemSchema } from "./atw-schema"

// Type for a single order
export type Order = z.infer<typeof orderSchema>

// Type for a single order item
export type OrderItem = z.infer<typeof orderItemSchema>
