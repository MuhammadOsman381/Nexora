import * as React from "react"
import {
  History,
  HomeIcon,
  ListChecks,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Home",
      url: "/user",
      icon: HomeIcon,
      isActive: true,
      items: [

      ],
    },
    {
      title: "History",
      url: "/user/history",
      icon: History,
      items: [

      ],
    },
    {
      title: "Pricing Plans",
      url: "/user/pricing-plan",
      icon: ListChecks,
      items: [

      ],
    },
  ],


}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar className="border-r border-gray-300" variant="inset" {...props}>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
