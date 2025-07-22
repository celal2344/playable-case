import { apiClient } from "./client"
import type { WishlistItem } from "@/types"

export const wishlistApi = {
  createWishlist: (userId: string) => apiClient.post<{ message: string }>(`/wishlist/create-wishlist/${userId}`),

  getWishlist: (userId: string, wishlistId: string) =>
    apiClient.get<WishlistItem[]>(`/wishlist/${userId}/${wishlistId}`),

  addProduct: (productId: string) =>
    apiClient.patch<{ message: string }>(`/wishlist/add-product-wishlist/${productId}`),

  removeProduct: (userId: string, productId: string) =>
    apiClient.patch<{ message: string }>(`/wishlist/${userId}/${productId}`),
}
