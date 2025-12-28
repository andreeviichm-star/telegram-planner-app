import { Edit, Trash2, Video, Clock, MapPin } from 'lucide-react'
import { Meeting, MeetingPlatform } from '../types'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import './MeetingCard.css'

interface MeetingCardProps {
  meeting: Meeting
  onEdit: (meeting: Meeting) => void
  onDelete: (id: string) => void
}

const platformLabels: Record<MeetingPlatform, string> = {
  zoom: 'Zoom',
  telegram: 'Telegram',
  whatsapp: 'WhatsApp',
  other: 'Другое'
}

const platformColors: Record<MeetingPlatform, string> = {
  zoom: '#2d8cff',
  telegram: '#0088cc',
  whatsapp: '#25d366',
  other: '#8b5cf6'
}

export default function MeetingCard({ meeting, onEdit, onDelete }: MeetingCardProps) {
  const platformColor = platformColors[meeting.platform]

  return (
    <div className="meeting-card glass fade-in">
      <div className="meeting-header">
        <div className="meeting-title-row">
          <h3 className="meeting-title">{meeting.title}</h3>
          <span
            className="platform-badge"
            style={{ backgroundColor: `${platformColor}20`, color: platformColor }}
          >
            {platformLabels[meeting.platform]}
          </span>
        </div>
        <div className="meeting-actions">
          <button className="icon-btn" onClick={() => onEdit(meeting)}>
            <Edit size={16} />
          </button>
          <button className="icon-btn" onClick={() => onDelete(meeting.id)}>
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {meeting.description && (
        <p className="meeting-description">{meeting.description}</p>
      )}

      <div className="meeting-meta">
        <div className="meta-item">
          <Clock size={14} />
          <span>{format(new Date(meeting.date), 'd MMM yyyy, HH:mm', { locale: ru })}</span>
        </div>
        <div className="meta-item">
          <Clock size={14} />
          <span>{meeting.duration} мин</span>
        </div>
        {meeting.link && (
          <div className="meta-item">
            <Video size={14} />
            <a href={meeting.link} target="_blank" rel="noopener noreferrer" className="meeting-link">
              Ссылка
            </a>
          </div>
        )}
      </div>
    </div>
  )
}

