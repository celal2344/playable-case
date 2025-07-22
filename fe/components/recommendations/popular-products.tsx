"use client"

import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductGrid from "@/features/products/components/product-grid"
import Link from "next/link"
import {productsApi} from "@/lib/api/products";
import {useEffect, useState} from "react";
import {Product} from "@/types";

interface PopularProductsProps {
  title?: string
  limit?: number
  categoryId?: string
  showViewAll?: boolean
}

export default function PopularProducts({
  title = "Popular Products",
  limit = 4,
  categoryId,
  showViewAll = true,
}: PopularProductsProps) {
    const [products, setProducts] = useState<Product[]>([])

    useEffect(() => {
        let isMounted = true

        productsApi.getAllProducts().then((response) => {
            if (response.success && isMounted) {
                setProducts(response.data.data)
            }
        })
        return () => {
            isMounted = false
        }
    }, []);

  const popularProducts = products
    .filter((product) => (categoryId ? product.category === categoryId : true))
    .sort((a, b) => {
      // Sort by a combination of rating and review count
      const aScore = a.averageRating * Math.log(a.reviewCount + 1)
      const bScore = b.averageRating * Math.log(b.reviewCount + 1)
      return bScore - aScore
    })
    .slice(0, limit)

  if (popularProducts.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        {showViewAll && (
          <Button variant="outline" asChild>
            <Link href="/products?sort=popular">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        )}
      </div>

      <ProductGrid products={popularProducts} />
    </section>
  )
}
