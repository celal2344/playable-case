"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { CartItem, User, WishlistItem, Product } from "@/types"
import { authApi } from "@/lib/api/auth"
import { cartApi } from "@/lib/api/cart"
import { wishlistApi } from "@/lib/api/wishlist"
import { apiClient } from "@/lib/api/client"

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  verifyOtp: (email: string, otp: string) => Promise<void>
  register: (data: {
    email: string
    password: string
    firstName: string
    lastName: string
    phoneNumber?: string
  }) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => Promise<void>
  getCurrentUser: () => Promise<void>
}

interface CartState {
  items: CartItem[]
  loading: boolean
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  removeSameProducts: (productId: string) => Promise<void>
  clearCart: () => Promise<void>
  fetchCart: () => Promise<void>
  getTotalItems: () => number
  getTotalPrice: () => number
}

interface WishlistState {
  items: WishlistItem[]
  loading: boolean
  addItem: (productId: string) => Promise<void>
  removeItem: (productId: string) => Promise<void>
  fetchWishlist: () => Promise<void>
  isInWishlist: (productId: string) => boolean
}

interface AppState {
  recentlyViewed: Product[]
  addToRecentlyViewed: (product: Product) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: false,

      login: async (email: string, password: string) => {
        set({ loading: true })
        try {
          const response = await authApi.login({ email, password })
          if (response.success) {
            // Login successful, OTP sent
            set({ loading: false })
          } else {
            throw new Error(response.error || "Login failed")
          }
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      verifyOtp: async (email: string, otp: string) => {
        set({ loading: true })
        try {
          const response = await authApi.verifyOtp({ email, otp })
          if (response.success) {
            apiClient.setAuthToken(response.data.token)
            set({
              user: response.data.user,
              isAuthenticated: true,
              loading: false,
            })
          } else {
            throw new Error(response.error || "OTP verification failed")
          }
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      register: async (data) => {
        set({ loading: true })
        try {
          const response = await authApi.register(data)
          if (response.success) {
            // Registration successful, proceed to OTP verification
            set({ loading: false })
          } else {
            throw new Error(response.error || "Registration failed")
          }
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      logout: async () => {
        try {
          await authApi.logout()
        } catch (error) {
          console.error("Logout error:", error)
        } finally {
          apiClient.clearAuthToken()
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          })
        }
      },

      updateUser: async (updates: Partial<User>) => {
        set({ loading: true })
        try {
          const response = await authApi.updateAccount(updates)
          if (response.success) {
            set({
              user: response.data,
              loading: false,
            })
          } else {
            throw new Error(response.error || "Update failed")
          }
        } catch (error) {
          set({ loading: false })
          throw error
        }
      },

      getCurrentUser: async () => {
        set({ loading: true })
        try {
          const response = await authApi.getCurrentUser()
          if (response.success) {
            set({
              user: response.data,
              isAuthenticated: true,
              loading: false,
            })
          } else {
            // Token might be invalid
            apiClient.clearAuthToken()
            set({
              user: null,
              isAuthenticated: false,
              loading: false,
            })
          }
        } catch (error) {
          apiClient.clearAuthToken()
          set({
            user: null,
            isAuthenticated: false,
            loading: false,
          })
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  loading: false,

  addItem: async (productId: string) => {
    set({ loading: true })
    try {
      const response = await cartApi.addProduct(productId)
      if (response.success) {
        await get().fetchCart()
      } else {
        throw new Error(response.error || "Failed to add item to cart")
      }
    } catch (error) {
      console.error("Add to cart error:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  removeItem: async (productId: string) => {
    set({ loading: true })
    try {
      const response = await cartApi.removeProduct(productId)
      if (response.success) {
        await get().fetchCart()
      } else {
        throw new Error(response.error || "Failed to remove item from cart")
      }
    } catch (error) {
      console.error("Remove from cart error:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  removeSameProducts: async (productId: string) => {
    set({ loading: true })
    try {
      const response = await cartApi.removeSameProducts(productId)
      if (response.success) {
        await get().fetchCart()
      } else {
        throw new Error(response.error || "Failed to remove products from cart")
      }
    } catch (error) {
      console.error("Remove products error:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  clearCart: async () => {
    // This would need a cart ID - implement based on your cart structure
    set({ items: [] })
  },

  fetchCart: async () => {
    set({ loading: true })
    try {
      const response = await cartApi.getCart()
      if (response.success) {
        set({ items: response.data.items || [], loading: false })
      } else {
        set({ items: [], loading: false })
      }
    } catch (error) {
      console.error("Fetch cart error:", error)
      set({ items: [], loading: false })
    }
  },

  getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
  getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
}))

export const useWishlistStore = create<WishlistState>((set, get) => ({
  items: [],
  loading: false,

  addItem: async (productId: string) => {
    set({ loading: true })
    try {
      const response = await wishlistApi.addProduct(productId)
      if (response.success) {
        await get().fetchWishlist()
      } else {
        throw new Error(response.error || "Failed to add item to wishlist")
      }
    } catch (error) {
      console.error("Add to wishlist error:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  removeItem: async (productId: string) => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      const response = await wishlistApi.removeProduct(user.id, productId)
      if (response.success) {
        await get().fetchWishlist()
      } else {
        throw new Error(response.error || "Failed to remove item from wishlist")
      }
    } catch (error) {
      console.error("Remove from wishlist error:", error)
      throw error
    } finally {
      set({ loading: false })
    }
  },

  fetchWishlist: async () => {
    const { user } = useAuthStore.getState()
    if (!user) return

    set({ loading: true })
    try {
      // Note: This endpoint needs both userId and wishlistId
      // You might need to adjust this based on your API structure
      const response = await wishlistApi.getWishlist(user.id, "wishlist-id")
      if (response.success) {
        set({ items: response.data, loading: false })
      } else {
        set({ items: [], loading: false })
      }
    } catch (error) {
      console.error("Fetch wishlist error:", error)
      set({ items: [], loading: false })
    }
  },

  isInWishlist: (productId: string) => get().items.some((item) => item.productId === productId),
}))

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      recentlyViewed: [],
      addToRecentlyViewed: (product) =>
        set((state) => {
          const filtered = state.recentlyViewed.filter((p) => p.id !== product.id)
          return {
            recentlyViewed: [product, ...filtered].slice(0, 10),
          }
        }),
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
    }),
    {
      name: "app-storage",
    },
  ),
)
