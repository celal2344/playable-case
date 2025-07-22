"use client"

import React, {useEffect} from "react"

import Link from "next/link"
import { useState } from "react"
import { Search, ShoppingCart, User, Heart, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuthStore, useCartStore, useWishlistStore, useAppStore } from "@/lib/store"
import { useRouter } from "next/navigation"
import {categoriesApi} from "@/lib/api/categories";
import {Category} from "@/types";


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuthStore()
  const { getTotalItems } = useCartStore()
  const { items: wishlistItems } = useWishlistStore()
  const { searchQuery, setSearchQuery } = useAppStore()

  const totalCartItems = getTotalItems()
  const router = useRouter()

  const [categories, setCategories] = useState<Category[]>([])


  useEffect(() => {
    let isMounted = true

    categoriesApi.getAllCategories()
        .then((data) => {
          if (isMounted) {
            setCategories(data.data.data)
            console.log('Categories loaded:', data.data)
          }
        })
        .catch((error) => {
          if (isMounted) {
            console.error('Failed to load categories', error)
          }
        })

    return () => {
      isMounted = false
    }
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Main header */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Playable Case
          </Link>

          {/* Search bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative w-full flex">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full"
              />
              <Button type="submit" className="ml-2">
                Search
              </Button>
            </form>
          </div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* User menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">{isAuthenticated ? user?.firstName : "Account"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {isAuthenticated ? (
                  <>
                    {user?.role === "admin" && (
                        <DropdownMenuItem asChild>
                          <Link href="/admin">Admin Page</Link>
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/account/orders">Orders</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout}>Sign Out</DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/login">Sign In</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/auth/register">Register</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Cart */}
            <Button variant="ghost" size="sm" asChild>
              <Link href="/cart" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {totalCartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                    {totalCartItems}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden mt-4">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </form>
        </div>
      </div>

      {/* Navigation */}
      <nav className="bg-gray-50 border-t">
        <div className="container mx-auto px-4">
          <div className="hidden md:flex items-center space-x-8 py-3">
            {categories?.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                href={`/category/${category._id}`}
                className="text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {category.name}
              </Link>
            ))}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  More Categories
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {categories?.slice(6).map((category) => (
                  <DropdownMenuItem key={category._id} asChild>
                    <Link href={`/category/${category._id}`}>{category.name}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile navigation */}
          {isMobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/category/${category._id}`}
                  className="block py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
