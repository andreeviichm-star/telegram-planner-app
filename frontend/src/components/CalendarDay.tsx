import { format, isToday } from 'date-fns'
import { CalendarEvent } from '../types'
import './CalendarDay.css'

interface CalendarDayProps {
  date: Date
  events: CalendarEvent[]
  isCurrentMonth: boolean
  onClick: () => void
  onEventClick: (event: CalendarEvent) => void
}

export default function CalendarDay({
  date,
  events,
  isCurrentMonth,
  onClick,
  onEventClick
}: CalendarDayProps) {
  const dayNumber = format(date, 'd')
  const isCurrentDay = isToday(date)

  const eventTypes = {
    period: events.filter(e => e.type === 'period'),
    ovulation: events.filter(e => e.type === 'ovulation'),
    sex: events.filter(e => e.type === 'sex')
  }

  return (
    <div
      className={`calendar-day glass-light ${isCurrentDay ? 'today' : ''} ${!isCurrentMonth ? 'other-month' : ''}`}
      onClick={onClick}
    >
      <div className="day-number">{dayNumber}</div>
      <div className="day-events">
        {eventTypes.period.length > 0 && (
          <div className="event-dot period" title="Месячные" />
        )}
        {eventTypes.ovulation.length > 0 && (
          <div className="event-dot ovulation" title="Овуляция" />
        )}
        {eventTypes.sex.length > 0 && (
          <div className="event-dot sex" title="Секс" />
        )}
      </div>
    </div>
  )
}

