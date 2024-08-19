import { Skeleton } from "@/components/ui/skeleton"

export default function SkeletonDashboard() {
    return (
        <div className="flex flex-col w-full min-h-screen">
            <header className="flex items-center h-16 px-4 border-b shrink-0 md:px-6">
                <div className="flex-1">
                    <Skeleton className="h-6 w-[200px]" />
                </div>
            </header>
            <main className="flex-1 grid gap-4 p-4 md:gap-8 md:p-10">
                <div>
                    <Skeleton className="h-[300px] w-full rounded-lg" />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <Skeleton className="h-[100px] rounded-lg" />
                        <Skeleton className="h-4 w-[150px] mt-2" />
                    </div>
                    <div>
                        <Skeleton className="h-[100px] rounded-lg" />
                        <Skeleton className="h-4 w-[150px] mt-2" />
                    </div>
                    <div>
                        <Skeleton className="h-[100px] rounded-lg" />
                        <Skeleton className="h-4 w-[150px] mt-2" />
                    </div>
                </div>
            </main>
        </div>
    )
}