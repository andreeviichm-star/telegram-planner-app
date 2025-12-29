import { useState, useEffect } from 'react'
import { Plus, Filter, Menu } from 'lucide-react'
import TaskCard from '../components/TaskCard'
import TaskModal from '../components/TaskModal'
import FilterModal from '../components/FilterModal'
import MenuModal from '../components/MenuModal'
import { Task, Priority } from '../types'
import { getTasks, createTask, updateTask, deleteTask } from '../services/api'
import './TasksPage.css'

export default function TasksPage() {
  console.log('📋 TasksPage function called - component is rendering!')
  
  const [tasks, setTasks] = useState<Task[]>([])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [filter, setFilter] = useState<{ priority?: Priority; status?: string }>({})

  useEffect(() => {
    console.log('📋 TasksPage mounted')
    
    // Simple load tasks
    const loadTasks = async () => {
      try {
        const data = await getTasks(filter)
        setTasks(data || [])
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

  console.log('📋 TasksPage: Returning JSX now')
  
  return (
    <div 
      className="tasks-page" 
      data-testid="tasks-page"
      style={{
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        width: '100%',
        minHeight: '100vh',
      }}
    >
      
      <div className="page-header">
        <h1 className="page-title">Задачи</h1>
        <button
          className="filter-btn glass-light"
          onClick={() => setIsFilterModalOpen(true)}
        >
          <Filter size={20} />
        </button>
      </div>

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

      <button 
        className="menu-btn-fab glass" 
        onClick={() => setIsMenuModalOpen(true)}
      >
        <Menu size={24} />
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
          currentPath="/"
        />
      )}
    </div>
  )
}
