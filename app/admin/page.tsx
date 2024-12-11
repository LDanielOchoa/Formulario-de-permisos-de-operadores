'use client'

import { useState } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RequestsTable } from './components/request-table'
import { Statistics } from './components/statistics'
import { ExcelExport } from './components/excel-exports'
import { DateManager } from './components/data-manager'
import { useRequestsStore } from '@/store/requests-store'
import Header from '@/components/Header'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('requests')
  const requests = useRequestsStore((state) => state.getAllRequests())

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="container mx-auto py-8 px-4 space-y-8 pt-24">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <span className="text-sm text-gray-500">
            Total de solicitudes: {requests.length}
          </span>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="requests">Solicitudes</TabsTrigger>
            <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
            <TabsTrigger value="excel">Exportar Excel</TabsTrigger>
            <TabsTrigger value="dates">Gestionar Fechas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="requests" className="space-y-4">
            <RequestsTable requests={requests} />
          </TabsContent>
          
          <TabsContent value="statistics">
            <Statistics requests={requests} />
          </TabsContent>
          
          <TabsContent value="excel">
            <ExcelExport requests={requests} />
          </TabsContent>
          
          <TabsContent value="dates">
            <DateManager requests={requests} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

