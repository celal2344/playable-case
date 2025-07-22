"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Eye, EyeOff, ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginSchema, otpSchema, type LoginInput, type OtpInput } from "@/lib/schemas"
import { useAuthStore } from "@/lib/store"
import {authApi} from "@/lib/api/auth";

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, verifyOtp, loading } = useAuthStore()
  const [showPassword, setShowPassword] = useState(false)
  const [showOtpStep, setShowOtpStep] = useState(false)
  const [userEmail, setUserEmail] = useState("")
  const [showVerificationSuccess, setShowVerificationSuccess] = useState(false)

  const loginForm = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const otpForm = useForm<OtpInput>({
    resolver: zodResolver(otpSchema),
    defaultValues: {
      otp: "",
    },
  })

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setShowVerificationSuccess(true)
      setTimeout(() => setShowVerificationSuccess(false), 5000)
    }
  }, [searchParams])

  const onLoginSubmit = async (data: LoginInput) => {
    try {
      console.log(data)
      authApi.login({
        email: data.email,
        password: data.password,
      }).then(
        (response) => {
          if (response.success) {
            setUserEmail(data.email)
            setShowOtpStep(true)
          } else {
            console.log("Login unsuccessful.")
          }
        }
      )
      setUserEmail(data.email)
      setShowOtpStep(true)
    } catch (error: any) {
      loginForm.setError("root", {
        message: error.message || "Login failed. Please try again.",
      })
    }
  }

  const onOtpSubmit = async (data: OtpInput) => {
    try {
      authApi.verifyOtp({
        email: userEmail,
        otp: data.otp,
      }).then(
        (response) => {
          console.log(response)
          if (response.success) {
            setShowOtpStep(false)
            setUserEmail("")
            setShowVerificationSuccess(true)
            router.push("/account")
          } else {
            console.log("OTP verification unsuccessful.")
          }
        }
      )
    } catch (error: any) {
      otpForm.setError("otp", {
        message: error.message || "Invalid verification code. Please try again.",
      })
    }
  }

  const resendOtp = async () => {
    try {
      await login(userEmail, "")
    } catch (error) {
      console.error("Failed to resend OTP:", error)
    }
  }

  if (showOtpStep) {
    return (
      <div className="container mx-auto px-4 py-16 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Two-Factor Authentication</CardTitle>
            <p className="text-gray-600">
              We've sent a 6-digit security code to
              <br />
              <strong>{userEmail}</strong>
            </p>
          </CardHeader>
          <CardContent>
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Security Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="123456"
                          maxLength={6}
                          className="text-center text-2xl tracking-widest"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Verifying..." : "Verify & Sign In"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <Button variant="ghost" onClick={resendOtp} className="text-sm">
                Didn't receive the code? Resend
              </Button>
            </div>

            <div className="mt-4 text-center">
              <Button
                variant="ghost"
                onClick={() => setShowOtpStep(false)}
                className="text-sm flex items-center mx-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome Back</CardTitle>
          <p className="text-gray-600">Sign in to your account to continue</p>
        </CardHeader>
        <CardContent>
          {showVerificationSuccess && (
            <Alert className="mb-4 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">
                Email verified successfully! You can now sign in to your account.
              </AlertDescription>
            </Alert>
          )}

          <Form {...loginForm}>
            <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
              <FormField
                control={loginForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="john.doe@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={loginForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input type={showPassword ? "text" : "password"} placeholder="Enter your password" {...field} />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot your password?
                </Link>
              </div>

              {loginForm.formState.errors.root && (
                <div className="text-sm text-red-600 text-center bg-red-50 p-3 rounded-md">
                  {loginForm.formState.errors.root.message}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </Button>
            </form>
          </Form>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link href="/auth/register" className="text-blue-600 hover:underline font-medium">
                Create one now
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
