import { useEffect } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import TasksPage from './pages/TasksPage'
import CalendarPage from './pages/CalendarPage'
import MeetingsPage from './pages/MeetingsPage'
import BudgetPage from './pages/BudgetPage'
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
    const initTelegram = () => {
      try {
        // Ждем загрузки Telegram WebApp скрипта
        if (window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp
          tg.ready()
          tg.expand()
          tg.setHeaderColor('#0a0e27')
          tg.setBackgroundColor('#0a0e27')
          console.log('Telegram WebApp initialized')
        } else {
          // Если скрипт еще не загружен, ждем
          setTimeout(initTelegram, 100)
        }
      } catch (error) {
        console.error('Telegram WebApp error:', error)
        // Приложение все равно должно работать без Telegram API
      }
    }
    
    initTelegram()
  }, [])

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<TasksPage />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/meetings" element={<MeetingsPage />} />
          <Route path="/budget" element={<BudgetPage />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

