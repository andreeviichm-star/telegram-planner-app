import { ReactNode, useEffect } from 'react'
import './Layout.css'

interface LayoutProps {
  children: ReactNode
}

export default function Layout({ children }: LayoutProps) {
  useEffect(() => {
    console.log('📐 Layout component mounted')
    console.log('📐 Root element:', document.getElementById('root'))
    console.log('📐 Layout element:', document.querySelector('.layout'))
  }, [])

  return (
    <div className="layout">
      <main className="main-content">{children}</main>
    </div>
  )
}

