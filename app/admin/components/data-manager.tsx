'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useRequestsStore, Request } from '@/store/requests-store'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'

interface DateManagerProps {
  requests: Request[]
}

export function DateManager({ requests }: DateManagerProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date())
  const [newDate, setNewDate] = useState<Date | undefined>()
  const [selectedRequests, setSelectedRequests] = useState<string[]>([])
  const updateRequestDate = useRequestsStore((state) => state.updateRequestDate)

  const filteredRequests = requests.filter(
    (request) => format(new Date(request.date), 'yyyy-MM-dd') === format(selectedDate!, 'yyyy-MM-dd')
  )

  const handleDateChange = async () => {
    if (!newDate || selectedRequests.length === 0) {
      toast.error('Por favor seleccione una nueva fecha y al menos una solicitud')
      return
    }

    try {
      selectedRequests.forEach((requestId) => {
        updateRequestDate(requestId, newDate.toISOString())
      })
      toast.success('Fechas actualizadas correctamente')
      setSelectedRequests([])
      setNewDate(undefined)
    } catch (error) {
      toast.error('Error al actualizar las fechas')
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gestionar Fechas de Solicitudes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Seleccionar Fecha Original</Label>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={es}
            />
          </div>
          <div>
            <Label>Nueva Fecha</Label>
            <Calendar
              mode="single"
              selected={newDate}
              onSelect={setNewDate}
              className="rounded-md border"
              locale={es}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Solicitudes para la fecha seleccionada</Label>
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {filteredRequests.map((request) => (
              <div key={request.id} className="flex items-center space-x-2">
                <Checkbox
                  id={request.id}
                  checked={selectedRequests.includes(request.id)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedRequests([...selectedRequests, request.id])
                    } else {
                      setSelectedRequests(selectedRequests.filter(id => id !== request.id))
                    }
                  }}
                />
                <Label htmlFor={request.id} className="text-sm">
                  {request.name} - {request.type}
                </Label>
              </div>
            ))}
          </div>
        </div>

        <Button
          onClick={handleDateChange}
          disabled={!newDate || selectedRequests.length === 0}
          className="w-full"
        >
          Actualizar Fechas
        </Button>
      </CardContent>
    </Card>
  )
}

