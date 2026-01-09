 
import { DataTable } from "@/components/atw-data-table";
//import { SectionCards } from "@/components/section-cards";
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";
import React from "react";
import data from "@/lib/so-data.json" 
// Convert string dates to Date objects
const parsedData = data.map(item => ({
  ...item,
  deliverydate: new Date(item.deliverydate),
  uploaddate: new Date(item.uploaddate),
   secondplantid: String(item.secondplantid),  
}))

const Atw = () => {
    const breadcrumbs = useBreadcrumbs();
    return (
      <SidebarProvider 
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              /> 
               <Breadcrumb>
                <BreadcrumbList>
                  {breadcrumbs.map((item) => (
                    <React.Fragment key={item.url}>
                      <BreadcrumbItem>
                        {item.isLast ? (
                          <BreadcrumbPage>
                            {item.label}
                          </BreadcrumbPage>
                        ) : (
                          <BreadcrumbLink asChild>
                            <a href={item.url}>{item.label}</a>
                          </BreadcrumbLink>
                        )}
                      </BreadcrumbItem>
  
                      {!item.isLast && <BreadcrumbSeparator />}
                    </React.Fragment>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header> 
          <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
             

            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">  
              <DataTable data={parsedData} />
            </div>
            
          </div>
        </div> 
        </SidebarInset>
      </SidebarProvider>
    )
};

export default Atw;