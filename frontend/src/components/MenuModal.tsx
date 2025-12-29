import { Home, CheckSquare, Calendar, Video, Wallet, X } from 'lucide-react'
import './MenuModal.css'

interface MenuModalProps {
  isOpen: boolean
  onClose: () => void
  currentPath: string
  onNavigate?: (page: 'dashboard' | 'tasks' | 'calendar' | 'meetings' | 'budget') => void
}

export default function MenuModal({ isOpen, onClose, currentPath, onNavigate }: MenuModalProps) {
  if (!isOpen) return null

  const handleNavigate = (page: 'dashboard' | 'tasks' | 'calendar' | 'meetings' | 'budget') => {
    if (onNavigate) {
      onNavigate(page)
    }
    onClose()
  }

  return (
    <div className="menu-modal-overlay" onClick={onClose}>
      <div className="menu-modal-content glass slide-up" onClick={e => e.stopPropagation()}>
        <div className="menu-modal-header">
          <h2>Меню</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="menu-options">
          <button
            className={`menu-option ${currentPath === 'dashboard' || currentPath === '/' ? 'active' : ''}`}
            onClick={() => handleNavigate('dashboard')}
          >
            <Home size={24} />
            <div className="menu-option-content">
              <div className="menu-option-title">Главная</div>
              <div className="menu-option-subtitle">Сводка на сегодня</div>
            </div>
          </button>

          <button
            className={`menu-option ${currentPath === 'tasks' ? 'active' : ''}`}
            onClick={() => handleNavigate('tasks')}
          >
            <CheckSquare size={24} />
            <div className="menu-option-content">
              <div className="menu-option-title">Задачи</div>
              <div className="menu-option-subtitle">Управление задачами</div>
            </div>
          </button>

          <button
            className={`menu-option ${currentPath === '/calendar' || currentPath === 'calendar' ? 'active' : ''}`}
            onClick={() => handleNavigate('calendar')}
          >
            <Calendar size={24} />
            <div className="menu-option-content">
              <div className="menu-option-title">Календарь</div>
              <div className="menu-option-subtitle">Дневник и события</div>
            </div>
          </button>

          <button
            className={`menu-option ${currentPath === '/meetings' || currentPath === 'meetings' ? 'active' : ''}`}
            onClick={() => handleNavigate('meetings')}
          >
            <Video size={24} />
            <div className="menu-option-content">
              <div className="menu-option-title">Созвоны</div>
              <div className="menu-option-subtitle">Планирование встреч</div>
            </div>
          </button>

          <button
            className={`menu-option ${currentPath === '/budget' || currentPath === 'budget' ? 'active' : ''}`}
            onClick={() => handleNavigate('budget')}
          >
            <Wallet size={24} />
            <div className="menu-option-content">
              <div className="menu-option-title">Бюджет</div>
              <div className="menu-option-subtitle">Доходы и расходы</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

