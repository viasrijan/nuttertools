import React from 'react'

export function Card({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <div className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-none p-6 soft-shadow transition-all duration-200 ${className}`}>
      {children}
    </div>
  )
}
