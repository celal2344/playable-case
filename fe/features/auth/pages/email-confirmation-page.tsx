"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmailConfirmationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")

  useEffect(() => {
    const token = searchParams.get("token")

    if (!token) {
      setStatus("error")
      setMessage("Invalid confirmation link")
      return
    }

    // Simulate email confirmation API call
    setTimeout(() => {
      // Mock confirmation - in real app, this would call your API
      if (token === "valid-token") {
        setStatus("success")
        setMessage("Your email has been successfully confirmed!")
      } else {
        setStatus("error")
        setMessage("Invalid or expired confirmation link")
      }
    }, 2000)
  }, [searchParams])

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center mb-4">
            {status === "loading" && (
              <div className="bg-blue-100">
                <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
              </div>
            )}
            {status === "success" && (
              <div className="bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100">
                <XCircle className="h-8 w-8 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Confirming Email..."}
            {status === "success" && "Email Confirmed!"}
            {status === "error" && "Confirmation Failed"}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">{message}</p>

          {status === "success" && (
            <Button onClick={() => router.push("/auth/login")} className="w-full">
              Continue to Sign In
            </Button>
          )}

          {status === "error" && (
            <div className="space-y-2">
              <Button onClick={() => router.push("/auth/register")} variant="outline" className="w-full">
                Back to Registration
              </Button>
              <Button onClick={() => window.location.reload()} className="w-full">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
