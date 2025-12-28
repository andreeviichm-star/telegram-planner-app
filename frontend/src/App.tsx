import { useEffect, useState } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TasksPage from './pages/TasksPage'
import TasksPageSimple from './pages/TasksPageSimple'
import TasksPageProgressive from './pages/TasksPageProgressive'
import CalendarPage from './pages/CalendarPage'
import MeetingsPage from './pages/MeetingsPage'
import BudgetPage from './pages/BudgetPage'
import './App.css'

// TEST: Use different versions to find the problematic component
// 'simple' - minimal version
// 'progressive' - with stats and tasks list, but without complex components
// 'full' - full version with all components
const VERSION = 'progressive' // 'simple' | 'progressive' | 'full'

// Initialize Telegram WebApp outside of component to avoid initialization issues
if (typeof window !== 'undefined') {
  const initTelegram = () => {
    if (window.Telegram?.WebApp) {
      try {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()
        
        // Check version before using color methods (not supported in 6.0)
        const version = parseFloat(tg.version || '0')
        if (version >= 6.1) {
          // Only use color methods in newer versions
          if (tg.setHeaderColor) {
            tg.setHeaderColor('#0a0e27')
          }
          if (tg.setBackgroundColor) {
            tg.setBackgroundColor('#0a0e27')
          }
        }
      } catch (error) {
        // Ignore errors - app will work without Telegram API
      }
    }
  }
  
  // Try immediately
  initTelegram()
  
  // Also try after a delay in case script loads later
  setTimeout(initTelegram, 100)
}

function App() {
  const [currentPage, setCurrentPage] = useState<'tasks' | 'calendar' | 'meetings' | 'budget'>('tasks')
  
  useEffect(() => {
    console.log('⚛️ App component mounted')
    
    // Global error handlers
    const handleError = (event: ErrorEvent) => {
      console.error('❌ Resource loading error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      })
    }

    const handleRejection = (event: PromiseRejectionEvent) => {
      console.error('❌ Unhandled promise rejection:', event.reason)
    }

    window.addEventListener('error', handleError, true)
    window.addEventListener('unhandledrejection', handleRejection)

    return () => {
      window.removeEventListener('error', handleError, true)
      window.removeEventListener('unhandledrejection', handleRejection)
    }
  }, [])

  useEffect(() => {
    console.log('🔗 Current location:', window.location.href)
    console.log('🔗 Hash:', window.location.hash)
    console.log('🔗 Pathname:', window.location.pathname)
  }, [])

  // Render WITHOUT HashRouter - HashRouter causes issues in Telegram
  // Use state-based navigation instead
  console.log('🧪 VERSION:', VERSION)
  console.log('🧪 Current page:', currentPage)
  
  const renderPage = () => {
    if (VERSION === 'simple') {
      return <TasksPageSimple />
    }
    
    if (VERSION === 'progressive') {
      return <TasksPageProgressive onNavigate={setCurrentPage} />
    }
    
    return <TasksPage onNavigate={setCurrentPage} />
  }
  
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'calendar':
        return <CalendarPage />
      case 'meetings':
        return <MeetingsPage />
      case 'budget':
        return <BudgetPage />
      case 'tasks':
      default:
        return renderPage()
    }
  }
  
  return (
    <Layout>
      {renderCurrentPage()}
    </Layout>
  )

  // Original code with router (commented out for testing)
  /*
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
        </Routes>
      </Layout>
    </HashRouter>
  )
  */
}

export default App

