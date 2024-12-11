'use client'

import Link from 'next/link'
import { useAuth } from '@/contexts/auth-context'
import { Button } from '@/components/ui/button'

export default function Header() {
  const { user, logout } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 bg-green-600 shadow-md z-10">
      <div className="container mx-auto px-6 py-4">
        <nav className="flex items-center justify-between">
          <Link href="/" className="text-white text-xl font-semibold">
            SAO6 Permisos
          </Link>
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <span className="text-white text-sm">
                  {user.name}
                </span>
                <Button
                  onClick={logout}
                  variant="secondary"
                  className="text-green-600"
                >
                  Cerrar Sesión
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="secondary" className="text-green-600">
                    Iniciar Sesión
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  )
}

