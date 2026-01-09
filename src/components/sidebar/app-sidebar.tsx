import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command, 
  GalleryVerticalEnd, 
  SquareTerminal,
} from "lucide-react" 
import { NavMain } from '@/components/sidebar/nav-main' 
import { NavUser } from '@/components/sidebar/nav-user'
import { TeamSwitcher } from '@/components/sidebar/team-switcher'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/apps/dashboard",
      icon: BookOpen,
      items: [
        { 

          title: "Dashboard",
          url: "/apps/dashboard",
        }, 
      ],
    },
    {
      title: "Manage Dispatch",
      url: "/apps/manage-dispatch",
      icon: SquareTerminal,
      items: [ 
        {
          title: "Authority to Withdraw",
          url: "/apps/atw",
        },
        {
          title: "Trip",
          url: "/apps/trip",
        },
      ],
    },
    {
      title: "Masters",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Items",
          url: "#",
        },
        {
          title: "Outlets",
          url: "#",
        },
        {
          title: "Trucks",
          url: "#",
        },
        {
          title: "Plants",
          url: "#",
        },
        {
          title: "Channels",
          url: "#",
        }
      ],
    },  
  ],
   
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} /> 
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
