import { useState, useEffect } from 'react'
import { Trash2 } from 'lucide-react'
import { CalendarEvent, EventType } from '../types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import './CalendarEventModal.css'

interface CalendarEventModalProps {
  date: Date | null
  event: CalendarEvent | null
  onClose: () => void
  onSave: (eventData: Partial<CalendarEvent>) => void
  onDelete?: () => void
}

export default function CalendarEventModal({
  date,
  event,
  onClose,
  onSave,
  onDelete
}: CalendarEventModalProps) {
  const [type, setType] = useState<EventType>('period')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    if (event) {
      setType(event.type)
      setNotes(event.notes || '')
    }
  }, [event])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({
      type,
      notes: notes || undefined
    })
  }

  const eventTypeLabels: Record<EventType, string> = {
    period: 'Месячные',
    ovulation: 'Овуляция',
    sex: 'Секс'
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{event ? 'Редактировать событие' : 'Новое событие'}</h2>
          <div style={{ display: 'flex', gap: '8px' }}>
            {event && onDelete && (
              <button className="delete-btn" onClick={onDelete}>
                <Trash2 size={20} />
              </button>
            )}
            <button className="close-btn" onClick={onClose}>
              ✕
            </button>
          </div>
        </div>

        {date && (
          <div className="event-date">
            {format(date, 'd MMMM yyyy', { locale: ru })}
          </div>
        )}

        <form onSubmit={handleSubmit} className="event-form">
          <div className="form-group">
            <label>Тип события</label>
            <div className="event-type-buttons">
              {(['period', 'ovulation', 'sex'] as EventType[]).map(eventType => (
                <button
                  key={eventType}
                  type="button"
                  className={`event-type-btn ${type === eventType ? 'active' : ''}`}
                  onClick={() => setType(eventType)}
                >
                  {eventTypeLabels[eventType]}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Заметки</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              className="form-input"
              placeholder="Дополнительная информация..."
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

