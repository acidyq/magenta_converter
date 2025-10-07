import type { Metadata } from 'next'
import Image from 'next/image'
import './globals.css'

export const metadata: Metadata = {
  title: 'Magenta Converter',
  description: 'Universal file conversion suite with neon magenta branding',
  keywords: ['file conversion', 'video converter', 'audio converter', 'image converter', 'document converter'],
  authors: [{ name: 'Magenta Converter' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#ff00cc',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <div className="min-h-screen flex flex-col">
          <header className="border-b border-white/10 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative w-9 h-9">
                    <Image
                      src="/icon.svg"
                      alt="Magenta Converter logo"
                      width={36}
                      height={36}
                      priority
                    />
                  </div>
                  <h1 className="text-2xl font-bold neon-text">Magenta Converter</h1>
                </div>
                <div className="text-sm text-gray-400">
                  Universal File Conversion Suite
                </div>
              </div>
            </div>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-white/10 backdrop-blur-sm">
            <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-400">
              <p>© 2024 Magenta Converter. Convert with style.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
