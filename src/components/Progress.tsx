export default function Progress({ label, percent }: { label?: string; percent?: number }) {
  const determinate = typeof percent === 'number'
  return (
    <div className="space-y-2.5 p-4 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-zinc-200/80 dark:border-zinc-800" role="status" aria-live="polite">
      {(label || determinate) && (
        <div className="flex items-center justify-between gap-4">
          {label ? <p className="text-[13.5px] font-semibold text-zinc-900 dark:text-zinc-100">{label}</p> : <span />}
          {determinate && <span className="text-[12.5px] font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-2.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden ring-1 ring-black/5 dark:ring-white/10 relative">
        <div
          className={determinate
            ? 'h-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 transition-[width] duration-300 ease-out shadow-sm'
            : 'h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-700 animate-[omni-progress_1.3s_ease-in-out_infinite] shadow-sm'}
          style={determinate ? { width: `${Math.min(100, Math.max(0, percent))}%` } : undefined}
        />
      </div>
    </div>
  )
}
