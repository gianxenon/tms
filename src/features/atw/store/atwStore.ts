import { create } from "zustand"
import { z } from "zod"
import { atwService } from "../api/atw.service"
import { schema, orderSchema } from "../model/atw-schema"

export type Order = z.infer<typeof orderSchema>

interface AtwStore {
  orders: Order[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
}

export const useAtwStore = create<AtwStore>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null })

    try {
      const res = await atwService.list()   
      
      // validate entire array at once
      const parsed = schema.parse(res)

      set({ orders: parsed, loading: false })
      console.log("Orders in store:", parsed.length); 
      
    } catch (err) {
      let message = "Failed to fetch orders"

      if (err instanceof Error) {
        message = err.message
      }

      set({ error: message, loading: false })
    }
  },
}))
