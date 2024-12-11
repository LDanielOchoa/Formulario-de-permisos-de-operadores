import { addDays, getDay, setDay } from 'date-fns'

export function getColombianHolidays(year: number): Date[] {
  const holidays = [
    new Date(year, 0, 1),  // Año Nuevo
    new Date(year, 4, 1),  // Día del Trabajo
    new Date(year, 6, 20), // Día de la Independencia
    new Date(year, 7, 7),  // Batalla de Boyacá
    new Date(year, 11, 8), // Día de la Inmaculada Concepción
    new Date(year, 11, 25) // Navidad
  ]

  // Festivos que se celebran el lunes siguiente
  const mondayHolidays = [
    new Date(year, 0, 6),  // Día de los Reyes Magos
    new Date(year, 2, 19), // Día de San José
    new Date(year, 5, 29), // San Pedro y San Pablo
    new Date(year, 7, 15), // La Asunción de la Virgen
    new Date(year, 9, 12), // Día de la Raza
    new Date(year, 10, 1), // Todos los Santos
    new Date(year, 10, 11) // Independencia de Cartagena
  ]

  mondayHolidays.forEach(date => {
    holidays.push(getNextMonday(date))
  })

  // Semana Santa
  const easterDate = getEasterDate(year)
  holidays.push(addDays(easterDate, -3)) // Jueves Santo
  holidays.push(addDays(easterDate, -2)) // Viernes Santo

  // Corpus Christi y Sagrado Corazón (60 y 68 días después de Pascua)
  holidays.push(getNextMonday(addDays(easterDate, 60)))
  holidays.push(getNextMonday(addDays(easterDate, 68)))

  return holidays.sort((a, b) => a.getTime() - b.getTime())
}

function getNextMonday(date: Date): Date {
  const dayOfWeek = getDay(date)
  if (dayOfWeek === 1) return date // Ya es lunes
  return setDay(date, 1, { weekStartsOn: 1 })
}

function getEasterDate(year: number): Date {
  const a = year % 19
  const b = Math.floor(year / 100)
  const c = year % 100
  const d = Math.floor(b / 4)
  const e = b % 4
  const f = Math.floor((b + 8) / 25)
  const g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30
  const i = Math.floor(c / 4)
  const k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7
  const m = Math.floor((a + 11 * h + 22 * l) / 451)
  const month = Math.floor((h + l - 7 * m + 114) / 31) - 1
  const day = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(year, month, day)
}

