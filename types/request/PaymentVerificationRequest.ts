/*
Payment Verification
POST: {{server}}/payment/verify-payment/67a1c6565b54a0357e5a939a
*/
export interface PaymentVerification { 
  signature: string; 
  razorpayOrderId: string; 
  razorpayPaymentId: string; 
}