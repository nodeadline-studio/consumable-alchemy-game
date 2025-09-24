import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Consumable Alchemy Game - Safe Consumable Interaction Checker',
  description: 'Discover the magical world of consumable safety! Mix foods, drinks, medications, and supplements to learn about their interactions and effects on your body. Gamified safety analysis for the modern age.',
  keywords: [
    'consumable safety',
    'food interactions',
    'medication interactions',
    'supplement safety',
    'alchemy game',
    'health app',
    'safety checker',
    'interaction analysis',
    'gamification',
    'wellness'
  ],
  authors: [{ name: 'Consumable Alchemy Team' }],
  creator: 'Consumable Alchemy Game',
  publisher: 'Consumable Alchemy Game',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://consumable-alchemy.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Consumable Alchemy Game - Safe Consumable Interaction Checker',
    description: 'Discover the magical world of consumable safety! Mix foods, drinks, medications, and supplements to learn about their interactions and effects on your body.',
    url: '/',
    siteName: 'Consumable Alchemy Game',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Consumable Alchemy Game - Safe Consumable Interaction Checker',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Consumable Alchemy Game - Safe Consumable Interaction Checker',
    description: 'Discover the magical world of consumable safety! Mix foods, drinks, medications, and supplements to learn about their interactions and effects on your body.',
    images: ['/og-image.png'],
    creator: '@consumablealchemy',
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
    google: 'your-google-verification-code',
  },
  category: 'health',
  classification: 'Health & Wellness App',
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
    'apple-mobile-web-app-title': 'Alchemy Game',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#1e293b',
    'msapplication-config': '/browserconfig.xml',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#1e293b' },
    { media: '(prefers-color-scheme: dark)', color: '#0f172a' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#1e293b" />
        <meta name="msapplication-TileColor" content="#1e293b" />
        <meta name="theme-color" content="#1e293b" />
      </head>
      <body className={inter.className} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}