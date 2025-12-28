// Ultra-simple version for testing
import { useEffect } from 'react'

export default function TasksPageSimple() {
  console.log('📋 TasksPageSimple: Function called - component is rendering!')
  
  useEffect(() => {
    console.log('📋 TasksPageSimple: useEffect - component mounted')
    
    // Force visibility check
    setTimeout(() => {
      const tasksPage = document.querySelector('.tasks-page')
      const testElement = document.querySelector('[style*="background: red"]')
      const h1 = document.querySelector('h1')
      
      console.log('📋 TasksPageSimple: Elements check:', {
        tasksPage: !!tasksPage,
        testElement: !!testElement,
        h1: !!h1,
        tasksPageDisplay: tasksPage ? window.getComputedStyle(tasksPage).display : 'N/A',
        tasksPageVisibility: tasksPage ? window.getComputedStyle(tasksPage).visibility : 'N/A',
        tasksPageOpacity: tasksPage ? window.getComputedStyle(tasksPage).opacity : 'N/A',
        tasksPageWidth: tasksPage ? window.getComputedStyle(tasksPage).width : 'N/A',
        tasksPageHeight: tasksPage ? window.getComputedStyle(tasksPage).height : 'N/A',
        testElementDisplay: testElement ? window.getComputedStyle(testElement).display : 'N/A',
        h1Display: h1 ? window.getComputedStyle(h1).display : 'N/A',
      })
      
      // Force visibility if hidden
      if (tasksPage) {
        const style = window.getComputedStyle(tasksPage)
        if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) {
          console.warn('⚠️ TasksPageSimple is hidden! Forcing visibility...')
          ;(tasksPage as HTMLElement).style.setProperty('display', 'block', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('visibility', 'visible', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('opacity', '1', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('width', '100%', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('min-height', '100vh', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('background', '#0a0e27', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('color', 'white', 'important')
          ;(tasksPage as HTMLElement).style.setProperty('padding', '20px', 'important')
        }
      }
      
      if (testElement) {
        const style = window.getComputedStyle(testElement)
        if (style.display === 'none' || style.visibility === 'hidden') {
          console.warn('⚠️ Test element is hidden! Forcing visibility...')
          ;(testElement as HTMLElement).style.setProperty('display', 'block', 'important')
          ;(testElement as HTMLElement).style.setProperty('visibility', 'visible', 'important')
        }
      }
    }, 500)
  }, [])
  
  console.log('📋 TasksPageSimple: Returning JSX')
  
  return (
    <div 
      className="tasks-page" 
      style={{ 
        padding: '40px', 
        color: '#FFFFFF',
        background: '#0a0e27', // Dark background
        minHeight: '100vh',
        width: '100%',
        display: 'block',
        visibility: 'visible',
        opacity: 1,
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ 
        color: '#FFFFFF', 
        fontSize: '32px', 
        marginBottom: '20px',
        fontWeight: 'bold',
      }}>
        FLUXPLANNER
      </h1>
      <p style={{ 
        color: '#FFFFFF', 
        fontSize: '18px',
        marginBottom: '20px',
      }}>
        Simple version - if you see this, basic rendering works!
      </p>
    </div>
  )
}

