'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line } from "recharts"
import { type Request } from '@/store/requests-store'
import { format, parseISO, startOfWeek, endOfWeek, eachWeekOfInterval, eachMonthOfInterval, eachYearOfInterval, startOfYear, endOfYear, getYear, getMonth, getWeek, getDate } from 'date-fns'
import { es } from 'date-fns/locale'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface StatisticsProps {
  requests: Request[]
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC0CB', '#A52A2A', '#DDA0DD', '#FF69B4'];

export function Statistics({ requests }: StatisticsProps) {
  const [timeFrame, setTimeFrame] = useState<'day' | 'week' | 'month' | 'year'>('month')
  const [selectedYear, setSelectedYear] = useState<string>('all')
  const [selectedMonth, setSelectedMonth] = useState<string>('all')
  const [selectedWeek, setSelectedWeek] = useState<string>('all')
  const [selectedDay, setSelectedDay] = useState<string>('all')

  const years = useMemo(() => {
    const yearsSet = new Set(requests.map(r => getYear(parseISO(r.date))))
    return Array.from(yearsSet).sort((a, b) => b - a)
  }, [requests])

  const months = useMemo(() => {
    if (selectedYear === 'all') return []
    const monthsSet = new Set(requests
      .filter(r => getYear(parseISO(r.date)) === parseInt(selectedYear))
      .map(r => getMonth(parseISO(r.date))))
    return Array.from(monthsSet).sort((a, b) => a - b)
  }, [requests, selectedYear])

  const weeks = useMemo(() => {
    if (selectedYear === 'all' || selectedMonth === 'all') return []
    const weeksSet = new Set(requests
      .filter(r => {
        const date = parseISO(r.date)
        return getYear(date) === parseInt(selectedYear) && getMonth(date) === parseInt(selectedMonth)
      })
      .map(r => getWeek(parseISO(r.date))))
    return Array.from(weeksSet).sort((a, b) => a - b)
  }, [requests, selectedYear, selectedMonth])

  const days = useMemo(() => {
    if (selectedYear === 'all' || selectedMonth === 'all' || selectedWeek === 'all') return []
    const daysSet = new Set(requests
      .filter(r => {
        const date = parseISO(r.date)
        return getYear(date) === parseInt(selectedYear) && 
               getMonth(date) === parseInt(selectedMonth) && 
               getWeek(date) === parseInt(selectedWeek)
      })
      .map(r => getDate(parseISO(r.date))))
    return Array.from(daysSet).sort((a, b) => a - b)
  }, [requests, selectedYear, selectedMonth, selectedWeek])

  const filteredRequests = useMemo(() => {
    return requests.filter(request => {
      const date = parseISO(request.date)
      return (selectedYear === 'all' || getYear(date) === parseInt(selectedYear)) &&
             (selectedMonth === 'all' || getMonth(date) === parseInt(selectedMonth)) &&
             (selectedWeek === 'all' || getWeek(date) === parseInt(selectedWeek)) &&
             (selectedDay === 'all' || getDate(date) === parseInt(selectedDay))
    })
  }, [requests, selectedYear, selectedMonth, selectedWeek, selectedDay])

  const totalRequests = filteredRequests.length
  const approvedRequests = filteredRequests.filter(r => r.status === 'approved').length
  const rejectedRequests = filteredRequests.filter(r => r.status === 'rejected').length
  const pendingRequests = filteredRequests.filter(r => r.status === 'pending').length

  const getChartData = () => {
    if (filteredRequests.length === 0) {
      return []
    }

    let intervals
    let formatStr

    const startDate = filteredRequests[0].date
    const endDate = filteredRequests[filteredRequests.length - 1].date

    switch (timeFrame) {
      case 'day':
        intervals = eachWeekOfInterval({ start: parseISO(startDate), end: parseISO(endDate) })
        formatStr = 'dd/MM'
        break
      case 'week':
        intervals = eachWeekOfInterval({ start: parseISO(startDate), end: parseISO(endDate) })
        formatStr = "'Sem' w"
        break
      case 'month':
        intervals = eachMonthOfInterval({ start: parseISO(startDate), end: parseISO(endDate) })
        formatStr = 'MMM'
        break
      case 'year':
        intervals = eachYearOfInterval({ start: parseISO(startDate), end: parseISO(endDate) })
        formatStr = 'yyyy'
        break
    }

    return intervals.map(interval => {
      const start = timeFrame === 'year' ? startOfYear(interval) : startOfWeek(interval)
      const end = timeFrame === 'year' ? endOfYear(interval) : endOfWeek(interval)
      
      const periodRequests = filteredRequests.filter(request => {
        const requestDate = parseISO(request.date)
        return requestDate >= start && requestDate <= end
      })

      return {
        name: format(interval, formatStr, { locale: es }),
        approved: periodRequests.filter(r => r.status === 'approved').length,
        rejected: periodRequests.filter(r => r.status === 'rejected').length,
        pending: periodRequests.filter(r => r.status === 'pending').length,
        total: periodRequests.length,
      }
    })
  }

  const chartData = getChartData()

  const operatorStats = filteredRequests.reduce((acc, request) => {
    acc[request.code] = (acc[request.code] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topOperators = Object.entries(operatorStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([code, count]) => ({ name: code, value: count }))

  const typeStats = filteredRequests.reduce((acc, request) => {
    acc[request.type] = (acc[request.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topTypes = Object.entries(typeStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([type, count]) => ({ name: type, value: count }))

  const dateStats = filteredRequests.reduce((acc, request) => {
    const date = format(parseISO(request.date), 'yyyy-MM-dd')
    acc[date] = (acc[date] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const topDates = Object.entries(dateStats)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([date, count]) => ({ name: format(parseISO(date), 'dd/MM/yyyy'), value: count }))

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div>
          <Label>Año</Label>
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar año" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {years.map(year => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Mes</Label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth} disabled={selectedYear === 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {months.map(month => (
                <SelectItem key={month} value={month.toString()}>
                  {format(new Date(2021, month, 1), 'MMMM', { locale: es })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Semana</Label>
          <Select value={selectedWeek} onValueChange={setSelectedWeek} disabled={selectedYear === 'all' || selectedMonth === 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar semana" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {weeks.map(week => (
                <SelectItem key={week} value={week.toString()}>Semana {week}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Día</Label>
          <Select value={selectedDay} onValueChange={setSelectedDay} disabled={selectedYear === 'all' || selectedMonth === 'all' || selectedWeek === 'all'}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar día" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {days.map(day => (
                <SelectItem key={day} value={day.toString()}>{day}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Período</Label>
          <Select value={timeFrame} onValueChange={(value: 'day' | 'week' | 'month' | 'year') => setTimeFrame(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="day">Por día</SelectItem>
              <SelectItem value="week">Por semana</SelectItem>
              <SelectItem value="month">Por mes</SelectItem>
              <SelectItem value="year">Por año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Solicitudes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalRequests}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aprobadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{approvedRequests}</div>
            <p className="text-xs text-muted-foreground">
              {totalRequests > 0 ? `${((approvedRequests / totalRequests) * 100).toFixed(1)}% del total` : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rechazadas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rejectedRequests}</div>
            <p className="text-xs text-muted-foreground">
              {totalRequests > 0 ? `${((rejectedRequests / totalRequests) * 100).toFixed(1)}% del total` : 'N/A'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingRequests}</div>
            <p className="text-xs text-muted-foreground">
              {totalRequests > 0 ? `${((pendingRequests / totalRequests) * 100).toFixed(1)}% del total` : 'N/A'}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estadísticas de Solicitudes por {timeFrame === 'day' ? 'Día' : timeFrame === 'week' ? 'Semana' : timeFrame === 'month' ? 'Mes' : 'Año'}</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="approved" name="Aprobadas" fill="#16a34a" />
                <Bar dataKey="rejected" name="Rechazadas" fill="#dc2626" />
                <Bar dataKey="pending" name="Pendientes" fill="#d97706" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No hay datos disponibles para el período seleccionado</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top 5 Operadores con más Solicitudes</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {topOperators.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topOperators}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {topOperators.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No hay datos disponibles para el período seleccionado</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top 5 Tipos de Solicitudes</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            {topTypes.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={topTypes}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {topTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No hay datos disponibles para el período seleccionado</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top 5 Fechas con más Solicitudes</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {topDates.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={topDates}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="value" name="Solicitudes" stroke="#8884d8" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">No hay datos disponibles para el período seleccionado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

