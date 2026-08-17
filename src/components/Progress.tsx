import { useEffect, useRef, useState } from 'react'

function useAnimatedPercent(target: number, duration = 500) {
  const [value, setValue] = useState(target)
  const fromRef = useRef(target)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const from = fromRef.current
    if (Math.abs(target - from) < 0.5) {
      fromRef.current = target
      setValue(target)
      return
    }
    const start = performance.now()
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3)
      const v = from + (target - from) * eased
      setValue(v)
      if (t < 1) rafRef.current = requestAnimationFrame(tick)
      else fromRef.current = target
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      fromRef.current = value
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration])

  return value
}

export default function Progress({ label, percent, indeterminate: forceIndeterminate }: {
  label?: string
  percent?: number
  indeterminate?: boolean
}) {
  const determinate = !forceIndeterminate && typeof percent === 'number'
  const clamped = determinate ? Math.min(100, Math.max(0, percent as number)) : 0
  const animated = useAnimatedPercent(clamped)
  const done = determinate && clamped >= 100

  return (
    <div
      className="space-y-2.5 p-4  border border-zinc-200/80 dark:border-zinc-800 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-900/60 dark:to-zinc-900/30"
      role="status"
      aria-live="polite"
    >
      {(label || determinate) && (
        <div className="flex items-center justify-between gap-4">
          {label ? (
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.06em] text-zinc-700 dark:text-zinc-200">
              <span
                className={`w-1.5 h-1.5  ${
                  done ? 'bg-emerald-500' : determinate ? 'bg-indigo-500 animate-pulse' : 'bg-indigo-400'
                }`}
              />
              {label}
            </p>
          ) : (
            <span />
          )}
          {determinate && (
            <span
              className={`text-xs font-extrabold tabular-nums  px-2 py-0.5 ${
                done
                  ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  : 'text-indigo-600 dark:text-indigo-300 bg-indigo-500/10'
              }`}
            >
              {Math.round(animated)}%
            </span>
          )}
        </div>
      )}
      <div className="h-2.5  bg-zinc-200/90 dark:bg-zinc-800 overflow-hidden relative ring-1 ring-inset ring-black/[0.03] dark:ring-white/[0.04]">
        {determinate ? (
          <div
            className="relative h-full  bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 transition-[width] duration-200 ease-out shadow-[0_0_12px_rgba(99,102,241,0.5)]"
            style={{ width: `${animated}%` }}
          >
            {/* shimmering highlight sweeping across the fill */}
            <span
              aria-hidden
              className={`absolute inset-0  bg-[linear-gradient(110deg,transparent_25%,rgba(255,255,255,0.45)_50%,transparent_75%)] bg-[length:200%_100%] ${
                done ? '' : 'animate-[omni-shimmer_1.6s_linear_infinite]'
              }`}
            />
          </div>
        ) : (
          <div
            className="h-full w-1/3  bg-gradient-to-r from-transparent via-indigo-500 to-transparent animate-[omni-progress_1.3s_ease-in-out_infinite] shadow-[0_0_12px_rgba(99,102,241,0.55)]"
          />
        )}
      </div>
    </div>
  )
}
