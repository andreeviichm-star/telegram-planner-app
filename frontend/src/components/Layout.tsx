import { ReactNode, useEffect } from 'react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    console.log('📐 Layout mounted', {
      hasChildren: !!children,
      childrenType: typeof children,
    })
    
    // Force visibility
    const layout = document.querySelector('.layout') as HTMLElement
    const mainContent = document.querySelector('.main-content') as HTMLElement
    
    if (layout) {
      layout.style.setProperty('display', 'flex', 'important')
      layout.style.setProperty('visibility', 'visible', 'important')
      layout.style.setProperty('opacity', '1', 'important')
      layout.style.setProperty('min-height', '100vh', 'important')
    }
    
    if (mainContent) {
      mainContent.style.setProperty('display', 'block', 'important')
      mainContent.style.setProperty('visibility', 'visible', 'important')
    }
  }, [children])

  return (
    <div className="layout">
      <main className="main-content">{children}</main>
    </div>
  )
}

