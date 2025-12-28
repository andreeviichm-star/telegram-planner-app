import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

const rootElement = document.getElementById('root')

if (!rootElement) {
  console.error('Root element not found!')
  document.body.innerHTML = `
    <div style="
      padding: 20px; 
      color: white; 
      background: #0a0e27; 
      min-height: 100vh; 
      display: flex; 
      align-items: center; 
      justify-content: center; 
      font-family: system-ui;
    ">
      Ошибка: корневой элемент не найден
    </div>
  `
} else {
  // Render immediately - don't wait for anything
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  // Debug info for Telegram
  if (import.meta.env.DEV) {
    console.log('React app rendered to root element')
    console.log('Base path:', import.meta.env.VITE_BASE_PATH)
    console.log('Current URL:', window.location.href)
  }
}

