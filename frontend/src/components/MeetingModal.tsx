import { useState, useEffect } from 'react'
import { Video, Clock, Calendar, Link as LinkIcon } from 'lucide-react'
import { Meeting, MeetingPlatform } from '../types'
import './MeetingModal.css'

interface MeetingModalProps {
  meeting: Meeting | null
  onClose: () => void
  onSave: (meetingData: Partial<Meeting>) => void
}

const platforms: { value: MeetingPlatform; label: string }[] = [
  { value: 'zoom', label: 'Zoom' },
  { value: 'telegram', label: 'Telegram' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'other', label: 'Другое' }
]

export default function MeetingModal({ meeting, onSave, onClose }: MeetingModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [duration, setDuration] = useState('60')
  const [platform, setPlatform] = useState<MeetingPlatform>('zoom')
  const [link, setLink] = useState('')
  const [reminder24h, setReminder24h] = useState(true)

  useEffect(() => {
    if (meeting) {
      setTitle(meeting.title)
      setDescription(meeting.description || '')
      const meetingDate = new Date(meeting.date)
      setDate(meetingDate.toISOString().split('T')[0])
      setTime(meetingDate.toTimeString().slice(0, 5))
      setDuration(meeting.duration.toString())
      setPlatform(meeting.platform)
      setLink(meeting.link || '')
      setReminder24h(meeting.reminder24h !== false)
    } else {
      const now = new Date()
      setDate(now.toISOString().split('T')[0])
      setTime(now.toTimeString().slice(0, 5))
    }
  }, [meeting])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const dateTime = new Date(`${date}T${time}`)
    onSave({
      title,
      description,
      date: dateTime.toISOString(),
      duration: parseInt(duration),
      platform,
      link: link || undefined,
      reminder24h
    })
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content glass slide-up" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{meeting ? 'Редактировать созвон' : 'Новый созвон'}</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="meeting-form">
          <div className="form-group">
            <label>Название созвона *</label>
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
              <label>
                <Calendar size={14} /> Дата
              </label>
              <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>
                <Clock size={14} /> Время
              </label>
              <input
                type="time"
                value={time}
                onChange={e => setTime(e.target.value)}
                required
                className="form-input"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>
                <Clock size={14} /> Длительность (мин)
              </label>
              <input
                type="number"
                value={duration}
                onChange={e => setDuration(e.target.value)}
                min="5"
                step="5"
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>
                <Video size={14} /> Платформа
              </label>
              <select
                value={platform}
                onChange={e => setPlatform(e.target.value as MeetingPlatform)}
                className="form-input"
              >
                {platforms.map(p => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>
              <LinkIcon size={14} /> Ссылка на созвон
            </label>
            <input
              type="url"
              value={link}
              onChange={e => setLink(e.target.value)}
              placeholder="https://..."
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={reminder24h}
                onChange={e => setReminder24h(e.target.checked)}
                className="checkbox-input"
              />
              <span>Уведомление за 24 часа</span>
            </label>
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

