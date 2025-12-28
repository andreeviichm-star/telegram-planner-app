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

export type MeetingPlatform = 'zoom' | 'telegram' | 'whatsapp' | 'other'

export interface Meeting {
  id: string
  title: string
  description?: string
  date: string
  duration: number // в минутах
  platform: MeetingPlatform
  link?: string
  participants?: string[]
  reminder24h?: boolean
  createdAt: string
  updatedAt: string
}

export type TransactionType = 'income' | 'expense' | 'fundraising'

export interface BudgetTransaction {
  id: string
  type: TransactionType
  title: string
  description?: string
  amount: number
  category?: string
  date: string
  createdAt: string
  updatedAt: string
}

