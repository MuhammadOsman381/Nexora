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
import { useLocation } from "react-router-dom"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  userRoutes: [
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

  adminRoutes: [
    {
      title: "Home",
      url: "/admin",
      icon: HomeIcon,
      isActive: true,
      items: [

      ],
    },
    {
      title: "Pricing Plan",
      url: "/admin/pricing-plan",
      icon: ListChecks,
      isActive: true,
      items: [

      ],
    },
  ],


}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  return (
    <Sidebar className="border-r   border-gray-300" variant="inset" {...props}>
      <SidebarContent>
        <NavMain items={location.pathname.startsWith('/user') ? data.userRoutes : data.adminRoutes} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
