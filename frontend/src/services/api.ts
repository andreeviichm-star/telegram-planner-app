import axios from 'axios'
import { Task, CalendarEvent } from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Tasks API
export const getTasks = async (filter?: { priority?: string; status?: string }) => {
  const params = new URLSearchParams()
  if (filter?.priority) params.append('priority', filter.priority)
  if (filter?.status) params.append('status', filter.status)
  
  const response = await api.get<Task[]>(`/tasks?${params.toString()}`)
  return response.data
}

export const createTask = async (task: Task) => {
  const response = await api.post<Task>('/tasks', task)
  return response.data
}

export const updateTask = async (id: string, task: Partial<Task>) => {
  const response = await api.put<Task>(`/tasks/${id}`, task)
  return response.data
}

export const deleteTask = async (id: string) => {
  await api.delete(`/tasks/${id}`)
}

// Calendar API
export const getCalendarEvents = async (start: Date, end: Date) => {
  const params = new URLSearchParams({
    start: start.toISOString(),
    end: end.toISOString()
  })
  const response = await api.get<CalendarEvent[]>(`/calendar/events?${params.toString()}`)
  return response.data
}

export const createCalendarEvent = async (event: CalendarEvent) => {
  const response = await api.post<CalendarEvent>('/calendar/events', event)
  return response.data
}

export const updateCalendarEvent = async (id: string, event: Partial<CalendarEvent>) => {
  const response = await api.post<CalendarEvent>(`/calendar/events/${id}`, event)
  return response.data
}

export const deleteCalendarEvent = async (id: string) => {
  await api.delete(`/calendar/events/${id}`)
}

