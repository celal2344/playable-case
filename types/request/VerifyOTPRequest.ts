/*
Verify OTP
POST: {{server}}/users/verify-otp
*/
export interface VerifyOTP { 
  email: string; 
  otp: string; 
}