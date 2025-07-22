import { z } from "zod"

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const otpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
})

export const registerSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const emailConfirmationSchema = z.object({
  token: z.string().min(1, "Confirmation token is required"),
})

export const resetPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
})

// Admin schemas
export const adminLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0.01, "Price must be greater than 0"),
  categoryId: z.string().min(1, "Category is required"),
  stock: z.number().min(0, "Stock quantity cannot be negative"),
  tags: z.array(z.string()).optional(),
  isFeatured: z.boolean().optional(),
  isActive: z.boolean().optional(),
})

export const categorySchema = z.object({
  name: z.string().min(1, "Category name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isActive: z.boolean().optional(),
  sortOrder: z.number().optional(),
})

export const orderStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
  notes: z.string().optional(),
})

// User schemas
export const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
})

export const addressSchema = z.object({
  type: z.enum(["shipping", "billing"]),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(1, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  isDefault: z.boolean().optional(),
})

// Checkout schemas
export const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  paymentMethod: z.enum(["card", "paypal"]),
  cardInfo: z
    .object({
      name: z.string().min(1, "Name on card is required"),
      number: z.string().min(16, "Card number must be at least 16 digits"),
      expiry: z.string().regex(/^\d{2}\/\d{2}$/, "Expiry must be in MM/YY format"),
      cvv: z.string().min(3, "CVV must be at least 3 digits"),
    })
    .optional(),
  orderNotes: z.string().optional(),
})

export const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, "Review must be at least 10 characters"),
})

export const newsletterSchema = z.object({
  email: z.string().email("Invalid email address"),
})

export type LoginInput = z.infer<typeof loginSchema>
export type OtpInput = z.infer<typeof otpSchema>
export type RegisterInput = z.infer<typeof registerSchema>
export type EmailConfirmationInput = z.infer<typeof emailConfirmationSchema>
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>
export type AdminLoginInput = z.infer<typeof adminLoginSchema>
export type ProductInput = z.infer<typeof productSchema>
export type CategoryInput = z.infer<typeof categorySchema>
export type OrderStatusInput = z.infer<typeof orderStatusSchema>
export type ProfileInput = z.infer<typeof profileSchema>
export type AddressInput = z.infer<typeof addressSchema>
export type CheckoutInput = z.infer<typeof checkoutSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type NewsletterInput = z.infer<typeof newsletterSchema>
