import { ReactNode, useEffect } from 'react'
import './Layout.css'
import { logger } from '../utils/logger'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    // Debug: check if children are rendering
    if (import.meta.env.DEV) {
      logger.info('Layout mounted', {
        hasChildren: !!children,
        childrenType: typeof children,
      })
      
      // Check after a short delay to allow React to render
      setTimeout(() => {
        const layout = document.querySelector('.layout')
        const mainContent = document.querySelector('.main-content')
        logger.info('Layout elements check', {
          layoutExists: !!layout,
          mainContentExists: !!mainContent,
          mainContentChildren: mainContent?.children.length || 0,
          mainContentHTML: mainContent?.innerHTML.substring(0, 100),
        })
      }, 200)
    }
  }, [children])

  // Debug: log children
  if (import.meta.env.DEV) {
    console.log('Layout render - children:', children)
  }

  return (
    <div className="layout">
      <main className="main-content">
        {children || <div style={{ padding: '20px', color: 'white' }}>No children rendered!</div>}
      </main>
    </div>
  )
}

