import { apiClient } from "./client"
import type { Review } from "@/types"

export interface CreateReviewRequest {
  comment: string
  rating: string
}

export interface UpdateReviewRequest {
  rating?: string
  comment?: string
}

export const reviewsApi = {
  createReview: (productId: string, data: CreateReviewRequest) =>
    apiClient.post<Review>(`/review/create-review/${productId}`, data),

  getUserReviews: () => apiClient.get<Review[]>("/review/user-review"),

  getReview: (userId: string, reviewId: string) => apiClient.get<Review>(`/review/${userId}/${reviewId}`),

  updateReview: (userId: string, reviewId: string, data: UpdateReviewRequest) =>
    apiClient.patch<Review>(`/review/${userId}/${reviewId}`, data),

  deleteReview: (userId: string, reviewId: string) =>
    apiClient.delete<{ message: string }>(`/review/${userId}/${reviewId}`),
}
