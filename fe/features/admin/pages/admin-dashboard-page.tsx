"use client"

import { DollarSign, ShoppingCart, Users, Package } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import StatsCard from "../components/stats-card"
import SimpleLineChart from "@/components/charts/simple-line-chart"
import type {Product, User} from "@/types";
import {useEffect, useState} from "react";
import {productsApi} from "@/lib/api/products";

export default function AdminDashboardPage() {
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

  // Popular products (mock data)
  const popularProducts = products.slice(0, 5)



  return (
    <div className="space-y-6">
      {/* Recent Orders and Popular Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
        </Card>

        {/* Popular Products */}
        <Card>
          <CardHeader>
            <CardTitle>Popular Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularProducts.map((product) => (
                <div key={product.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                  <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center">
                    <Package className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{product.name}</p>
                    <p className="text-sm text-gray-500">${product.price.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{product.reviewCount} reviews</p>
                    <p className="text-xs text-gray-500">★ {product.averageRating}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
