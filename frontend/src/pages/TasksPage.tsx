import { useState, useEffect, useCallback } from 'react'
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
  console.log('📋 TasksPage function called - component is rendering!')
  
  const location = useLocation()
  console.log('📋 TasksPage location:', location.pathname, location.hash)
  
  const [tasks, setTasks] = useState<Task[]>([])
  
  useEffect(() => {
    console.log('📋 TasksPage mounted (useEffect)')
    
    // Force visibility check
    setTimeout(() => {
      const tasksPage = document.querySelector('.tasks-page')
      const pageHeader = document.querySelector('.page-header')
      const pageTitle = document.querySelector('.page-title')
      
      console.log('📋 TasksPage elements:', {
        tasksPage: !!tasksPage,
        pageHeader: !!pageHeader,
        pageTitle: !!pageTitle,
        tasksPageDisplay: tasksPage ? window.getComputedStyle(tasksPage).display : 'N/A',
        tasksPageVisibility: tasksPage ? window.getComputedStyle(tasksPage).visibility : 'N/A',
        tasksPageOpacity: tasksPage ? window.getComputedStyle(tasksPage).opacity : 'N/A',
        tasksPageWidth: tasksPage ? window.getComputedStyle(tasksPage).width : 'N/A',
        tasksPageHeight: tasksPage ? window.getComputedStyle(tasksPage).height : 'N/A',
      })
      
      // Force visibility if hidden
      if (tasksPage) {
        const style = window.getComputedStyle(tasksPage)
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
          console.warn('⚠️ TasksPage is hidden! Forcing visibility...')
          ;(tasksPage as HTMLElement).style.setProperty('display', 'block', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('visibility', 'visible', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('opacity', '1', 'important')
        }
      }
    }, 1000)
  }, [])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<{ priority?: Priority; status?: string }>({})

  const loadTasks = useCallback(async () => {
    try {
      const data = await getTasks(filter)
      setTasks(data || [])
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load tasks:', error)
      }
      setTasks([])
    }
  }, [filter])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

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
      if (import.meta.env.DEV) {
        console.error('Failed to save task:', error)
      }
    }
  }

  const handleDeleteTask = async (id: string) => {
    try {
      await deleteTask(id)
      loadTasks()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete task:', error)
      }
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
      {/* Debug test element */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        background: 'red',
        color: 'white',
        padding: '5px',
        zIndex: 99999,
        fontSize: '12px'
      }}>
        TEST: TasksPage rendered
      </div>
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

