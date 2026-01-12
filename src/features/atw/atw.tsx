 
import { AtwDataTable } from "@/features/atw/ui/atw-data-table"; 
import { AppSidebar } from "@/components/sidebar/app-sidebar";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/hooks/use-breadcrumbs";    
import React from "react";

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
          <div className="flex flex-1 flex-col p-4"> 
          <AtwDataTable  />
          </div>
        </SidebarInset>
      </SidebarProvider>
    )
};

export default Atw;