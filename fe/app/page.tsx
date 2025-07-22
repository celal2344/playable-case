"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import { ArrowRight, ShoppingBag, Star, Users, Truck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import ProductGrid from "@/components/product/product-grid"
import { useApi } from "@/lib/hooks/useApi"
import { productsApi } from "@/lib/api/products"
import { categoriesApi } from "@/lib/api/categories"
import { useAuthStore } from "@/lib/store"
import {Category, Product} from "@/types";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
    const [products, setProducts] = useState<Product[]>([])
  const [productsLoading, setProductsLoading] = useState<boolean>(true)
  const [categoriesLoading, setCategoriesLoading] = useState<boolean>(true)

  const { getCurrentUser, isAuthenticated } = useAuthStore()

  useEffect(() => {
    let isMounted = true
    productsApi.getAllProducts().then(
        (data) => {
          if(isMounted){
            setProducts(data.data.data)
            console.log(data.data.data)
            setProductsLoading(false)
          }

        }
    )
    categoriesApi.getAllCategories().then(
        (data) => {
          console.log(data)
          if (isMounted) {
            setCategories(data.data.data)
            console.log(data.data.data)
            setCategoriesLoading(false)
          }
        }
    )
    return () => {
      isMounted = false
    }
  }, []);

  useEffect(() => {
    // Try to get current user if token exists
    if (!isAuthenticated) {
      getCurrentUser()
    }
  }, [getCurrentUser, isAuthenticated])

  const featuredProducts = products?.filter((product) => product.isFeatured) || []
  const popularProducts = products?.slice(0, 8) || []

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Welcome to Our Store</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Discover amazing products at unbeatable prices. Shop with confidence and enjoy fast, free shipping.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100">
              <Link href="/products">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Shop Now
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Link href="/categories">
                Browse Categories
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of categories to find exactly what you're looking for
            </p>
          </div>

          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {categories?.slice(0, 8).map((category) => (
                <Link key={category._id} href={`/category/${category.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">{category.name.charAt(0)}</span>
                      </div>
                      <h3 className="font-semibold mb-2">{category.name}</h3>
                      <p className="text-sm text-gray-600 line-clamp-2">{category.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
                <p className="text-gray-600">Hand-picked products just for you</p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/products?featured=true">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {productsLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                    <div className="bg-gray-200 h-4 rounded mb-2"></div>
                    <div className="bg-gray-200 h-3 rounded w-3/4 mb-2"></div>
                    <div className="bg-gray-200 h-5 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              <ProductGrid products={featuredProducts.slice(0, 4)} />
            )}
          </div>
        </section>
      )}

      {/* Popular Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-4">Popular Products</h2>
              <p className="text-gray-600">Trending items that customers love</p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/products">
                View All Products
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 aspect-square rounded-lg mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded mb-2"></div>
                  <div className="bg-gray-200 h-3 rounded w-3/4 mb-2"></div>
                  <div className="bg-gray-200 h-5 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <ProductGrid products={popularProducts} />
          )}
        </div>
      </section>
    </div>
  )
}
