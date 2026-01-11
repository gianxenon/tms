// features/atw/api/atw.service.ts
import type { Order } from "../model/atw-types"
import data from "@/lib/atw-data.json"

// In-memory store for now (TEMP)
let atwStore: Order[] = [...data] as Order[]

export const atwService = {
  /** List all ATW orders */
  async list(): Promise<Order[]> {
    return Promise.resolve([...atwStore])
  },

  /** Create a new ATW order */
  async create(payload: Order): Promise<Order> {
    atwStore = [payload, ...atwStore]
    return Promise.resolve(payload)
  },

  /** Get a single order by docid */
  async get(docid: number): Promise<Order | undefined> {
    return Promise.resolve(atwStore.find((order) => order.docid === docid))
  },

  /** Delete order by docid */
  async delete(docid: number): Promise<void> {
    atwStore = atwStore.filter((order) => order.docid !== docid)
    return Promise.resolve()
  },
}
