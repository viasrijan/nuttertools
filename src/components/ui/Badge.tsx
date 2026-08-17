import React from 'react'

export interface BadgeProps {
  children: React.ReactNode
  variant?: 'neutral' | 'indigo' | 'emerald' | 'rose' | 'amber' | 'sky' | 'violet' | 'gradient'
  className?: string
}

const VARIANTS: Record<NonNullable<BadgeProps['variant']>, string> = {
  neutral: 'bg-zinc-100 text-zinc-700 ring-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-700',
  indigo: 'bg-indigo-50 text-indigo-700 ring-indigo-200 dark:bg-indigo-500/15 dark:text-indigo-300 dark:ring-indigo-500/30',
  emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-500/15 dark:text-emerald-300 dark:ring-emerald-500/30',
  rose: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-300 dark:ring-rose-500/30',
  amber: 'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-500/15 dark:text-amber-300 dark:ring-amber-500/30',
  sky: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-500/15 dark:text-sky-300 dark:ring-sky-500/30',
  violet: 'bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-500/15 dark:text-violet-300 dark:ring-violet-500/30',
  gradient:
    'text-white bg-gradient-to-r from-indigo-500 to-violet-500 ring-transparent shadow-[0_2px_10px_-2px_rgba(99,102,241,0.5)]',
}

export function Badge({ children, variant = 'neutral', className = '' }: BadgeProps) {
  return (
    <span
      className={`omni-pop inline-flex items-center gap-1.5 px-2.5 py-1  text-[11px] font-bold tracking-wide ring-1 ${VARIANTS[variant]} ${className}`}
    >
      {children}
    </span>
  )
}
