import App from "@/App"
import { AppSidebar } from "@/components/app-sidebar"
import NavBar from "@/components/NavBar"
import { SidebarProvider } from "@/components/ui/sidebar"

const UserLayout = () => {

    return (
        <SidebarProvider>
            <AppSidebar />
            <div className="w-full" >
                <NavBar />
                <div className=" w-full flex justify-center" >
                    <div className="lg:w-[70vw] " >
                        <App />
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}

export default UserLayout