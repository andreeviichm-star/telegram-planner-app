import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { debugTelegram } from './utils/telegramDebug'

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
  // Render immediately
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    )
    
    // Debug after a short delay to allow React to render
    setTimeout(() => {
      debugTelegram()
    }, 100)
  } catch (error) {
    console.error('Failed to render React app:', error)
    rootElement.innerHTML = `
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
        Ошибка рендеринга: ${error instanceof Error ? error.message : 'Unknown error'}
      </div>
    `
  }
}

