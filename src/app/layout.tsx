import type { Metadata } from 'next'
import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import ClientLayoutWrapper from '@/components/ClientLayoutWrapper'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NFE Football Predictions',
  description: 'AI-powered football predictions and analytics',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navbar />
        <ClientLayoutWrapper>{children}</ClientLayoutWrapper>
      </body>
    </html>
  )
}