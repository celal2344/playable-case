import { apiClient } from "./client"
import type { Address } from "@/types"

export interface CreateAddressRequest {
  houseNumber: string
  area: string
  landmark?: string
  city: string
  pincode: string
  state: string
  mobileNumber: string
}

export interface UpdateAddressRequest {
  houseNumber?: string
  area?: string
  landmark?: string
  city?: string
  pincode?: string
  state?: string
  mobileNumber?: string
}

export const addressesApi = {
  addAddress: (data: CreateAddressRequest) => apiClient.post<Address>("/address/add-address", data),

  getAllUserAddresses: () => apiClient.get<Address[]>("/address/all-user-address"),

  getAddress: (id: string) => apiClient.get<Address>(`/address/${id}`),

  updateAddress: (id: string, data: UpdateAddressRequest) => apiClient.patch<Address>(`/address/${id}`, data),

  deleteAddress: (id: string) => apiClient.delete<{ message: string }>(`/address/${id}`),
}
