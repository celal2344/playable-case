"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Users, FolderOpen, BarChart3, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Products", href: "/admin/products", icon: Package },
  { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { name: "Customers", href: "/admin/customers", icon: Users },
  { name: "Categories", href: "/admin/categories", icon: FolderOpen },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Settings", href: "/admin/settings", icon: Settings },
]

export default function AdminSidebar() {
  const pathname = usePathname()

  return (
    <div className="bg-gray-900 text-white w-64 min-h-screen flex flex-col">
      <div className="p-6">
        <h2 className="text-xl font-bold">ShopHub Admin</h2>
        <p className="text-gray-400 text-sm mt-1">Management Panel</p>
      </div>

      <nav className="mt-6 flex-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-6 py-3 text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-800 text-white border-r-2 border-blue-500"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white",
              )}
            >
              <item.icon className="mr-3 h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>

      <div className="p-6 border-t border-gray-800">
        <Button
          variant="ghost"
          className="w-full justify-start text-gray-300 hover:text-white hover:bg-gray-800"
          asChild
        >
          <Link href="/admin/login">
            <LogOut className="mr-3 h-4 w-4" />
            Sign Out
          </Link>
        </Button>
      </div>
    </div>
  )
}
