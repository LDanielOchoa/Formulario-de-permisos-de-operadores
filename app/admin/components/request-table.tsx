'use client'

import { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useRequestsStore, type Request } from '@/store/requests-store'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { toast } from 'sonner'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface RequestsTableProps {
  requests: Request[]
}

export function RequestsTable({ requests }: RequestsTableProps) {
  const updateRequestStatus = useRequestsStore((state) => state.updateRequestStatus)
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)
  const [feedback, setFeedback] = useState('')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    code: '',
    type: '',
  })

  const handleStatusUpdate = (id: string, newStatus: Request['status']) => {
    try {
      updateRequestStatus(id, newStatus, feedback)
      toast.success(`Solicitud ${newStatus === 'approved' ? 'aprobada' : 'rechazada'} correctamente`)
      setIsDialogOpen(false)
      setFeedback('')
    } catch (error) {
      toast.error('Error al actualizar el estado de la solicitud')
    }
  }

  const filteredRequests = requests.filter(request => {
    const requestDate = parseISO(request.date)
    return (
      (!filters.startDate || requestDate >= parseISO(filters.startDate)) &&
      (!filters.endDate || requestDate <= parseISO(filters.endDate)) &&
      (!filters.code || request.code.includes(filters.code)) &&
      (!filters.type || filters.type === 'all' || request.type === filters.type)
    )
  })

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <Label htmlFor="startDate">Fecha Inicial</Label>
          <Input
            id="startDate"
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="endDate">Fecha Final</Label>
          <Input
            id="endDate"
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="code">Código</Label>
          <Input
            id="code"
            value={filters.code}
            onChange={(e) => setFilters({ ...filters, code: e.target.value })}
            placeholder="Filtrar por código"
          />
        </div>
        <div>
          <Label htmlFor="type">Tipo</Label>
          <Select value={filters.type} onValueChange={(value) => setFilters({ ...filters, type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="descanso">Descanso</SelectItem>
              <SelectItem value="audiencia">Audiencia</SelectItem>
              <SelectItem value="citaMedica">Cita Médica</SelectItem>
              <SelectItem value="licencia">Licencia</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>{request.code}</TableCell>
              <TableCell>{request.name}</TableCell>
              <TableCell>{request.type}</TableCell>
              <TableCell>
                {format(parseISO(request.date), 'PPP', { locale: es })}
              </TableCell>
              <TableCell>
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
              </TableCell>
              <TableCell>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedRequest(request)
                    setFeedback(request.feedback || '')
                    setIsDialogOpen(true)
                  }}
                >
                  Revisar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Revisar Solicitud</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {selectedRequest && (
              <>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Nombre
                  </Label>
                  <Input id="name" value={selectedRequest.name} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Tipo
                  </Label>
                  <Input id="type" value={selectedRequest.type} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Fecha
                  </Label>
                  <Input id="date" value={format(parseISO(selectedRequest.date), 'PPP', { locale: es })} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="description" className="text-right">
                    Descripción
                  </Label>
                  <Textarea id="description" value={selectedRequest.description} className="col-span-3" readOnly />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="feedback" className="text-right">
                    Comentarios
                  </Label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="col-span-3"
                    placeholder="Ingrese sus comentarios aquí..."
                  />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedRequest && handleStatusUpdate(selectedRequest.id, 'rejected')}
            >
              Rechazar
            </Button>
            <Button
              onClick={() => selectedRequest && handleStatusUpdate(selectedRequest.id, 'approved')}
            >
              Aprobar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

