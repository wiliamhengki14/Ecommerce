import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/Components/ui/sidebar"
import { AdminSidebar } from "@/Components/AdminSidebar"
import { PropsWithChildren } from "react"
import { Head } from "@inertiajs/react"

export default function AdminLayout({ children, title }: PropsWithChildren<{ title?: string }>) {
    return (
        <SidebarProvider>
            {title && <Head title={title} />}
            <AdminSidebar />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4 bg-white shadow-sm sticky top-0 z-50">
                    <SidebarTrigger className="-ml-1 h-10" />
                    <div className="w-full flex justify-between items-center px-4">
                        <h1 className="font-semibold text-lg">{title || 'Admin Dashboard'}</h1>
                    </div>
                </header>
                <main className="p-4 md:p-6 flex-1 overflow-auto bg-gray-50 min-h-screen">
                    {children}
                </main>
            </SidebarInset>
        </SidebarProvider>
    )
}
