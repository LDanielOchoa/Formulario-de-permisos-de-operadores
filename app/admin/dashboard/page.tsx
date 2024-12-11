'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/contexts/auth-context'
import { useRequestsStore, type Request } from '@/store/requests-store'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Link from 'next/link'
import Header from '@/components/Header'

export default function DashboardPage() {
  const { user } = useAuth()
  const getRequestsByUser = useRequestsStore((state) => state.getRequestsByUser)
  const [requests, setRequests] = useState<Request[]>([])

  useEffect(() => {
    if (user) {
      const userRequests = getRequestsByUser(user.code)
      setRequests(userRequests)
    }
  }, [user, getRequestsByUser])

  if (!user) {
    return null // or a loading state
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 pt-24">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard de {user.name}</h1>
        <div className="grid gap-6">
          <section>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Mis Solicitudes
            </h2>
            <div className="grid gap-4">
              {requests.length === 0 ? (
                <Card className="p-6 text-center text-gray-500">
                  No tienes solicitudes aún
                </Card>
              ) : (
                requests.map((request) => (
                  <Card key={request.id} className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-900">
                          {request.type}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {format(new Date(request.date), 'PPP', { locale: es })}
                        </p>
                      </div>
                      <Badge
                        variant={
                          request.status === 'approved'
                            ? 'success'
                            : request.status === 'rejected'
                            ? 'destructive'
                            : 'default'
                        }
                      >
                        {request.status === 'approved'
                          ? 'Aprobado'
                          : request.status === 'rejected'
                          ? 'Rechazado'
                          : 'Pendiente'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {request.description}
                    </p>
                    {request.feedback && (
                      <div className="text-sm bg-gray-50 p-4 rounded-lg">
                        <strong>Comentarios:</strong> {request.feedback}
                      </div>
                    )}
                  </Card>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

