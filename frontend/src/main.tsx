import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Simple initialization
const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error('Root element not found!')
}

console.log('🚀 Starting React render...')

try {
  ReactDOM.createRoot(rootElement).render(<App />)
  console.log('✅ React app rendered successfully')
} catch (error) {
  console.error('❌ Failed to render React app:', error)
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

