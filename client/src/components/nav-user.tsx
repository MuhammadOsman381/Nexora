"use client"

import {
  ChevronsUpDown,
  LogOut,
} from "lucide-react"

import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { useNavigate } from "react-router-dom"
import useGetAndDelete from "@/hooks/useGetAndDelete"
import axios from "axios"
import { useEffect, useRef, useState } from "react"


interface UserData {
  name: string;
  email: string;
  fallback: string;
}


export function NavUser({
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {

  const defaultUserData = {
    name: "",
    email: "",
    fallback: "",
  }

  const { isMobile } = useSidebar()
  const navigate = useNavigate();
  const getUserHook = useGetAndDelete(axios.get)
  const hasFetched = useRef(false);
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const getUser = async () => {
    const response = await getUserHook.callApi('auth/user', true, false);
    setUserData({
      name: response.data.user.name,
      email: response.data.user.email,
      fallback: response.data.user.name
        ?.split(" ")
        .map((word: string) => word.charAt(0).toUpperCase())
        .slice(0, 2)
        .join("") || "",

    });
    return;
  }

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    getUser();
  }, []);


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg ">
                {/* <AvatarImage src={userData.avatar} alt={user.name} /> */}
                <AvatarFallback className="rounded-lg text-white bg-orange-500">{userData.fallback}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{userData.name}</span>
                <span className="truncate text-xs">{userData.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {/* <AvatarImage src={userData.avatar} alt={userData.name} /> */}
                  <AvatarFallback className="rounded-lg">{userData.fallback}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{userData.name}</span>
                  <span className="truncate text-xs">{userData.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>


            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                localStorage.removeItem("token");
                navigate('/')
              }}
            >
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
