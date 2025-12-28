import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Проверка, что root элемент существует
const rootElement = document.getElementById('root')
if (!rootElement) {
  console.error('❌ Root element not found!')
  document.body.innerHTML = '<div style="padding: 20px; color: white; background: #0a0e27; min-height: 100vh; display: flex; align-items: center; justify-content: center; font-family: system-ui;">Ошибка: корневой элемент не найден</div>'
} else {
  console.log('✅ Root element found, rendering app...')
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  )
}

