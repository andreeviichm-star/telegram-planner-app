import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { Clock, Users, FileText, Calendar } from 'lucide-react'
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
  const [estimatedTime, setEstimatedTime] = useState('')
  const [delegatedTo, setDelegatedTo] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [status, setStatus] = useState<'pending' | 'in_progress' | 'completed'>('pending')
  const [documents, setDocuments] = useState<File[]>([])

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || '')
      setPriority(task.priority)
      setEstimatedTime(task.estimatedTime?.toString() || '')
      setDelegatedTo(task.delegatedTo || '')
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
      estimatedTime: estimatedTime ? parseInt(estimatedTime) : undefined,
      delegatedTo: delegatedTo || undefined,
      dueDate: dueDate || undefined,
      status,
      documents: documents.map(f => ({ name: f.name, url: URL.createObjectURL(f) }))
    })
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files))
    }
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

          <div className="form-row">
            <div className="form-group">
              <label>
                <Clock size={14} /> Время (часы)
              </label>
              <input
                type="number"
                value={estimatedTime}
                onChange={e => setEstimatedTime(e.target.value)}
                min="0"
                className="form-input"
              />
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
          </div>

          <div className="form-group">
            <label>
              <Users size={14} /> Делегировать
            </label>
            <input
              type="text"
              value={delegatedTo}
              onChange={e => setDelegatedTo(e.target.value)}
              placeholder="Имя пользователя"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>
              <FileText size={14} /> Документы
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="form-input"
            />
            {documents.length > 0 && (
              <div className="documents-list">
                {documents.map((doc, i) => (
                  <span key={i} className="document-tag">
                    {doc.name}
                  </span>
                ))}
              </div>
            )}
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

