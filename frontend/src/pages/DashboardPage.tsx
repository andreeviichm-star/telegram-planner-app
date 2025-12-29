import { useState, useEffect } from 'react'
import { Menu, CheckSquare, Video } from 'lucide-react'
import MenuModal from '../components/MenuModal'
import { Task } from '../types'
import { getTasks } from '../services/api'
import { getMeetings } from '../services/api'
import { Meeting } from '../types'
import './DashboardPage.css'

interface DashboardPageProps {
  onNavigate?: (page: 'dashboard' | 'tasks' | 'calendar' | 'meetings' | 'budget') => void
}

export default function DashboardPage({ onNavigate }: DashboardPageProps = {}) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [tasksData, meetingsData] = await Promise.all([
          getTasks({}),
          getMeetings()
        ])
        setTasks(tasksData || [])
        setMeetings(meetingsData || [])
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      }
    }
    loadData()
  }, [])

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0]

  // Filter tasks due today
  const todayTasks = tasks.filter(task => {
    if (!task.dueDate) return false
    return task.dueDate === today && task.status !== 'completed'
  })

  // Filter meetings today
  const todayMeetings = meetings.filter(meeting => {
    if (!meeting.date) return false
    return meeting.date === today
  })

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1 className="page-title">FLUXPLANNER</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <div className="section-header">
            <CheckSquare size={20} />
            <h2>Задачи на сегодня</h2>
          </div>
          {todayTasks.length > 0 ? (
            <div className="dashboard-list">
              {todayTasks.map(task => (
                <div key={task.id} className="dashboard-item glass">
                  <div className="dashboard-item-title">{task.title}</div>
                  {task.description && (
                    <div className="dashboard-item-subtitle">{task.description}</div>
                  )}
                  <div className="dashboard-item-meta">
                    <span className={`priority-badge priority-${task.priority}`}>
                      {task.priority === 'urgent' ? 'Срочно' : 
                       task.priority === 'high' ? 'Высокий' :
                       task.priority === 'medium' ? 'Средний' : 'Низкий'}
                    </span>
                    <span className={`status-badge status-${task.status}`}>
                      {task.status === 'pending' ? 'Ожидает' :
                       task.status === 'in_progress' ? 'В работе' : 'Выполнено'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty glass">
              <p>Нет задач на сегодня</p>
            </div>
          )}
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <Video size={20} />
            <h2>Созвоны на сегодня</h2>
          </div>
          {todayMeetings.length > 0 ? (
            <div className="dashboard-list">
              {todayMeetings.map(meeting => (
                <div key={meeting.id} className="dashboard-item glass">
                  <div className="dashboard-item-title">{meeting.title}</div>
                  {meeting.time && (
                    <div className="dashboard-item-subtitle">
                      {meeting.time} • {meeting.duration} мин • {meeting.platform}
                    </div>
                  )}
                  {meeting.description && (
                    <div className="dashboard-item-subtitle">{meeting.description}</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty glass">
              <p>Нет созвонов на сегодня</p>
            </div>
          )}
        </div>
      </div>

      <button 
        className="menu-btn-fab glass" 
        onClick={() => setIsMenuModalOpen(true)}
      >
        <Menu size={20} />
        <span>Меню</span>
      </button>

      {isMenuModalOpen && (
        <MenuModal
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          currentPath="dashboard"
          onNavigate={onNavigate}
        />
      )}
    </div>
  )
}

