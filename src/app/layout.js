import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Providers } from "@/components/Providers"

export const metadata = {
  title: 'Caption Clash',
  description: 'Caption random screenshots',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={GeistMono.className}>
      <body className="bg-gray-900 text-white min-h-screen">
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
