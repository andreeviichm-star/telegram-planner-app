/**
 * Telegram WebApp utilities
 */

interface TelegramWebApp {
  ready: () => void
  expand: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
  version?: string
  platform?: string
}

declare global {
  interface Window {
    Telegram?: {
      WebApp: TelegramWebApp
    }
  }
}

const TELEGRAM_COLORS = {
  header: '#0a0e27',
  background: '#0a0e27',
} as const

const INIT_TIMEOUT = 5000 // 5 seconds
const CHECK_INTERVAL = 100 // 100ms

/**
 * Initialize Telegram WebApp
 */
export const initTelegramWebApp = (): void => {
  const init = (tg: TelegramWebApp) => {
    try {
      tg.ready()
      tg.expand()
      tg.setHeaderColor(TELEGRAM_COLORS.header)
      tg.setBackgroundColor(TELEGRAM_COLORS.background)
    } catch (error) {
      console.error('Failed to initialize Telegram WebApp:', error)
    }
  }

  // Check if Telegram WebApp is already available
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    init(window.Telegram.WebApp)
    return
  }

  // Wait for Telegram WebApp to load (for cases when script loads after our code)
  if (typeof window === 'undefined') return

  let attempts = 0
  const maxAttempts = INIT_TIMEOUT / CHECK_INTERVAL

  const checkInterval = setInterval(() => {
    attempts++
    if (window.Telegram?.WebApp) {
      clearInterval(checkInterval)
      init(window.Telegram.WebApp)
    } else if (attempts >= maxAttempts) {
      clearInterval(checkInterval)
      // App will work without Telegram API
    }
  }, CHECK_INTERVAL)
}

/**
 * Check if running in Telegram
 */
export const isTelegram = (): boolean => {
  return /Telegram/i.test(navigator.userAgent) || window.Telegram?.WebApp !== undefined
}

