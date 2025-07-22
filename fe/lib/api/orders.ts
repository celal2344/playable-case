import { apiClient } from "./client"
import type { Order } from "@/types"

export interface CreateSingleOrderRequest {
  quantity: string
}

export const ordersApi = {
  createSingleOrder: (productId: string, addressId: string, data: CreateSingleOrderRequest) =>
    apiClient.post<Order>(`/order/create-single-order/${productId}/${addressId}`, data),

  createCartOrder: (cartId: string, addressId: string) =>
    apiClient.post<Order>(`/order/create-cart-order/${cartId}/${addressId}`),
}
