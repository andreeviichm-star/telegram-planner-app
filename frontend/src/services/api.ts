import axios from 'axios'
import { Task, CalendarEvent, Meeting, BudgetTransaction } from '../types'

/**
 * Normalize API URL - ensure it ends with /api
 */
const normalizeApiUrl = (url: string): string => {
  if (!url) return 'http://localhost:3001/api'
  if (url.endsWith('/api')) return url
  return url.endsWith('/') ? `${url}api` : `${url}/api`
}

const API_URL = normalizeApiUrl(import.meta.env.VITE_API_URL || 'http://localhost:3001/api')

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
})

// Request interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Use console.error directly to avoid circular dependency issues
    if (import.meta.env.DEV) {
      console.error('API Error:', error.message)
    }
    return Promise.reject(error)
  }
)

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

// Meetings API
export const getMeetings = async () => {
  const response = await api.get<Meeting[]>('/meetings')
  return response.data
}

export const createMeeting = async (meeting: Meeting) => {
  const response = await api.post<Meeting>('/meetings', meeting)
  return response.data
}

export const updateMeeting = async (id: string, meeting: Partial<Meeting>) => {
  const response = await api.put<Meeting>(`/meetings/${id}`, meeting)
  return response.data
}

export const deleteMeeting = async (id: string) => {
  await api.delete(`/meetings/${id}`)
}

// Budget API
export const getTransactions = async () => {
  const response = await api.get<BudgetTransaction[]>('/budget/transactions')
  return response.data
}

export const createTransaction = async (transaction: BudgetTransaction) => {
  const response = await api.post<BudgetTransaction>('/budget/transactions', transaction)
  return response.data
}

export const updateTransaction = async (id: string, transaction: Partial<BudgetTransaction>) => {
  const response = await api.put<BudgetTransaction>(`/budget/transactions/${id}`, transaction)
  return response.data
}

export const deleteTransaction = async (id: string) => {
  await api.delete(`/budget/transactions/${id}`)
}

