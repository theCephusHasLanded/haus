import type { Metadata } from 'next';
import './globals.css';
import { Providers } from './providers';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: {
    default: 'Haus | Housing Equity Analysis Platform',
    template: '%s | Haus'
  },
  description: 'Minimalist housing equity analysis platform with constellation data visualization and AR-style interface.',
  keywords: [
    'housing equity',
    'haus platform',
    'minimalist design',
    'constellation data',
    'AR interface',
    'property analysis',
    'housing market',
    'TT Drugs font',
    'black and white',
    'data visualization'
  ],
  authors: [{ name: 'Haus Platform Team' }],
  creator: 'Haus Platform',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://haus-platform.com',
    siteName: 'Haus',
    title: 'Haus | Housing Equity Analysis Platform',
    description: 'Minimalist housing equity analysis platform with constellation data visualization and AR-style interface.',
    images: [
      {
        url: '/og-haus.png',
        width: 1200,
        height: 630,
        alt: 'Haus - Minimalist Housing Equity Platform'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Haus | Housing Equity Analysis Platform',
    description: 'Minimalist housing equity analysis platform with constellation data visualization',
    images: ['/og-haus.png'],
    creator: '@haus_platform'
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
    google: process.env.GOOGLE_VERIFICATION_ID,
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        {/* Preload critical TT Drugs fonts */}
        <link 
          rel="preload" 
          href="/fonts/TTDrugs-Regular.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="/fonts/TTDrugs-Medium.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        <link 
          rel="preload" 
          href="/fonts/TTDrugs-Light.woff2" 
          as="font" 
          type="font/woff2" 
          crossOrigin="anonymous"
        />
        {/* Fallback fonts for development */}
        <link 
          rel="preload" 
          href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" 
          as="style" 
        />
        {/* Minimalist favicon */}
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='3' fill='%23FFFFFF'/><circle cx='30' cy='30' r='1' fill='%23FFFFFF'/><circle cx='70' cy='70' r='1' fill='%23FFFFFF'/></svg>" />
        <meta name="theme-color" content="#000000" />
        <meta name="color-scheme" content="dark" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-black text-white tt-drugs-body antialiased">
        <Providers>
          <div className="flex min-h-screen flex-col">
            <main className="flex-1">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
}