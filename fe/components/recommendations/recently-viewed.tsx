"use client"
import ProductGrid from "@/features/products/components/product-grid"
import { useAppStore } from "@/lib/store"

interface RecentlyViewedProps {
  limit?: number
}

export default function RecentlyViewed({ limit = 4 }: RecentlyViewedProps) {
  const { recentlyViewed } = useAppStore()

  const displayProducts = recentlyViewed.slice(0, limit)

  if (displayProducts.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold">Recently Viewed</h2>
      <ProductGrid products={displayProducts} />
    </section>
  )
}
