import { useState, useEffect } from 'react'
import { Plus, Filter, Menu } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import FilterModal from '../components/FilterModal'
import MenuModal from '../components/MenuModal'
import BudgetWidget from '../components/BudgetWidget'
import { Task, Priority } from '../types'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'
import './TasksPage.css'

interface TasksPageProgressiveProps {
  onNavigate?: (page: 'tasks' | 'calendar' | 'meetings' | 'budget') => void
}

export default function TasksPageProgressive({ onNavigate }: TasksPageProgressiveProps = {}) {
  console.log('📋 TasksPageProgressive: Function called')
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<{ priority?: Priority; status?: string }>({})

  useEffect(() => {
    console.log('📋 TasksPageProgressive: useEffect - loading tasks')
    const loadTasks = async () => {
      try {
        const data = await getTasks(filter)
        setTasks(data || [])
        console.log('📋 TasksPageProgressive: Tasks loaded:', data?.length || 0)
      } catch (error) {
        console.error('Failed to load tasks:', error)
        setTasks([])
      }
    }
    loadTasks()
  }, [filter])

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
      // Reload tasks
      const data = await getTasks(filter)
      setTasks(data || [])
    } catch (error) {
      console.error('Failed to save task:', error)
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      // Reload tasks
      const data = await getTasks(filter)
      setTasks(data || [])
    } catch (error) {
      console.error('Failed to delete task:', error)
    }
  }

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    totalTime: tasks.reduce((sum, t) => sum + (t.estimatedTime || 0), 0)
  }

  console.log('📋 TasksPageProgressive: Returning JSX')
  
  return (
    <div 
      className="tasks-page" 
      style={{
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        width: '100%',
        minHeight: '100vh',
        padding: '20px',
      }}
    >
      <div className="page-header">
        <button
          className="menu-btn glass-light"
          onClick={() => setIsMenuModalOpen(true)}
          style={{
            padding: '10px',
            border: 'none',
            borderRadius: '12px',
            color: '#FFFFFF',
            cursor: 'pointer',
            background: 'rgba(22, 33, 62, 0.4)',
          }}
        >
          <Menu size={24} />
        </button>
        <h1 className="page-title">FLUXPLANNER</h1>
        <button
          className="filter-btn glass-light"
          onClick={() => setIsFilterModalOpen(true)}
          style={{
            padding: '10px',
            border: 'none',
            borderRadius: '12px',
            color: '#FFFFFF',
            cursor: 'pointer',
            background: 'rgba(22, 33, 62, 0.4)',
          }}
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
        {tasks.length === 0 && (
          <div className="empty-state glass">
            <p>Нет задач</p>
            <p className="empty-hint">Нажмите + чтобы создать задачу</p>
          </div>
        )}
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={handleEditTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>

      <button 
        className="fab glass" 
        onClick={handleCreateTask}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          border: 'none',
          color: '#FFFFFF',
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          boxShadow: '0 4px 20px rgba(139, 92, 246, 0.4)',
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
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
          currentPath="tasks"
          onNavigate={onNavigate}
        />
      )}
    </div>
  )
}

