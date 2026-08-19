import { useEffect, useRef, useState } from 'react'

/**
 * Copy-to-clipboard button with animated "Copied!" feedback.
 * Fails silently when the clipboard API is unavailable.
 */
export default function CopyButton({
  value,
  label = 'Copy',
  size = 'sm',
  variant = 'subtle',
  className = '',
}: {
  value: string
  label?: string
  size?: 'sm' | 'md'
  variant?: 'subtle' | 'ghost' | 'outline'
  className?: string
}) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current)
  }, [])

  const copy = async () => {
    if (!value) return
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = value
      document.body.appendChild(ta)
      ta.select()
      try { document.execCommand('copy') } catch { /* noop */ }
      document.body.removeChild(ta)
    }
    setCopied(true)
    if (timer.current) clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setCopied(false), 1600)
  }

  const sizes = size === 'sm' ? 'h-8 px-3 text-xs gap-1.5' : 'h-10 px-4 text-sm gap-2'
  const variants = {
    subtle:
      'text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(79,70,229,0.55)]',
    ghost:
      'text-white bg-zinc-800 hover:bg-zinc-700 dark:bg-zinc-600 dark:hover:bg-zinc-500 shadow-[0_1px_2px_rgba(0,0,0,0.2),0_6px_16px_-8px_rgba(0,0,0,0.5)]',
    outline:
      'text-white bg-gradient-to-b from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(14,165,233,0.55)]',
  }

  return (
    <button
      type="button"
      onClick={copy}
      disabled={!value}
      aria-label={copied ? 'Copied' : `Copy ${label.toLowerCase()}`}
      className={`inline-flex items-center justify-center font-bold transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-40 disabled:pointer-events-none ${
        copied
          ? 'text-white bg-gradient-to-b from-emerald-500 to-emerald-600 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(5,150,105,0.55)]'
          : variants[variant]
      } ${sizes} ${className}`}
    >
      {copied ? (
        <>
          <svg className="w-3.5 h-3.5 omni-pop" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span className="omni-pop">Copied!</span>
        </>
      ) : (
        <>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2.5" />
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  )
}
