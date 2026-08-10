export default function Progress({ label, percent }: { label?: string; percent?: number }) {
  const determinate = typeof percent === 'number'
  return (
    <div className="space-y-2" role="status" aria-live="polite">
      {(label || determinate) && (
        <div className="flex items-center justify-between gap-4">
          {label ? <p className="text-[13.5px] font-medium text-zinc-900 dark:text-white">{label}</p> : <span />}
          {determinate && <span className="text-[12.5px] font-bold text-indigo-600 dark:text-indigo-400 tabular-nums">{Math.round(percent)}%</span>}
        </div>
      )}
      <div className="h-2 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden ring-1 ring-black/5 dark:ring-white/10">
        <div
          className={determinate
            ? 'h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-800 transition-[width] duration-300 ease-out'
            : 'h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-800 animate-[omni-progress_1.3s_ease-in-out_infinite]'}
          style={determinate ? { width: `${Math.min(100, Math.max(0, percent))}%` } : undefined}
        />
      </div>
    </div>
  )
}
