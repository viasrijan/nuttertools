import React from 'react'

export function Badge({ children, className = '' }: { children: React.ReactNode, className?: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-none text-xs font-bold uppercase tracking-wider bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 ${className}`}>
      {children}
    </span>
  )
}
