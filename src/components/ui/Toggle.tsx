/**
 * Modern iOS-style toggle switch for boolean options.
 */
export default function Toggle({
  checked,
  onChange,
  label,
  hint,
  disabled = false,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
  hint?: string
  disabled?: boolean
}) {
  return (
    <label
      className={`flex items-center justify-between gap-4  px-3.5 py-2.5 border transition-all duration-200 select-none ${
        checked
          ? 'border-indigo-200 dark:border-indigo-500/40 bg-indigo-50/50 dark:bg-indigo-500/10'
          : 'border-zinc-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-zinc-300 dark:hover:border-zinc-700'
      } ${disabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-zinc-800 dark:text-zinc-100">{label}</span>
        {hint && <span className="block text-xs font-medium text-zinc-400 dark:text-zinc-500 mt-0.5">{hint}</span>}
      </span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={`no-lift relative shrink-0 w-11 h-6  transition-all duration-300 focus-visible:ring-4 focus-visible:ring-indigo-500/25 ${
          checked
            ? 'bg-gradient-to-r from-indigo-500 to-violet-500 shadow-[0_2px_10px_-2px_rgba(99,102,241,0.6)]'
            : 'bg-zinc-300 dark:bg-zinc-700'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5  bg-white shadow-md transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  )
}
