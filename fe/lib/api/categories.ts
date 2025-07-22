import {apiClient, ApiResponse} from "./client"
import type { Category } from "@/types"

export interface CreateCategoryRequest {
  name: string
  description: string
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
}

export const categoriesApi = {
  getAllCategories: () => apiClient.get<ApiResponse>("/category/all-categories"),

  createCategory: (data: CreateCategoryRequest) => apiClient.post<Category>("/category/create-category", data),

  updateCategory: (id: string, data: UpdateCategoryRequest) => apiClient.patch<Category>(`/category/${id}`, data),

  deleteCategory: (id: string) => apiClient.delete<{ message: string }>(`/category/${id}`),
}
