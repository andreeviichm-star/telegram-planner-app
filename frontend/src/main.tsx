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
      const testElement = document.querySelector('[style*="background: red"]')
      const pageTitle = document.querySelector('.page-title')
      
      console.log('🔍 After render check:', {
        layout: !!layout,
        mainContent: !!mainContent,
        tasksPage: !!tasksPage,
        testElement: !!testElement,
        pageTitle: !!pageTitle,
        rootChildren: rootElement.children.length,
        layoutChildren: layout?.children.length || 0,
        mainContentChildren: mainContent?.children.length || 0,
        layoutDisplay: layout ? window.getComputedStyle(layout).display : 'N/A',
        layoutVisibility: layout ? window.getComputedStyle(layout).visibility : 'N/A',
        layoutOpacity: layout ? window.getComputedStyle(layout).opacity : 'N/A',
        layoutWidth: layout ? window.getComputedStyle(layout).width : 'N/A',
        layoutHeight: layout ? window.getComputedStyle(layout).height : 'N/A',
        tasksPageDisplay: tasksPage ? window.getComputedStyle(tasksPage).display : 'N/A',
        tasksPageVisibility: tasksPage ? window.getComputedStyle(tasksPage).visibility : 'N/A',
        tasksPageOpacity: tasksPage ? window.getComputedStyle(tasksPage).opacity : 'N/A',
        testElementDisplay: testElement ? window.getComputedStyle(testElement).display : 'N/A',
        testElementVisibility: testElement ? window.getComputedStyle(testElement).visibility : 'N/A',
      })
      
      // Log HTML structure
      console.log('📄 HTML Structure:', {
        rootHTML: rootElement.innerHTML.substring(0, 500),
        layoutHTML: layout?.outerHTML.substring(0, 500),
        mainContentHTML: mainContent?.innerHTML.substring(0, 500),
      })
    }, 1000)
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

