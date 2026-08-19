import React from 'react'

export function Result({ label, value, tone = 'default' }: { label: string; value: React.ReactNode; tone?: 'default' | 'good' | 'warn' | 'muted' }) {
  const tones = {
    default: 'text-zinc-900 dark:text-white',
    good: 'text-emerald-600 dark:text-emerald-400',
    warn: 'text-amber-600 dark:text-amber-400',
    muted: 'text-zinc-500 dark:text-zinc-400',
  }
  return (
    <div className="flex items-center justify-between gap-4 bg-zinc-100 dark:bg-zinc-800 px-3.5 py-2.5">
      <span className="text-[13px] font-semibold text-zinc-600 dark:text-zinc-300">{label}</span>
      <b className={`text-[15px] font-extrabold tabular-nums ${tones[tone]}`}>{value}</b>
    </div>
  )
}

export function ResultGrid({ children, cols = 1 }: { children: React.ReactNode; cols?: 1 | 2 }) {
  return <div className={`grid gap-2 ${cols === 2 ? 'sm:grid-cols-2' : ''}`}>{children}</div>
}
