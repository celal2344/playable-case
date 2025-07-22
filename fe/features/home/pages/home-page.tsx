"use client"

import {useEffect, useState} from "react"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import ProductGrid from "@/features/products/components/product-grid"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { newsletterSchema, type NewsletterInput } from "@/lib/schemas"
import PopularProducts from "@/components/recommendations/popular-products"
import RecentlyViewed from "@/components/recommendations/recently-viewed"
import {Category, Product} from "@/types";
import {categoriesApi} from "@/lib/api/categories";
import {productsApi} from "@/lib/api/products";

export default function HomePage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
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

  const form = useForm<NewsletterInput>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  })

  const featuredProducts = products.filter((p) => p.isFeatured)
  const newArrivals = products.slice(0, 4)
  const popularProducts = products.slice(2, 6)

  const onNewsletterSubmit = async (data: NewsletterInput) => {
    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      console.log("Newsletter signup:", data.email)
      form.reset()
      setIsSubmitting(false)
    }, 1000)
  }

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Amazing Products</h1>
            <p className="text-xl mb-8 opacity-90">
              Shop the latest trends in electronics, fashion, home goods, and more. Quality products at unbeatable
              prices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" variant="secondary" asChild>
                <Link href="/products">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-white border-white hover:bg-white hover:text-blue-600 bg-transparent"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore our wide range of categories to find exactly what you're looking for.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 8).map((category) => (
            <Link key={category.id} href={`/category/${category.id}`} className="group">
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg">
                    <Image
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      width={200}
                      height={200}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900">{category.name}</h3>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="container mx-auto px-4">
        <PopularProducts title="Popular Products" limit={8} />
      </section>

      {/* Stats Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">10K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
              <div className="text-gray-600">Products Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">99%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-gray-600">Latest products just added to our store</p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products?sort=newest">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={newArrivals} />
      </section>

      {/* Popular Products */}
      <section className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-3xl font-bold">Trending Now</h2>
          </div>
          <Button variant="outline" asChild>
            <Link href="/products?sort=popular">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        <ProductGrid products={popularProducts} />
      </section>

      {/* Recently Viewed Products */}
      <section className="container mx-auto px-4">
        <RecentlyViewed limit={4} />
      </section>

      {/* Newsletter Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Subscribe to our newsletter and be the first to know about new products, exclusive deals, and special
            offers.
          </p>

          <form onSubmit={form.handleSubmit(onNewsletterSubmit)} className="max-w-md mx-auto flex gap-4">
            <Input type="email" placeholder="Enter your email" {...form.register("email")} className="flex-1" />
            <Button type="submit" variant="secondary" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          {form.formState.errors.email && (
            <p className="text-red-400 text-sm mt-2">{form.formState.errors.email.message}</p>
          )}
        </div>
      </section>
    </div>
  )
}
