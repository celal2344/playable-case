"use client"

import {useState, useMemo, useEffect} from "react"
import { useParams } from "next/navigation"
import { Filter, Grid, List, SortAsc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ProductGrid from "@/features/products/components/product-grid"
import {categoriesApi} from "@/lib/api/categories";
import {Category, Product} from "@/types";
import {productsApi} from "@/lib/api/products";

export default function CategoryPage() {
  const params = useParams()
  const categoryId = params.id as string


  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("name")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [minRating, setMinRating] = useState(0)
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


  const category = categories.find((c) => c._id === categoryId)
  const categoryProducts = products.filter((p) => p.category === categoryId)

  const filteredProducts = useMemo(() => {
    const filtered = categoryProducts.filter((product) => {
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) {
        return false
      }

      // Rating filter
      if (product.averageRating < minRating) {
        return false
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.averageRating - a.averageRating
        case "newest":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "name":
        default:
          return a.name.localeCompare(b.name)
      }
    })

    return filtered
  }, [categoryProducts, priceRange, minRating, sortBy])

  if (!category) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Category not found</h1>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-600">{category.description}</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Price Range */}
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Price Range: ${priceRange[0]} - ${priceRange[1]}
                </Label>
                <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
              </div>

              {/* Rating */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Minimum Rating</Label>
                <Select value={minRating.toString()} onValueChange={(value) => setMinRating(Number(value))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">All Ratings</SelectItem>
                    <SelectItem value="1">1+ Stars</SelectItem>
                    <SelectItem value="2">2+ Stars</SelectItem>
                    <SelectItem value="3">3+ Stars</SelectItem>
                    <SelectItem value="4">4+ Stars</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Clear Filters */}
              <Button
                variant="outline"
                className="w-full bg-transparent"
                onClick={() => {
                  setPriceRange([0, 500])
                  setMinRating(0)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {categoryProducts.length} products
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Mobile filter toggle */}
              <Button
                variant="outline"
                size="sm"
                className="lg:hidden bg-transparent"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>

              {/* Sort */}
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-40">
                  <SortAsc className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Rating</SelectItem>
                  <SelectItem value="newest">Newest</SelectItem>
                </SelectContent>
              </Select>

              {/* View Mode */}
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Products */}
          <ProductGrid products={filteredProducts} />

          {/* Pagination would go here */}
          {filteredProducts.length > 12 && (
            <div className="flex justify-center mt-8">
              <Button variant="outline">Load More Products</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
