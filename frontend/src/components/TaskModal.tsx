import { useState, useEffect, FormEvent } from 'react'
import { Calendar } from 'lucide-react'
import { Task, Priority } from '../types'
import './TaskModal.css'

interface TaskModalProps {
  task: Task | null
  onClose: () => void
  onSave: (taskData: Partial<Task>) => void
}

const priorities: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Низкий' },
  { value: 'medium', label: 'Средний' },
  { value: 'high', label: 'Высокий' },
  { value: 'urgent', label: 'Срочный' }
]

export default function TaskModal({ task, onSave, onClose }: TaskModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending')

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setDueDate(task.dueDate || '')
      setStatus(task.status)
    }
  }, [task])

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    onSave({
      title,
      description,
      priority,
      dueDate: dueDate || undefined,
      status,
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{task ? 'Редактировать задачу' : 'Новая задача'}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Название задачи *</label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Описание</label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              className="form-input"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Приоритет</label>
              <select
                value={priority}
                onChange={e => setPriority(e.target.value as Priority)}
                className="form-input"
              >
                {priorities.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Статус</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as any)}
                className="form-input"
              >
                <option value="pending">Ожидает</option>
                <option value="in_progress">В работе</option>
                <option value="completed">Выполнено</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <Calendar size={14} /> Срок
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              className="form-input"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Отмена
            </button>
            <button type="submit" className="btn-primary">
              Сохранить
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

