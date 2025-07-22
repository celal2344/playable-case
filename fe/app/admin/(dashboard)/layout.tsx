"use client"

import AdminSidebar from "@/features/admin/components/admin-sidebar"
import {useRouter} from "next/navigation";
import {useAuthStore} from "@/lib/store";
import {useEffect} from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
    const { user, isAuthenticated } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'admin') {
            router.push('/')
        }
    }, [isAuthenticated, user, router])

    if (!isAuthenticated || user?.role !== 'admin') {
        return null
    }
  return (
    <div className="flex h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">{children}</main>
      </div>
    </div>
  )
}
