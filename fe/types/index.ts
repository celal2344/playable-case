export interface User {
  _id: string
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber?: string
  role: "admin" | "customer"
  isEmailVerified: boolean
  addresses: Address[]
  favoriteCategories: string[]
  createdAt: string
  updatedAt: string
}

export interface Address {
  _id: string
  id: string
  houseNumber: string
  area: string
  landmark?: string
  city: string
  pincode: string
  state: string
  mobileNumber: string
  isDefault?: boolean
  type?: "shipping" | "billing"
}

export interface Product {
  _id: string
  id: string
  name: string
  description: string
  price: number
  stock: number
  category: string
  images: string[]
  specifications?: Record<string, string>
  tags?: string[]
  isFeatured?: boolean
  variants?: ProductVariant[]
  averageRating: number
  reviewCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface ProductVariant {
  id: string
  type: "size" | "color"
  value: string
  priceModifier: number
  stockQuantity: number
}

export interface Category {
  _id: string
  id: string
  name: string
  description: string
  image?: string
  isActive: boolean
  sortOrder?: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  _id: string
  id: string
  productId: string
  product: Product
  quantity: number
  selectedVariants?: Record<string, string>
  price: number
}

export interface Cart {
  _id: string
  id: string
  userId: string
  items: CartItem[]
  total: number
  createdAt: string
  updatedAt: string
}

export interface Order {
  _id: string
  id: string
  userId: string
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: Address
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
  paymentStatus: "pending" | "completed" | "failed"
  razorpayOrderId?: string
  razorpayPaymentId?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  _id: string
  id: string
  productId: string
  product: Product
  quantity: number
  price: number
  selectedVariants?: Record<string, string>
}

export interface Review {
  _id: string
  id: string
  productId: string
  userId: string
  user: Pick<User, "firstName" | "lastName">
  rating: number
  comment: string
  isApproved: boolean
  createdAt: string
  updatedAt: string
}

export interface WishlistItem {
  _id: string
  id: string
  userId: string
  productId: string
  product: Product
  createdAt: string
}

export interface Wishlist {
  _id: string
  id: string
  userId: string
  products: WishlistItem[]
  createdAt: string
  updatedAt: string
}

export interface UserActivity {
  _id: string
  id: string
  userId: string
  type: "view" | "purchase" | "cart_add"
  productId: string
  timestamp: string
}
