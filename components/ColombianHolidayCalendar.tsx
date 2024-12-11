import { useState } from 'react'
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { es } from 'date-fns/locale'

const colombianHolidays2024 = [
  new Date(2024, 0, 1),  // Año Nuevo
  new Date(2024, 0, 8),  // Día de los Reyes Magos
  new Date(2024, 2, 25), // Día de San José
  new Date(2024, 2, 28), // Jueves Santo
  new Date(2024, 2, 29), // Viernes Santo
  new Date(2024, 4, 1),  // Día del Trabajo
  new Date(2024, 5, 3),  // Ascensión del Señor
  new Date(2024, 5, 24), // Corpus Christi
  new Date(2024, 6, 1),  // Sagrado Corazón
  new Date(2024, 6, 20), // Día de la Independencia
  new Date(2024, 7, 7),  // Batalla de Boyacá
  new Date(2024, 7, 19), // La Asunción de la Virgen
  new Date(2024, 9, 14), // Día de la Raza
  new Date(2024, 10, 4), // Día de Todos los Santos
  new Date(2024, 10, 11), // Independencia de Cartagena
  new Date(2024, 11, 8), // Día de la Inmaculada Concepción
  new Date(2024, 11, 25), // Día de Navidad
]

export function ColombianHolidayCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  return (
    <Card>
      <CardHeader>
        <CardTitle>Calendario de Festivos Colombianos</CardTitle>
      </CardHeader>
      <CardContent>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          locale={es}
          modifiers={{
            holiday: colombianHolidays2024
          }}
          modifiersStyles={{
            holiday: { color: 'red', fontWeight: 'bold' }
          }}
        />
      </CardContent>
    </Card>
  )
}

