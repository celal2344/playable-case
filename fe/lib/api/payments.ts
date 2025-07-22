import { apiClient } from "./client"

export interface VerifyPaymentRequest {
  signature: string
  razorpayOrderId: string
  razorpayPaymentId: string
}

export const paymentsApi = {
  verifyPayment: (orderId: string, data: VerifyPaymentRequest) =>
    apiClient.post<{ message: string }>(`/payment/verify-payment/${orderId}`, data),
}
