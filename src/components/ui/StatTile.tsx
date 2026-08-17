import type { ReactNode } from 'react'

/**
 * Compact stat tile used for counters (words, characters, size savings…).
 */
export default function StatTile({
  label,
  value,
  sub,
  accent = false,
  className = '',
}: {
  label: string
  value: ReactNode
  sub?: string
  accent?: boolean
  className?: string
}) {
  return (
    <div
      className={`omni-pop relative overflow-hidden  border p-3.5 text-center transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_-12px_rgba(0,0,0,0.18)] ${
        accent
          ? 'border-transparent bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-[0_8px_24px_-8px_rgba(99,102,241,0.55)]'
          : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/70 text-zinc-900 dark:text-white'
      } ${className}`}
    >
      {accent && (
        <span aria-hidden className="pointer-events-none absolute -top-8 -right-8 w-24 h-24  bg-white/15 blur-xl" />
      )}
      <div className={`relative text-xl md:text-[22px] font-extrabold tabular-nums tracking-tight ${accent ? 'text-white' : ''}`}>
        {value}
      </div>
      <div
        className={`relative text-[11px] font-bold uppercase tracking-[0.07em] mt-1 ${
          accent ? 'text-indigo-100' : 'text-zinc-500 dark:text-zinc-400'
        }`}
      >
        {label}
      </div>
      {sub && (
        <div className={`relative text-[11px] font-medium mt-0.5 ${accent ? 'text-indigo-100/80' : 'text-zinc-400 dark:text-zinc-500'}`}>
          {sub}
        </div>
      )}
    </div>
  )
}
