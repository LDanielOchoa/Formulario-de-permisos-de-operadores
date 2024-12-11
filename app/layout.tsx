import { AuthProvider } from '@/contexts/auth-context'
import { Toaster } from 'sonner'
import './globals.css'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'SAO6 Permisos',
  description: 'Sistema de gestión de permisos para SAO6',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/sao6.png" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position="top-center" />
        </AuthProvider>
      </body>
    </html>
  )
}
