'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/auth-context'

interface ProtectedRouteProps {
  children: React.ReactNode
  allowedRoles?: ('admin' | 'user')[]
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login')
    } else if (!isLoading && allowedRoles && !allowedRoles.includes(user?.role!)) {
      router.push('/')
    }
  }, [user, isLoading, router, allowedRoles])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return null
  }

  return <>{children}</>
}

