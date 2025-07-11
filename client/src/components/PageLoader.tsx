import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

const PageLoader = () => {
    return (
        <div className="flex flex-col items-center justify-center h-[80vh] w-full gap-4">
            <Loader2 className={cn("h-10 w-10 animate-spin text-primary")} />
            <p className="text-sm text-muted-foreground">Please wait</p>
        </div>
    )
}

export default PageLoader
