import { create } from "zustand";
import { z } from "zod"; 
import { atwService } from "../api/atw.service";
import { orderSchema } from "../model/atw-schema";

export type Order = z.infer<typeof orderSchema>;

interface AtwStore {
  orders: Order[];
  loading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
}

export const useAtwStore = create<AtwStore>((set) => ({
  orders: [],
  loading: false,
  error: null,
  fetchOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await atwService.list();
      const parsed = res.map((o) => orderSchema.parse(o));
      set({ orders: parsed, loading: false });
    } catch (err: unknown) {
      let message = "Failed to fetch orders";

      // Type-guard
      if (err instanceof Error) {
        message = err.message;
      }

      set({ error: message, loading: false });
    }
  },
}));
