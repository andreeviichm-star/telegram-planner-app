import { Edit, Trash2, Clock, Users, FileText } from 'lucide-react'
import { Task, Priority } from '../types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import './TaskCard.css'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

const priorityColors: Record<Priority, string> = {
  low: '#4ade80',
  medium: '#fbbf24',
  high: '#f87171',
  urgent: '#ef4444'
}

const priorityLabels: Record<Priority, string> = {
  low: 'Низкий',
  medium: 'Средний',
  high: 'Высокий',
  urgent: 'Срочный'
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const priorityColor = priorityColors[task.priority]

  return (
    <div className="task-card glass fade-in">
      <div className="task-header">
        <div className="task-title-row">
          <h3 className="task-title">{task.title}</h3>
          <span
            className="priority-badge"
            style={{ backgroundColor: `${priorityColor}20`, color: priorityColor }}
          >
            {priorityLabels[task.priority]}
          </span>
        </div>
        <div className="task-actions">
          <button className="icon-btn" onClick={() => onEdit(task)}>
            <Edit size={16} />
          </button>
          <button className="icon-btn" onClick={() => onDelete(task.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {task.description && (
        <p className="task-description">{task.description}</p>
      )}

      <div className="task-meta">
        {task.estimatedTime && (
          <div className="meta-item">
            <Clock size={14} />
            <span>{task.estimatedTime}ч</span>
          </div>
        )}
        {task.delegatedTo && (
          <div className="meta-item">
            <Users size={14} />
            <span>{task.delegatedTo}</span>
          </div>
        )}
        {task.documents && task.documents.length > 0 && (
          <div className="meta-item">
            <FileText size={14} />
            <span>{task.documents.length}</span>
          </div>
        )}
        {task.dueDate && (
          <div className="meta-item">
            <span>{format(new Date(task.dueDate), 'd MMM', { locale: ru })}</span>
          </div>
        )}
      </div>

      {task.status === 'completed' && (
        <div className="task-status-bar completed" />
      )}
      {task.status === 'in_progress' && (
        <div className="task-status-bar in-progress" />
      )}
    </div>
  )
}

