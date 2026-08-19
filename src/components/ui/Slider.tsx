import React from 'react'

export interface SliderProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  label: string
  value: number
  min: number
  max: number
  step?: number
  display?: string
  onChange: (v: number) => void
}

export function Slider({ label, value, min, max, step = 1, display, onChange, className = '', ...props }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <label className={`block select-none ${className}`}>
      <span className="flex items-baseline justify-between gap-3 mb-2">
        <span className="text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">{label}</span>
        <span className="text-[13px] font-extrabold tabular-nums text-indigo-600 dark:text-indigo-400">{display ?? value}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className={`nt-range w-full cursor-pointer ${className}`}
        style={{ ['--fill' as any]: `${pct}%` }}
        {...props}
      />
    </label>
  )
}
