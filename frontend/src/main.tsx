import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Wait for DOM and Telegram WebApp to be ready
const initApp = () => {
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
    return
  }

  // Debug: log before render
  console.log('🚀 Starting React render...', {
    rootElement: rootElement,
    hasChildren: rootElement.children.length,
  })
  
  try {
    ReactDOM.createRoot(rootElement).render(<App />)
    console.log('✅ React app rendered successfully')
    
    // Debug: check after render
    setTimeout(() => {
      const layout = document.querySelector('.layout')
      const mainContent = document.querySelector('.main-content')
      const tasksPage = document.querySelector('.tasks-page')
      console.log('🔍 After render check:', {
        layout: !!layout,
        mainContent: !!mainContent,
        tasksPage: !!tasksPage,
        rootChildren: rootElement.children.length,
        layoutDisplay: layout ? window.getComputedStyle(layout).display : 'N/A',
        layoutVisibility: layout ? window.getComputedStyle(layout).visibility : 'N/A',
      })
    }, 500)
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
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp)
} else {
  // DOM is already ready
  initApp()
}

