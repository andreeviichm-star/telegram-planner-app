import { useState } from 'react'
import { Priority } from '../types'
import './FilterModal.css'

interface FilterModalProps {
  filter: { priority?: Priority; status?: string }
  onClose: () => void
  onApply: (filter: { priority?: Priority; status?: string }) => void
}

export default function FilterModal({ filter, onClose, onApply }: FilterModalProps) {
  const [priority, setPriority] = useState<Priority | ''>(filter.priority || '')
  const [status, setStatus] = useState<string>(filter.status || '')

  const handleApply = () => {
    onApply({
      priority: priority || undefined,
      status: status || undefined
    })
    onClose()
  }

  const handleReset = () => {
    setPriority('')
    setStatus('')
    onApply({})
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Фильтры</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="filter-form">
          <div className="form-group">
            <label>Приоритет</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as Priority | '')}
              className="form-input"
            >
              <option value="">Все</option>
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
              <option value="urgent">Срочный</option>
            </select>
          </div>

          <div className="form-group">
            <label>Статус</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
              className="form-input"
            >
              <option value="">Все</option>
              <option value="pending">Ожидает</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Выполнено</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={handleReset}>
              Сбросить
            </button>
            <button type="button" className="btn-primary" onClick={handleApply}>
              Применить
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

