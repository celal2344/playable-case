/*
Verify OTP (Email ve Login)
POST: {{server}}/users/verify-otp
*/
export interface VerifyOTPEmailVeLogin { 
  email: string; 
  otp: string; 
}