import React from 'react'

export interface CardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
  accent?: 'none' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet'
}

const ACCENTS: Record<NonNullable<CardProps['accent']>, string> = {
  none: '',
  indigo: 'hover:border-indigo-300 dark:hover:border-indigo-500/60',
  emerald: 'hover:border-emerald-300 dark:hover:border-emerald-500/60',
  rose: 'hover:border-rose-300 dark:hover:border-rose-500/60',
  amber: 'hover:border-amber-300 dark:hover:border-amber-500/60',
  sky: 'hover:border-sky-300 dark:hover:border-sky-500/60',
  violet: 'hover:border-violet-300 dark:hover:border-violet-500/60',
}

export function Card({ children, className = '', hover = false, accent = 'none' }: CardProps) {
  return (
    <div
      className={`relative  border border-zinc-200/90 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 soft-shadow ${
        hover
          ? `transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_16px_40px_-12px_rgba(0,0,0,0.18)] ${ACCENTS[accent]}`
          : 'transition-colors duration-200'
      } ${className}`}
    >
      {children}
    </div>
  )
}

export function CardLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <p className={`text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500 dark:text-zinc-400 mb-2.5 ${className}`}>
      {children}
    </p>
  )
}

export function CardDivider({ className = '' }: { className?: string }) {
  return <div className={`h-px bg-gradient-to-r from-transparent via-zinc-200 dark:via-zinc-700/70 to-transparent ${className}`} />
}
