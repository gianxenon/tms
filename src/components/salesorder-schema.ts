import { z } from "zod"

export const schema = z.object({
  id: z.number(), 
  plantid: z.string(),
  profilename: z.string(),
  salesorderid: z.string(),
  deliverydate:  z.date(),
  uploaddate:  z.date(), 
  customersid: z.string(),
  customersname: z.string(),
  salesmanid: z.string(),
  forecastqty: z.number(),
  finalorderqty: z.number(),
  kilos: z.number(),
  uoms: z.number(),  
  secondplantid: z.string(),
  allocatedqty: z.number(),
  saleschannel: z.string(),
  salessubgroup: z.string(),
  logisticchannel: z.string(),
  isRedel: z.number(), 
  status: z.string(),
})
