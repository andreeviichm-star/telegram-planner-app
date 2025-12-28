import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Plus, Filter, Menu } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import FilterModal from '../components/FilterModal'
import MenuModal from '../components/MenuModal'
import BudgetWidget from '../components/BudgetWidget'
import { Task, Priority } from '../types'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'
import './TasksPage.css'

export default function TasksPage() {
  const location = useLocation()
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<{ priority?: Priority; status?: string }>({})

  useEffect(() => {
    console.log('📋 TasksPage component mounted')
  }, [])

  useEffect(() => {
    loadTasks()
  }, [filter])

  useEffect(() => {
    // Проверка уведомлений для задач
    const checkNotifications = async () => {
      if (tasks.length > 0) {
        const { checkTaskNotifications } = await import('../services/notifications')
        await checkTaskNotifications(tasks)
      }
    }
    checkNotifications()
  }, [tasks])

  const loadTasks = async () => {
    try {
      const data = await getTasks(filter)
      setTasks(data || [])
    } catch (error) {
      console.error('Ошибка загрузки задач:', error)
      // Показываем пустой список, если backend недоступен
      setTasks([])
    }
  }

  const handleCreateTask = () => {
    setSelectedTask(null)
    setIsTaskModalOpen(true)
  }

  const handleEditTask = (task: Task) => {
    setSelectedTask(task)
    setIsTaskModalOpen(true)
  }

  const handleSaveTask = async (taskData: Partial<Task>) => {
    try {
      if (selectedTask) {
        await updateTask(selectedTask.id, taskData)
      } else {
        await createTask(taskData as Task)
      }
      setIsTaskModalOpen(false)
      setSelectedTask(null)
      loadTasks()
    } catch (error) {
      console.error('Ошибка сохранения задачи:', error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      loadTasks()
    } catch (error) {
      console.error('Ошибка удаления задачи:', error)
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    totalTime: tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0)
  }

  return (
    <div className="tasks-page">
      <div className="page-header">
        <button
          className="menu-btn glass-light"
          onClick={() => setIsMenuModalOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="page-title">FLUXPLANNER</h1>
        <button
          className="filter-btn glass-light"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter size={20} />
        </button>
      </div>

      <div className="stats-grid">
        <div className="stat-card glass">
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Всего задач</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-value">{stats.completed}</div>
          <div className="stat-label">Выполнено</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-value">{stats.inProgress}</div>
          <div className="stat-label">В работе</div>
        </div>
        <div className="stat-card glass">
          <div className="stat-value">{stats.totalTime}h</div>
          <div className="stat-label">Время</div>
        </div>
      </div>

      <BudgetWidget />

      <div className="tasks-list">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
        {tasks.length === 0 && (
          <div className="empty-state glass">
            <p>Нет задач</p>
            <p className="empty-hint">Нажмите + чтобы создать задачу</p>
          </div>
        )}
      </div>

      <button className="fab glass" onClick={handleCreateTask}>
        <Plus size={24} />
      </button>

      {isTaskModalOpen && (
        <TaskModal
          task={selectedTask}
          onClose={() => {
            setIsTaskModalOpen(false)
            setSelectedTask(null)
          }}
          onSave={handleSaveTask}
        />
      )}

      {isFilterModalOpen && (
        <FilterModal
          filter={filter}
          onClose={() => setIsFilterModalOpen(false)}
          onApply={setFilter}
        />
      )}

      {isMenuModalOpen && (
        <MenuModal
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          currentPath={location.pathname}
        />
      )}
    </div>
  )
}

