"use client"

import {useEffect, useState} from "react"
import Image from "next/image"
import { Plus, ShoppingCart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { useCartStore } from "@/lib/store"
import {Category, Product} from "@/types"
import {categoriesApi} from "@/lib/api/categories";
import {productsApi} from "@/lib/api/products";

interface FrequentlyBoughtTogetherProps {
  currentProduct: Product
}

export default function FrequentlyBoughtTogether({ currentProduct }: FrequentlyBoughtTogetherProps) {
  // Mock frequently bought together logic - in real app this would come from backend
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

  const suggestedProducts = products
    .filter((product) => {
      if (product.id === currentProduct.id) return false
      // Simple logic: products in same category or with similar price range
      return product.category === currentProduct.category || Math.abs(product.price - currentProduct.price) < 50
    })
    .slice(0, 2)

  const [selectedProducts, setSelectedProducts] = useState<string[]>([currentProduct.id])
  const { addItem } = useCartStore()

  if (suggestedProducts.length === 0) {
    return null
  }

  const allProducts = [currentProduct, ...suggestedProducts]
  const totalPrice = allProducts
    .filter((product) => selectedProducts.includes(product.id))
    .reduce((sum, product) => sum + product.price, 0)

  const handleProductToggle = (productId: string) => {
    if (productId === currentProduct.id) return // Can't unselect main product

    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const handleAddAllToCart = () => {
    allProducts
      .filter((product) => selectedProducts.includes(product.id))
      .forEach((product) => {
        addItem(product._id)
      })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Frequently Bought Together</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Product List */}
          <div className="flex flex-col space-y-4">
            {allProducts.map((product, index) => (
              <div key={product.id}>
                <div className="flex items-center space-x-4">
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onCheckedChange={() => handleProductToggle(product.id)}
                    disabled={product.id === currentProduct.id}
                  />

                  <div className="w-16 h-16 flex-shrink-0">
                    <Image
                      src={product.images[0] || "/placeholder.svg"}
                      alt={product.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">{product.name}</h3>
                    <p className="text-sm font-semibold">${product.price.toFixed(2)}</p>
                  </div>
                </div>

                {index < allProducts.length - 1 && (
                  <div className="flex justify-center my-2">
                    <Plus className="h-4 w-4 text-gray-400" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Total and Add to Cart */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <span className="font-medium">Total for {selectedProducts.length} items:</span>
              <span className="text-lg font-bold">${totalPrice.toFixed(2)}</span>
            </div>

            <Button onClick={handleAddAllToCart} className="w-full" disabled={selectedProducts.length === 0}>
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add Selected to Cart
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
