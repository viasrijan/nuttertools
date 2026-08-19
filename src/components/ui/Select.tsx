import { useEffect, useRef, useState } from 'react'

export interface SelectOption {
  value: string
  label: string
}

export interface SelectProps {
  label?: string
  value: string
  options: SelectOption[]
  onChange: (v: string) => void
  className?: string
  disabled?: boolean
}

export function Select({ label, value, options, onChange, className = '', disabled }: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const current = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
      if (e.key === 'Tab') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative ${className}`}>
      {label && (
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-2">{label}</span>
      )}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full h-10 px-3.5 flex items-center justify-between gap-2 text-sm font-bold bg-zinc-100 hover:bg-zinc-200/80 dark:bg-zinc-800 dark:hover:bg-zinc-700/80 text-zinc-900 dark:text-white transition-colors duration-150 disabled:opacity-50 disabled:cursor-not-allowed ${
          open ? 'ring-2 ring-indigo-600/60' : ''
        }`}
      >
        <span className="truncate">{current?.label ?? value}</span>
        <svg className={`w-4 h-4 shrink-0 text-zinc-500 dark:text-zinc-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {open && (
        <div role="listbox" className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-zinc-800 soft-shadow-menu py-1 max-h-72 overflow-auto animate-[omni-drop_0.16s_ease-out]">
          {options.map((o) => {
            const active = o.value === value
            return (
              <button
                key={o.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={`w-full px-3.5 py-2 text-left text-[13px] font-semibold transition-colors duration-100 ${
                  active
                    ? 'bg-indigo-600 text-white'
                    : 'text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700'
                }`}
              >
                {o.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
