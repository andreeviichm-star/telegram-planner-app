import { useEffect } from 'react'
import { HashRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TasksPage from './pages/TasksPage'
import CalendarPage from './pages/CalendarPage'
import MeetingsPage from './pages/MeetingsPage'
import BudgetPage from './pages/BudgetPage'
import { initTelegramWebApp, isTelegram } from './utils/telegram'
import './App.css'

function App() {
  useEffect(() => {
    // Initialize Telegram WebApp immediately
    initTelegramWebApp()
    
    // Log only in dev mode and after initialization
    if (import.meta.env.DEV) {
      setTimeout(() => {
        console.log('App mounted', {
          url: window.location.href,
          isTelegram: isTelegram(),
        })
      }, 0)
    }

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

