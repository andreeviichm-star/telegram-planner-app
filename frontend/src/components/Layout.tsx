import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Calendar, CheckSquare } from 'lucide-react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="layout">
      <main className="main-content">{children}</main>
      <nav className="bottom-nav glass">
        <Link
          to="/"
          className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}
        >
          <CheckSquare size={24} />
          <span>Задачи</span>
        </Link>
        <Link
          to="/calendar"
          className={`nav-item ${location.pathname === '/calendar' ? 'active' : ''}`}
        >
          <Calendar size={24} />
          <span>Календарь</span>
        </Link>
      </nav>
    </div>
  )
}

