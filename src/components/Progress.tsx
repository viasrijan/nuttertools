export default function Progress({ label, percent }: { label?: string; percent?: number }) {
  const determinate = typeof percent === 'number'
  return (
    <div className="space-y-2 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-none border border-zinc-200 dark:border-zinc-800" role="status" aria-live="polite">
      {(label || determinate) && (
        <div className="flex items-center justify-between gap-4">
          {label ? <p className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">{label}</p> : <span />}
          {determinate && <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-2 rounded-none bg-zinc-200 dark:bg-zinc-800 overflow-hidden relative">
        <div
          className={determinate
            ? 'h-full rounded-none bg-indigo-600 transition-[width] duration-300 ease-out shadow-sm'
            : 'h-full w-1/3 rounded-none bg-indigo-600 animate-[omni-progress_1.3s_ease-in-out_infinite] shadow-sm'}
          style={determinate ? { width: `${Math.min(100, Math.max(0, percent))}%` } : undefined}
        />
      </div>
    </div>
  )
}
