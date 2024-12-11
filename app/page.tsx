import { PermissionForm } from '@/components/PermissionForm'
import { WaveBackground } from '@/components/WaveBackground'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden">
      <header className="absolute top-0 left-0 right-0 p-4 z-10">
        <nav className="container mx-auto flex justify-between items-center">
          <span className="text-white font-semibold">SAO6 Permisos</span>
          <div className="space-x-4">
            <Link
              href="/login"
              className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-medium hover:bg-opacity-90"
            >
              Iniciar Sesion
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 min-h-screen flex items-center justify-between relative z-10">
        <div className="max-w-xl text-white space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold">
            Sistema de Gestión de Permisos
          </h1>
          <p className="text-lg opacity-90">
            Gestiona tus solicitudes de manera fácil y eficiente. Realiza seguimiento en tiempo real del estado de tus permisos.
          </p>
        </div>
        <div className="hidden lg:block w-full max-w-md">
          <PermissionForm />
        </div>
      </main>

      <div className="lg:hidden w-full px-4 pb-8 relative z-10">
        <PermissionForm />
      </div>

      <WaveBackground />
    </div>
  )
}

