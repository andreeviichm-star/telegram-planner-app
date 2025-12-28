import { ReactNode, useEffect } from 'react'
import './Layout.css'
import { logger } from '../utils/logger'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Force layout to be visible in Telegram
    const layout = document.querySelector('.layout') as HTMLElement
    const mainContent = document.querySelector('.main-content') as HTMLElement
    
    if (layout) {
      // Force visibility immediately
      layout.style.display = 'flex'
      layout.style.visibility = 'visible'
      layout.style.opacity = '1'
      layout.style.minHeight = '100vh'
      
      if (mainContent) {
        mainContent.style.display = 'block'
        mainContent.style.visibility = 'visible'
      }
      
      if (import.meta.env.DEV) {
        logger.info('Layout mounted and forced visible', {
          layoutExists: !!layout,
          mainContentExists: !!mainContent,
          layoutDisplay: window.getComputedStyle(layout).display,
          layoutVisibility: window.getComputedStyle(layout).visibility,
        })
      }
    } else {
      console.error('Layout element not found!')
    }
  }, [])

  return (
    <div className="layout">
      <main className="main-content">{children}</main>
    </div>
  )
}

