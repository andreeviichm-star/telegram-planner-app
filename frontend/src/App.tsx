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
    console.log('🚀 App component mounted')
    console.log('📍 Current URL:', window.location.href)
    console.log('🔗 API URL:', import.meta.env.VITE_API_URL)
    console.log('📁 Base path:', import.meta.env.VITE_BASE_PATH)
    console.log('🌐 User Agent:', navigator.userAgent)
    
    // Проверка, что мы в Telegram
    const isTelegram = /Telegram/i.test(navigator.userAgent) || window.Telegram?.WebApp !== undefined
    console.log('📱 Is Telegram:', isTelegram)
    
    // Используем Telegram WebApp API напрямую
    const initTelegram = () => {
      try {
        console.log('🔧 Initializing Telegram WebApp...')
        // Проверяем наличие Telegram WebApp
        if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
          const tg = window.Telegram.WebApp
          console.log('📱 Telegram WebApp object found:', tg)
          tg.ready()
          tg.expand()
          tg.setHeaderColor('#0a0e27')
          tg.setBackgroundColor('#0a0e27')
          console.log('✅ Telegram WebApp initialized successfully')
          console.log('📊 WebApp version:', tg.version)
          console.log('📊 WebApp platform:', tg.platform)
        } else {
          console.log('⏳ Telegram WebApp not found, waiting...')
          // Если скрипт еще не загружен, ждем (максимум 3 секунды)
          let attempts = 0
          const maxAttempts = 50 // Увеличено до 5 секунд
          const checkInterval = setInterval(() => {
            attempts++
            if (window.Telegram?.WebApp) {
              clearInterval(checkInterval)
              const tg = window.Telegram.WebApp
              tg.ready()
              tg.expand()
              tg.setHeaderColor('#0a0e27')
              tg.setBackgroundColor('#0a0e27')
              console.log('✅ Telegram WebApp initialized after delay (attempts:', attempts, ')')
            } else if (attempts >= maxAttempts) {
              clearInterval(checkInterval)
              console.warn('⚠️ Telegram WebApp not available after', maxAttempts, 'attempts - running in browser mode')
            }
          }, 100)
        }
      } catch (error) {
        console.error('❌ Telegram WebApp error:', error)
        // Приложение все равно должно работать без Telegram API
      }
    }
    
    // Запускаем инициализацию после загрузки DOM
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initTelegram)
    } else {
      initTelegram()
    }
    
    // Обработка ошибок загрузки ресурсов
    window.addEventListener('error', (event) => {
      console.error('❌ Resource loading error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    }, true)
    
    // Обработка ошибок Promise
    window.addEventListener('unhandledrejection', (event) => {
      console.error('❌ Unhandled promise rejection:', event.reason)
    })
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

