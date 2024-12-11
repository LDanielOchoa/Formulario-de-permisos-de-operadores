'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Check, X } from 'lucide-react'
import { useRequestsStore } from '@/store/requests-store'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, isMonday, addDays, isBefore, isAfter } from 'date-fns'
import { es } from 'date-fns/locale'
import { getColombianHolidays } from '@/utils/colombianHolidays'

const TIPOS_NOVEDAD = [
  { value: 'descanso', label: 'Descanso' },
  { value: 'audiencia', label: 'Audiencia o curso de tránsito' },
  { value: 'citaMedica', label: 'Cita médica' },
  { value: 'licencia', label: 'Licencia no remunerada' },
  { value: 'semanaAM', label: 'Semana A.M.' },
  { value: 'semanaPM', label: 'Semana P.M.' },
  { value: 'diaAM', label: 'Día A.M.' },
  { value: 'diaPM', label: 'Día P.M.' },
  { value: 'tablaPartida', label: 'Tabla partida' },
]

export function PermissionForm() {
  const addRequest = useRequestsStore((state) => state.addRequest)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    phone: '',
    type: '',
    time: '',
    ampm: 'AM',
    description: ''
  })
  const [file, setFile] = useState<File | null>(null)
  const [fileError, setFileError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type === 'application/pdf' || selectedFile.type.startsWith('image/')) {
        setFile(selectedFile)
        setFileError(null)
      } else {
        setFile(null)
        setFileError('Por favor, sube solo imágenes o PDFs.')
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!date) {
      toast.error('Por favor seleccione una fecha')
      return
    }

    try {
      const formattedTime = `${formData.time} ${formData.ampm}`
      await addRequest({
        ...formData,
        time: formattedTime,
        date: date.toISOString(),
        attachments: file ? [file.name] : undefined,
      })
      
      // Show success message
      toast.custom((t) => (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded shadow-lg"
          role="alert"
        >
          <p className="font-bold">¡Éxito!</p>
          <p>Tu solicitud ha sido enviada correctamente.</p>
        </motion.div>
      ), { duration: 3000 })
      
      // Reset form
      setFormData({
        code: '',
        name: '',
        phone: '',
        type: '',
        time: '',
        ampm: 'AM',
        description: ''
      })
      setDate(new Date())
      setFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (error) {
      toast.error('Error al enviar la solicitud')
    }
  }

  const today = new Date()
  const currentYear = today.getFullYear()
  const colombianHolidays = getColombianHolidays(currentYear)
  const startOfCurrentWeek = startOfWeek(today, { weekStartsOn: 1 })
  const endOfCurrentWeek = endOfWeek(today, { weekStartsOn: 1 })
  const nextMonday = addDays(endOfCurrentWeek, 1)

  const availableDates = eachDayOfInterval({
    start: startOfCurrentWeek,
    end: isMonday(nextMonday) && colombianHolidays.some(holiday => isSameDay(holiday, nextMonday))
      ? nextMonday
      : endOfCurrentWeek
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-3xl shadow-xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-gray-800">Nueva Solicitud</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input
              id="code"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value })}
              className="bg-gray-50"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="name">Nombre y Apellido</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="bg-gray-50"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono de contacto</Label>
          <Input
            id="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="bg-gray-50"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Tipo de novedad</Label>
          <Select
            value={formData.type}
            onValueChange={(value) => setFormData({ ...formData, type: value })}
          >
            <SelectTrigger className="bg-gray-50">
              <SelectValue placeholder="Seleccione una opción" />
            </SelectTrigger>
            <SelectContent>
              {TIPOS_NOVEDAD.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Fecha de solicitud</Label>
          <div className="bg-gray-50 rounded-lg p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => {
                const isInAvailableDates = availableDates.some(d => isSameDay(d, date))
                const isPastDate = isBefore(date, startOfCurrentWeek)
                const isFutureDate = isAfter(date, availableDates[availableDates.length - 1])
                return !isInAvailableDates || isPastDate || isFutureDate
              }}
              className="rounded-md border"
              locale={es}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="time">Hora de la novedad</Label>
          <div className="flex space-x-2">
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="bg-gray-50 flex-grow"
              required
            />
            <Select
              value={formData.ampm}
              onValueChange={(value) => setFormData({ ...formData, ampm: value })}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue placeholder="AM/PM" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AM">AM</SelectItem>
                <SelectItem value="PM">PM</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descripción de la solicitud</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-gray-50 min-h-[100px]"
            placeholder="Ingrese el detalle de tu solicitud"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="file">Adjuntar archivo (solo imágenes o PDF)</Label>
          <div 
            className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors ${
              file ? 'border-green-500 bg-green-50' : fileError ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              type="file"
              id="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*,.pdf"
              onChange={handleFileChange}
            />
            <div className="flex flex-col items-center gap-2">
              {file ? (
                <>
                  <Check className="h-8 w-8 text-green-500" />
                  <span className="text-sm text-green-600">{file.name}</span>
                </>
              ) : fileError ? (
                <>
                  <X className="h-8 w-8 text-red-500" />
                  <span className="text-sm text-red-600">{fileError}</span>
                </>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-500">
                    Haz clic para adjuntar un archivo
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          Enviar Solicitud
        </Button>
      </form>
    </motion.div>
  )
}

