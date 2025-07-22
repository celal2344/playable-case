import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Playable Case - E-commerce Platform",
  description: "Discover amazing products at great prices. Shop electronics, clothing, home goods, and more.",
  keywords: "ecommerce, shopping, electronics, clothing, home goods",
  authors: [{ name: "Celal Özdemir" }],
  openGraph: {
    title: "Playable Case - Modern E-commerce Platform",
    description: "Discover amazing products at great prices",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Playable Case - Modern E-commerce Platform",
    description: "Discover amazing products at great prices",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
      <html lang="en">
      <meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests"/>
      <body className={inter.className}>
      <div className="min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1">{children}</main>
        <Footer/>
      </div>
      </body>
      </html>
  )
}
