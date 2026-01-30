import { z  } from "zod"
import { useEffect, useState } from "react" 
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerFooter,
  DrawerClose,
  DrawerDescription,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem, } from "@/components/ui/select" 
import { orderSchema } from "../model/atw-schema"
import { useIsMobile } from "@/hooks/use-mobile"
import { OrderItemsTable } from "./order-items-table"
import { ItemPicker, type OrderItem } from "./item-picker" 
import { atwService } from "../api/atw.service"

export type OrderDrawerMode = "view" | "edit" | "create" 
interface OrderDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: z.infer<typeof orderSchema>
  mode: OrderDrawerMode
}

interface Customer {
  id: string
  code: string
  name: string
}

export function OrderDrawer({ open, onOpenChange, item, mode, }: OrderDrawerProps) {
  const isMobile = useIsMobile() 
  const [itemPickerOpen, setItemPickerOpen] = useState(false)  
  const statusValue = mode === "create" ? "O" : item?.docStatus ?? "O" 
   
  const isDisabled =   ( mode === "edit" && statusValue  == "C")
console.log(statusValue,mode,isDisabled)
 const [selectedCustGroup, setSelectedCustGroup] = useState(item?.customerGroup ?? "");
  const [customers, setCustomers] = useState<Customer[]>([])

  const [docno, setDocno] = useState(item?.docno ?? "")
  const [shipTo, setShipTo] = useState(item?.shipTo ?? "")
  const [status, setStatus] = useState(statusValue) 
  const [items, setItems] = useState<OrderItem[]>(item?.items ?? [])
  const [errors, setErrors] = useState<Record<string, string>>({})

  
  useEffect(() => { 
    setCustomers([
      { id: "1", code: "BPI", name: "BOUNTY PLUS INC." },
      { id: "2", code: "QSR", name: "Quick Service Restaurantasfadasdadsa"},
      { id: "3", code: "MT", name: "MODERN TRADE" }
      
    ])
  }, [])

  useEffect(() => {
    if (customers.length === 0) return; 
    if (item?.customerGroup) {
      const exists = customers.find(c => c.name === item.customerGroup);
      if (exists) {
        setSelectedCustGroup(item.customerGroup);
      }
    }
  }, [customers, item?.customerGroup]);

  console.log(selectedCustGroup)
  const handleSave = async () => {
    const payload = {
      customerGroup: selectedCustGroup,
      shipTo,
      orderDate: new Date().toISOString(),
      docid: Date.now(), 
      docno,
      docDate: new Date().toISOString(),
      deliveryDate: new Date().toISOString(),
      docStatus: status,
      items,
    }
  
    const result = orderSchema.safeParse(payload)
  
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
    
      for (const issue of result.error.issues) {
        const key = issue.path.join(".")
    
        if (!fieldErrors[key]) {
          fieldErrors[key] = issue.message
        }
      }
    
      setErrors(fieldErrors)
      return
    }
    console.log(result.data)
    await atwService.create(result.data)
    onOpenChange(false)
  }
  return (
    <Drawer
      open={open}
      onOpenChange={onOpenChange}
      direction={isMobile ? "bottom" : "right"} 
    >
       <DrawerContent  className={isMobile ? " pr-5"  : "w-full max-w-[1000px]! px-10 py-5"} >
        <DrawerHeader>
          <DrawerTitle>
            {mode === "create" && "Create Order"}
            {mode === "edit" && "Edit Order"}
            {mode === "view" && "View Order"}
            <DrawerDescription>
              Manage order details and items
            </DrawerDescription>
          </DrawerTitle>
        </DrawerHeader> 
        <div className="flex flex-col gap-4 overflow-y-auto px-4 text-sm ">
          <form className="flex flex-col gap-4"> 
            <div className="flex justify-between gap-4">
              <div className="flex flex-col gap-3">
                <Label htmlFor="docno">Document No.</Label>
                <Input
                  id="docno"
                  defaultValue={docno ?? ""}
                  disabled={mode === "edit"} 
                  onChange={(e) => setDocno(e.target.value)}
                />
                {errors["docno"] && (
                  <p className="text-red-500 text-xs">{errors["docno"]}</p>
                )}
              </div> 
              <div className="flex flex-col gap-3 ">
                <Label htmlFor="status">Status</Label>
                <Select value={statusValue} disabled={isDisabled} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O">Open</SelectItem>
                    <SelectItem value="C">Close</SelectItem>
                    <SelectItem value="CN">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div> 

            <div className="flex flex-col gap-3">
                <Label htmlFor="customersGroup">Custsomer Group</Label> 
                <Select
                  value= {selectedCustGroup}
                  onValueChange={setSelectedCustGroup}
                  disabled={isDisabled }
                >
                  <SelectTrigger id="customersGroup" className=" sm:max-w-[220px] lg:max-w-full">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger> 
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem
                        key={customer.id}
                        value={customer.name}
                      >
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>  


            <div className="flex flex-col gap-3">
                <Label htmlFor="shipTo">Ship To</Label>
                <Input
                  id="shipTo"
                  defaultValue={shipTo ?? ""}
                  disabled={isDisabled} 
                  onChange={(e) => setShipTo(e.target.value)}
                />
                {errors["shipTo"] && (
                  <p className="text-red-500 text-xs">{errors["docno"]}</p>
                )}
            </div> 
 
            {/* Items Table */}
            <OrderItemsTable
              items={items}
              isDisabled={isDisabled} 
              onChange={setItems} 
            />

            {/* Item Picker */}
            {mode !== "view" && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setItemPickerOpen(true)}
                disabled = {isDisabled}
                className="mb-5"
              >
                Add Item
              </Button>
            )}

            <ItemPicker
              open={itemPickerOpen}
              onOpenChange={setItemPickerOpen}
              onSelect={(newItem) => {
                setItems((prev) => [...prev, newItem])
              }}
            />
          </form>
        </div>

        <DrawerFooter className="flex justify-end gap-2 ">
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>

          {mode !== "view" && (
            <Button onClick={handleSave}>
              Save
            </Button>
          )}
        </DrawerFooter>

      </DrawerContent>
    </Drawer>
  )
}
