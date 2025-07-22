"use client"

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL = process.env.API_URL || "http://localhost:5000") {
    this.baseURL = baseURL
    this.loadToken()
  }

  private loadToken() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  setAuthToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  clearAuthToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
      })

      const data = await response.json()

      if (!response.ok) {
        return {
          success: false,
          data: null as T,
          error: data.message || `HTTP ${response.status}`,
        }
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      }
    } catch (error) {
      return {
        success: false,
        data: null as T,
        error: error instanceof Error ? error.message : "Network error",
      }
    }
  }


  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }

  async refreshToken(): Promise<ApiResponse<{ token: string }>> {
    return this.post("/users/refresh-token")
  }
}

export const apiClient = new ApiClient()
