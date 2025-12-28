import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AppRouter } from './utils/router'
import Layout from './components/Layout'
import TasksPage from './pages/TasksPage'
import CalendarPage from './pages/CalendarPage'
import MeetingsPage from './pages/MeetingsPage'
import BudgetPage from './pages/BudgetPage'
import { initTelegramWebApp, isTelegram } from './utils/telegram'
import { logger } from './utils/logger'
import './App.css'

function App() {
  useEffect(() => {
    logger.info('App mounted', {
      url: window.location.href,
      isTelegram: isTelegram(),
    })

    // Initialize Telegram WebApp immediately
    initTelegramWebApp()

    // Global error handlers (only in development)
    if (import.meta.env.DEV) {
      const handleError = (event: ErrorEvent) => {
        logger.error('Resource loading error:', {
          message: event.message,
          filename: event.filename,
          lineno: event.lineno,
          colno: event.colno,
        })
      }

      const handleRejection = (event: PromiseRejectionEvent) => {
        logger.error('Unhandled promise rejection:', event.reason)
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
    <AppRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
        </Routes>
      </Layout>
    </AppRouter>
  )
}

export default App

