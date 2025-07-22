import { apiClient } from "./client"
import type { User } from "@/types"

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
}

export interface VerifyOtpRequest {
  email: string
  otp: string
}

export interface UpdatePasswordRequest {
  oldPassword: string
  newPassword: string
}

export interface UpdateAccountRequest {
  phoneNumber?: string
}

export const authApi = {
  register: (data: RegisterRequest) => apiClient.post<{ user: User; token: string }>("/users/register", data),

  login: (data: LoginRequest) => apiClient.post<{ message: string }>("/users/login", data),

  verifyOtp: (data: VerifyOtpRequest) => apiClient.post<{ user: User; token: string }>("/users/verify-otp", data),

  sendOtp: (email: string) => apiClient.post<{ message: string }>("/users/send-otp", { email }),

  getCurrentUser: () => apiClient.get<User>("/users/current-user"),

  updatePassword: (data: UpdatePasswordRequest) => apiClient.patch<{ message: string }>("/users/update-password", data),

  updateAccount: (data: UpdateAccountRequest) => apiClient.patch<User>("/users/update-account-details", data),

  logout: () => apiClient.post<{ message: string }>("/users/logout"),

  refreshToken: () => apiClient.post<{ token: string }>("/users/refresh-token"),
}
