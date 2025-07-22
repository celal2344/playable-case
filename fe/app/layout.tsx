import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/layout/header"
import Footer from "@/components/layout/footer"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ShopHub - Modern E-commerce Platform",
  description: "Discover amazing products at great prices. Shop electronics, clothing, home goods, and more.",
  keywords: "ecommerce, shopping, electronics, clothing, home goods",
  authors: [{ name: "ShopHub Team" }],
  openGraph: {
    title: "ShopHub - Modern E-commerce Platform",
    description: "Discover amazing products at great prices",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ShopHub - Modern E-commerce Platform",
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
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
