/**
 * Telegram-specific debugging utilities
 */

export const debugTelegram = () => {
  if (import.meta.env.DEV) {
    console.log('=== Telegram Debug Info ===')
    console.log('User Agent:', navigator.userAgent)
    console.log('Is Telegram:', /Telegram/i.test(navigator.userAgent))
    console.log('Telegram WebApp:', window.Telegram?.WebApp)
    console.log('Current URL:', window.location.href)
    console.log('Base path:', import.meta.env.VITE_BASE_PATH)
    
    // Check if resources are loading
    const scripts = document.querySelectorAll('script')
    console.log('Scripts found:', scripts.length)
    scripts.forEach((script, i) => {
      console.log(`Script ${i}:`, script.src || script.textContent?.substring(0, 50))
    })
    
    // Check if root element has content
    const root = document.getElementById('root')
    if (root) {
      console.log('Root element:', root)
      console.log('Root children:', root.children.length)
      console.log('Root innerHTML length:', root.innerHTML.length)
    }
    
    // Check computed styles
    const layout = document.querySelector('.layout')
    if (layout) {
      const styles = window.getComputedStyle(layout)
      console.log('Layout styles:', {
        display: styles.display,
        visibility: styles.visibility,
        opacity: styles.opacity,
        width: styles.width,
        height: styles.height,
      })
    }
    
    console.log('=== End Debug Info ===')
  }
}

