import { GeistMono } from 'geist/font/mono'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Providers } from "@/components/Providers"
import PWAInstallPrompt from '@/components/PWAInstallPrompt';
import { Analytics } from '@vercel/analytics/react'
import { NextIntlClientProvider } from 'next-intl'
import { getLocale, getMessages } from 'next-intl/server'
import { LanguageProvider } from '@/contexts/LanguageContext'

export const metadata = {
  title: 'Caption Clash - Random Screenshot Caption Contest',
  description: 'Join the ultimate screenshot captioning competition! Create witty captions for random Lightshot screenshots, compete with others, and climb the leaderboard. Over 5 billion screenshots to explore and caption.',
  keywords: [
    'screenshot captions',
    'lightshot random',
    'caption contest',
    'screenshot competition',
    'funny captions',
    'prnt.sc random',
    'screenshot roulette',
    'caption game',
    'internet screenshots',
    'meme creation',
    'screenshot sharing',
    'caption community',
    'lightshot explorer',
    'screenshot contest',
    'funny screenshots',
    'caption battle',
    'screenshot comments',
    'internet humor',
    'screenshot discovery',
    'caption leaderboard',
    'screenshot game',
    'caption competition',
    'social screenshot sharing',
    'screenshot caption generator',
    'funny image captions',
    'screenshot community',
    'caption ranking',
    'screenshot caption battle'
  ].join(', '),
  openGraph: {
    title: 'Caption Clash - Random Screenshot Caption Contest',
    description: 'Create witty captions for random internet screenshots and compete with others in this fun community contest.',
    type: 'website',
    url: 'https://caption-clash.com',
    images: [
      {
        url: '/images/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Caption Clash - Screenshot Caption Contest'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Caption Clash - Random Screenshot Caption Contest',
    description: 'Create witty captions for random internet screenshots and compete with others!',
    images: ['/images/icons/twitter_card_image.png']
  },
  alternates: {
    canonical: 'https://caption-clash.com'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'I0ElEXsJBu72JA_XCsJLH-mUGYcK1K2G9-AM1DhjYeQ',
  },
  metadataBase: new URL('https://caption-clash.com'),
  applicationName: 'Caption Clash',
  authors: [{ name: 'Caption Clash Team' }],
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  creator: 'Caption Clash Team',
  publisher: 'Caption Clash',
  category: 'Entertainment',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Caption Clash',
  description: 'Join the ultimate screenshot captioning competition! Create witty captions for random Lightshot screenshots, compete with others, and climb the leaderboard.',
  applicationCategory: 'Entertainment',
  genre: ['Social', 'Contest', 'Humor'],
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'USD'
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingCount: '100',
    reviewCount: '50',
    bestRating: '5',
    ratingValue: '4.8'
  },
  featureList: [
    'Random screenshot discovery',
    'Caption creation',
    'Community voting',
    'Leaderboard competition',
    'Real-time updates'
  ]
};

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={GeistMono.className}>
      <head>
        <meta name='application-name' content='Caption Clash' />
        <meta name='apple-mobile-web-app-capable' content='yes' />
        <meta name='apple-mobile-web-app-status-bar-style' content='default' />
        <meta name='apple-mobile-web-app-title' content='Caption Clash' />
        <meta name='format-detection' content='telephone=no' />
        <meta name='mobile-web-app-capable' content='yes' />
        <meta name='theme-color' content='#1F2937' />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta property="og:site_name" content="Caption Clash" />
        <meta name="author" content="Caption Clash Team" />
        <link rel="icon" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="mask-icon" href="/icons/safari-pinned-tab.svg" color="#1F2937" />
        <meta name="msapplication-TileColor" content="#1F2937" />
        <meta name="msapplication-TileImage" content="/icons/mstile-150x150.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </head>
      <body className="bg-gray-900 text-white min-h-screen">
        <Providers>
          <LanguageProvider initialLocale={locale}>
            <NextIntlClientProvider messages={messages}>
              <Navbar />
              {children}
              <PWAInstallPrompt />
              <Analytics />
            </NextIntlClientProvider>
          </LanguageProvider>
        </Providers>
      </body>
    </html>
  )
}
