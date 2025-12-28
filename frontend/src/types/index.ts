export type Priority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskStatus = 'pending' | 'in_progress' | 'completed'

export interface Document {
  name: string
  url: string
}

export interface Task {
  id: string
  title: string
  description?: string
  priority: Priority
  status: TaskStatus
  estimatedTime?: number // в часах
  delegatedTo?: string
  dueDate?: string
  documents?: Document[]
  createdAt: string
  updatedAt: string
}

export type EventType = 'period' | 'ovulation' | 'sex'

export interface CalendarEvent {
  id: string
  date: string
  type: EventType
  notes?: string
  createdAt: string
  updatedAt: string
}

