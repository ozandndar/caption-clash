import { Providers } from "@/components/Providers"
import './globals.css'
import { Navbar } from '@/components/Navbar'

export const metadata = {
  title: 'Caption Clash',
  description: 'Generate captions for random internet screenshots',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  )
}
