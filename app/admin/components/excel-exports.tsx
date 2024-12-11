'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Request } from '@/store/requests-store'

interface ExcelExportProps {
  requests: Request[]
}

export function ExcelExport({ requests }: ExcelExportProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined
    to: Date | undefined
  }>({
    from: undefined,
    to: undefined,
  })

  const handleExport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast.error('Por favor seleccione un rango de fechas')
      return
    }

    // Filter requests based on date range
    const filteredRequests = requests.filter(request => {
      const requestDate = new Date(request.date)
      return requestDate >= dateRange.from! && requestDate <= dateRange.to!
    })

    // Create CSV content
    const csvContent = [
      ['Código', 'Nombre', 'Tipo', 'Fecha', 'Estado', 'Descripción'].join(','),
      ...filteredRequests.map(request => [
        request.code,
        request.name,
        request.type,
        format(new Date(request.date), 'dd/MM/yyyy'),
        request.status,
        `"${request.description.replace(/"/g, '""')}"` // Escape quotes in description
      ].join(','))
    ].join('\n')

    // Create and download the file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', `solicitudes_${format(dateRange.from, 'yyyyMMdd')}_${format(dateRange.to, 'yyyyMMdd')}.csv`)
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    toast.success('Archivo Excel generado y descargado')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exportar Datos a Excel</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <h3 className="mb-2 text-sm font-medium">Fecha Inicial</h3>
            <Calendar
              mode="single"
              selected={dateRange.from}
              onSelect={(date) => setDateRange({ ...dateRange, from: date })}
              locale={es}
            />
          </div>
          <div>
            <h3 className="mb-2 text-sm font-medium">Fecha Final</h3>
            <Calendar
              mode="single"
              selected={dateRange.to}
              onSelect={(date) => setDateRange({ ...dateRange, to: date })}
              locale={es}
            />
          </div>
        </div>
        <Button
          onClick={handleExport}
          disabled={!dateRange.from || !dateRange.to}
          className="w-full"
        >
          <Download className="mr-2 h-4 w-4" />
          Exportar a Excel
        </Button>
      </CardContent>
    </Card>
  )
}

