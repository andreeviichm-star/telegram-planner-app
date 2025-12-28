import { ReactNode, useEffect } from 'react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  console.log('📐 Layout render - children:', {
    hasChildren: !!children,
    childrenType: typeof children,
    childrenValue: children,
    childrenString: String(children).substring(0, 200),
    isReactElement: React.isValidElement(children),
  })
  
  // Force render children
  if (!children) {
    console.error('❌ Layout: No children provided!')
    return (
      <div className="layout">
        <main className="main-content">
          <div style={{ padding: '20px', color: 'white' }}>No children in Layout!</div>
        </main>
      </div>
    )
  }
  
  useEffect(() => {
    console.log('📐 Layout mounted (useEffect)', {
      hasChildren: !!children,
      childrenType: typeof children,
    })
    
    // Force visibility with delay to ensure React has rendered
    setTimeout(() => {
      const layout = document.querySelector('.layout') as HTMLElement
      const mainContent = document.querySelector('.main-content') as HTMLElement
      
      console.log('📐 Layout elements check:', {
        layout: !!layout,
        mainContent: !!mainContent,
        layoutDisplay: layout ? window.getComputedStyle(layout).display : 'N/A',
        layoutVisibility: layout ? window.getComputedStyle(layout).visibility : 'N/A',
        layoutOpacity: layout ? window.getComputedStyle(layout).opacity : 'N/A',
        layoutWidth: layout ? window.getComputedStyle(layout).width : 'N/A',
        layoutHeight: layout ? window.getComputedStyle(layout).height : 'N/A',
        mainContentDisplay: mainContent ? window.getComputedStyle(mainContent).display : 'N/A',
        mainContentChildren: mainContent?.children.length || 0,
      })
      
      if (layout) {
        const style = window.getComputedStyle(layout)
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
          console.warn('⚠️ Layout is hidden! Forcing visibility...')
        }
        layout.style.setProperty('display', 'flex', 'important')
        layout.style.setProperty('visibility', 'visible', 'important')
        layout.style.setProperty('opacity', '1', 'important')
        layout.style.setProperty('min-height', '100vh', 'important')
        layout.style.setProperty('width', '100%', 'important')
      }
      
      if (mainContent) {
        const style = window.getComputedStyle(mainContent)
        if (style.display === 'none' || style.visibility === 'hidden') {
          console.warn('⚠️ MainContent is hidden! Forcing visibility...')
        }
        mainContent.style.setProperty('display', 'block', 'important')
        mainContent.style.setProperty('visibility', 'visible', 'important')
        mainContent.style.setProperty('width', '100%', 'important')
      }
    }, 200)
  }, [children])

  console.log('📐 Layout: About to return JSX with children')
  
  // Simple render - don't check isValidElement as it might cause issues
  return (
    <div className="layout">
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}

