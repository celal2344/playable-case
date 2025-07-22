"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ProductGrid from "@/features/products/components/product-grid"
import { useAppStore } from "@/lib/store"
import {Category, Product} from "@/types";
import {categoriesApi} from "@/lib/api/categories";
import {productsApi} from "@/lib/api/products";

interface SearchResultsProps {
  initialQuery?: string
}

export default function SearchResults({ initialQuery = "" }: SearchResultsProps) {
  const { searchQuery, setSearchQuery } = useAppStore()
  const [localQuery, setLocalQuery] = useState(initialQuery || searchQuery)
  const [sortBy, setSortBy] = useState("relevance")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priceFilter, setPriceFilter] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    let isMounted = true

    categoriesApi.getAllCategories().then((response) => {
      if (response.success && isMounted) {
        setCategories(response.data.data)
      }
    })

    productsApi.getAllProducts().then((response) => {
      if (response.success && isMounted) {
        setProducts(response.data.data)
      }
    })
    return () => {
      isMounted = false
    }
  }, []);


  useEffect(() => {
    if (initialQuery) {
      setSearchQuery(initialQuery)
      setLocalQuery(initialQuery)
    }
  }, [initialQuery, setSearchQuery])

  const searchResults = products.filter((product) => {
    if (!localQuery) return false

    const query = localQuery.toLowerCase()
    const matchesQuery =
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.tags?.some((tag) => tag.toLowerCase().includes(query))

    const matchesCategory = categoryFilter === "all" || product.category === categoryFilter

    let matchesPrice = true
    if (priceFilter !== "all") {
      switch (priceFilter) {
        case "under-25":
          matchesPrice = product.price < 25
          break
        case "25-50":
          matchesPrice = product.price >= 25 && product.price <= 50
          break
        case "50-100":
          matchesPrice = product.price >= 50 && product.price <= 100
          break
        case "over-100":
          matchesPrice = product.price > 100
          break
      }
    }

    return matchesQuery && matchesCategory && matchesPrice
  })

  // Sort results
  const sortedResults = [...searchResults].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "rating":
        return b.averageRating - a.averageRating
      case "name":
        return a.name.localeCompare(b.name)
      case "relevance":
      default:
        // Simple relevance: exact matches first, then partial matches
        const aExact = a.name.toLowerCase() === localQuery.toLowerCase() ? 1 : 0
        const bExact = b.name.toLowerCase() === localQuery.toLowerCase() ? 1 : 0
        return bExact - aExact
    }
  })

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchQuery(localQuery)
  }

  const clearFilters = () => {
    setCategoryFilter("all")
    setPriceFilter("all")
    setSortBy("relevance")
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Header */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search products..."
              value={localQuery}
              onChange={(e) => setLocalQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              {localQuery ? `Search results for "${localQuery}"` : "Search Products"}
            </h1>
            <p className="text-gray-600">
              {sortedResults.length} product{sortedResults.length !== 1 ? "s" : ""} found
            </p>
          </div>

          <Button variant="outline" onClick={() => setShowFilters(!showFilters)} className="lg:hidden">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Filters</CardTitle>
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Category Filter */}
              <div>
                <h3 className="font-medium mb-3">Category</h3>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Filter */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <Select value={priceFilter} onValueChange={setPriceFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="under-25">Under $25</SelectItem>
                    <SelectItem value="25-50">$25 - $50</SelectItem>
                    <SelectItem value="50-100">$50 - $100</SelectItem>
                    <SelectItem value="over-100">Over $100</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort */}
              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Relevance</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="flex-1">
          {localQuery && sortedResults.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <Search className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold mb-2">No results found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search terms or filters</p>
                <Button variant="outline" onClick={clearFilters}>
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          ) : (
            <ProductGrid products={sortedResults} />
          )}
        </div>
      </div>
    </div>
  )
}
