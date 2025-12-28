/**
 * Router configuration for Telegram Mini App
 * HashRouter works better with GitHub Pages and Telegram
 */

import { HashRouter } from 'react-router-dom'

/**
 * Get base path for router
 * In Telegram, we need to handle base path correctly
 */
export const getBasePath = (): string => {
  const basePath = import.meta.env.VITE_BASE_PATH || ''
  // Remove trailing slash for HashRouter
  return basePath.replace(/\/$/, '')
}

/**
 * Create router with proper base path handling
 */
export const AppRouter = HashRouter

