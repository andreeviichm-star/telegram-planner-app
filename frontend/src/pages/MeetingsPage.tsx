import { useState, useEffect, useCallback } from 'react'
import { Plus, Menu, Video, Clock, MapPin } from 'lucide-react'
import MeetingCard from '../components/MeetingCard'
import MeetingModal from '../components/MeetingModal'
import MenuModal from '../components/MenuModal'
import { Meeting, MeetingPlatform } from '../types'
import { getMeetings, createMeeting, updateMeeting, deleteMeeting } from '../services/api'
import './MeetingsPage.css'

interface MeetingsPageProps {
  onNavigate?: (page: 'tasks' | 'calendar' | 'meetings' | 'budget') => void
}

export default function MeetingsPage({ onNavigate }: MeetingsPageProps = {}) {
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [isMeetingModalOpen, setIsMeetingModalOpen] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)

  const loadMeetings = useCallback(async () => {
    try {
      const data = await getMeetings()
      setMeetings(data || [])
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load meetings:', error)
      }
      setMeetings([])
    }
  }, [])

  useEffect(() => {
    loadMeetings()
  }, [loadMeetings])

  const handleCreateMeeting = () => {
    setSelectedMeeting(null)
    setIsMeetingModalOpen(true)
  }

  const handleEditMeeting = (meeting: Meeting) => {
    setSelectedMeeting(meeting)
    setIsMeetingModalOpen(true)
  }

  const handleSaveMeeting = async (meetingData: Partial<Meeting>) => {
    try {
      if (selectedMeeting) {
        await updateMeeting(selectedMeeting.id, meetingData)
      } else {
        await createMeeting(meetingData as Meeting)
      }
      setIsMeetingModalOpen(false)
      setSelectedMeeting(null)
      loadMeetings()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to save meeting:', error)
      }
    }
  }

  const handleDeleteMeeting = async (id: string) => {
    try {
      await deleteMeeting(id)
      loadMeetings()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete meeting:', error)
      }
    }
  }

  const upcomingMeetings = meetings.filter(m => new Date(m.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  return (
    <div className="meetings-page">
      <div className="page-header">
        <button
          className="menu-btn glass-light"
          onClick={() => setIsMenuModalOpen(true)}
        >
          <Menu size={24} />
        </button>
        <h1 className="page-title">Созвоны</h1>
        <div style={{ width: '40px' }}></div>
      </div>

      <div className="meetings-stats glass">
        <div className="stat-item">
          <Video size={20} />
          <span>{upcomingMeetings.length} предстоящих</span>
        </div>
      </div>

      <div className="meetings-list">
        {upcomingMeetings.map(meeting => (
          <MeetingCard
            key={meeting.id}
            meeting={meeting}
            onEdit={handleEditMeeting}
            onDelete={handleDeleteMeeting}
          />
        ))}
        {upcomingMeetings.length === 0 && (
          <div className="empty-state glass">
            <p>Нет запланированных созвонов</p>
            <p className="empty-hint">Нажмите + чтобы создать созвон</p>
          </div>
        )}
      </div>

      <button className="fab glass" onClick={handleCreateMeeting}>
        <Plus size={24} />
      </button>

      {isMeetingModalOpen && (
        <MeetingModal
          meeting={selectedMeeting}
          onClose={() => {
            setIsMeetingModalOpen(false)
            setSelectedMeeting(null)
          }}
          onSave={handleSaveMeeting}
        />
      )}

      {isMenuModalOpen && (
        <MenuModal
          isOpen={isMenuModalOpen}
          onClose={() => setIsMenuModalOpen(false)}
          currentPath="meetings"
          onNavigate={onNavigate}
        />
      )}
    </div>
  )
}

