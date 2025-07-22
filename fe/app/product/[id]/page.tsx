"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import { Heart, Star, ShoppingCart, Minus, Plus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useApi } from "@/lib/hooks/useApi"
import { productsApi } from "@/lib/api/products"
import { reviewsApi } from "@/lib/api/reviews"
import { useCartStore, useWishlistStore, useAppStore } from "@/lib/store"
import type { Review } from "@/types"

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [newReview, setNewReview] = useState({ rating: 5, comment: "" })

  const { addItem } = useCartStore()
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore()
  const { addToRecentlyViewed } = useAppStore()

  const {
    data: product,
    loading: productLoading,
    error: productError,
  } = useApi(() => productsApi.getProduct(productId), [productId])

  const { data: reviews, loading: reviewsLoading } = useApi(() => reviewsApi.getUserReviews(), [])

  useEffect(() => {
    if (product) {
      addToRecentlyViewed(product)
    }
  }, [product, addToRecentlyViewed])

  const handleAddToCart = async () => {
    if (!product) return
    try {
      await addItem(product.id)
    } catch (error) {
      console.error("Failed to add to cart:", error)
    }
  }

  const handleWishlistToggle = async () => {
    if (!product) return
    try {
      const isWishlisted = isInWishlist(product.id)
      if (isWishlisted) {
        await removeFromWishlist(product.id)
      } else {
        await addToWishlist(product.id)
      }
    } catch (error) {
      console.error("Failed to update wishlist:", error)
    }
  }

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    try {
      await reviewsApi.createReview(product.id, {
        comment: newReview.comment,
        rating: newReview.rating.toString(),
      })
      setNewReview({ rating: 5, comment: "" })
      // Refresh reviews
    } catch (error) {
      console.error("Failed to submit review:", error)
    }
  }

  if (productLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="animate-pulse">
            <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
            <div className="flex space-x-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="w-20 h-20 bg-gray-200 rounded-md"></div>
              ))}
            </div>
          </div>
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (productError || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  const isWishlisted = isInWishlist(product.id)
  const productReviews = reviews?.filter((r: Review) => r.productId === product.id) || []

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border">
            <Image
              src={product.images[selectedImage] || "/placeholder.svg"}
              alt={product.name}
              width={600}
              height={600}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex space-x-2 overflow-x-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${
                  selectedImage === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-3xl font-bold">{product.name}</h1>
              <Button variant="ghost" size="sm" onClick={handleWishlistToggle}>
                <Heart className={`h-5 w-5 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.floor(product.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {product.averageRating} ({product.reviewCount} reviews)
              </span>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <span className="text-3xl font-bold">${product.price.toFixed(2)}</span>
              {product.isFeatured && <Badge className="bg-red-500">Featured</Badge>}
            </div>
          </div>

          <p className="text-gray-600">{product.description}</p>

          {/* Quantity */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Quantity</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setQuantity(quantity + 1)}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock Status */}
          <div>
            {product.stock > 0 ? (
              <p className="text-green-600 text-sm">✓ In stock ({product.stock} available)</p>
            ) : (
              <p className="text-red-600 text-sm">✗ Out of stock</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            <Button size="lg" onClick={handleAddToCart} disabled={product.stock === 0} className="flex-1">
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
            <Button variant="outline" size="lg">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-12">
        <TabsList>
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">Reviews ({productReviews.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.specifications &&
                  Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2 border-b">
                      <span className="font-medium">{key}:</span>
                      <span className="text-gray-600">{value}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="mt-6">
          <div className="space-y-6">
            {/* Review Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Customer Reviews</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.averageRating) ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-lg font-semibold">{product.averageRating}</span>
                  <span className="text-gray-600">({product.reviewCount} reviews)</span>
                </div>
              </CardContent>
            </Card>

            {/* Individual Reviews */}
            <div className="space-y-4">
              {productReviews.map((review: Review) => (
                <Card key={review.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <span className="font-medium">
                            {review.user.firstName} {review.user.lastName}
                          </span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Write Review Form */}
            <Card>
              <CardHeader>
                <CardTitle>Write a Review</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium mb-2 block">Rating</Label>
                    <Select
                      value={newReview.rating.toString()}
                      onValueChange={(value) => setNewReview((prev) => ({ ...prev, rating: Number(value) }))}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {[5, 4, 3, 2, 1].map((rating) => (
                          <SelectItem key={rating} value={rating.toString()}>
                            {rating} Star{rating !== 1 ? "s" : ""}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-sm font-medium mb-2 block">Comment</Label>
                    <Textarea
                      placeholder="Share your thoughts about this product..."
                      value={newReview.comment}
                      onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                      rows={4}
                    />
                  </div>

                  <Button type="submit">Submit Review</Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
