import {apiClient, ApiResponse} from "./client"
import type { Product } from "@/types"

export interface CreateProductRequest {
  name: string
  description: string
  price: number
  stock: number
  categoryId: string
}

export interface UpdateProductRequest {
  name?: string
  stock?: string
  description?: string
  price?: number
}

export const productsApi = {
  getAllProducts: () => apiClient.get<ApiResponse>("/product/get-all-products"),

  getProduct: (id: string) => apiClient.get<Product>(`/product/get-product/${id}`),

  createProduct: (categoryId: string, data: CreateProductRequest) =>
    apiClient.post<Product>(`/product/product-listing/${categoryId}`, data),

  updateProduct: (id: string, data: UpdateProductRequest) =>
    apiClient.patch<Product>(`/product/update-product/${id}`, data),

  updateProductImages: (id: string, images: FormData) =>
    apiClient.patch<Product>(`/product/update-product-images/${id}`, images),

  changeProductCategory: (productId: string, categoryId: string) =>
    apiClient.patch<Product>(`/product/change-product-category/${productId}/${categoryId}`),

  deleteProduct: (id: string) => apiClient.delete<{ message: string }>(`/product/delete-product/${id}`),
}
