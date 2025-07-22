import { apiClient } from "./client"
import type { CartItem } from "@/types"

export const cartApi = {
  createCart: (userId: string) => apiClient.post<{ message: string }>(`/cart/create-cart/${userId}`),

  getCart: () => apiClient.get<{ items: CartItem[]; total: number }>("/cart/get-cart"),

  addProduct: (productId: string) => apiClient.patch<{ message: string }>(`/cart/add-product/${productId}`),

  removeProduct: (productId: string) => apiClient.patch<{ message: string }>(`/cart/${productId}`),

  removeSameProducts: (productId: string) =>
    apiClient.patch<{ message: string }>(`/cart/remove-same-products/${productId}`),

  deleteCart: (cartId: string) => apiClient.delete<{ message: string }>(`/cart/${cartId}`),
}
