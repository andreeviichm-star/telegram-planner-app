import { useState, useEffect, useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Plus, Menu } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths } from 'date-fns'
import { ru } from 'date-fns/locale'
import CalendarDay from '../components/CalendarDay'
import CalendarEventModal from '../components/CalendarEventModal'
import MenuModal from '../components/MenuModal'
import { CalendarEvent } from '../types'
import { getCalendarEvents, createCalendarEvent, updateCalendarEvent, deleteCalendarEvent } from '../services/api'
import './CalendarPage.css'

export default function CalendarPage() {
  const location = useLocation()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)

  const loadEvents = useCallback(async () => {
    try {
      const start = startOfMonth(currentDate)
      const end = endOfMonth(currentDate)
      const data = await getCalendarEvents(start, end)
      setEvents(data || [])
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to load events:', error)
      }
      setEvents([])
    }
  }, [currentDate])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1))
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedEvent(null)
    setIsModalOpen(true)
  }

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setSelectedDate(new Date(event.date))
    setIsModalOpen(true)
  }

  const handleSaveEvent = async (eventData: Partial<CalendarEvent>) => {
    try {
      if (selectedEvent) {
        await updateCalendarEvent(selectedEvent.id, eventData)
      } else if (selectedDate) {
        await createCalendarEvent({
          ...eventData,
          date: selectedDate.toISOString()
        } as CalendarEvent)
      }
      setIsModalOpen(false)
      setSelectedDate(null)
      setSelectedEvent(null)
      loadEvents()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to save event:', error)
      }
    }
  }

  const handleDeleteEvent = async (id: string) => {
    try {
      await deleteCalendarEvent(id)
      loadEvents()
    } catch (error) {
      if (import.meta.env.DEV) {
        console.error('Failed to delete event:', error)
      }
    }
  }

  const getEventsForDay = (date: Date) => {
    return events.filter(event => isSameDay(new Date(event.date), date))
  }

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button className="menu-btn glass-light" onClick={() => setIsMenuModalOpen(true)}>
          <Menu size={24} />
        </button>
        <button className="nav-btn glass-light" onClick={handlePrevMonth}>
          <ChevronLeft size={20} />
        </button>
        <h1 className="calendar-title">
          {format(currentDate, 'LLLL yyyy', { locale: ru })}
        </h1>
        <button className="nav-btn glass-light" onClick={handleNextMonth}>
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="calendar-weekdays">
        {weekDays.map(day => (
          <div key={day} className="weekday">{day}</div>
        ))}
      </div>

      <div className="calendar-grid">
        {days.map(day => {
          const dayEvents = getEventsForDay(day)
          return (
            <CalendarDay
              key={day.toISOString()}
              date={day}
              events={dayEvents}
              isCurrentMonth={true}
              onClick={() => handleDayClick(day)}
              onEventClick={handleEventClick}
            />
          )
        })}
      </div>

      <div className="calendar-legend glass">
        <div className="legend-item">
          <div className="legend-dot period"></div>
          <span>Месячные</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot ovulation"></div>
          <span>Овуляция</span>
        </div>
        <div className="legend-item">
          <div className="legend-dot sex"></div>
          <span>Секс</span>
        </div>
      </div>

      <button className="fab glass" onClick={() => {
        setSelectedDate(new Date())
        setSelectedEvent(null)
        setIsModalOpen(true)
      }}>
        <Plus size={24} />
      </button>

      {isModalOpen && (
        <CalendarEventModal
          date={selectedDate}
          event={selectedEvent}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedDate(null)
            setSelectedEvent(null)
          }}
          onSave={handleSaveEvent}
          onDelete={selectedEvent ? () => handleDeleteEvent(selectedEvent.id) : undefined}
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

