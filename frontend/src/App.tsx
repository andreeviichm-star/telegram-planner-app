import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TasksPage from './pages/TasksPage'
import CalendarPage from './pages/CalendarPage'
import './App.css'

// Используем глобальный объект Telegram WebApp
declare global {
  interface Window {
    Telegram?: {
      WebApp: {
        ready: () => void
        expand: () => void
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
      }
    }
  }
}

function App() {
  useEffect(() => {
    // Используем Telegram WebApp API напрямую
    try {
      if (window.Telegram?.WebApp) {
        const tg = window.Telegram.WebApp
        tg.ready()
        tg.expand()
        tg.setHeaderColor('#0a0e27')
        tg.setBackgroundColor('#0a0e27')
      }
    } catch (error) {
      console.error('Telegram WebApp error:', error)
    }
  }, [])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

