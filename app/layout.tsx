import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Contrast Analyzer - WCAG Color Contrast Checker',
  description: 'Analyze website color contrast for WCAG 2.1 accessibility compliance. Get detailed reports and accessible color alternatives.',
  keywords: 'contrast checker, WCAG, accessibility, color contrast, a11y',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="cyber-dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
