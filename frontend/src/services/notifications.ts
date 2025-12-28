import axios from 'axios'
import { Task, Meeting } from '../types'

// Normalize API URL
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
  timeout: 10000,
})

// Проверка задач с истекающим сроком (за 24 часа)
export async function checkTaskNotifications(tasks: Task[]): Promise<void> {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const tasksToNotify = tasks.filter(task => {
    if (!task.dueDate || task.status === 'completed') return false
    
    const dueDate = new Date(task.dueDate)
    const timeDiff = dueDate.getTime() - now.getTime()
    const hoursUntilDue = timeDiff / (1000 * 60 * 60)
    
    // Уведомление за 24 часа (от 23 до 25 часов до дедлайна)
    return hoursUntilDue >= 23 && hoursUntilDue <= 25
  })

  for (const task of tasksToNotify) {
    await createTaskNotification(task)
  }
}

// Проверка созвонов (за 24 часа)
export async function checkMeetingNotifications(meetings: Meeting[]): Promise<void> {
  const now = new Date()
  const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)

  const meetingsToNotify = meetings.filter(meeting => {
    if (!meeting.reminder24h) return false
    
    const meetingDate = new Date(meeting.date)
    const timeDiff = meetingDate.getTime() - now.getTime()
    const hoursUntilMeeting = timeDiff / (1000 * 60 * 60)
    
    // Уведомление за 24 часа (от 23 до 25 часов до созвона)
    return hoursUntilMeeting >= 23 && hoursUntilMeeting <= 25
  })

  for (const meeting of meetingsToNotify) {
    await createMeetingNotification(meeting)
  }
}

async function createTaskNotification(task: Task): Promise<void> {
  try {
    const scheduledAt = new Date(new Date(task.dueDate!).getTime() - 24 * 60 * 60 * 1000)
    
    await api.post('/notifications', {
      userId: 'default',
      type: 'task_reminder',
      title: `Задача "${task.title}"`,
      message: `Срок выполнения истекает через 24 часа`,
      taskId: task.id,
      scheduledAt: scheduledAt.toISOString()
    })
    
    if (import.meta.env.DEV) {
      console.log(`Notification scheduled for task: ${task.title}`)
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error creating task notification:', error)
    }
  }
}

async function createMeetingNotification(meeting: Meeting): Promise<void> {
  try {
    const scheduledAt = new Date(new Date(meeting.date).getTime() - 24 * 60 * 60 * 1000)
    
    await api.post('/notifications', {
      userId: 'default',
      type: 'meeting_reminder',
      title: `Созвон "${meeting.title}"`,
      message: `Созвон через 24 часа в ${meeting.platform}`,
      meetingId: meeting.id,
      scheduledAt: scheduledAt.toISOString()
    })
    
    if (import.meta.env.DEV) {
      console.log(`Notification scheduled for meeting: ${meeting.title}`)
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error('Error creating meeting notification:', error)
    }
  }
}

// Периодическая проверка уведомлений
export function startNotificationChecker(
  getTasks: () => Promise<Task[]>,
  getMeetings: () => Promise<Meeting[]>
): void {
  // Проверка каждые 30 минут
  setInterval(async () => {
    try {
      const tasks = await getTasks()
      await checkTaskNotifications(tasks)
      
      const meetings = await getMeetings()
      await checkMeetingNotifications(meetings)
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Error checking notifications:', error)
      }
    }
  }, 30 * 60 * 1000) // 30 минут
}

