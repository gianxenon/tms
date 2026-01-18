// features/atw/api/atw.service.ts
import type { Order } from "../model/atw-types"
import api from "@/services/api"

export const atwService = {
  /** List all ATW orders */
  async list(): Promise<Order[]> {
    const response = await api.post("http://192.178.0.204:8087/ics/udp.php?objectcode=u_ajaxtest",{type : "fetchorders"} ) // replace with your endpoint
    console.log(response.data);
    return response.data
  },

  /** Create a new ATW order */
  async create(payload: Order): Promise<Order> {
    const response = await api.post("/atw/create-orders", payload)
    return response.data
  },

  /** Get a single order by docid */
  async get(docid: number): Promise<Order> {
    const response = await api.get(`/atw/orders/${docid}`)
    return response.data
  },

  /** Delete order by docid */
  async delete(docid: number): Promise<void> {
    await api.delete(`/atw/orders/${docid}`)
  },

  /** Fetch customers globally */
  async getCustomers(): Promise<{ id: string; code: string; name: string }[]> {
    const response = await api.get("/atw/customers") // replace with your endpoint
    return response.data
  },
}
