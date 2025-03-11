import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider";


const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Virtue AI",
  description: "AI chat interface with multiple model support",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dark`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

