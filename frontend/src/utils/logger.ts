/**
 * Logger utility - logs only in development mode
 */
const isDev = () => {
  try {
    return import.meta.env.DEV
  } catch {
    return false
  }
}

export const logger = {
  log: (...args: unknown[]) => {
    if (isDev()) console.log(...args)
  },
  warn: (...args: unknown[]) => {
    if (isDev()) console.warn(...args)
  },
  error: (...args: unknown[]) => {
    // Always log errors, even in production
    console.error(...args)
  },
  info: (...args: unknown[]) => {
    if (isDev()) console.info(...args)
  },
}

