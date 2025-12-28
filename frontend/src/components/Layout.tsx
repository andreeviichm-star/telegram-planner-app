import { ReactNode, useEffect } from 'react'
import './Layout.css'
import { logger } from '../utils/logger'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Force layout to be visible in Telegram
    const layout = document.querySelector('.layout')
    const mainContent = document.querySelector('.main-content')
    
    if (layout && import.meta.env.DEV) {
      logger.info('Layout mounted', {
        layoutExists: !!layout,
        mainContentExists: !!mainContent,
        layoutDisplay: window.getComputedStyle(layout).display,
        layoutVisibility: window.getComputedStyle(layout).visibility,
      })
    }
    
    // Ensure layout is visible
    if (layout) {
      const style = window.getComputedStyle(layout)
      if (style.display === 'none' || style.visibility === 'hidden') {
        console.warn('Layout is hidden! Forcing visibility...')
        ;(layout as HTMLElement).style.display = 'flex'
        ;(layout as HTMLElement).style.visibility = 'visible'
      }
    }
  }, [])

  return (
    <div className="layout">
      <main className="main-content">{children}</main>
    </div>
  )
}

