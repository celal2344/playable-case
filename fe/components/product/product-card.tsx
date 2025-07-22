"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Product } from "@/types"
import { useCartStore, useWishlistStore } from "@/lib/store"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()

  const isWishlisted = isInWishlist(product._id)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      await addItem(product._id)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id)
      } else {
        await addToWishlist(product._id)
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error)
    }
  }

  return (
    <div className="group relative bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <Link href={`/product/${product._id}`}>
        <div className="aspect-square overflow-hidden rounded-t-lg">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {product.isFeatured && <Badge className="absolute top-2 left-2 bg-red-500">Featured</Badge>}

        <Button
          variant="ghost"
          size="sm"
          className={`absolute top-2 right-2 p-2 rounded-full ${
            isWishlisted ? "text-red-500" : "text-gray-400"
          } hover:text-red-500`}
          onClick={handleWishlistToggle}
        >
          <Heart className={`h-4 w-4 ${isWishlisted ? "fill-current" : ""}`} />
        </Button>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>

          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${
                    i < Math.floor(product.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-500 ml-1">{product.reviewCount}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>

            {product.stock > 0 ? (
              <Button
                size="sm"
                onClick={handleAddToCart}
                className="opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ShoppingCart className="h-4 w-4 mr-1" />
                Add
              </Button>
            ) : (
              <Badge variant="secondary">Out of Stock</Badge>
            )}
          </div>
        </div>
      </Link>
    </div>
  )
}
