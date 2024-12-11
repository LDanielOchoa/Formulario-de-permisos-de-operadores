'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useAuth } from '@/contexts/auth-context'
import { toast } from 'sonner'
import Link from 'next/link'

export default function LoginPage() {
  const [code, setCode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await login(code)
      toast.success('Inicio de sesión exitoso')
      // La redirección se maneja en el contexto de autenticación
    } catch (error) {
      toast.error('Error al iniciar sesión')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 to-green-700 relative overflow-hidden flex items-center justify-center px-4">
      <div className="absolute top-0 left-0 right-0 p-4">
        <div className="container mx-auto">
          <Link 
            href="/"
            className="text-white hover:text-white/80 transition-colors inline-flex items-center gap-2"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md space-y-6"
      >
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-gray-900">
            Iniciar Sesión
          </h1>
          <p className="text-gray-500">
            Ingresa tu código para acceder al sistema
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="code" className="text-sm font-medium text-gray-900">
              Código
            </label>
            <Input
              id="code"
              type="text"
              placeholder="Ingresa tu código"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
              className="bg-gray-50"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-500">
          ¿No tienes un código? Contacta a tu administrador
        </div>
      </motion.div>
    </div>
  )
}

