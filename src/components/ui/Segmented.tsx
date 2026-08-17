/**
 * Segmented control for switching between a small set of modes/options.
 */
export default function Segmented<T extends string>({
  options,
  value,
  onChange,
  className = '',
}: {
  options: { value: T; label: string; icon?: React.ReactNode }[]
  value: T
  onChange: (v: T) => void
  className?: string
}) {
  return (
    <div
      role="tablist"
      className={`inline-flex flex-wrap items-center gap-1 p-1  bg-zinc-100 dark:bg-zinc-800/80 ring-1 ring-inset ring-zinc-200/70 dark:ring-zinc-700/70 ${className}`}
    >
      {options.map((o) => {
        const active = o.value === value
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={`no-lift flex items-center gap-1.5 px-3.5 h-8  text-xs font-bold tracking-[-0.01em] transition-all duration-200 active:scale-95 ${
              active
                ? 'bg-white dark:bg-zinc-900 text-indigo-600 dark:text-indigo-300 shadow-[0_1px_3px_rgba(0,0,0,0.12),0_4px_12px_-4px_rgba(0,0,0,0.12)]'
                : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            {o.icon}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}
