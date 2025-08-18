import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Habibistay - Premium Property Investment & Vacation Rentals',
  description: 'Experience luxury stays and smart property investments with Habibistay. Average 17% annual ROI with fully managed properties in prime locations.',
  keywords: 'vacation rental, property investment, airbnb, luxury stays, ROI, property management',
  openGraph: {
    title: 'Habibistay - Premium Property Investment & Vacation Rentals',
    description: 'Experience luxury stays and smart property investments with Habibistay.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}