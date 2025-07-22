"use client"

import ProductGrid from "@/features/products/components/product-grid"
import type { Product } from "@/types"
import {useEffect, useState} from "react";
import {productsApi} from "@/lib/api/products";

interface RelatedProductsProps {
  currentProduct: Product
  limit?: number
}

export default function RelatedProducts({ currentProduct, limit = 4 }: RelatedProductsProps) {
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
  const relatedProducts = products
    .filter((product) => {
      if (product.id === currentProduct.id) return false

      // Same category gets higher priority
      if (product.category === currentProduct.category) return true

      // Products with similar tags
      const commonTags = product.tags?.filter((tag) => currentProduct.tags?.includes(tag))
      return commonTags?.length || 0 > 0
    })
    .sort((a, b) => {
      // Prioritize same category
      const aSameCategory = a.category === currentProduct.category ? 1 : 0
      const bSameCategory = b.category === currentProduct.category ? 1 : 0

      if (aSameCategory !== bSameCategory) {
        return bSameCategory - aSameCategory
      }

      // Then by common tags count
      const aCommonTags = a.tags?.filter((tag) => currentProduct.tags?.includes(tag)).length
      const bCommonTags = b.tags?.filter((tag) => currentProduct.tags?.includes(tag)).length

      if (aCommonTags !== bCommonTags) {
        return (bCommonTags || 0) - (aCommonTags || 0)
      }

      // Finally by rating
      return b.averageRating - a.averageRating
    })
    .slice(0, limit)

  if (relatedProducts.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Related Products</h2>
      <ProductGrid products={relatedProducts} />
    </section>
  )
}
