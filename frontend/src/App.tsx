import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TasksPage from './pages/TasksPage'
import CalendarPage from './pages/CalendarPage'
import MeetingsPage from './pages/MeetingsPage'
import BudgetPage from './pages/BudgetPage'
import './App.css'

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

  // TEST: Render TasksPage directly without router to check if router is the issue
  // If this works, the problem is with HashRouter in Telegram
  console.log('🧪 Testing: Rendering TasksPage directly without router')
  return (
    <Layout>
      <TasksPage />
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

