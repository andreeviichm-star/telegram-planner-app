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
        window.Telegram.WebApp.ready()
        window.Telegram.WebApp.expand()
        window.Telegram.WebApp.setHeaderColor('#0a0e27')
        window.Telegram.WebApp.setBackgroundColor('#0a0e27')
      } catch (error) {
        // Ignore errors
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
    // Global error handlers (only in development)
    if (import.meta.env.DEV) {
      const handleError = (event: ErrorEvent) => {
        console.error('Resource loading error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      }

      const handleRejection = (event: PromiseRejectionEvent) => {
        console.error('Unhandled promise rejection:', event.reason)
      }

      window.addEventListener('error', handleError, true)
      window.addEventListener('unhandledrejection', handleRejection)

      return () => {
        window.removeEventListener('error', handleError, true)
        window.removeEventListener('unhandledrejection', handleRejection)
      }
    }
  }, [])

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
}

export default App

