import { useRef, useState } from 'react'

export interface DropFile {
  name: string
  size: number
  url?: string
}

const TRAIL_LAYERS = [
  { size: 150, color: 'rgba(250, 204, 21, 0.10)', blur: 8, dur: 0.5 },
  { size: 130, color: 'rgba(251, 191, 36, 0.07)', blur: 7, dur: 0.65 },
  { size: 110, color: 'rgba(251, 146, 60, 0.06)', blur: 6, dur: 0.8 },
  { size: 95, color: 'rgba(249, 115, 22, 0.05)', blur: 5, dur: 0.95 },
  { size: 80, color: 'rgba(245, 158, 11, 0.04)', blur: 4, dur: 1.1 },
]

export default function DropZone({
  onFiles,
  accept,
  multiple = true,
  label = 'Drop files here or click to browse',
  hint,
  files = [],
  onClear,
}: {
  onFiles: (files: FileList) => void
  accept?: string
  multiple?: boolean
  label?: string
  hint?: string
  files?: DropFile[]
  onClear?: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const moveGlow = (clientX: number, clientY: number, el: HTMLElement) => {
    const wrap = glowRef.current
    if (!wrap) return
    const r = el.getBoundingClientRect()
    const x = clientX - r.left
    const y = clientY - r.top
    for (const child of Array.from(wrap.children) as HTMLElement[]) {
      child.style.transform = `translate(${x}px, ${y}px)`
    }
    wrap.style.opacity = '1'
  }
  const hideGlow = () => { if (glowRef.current && !isDragging) glowRef.current.style.opacity = '0' }

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    const pasted: File[] = []
    if (items) {
      for (const it of Array.from(items)) {
        if (it.kind === 'file') {
          const f = it.getAsFile()
          if (f) pasted.push(f)
        }
      }
    }
    if (pasted.length === 0) return
    e.preventDefault()
    const dt = new DataTransfer()
    pasted.forEach((f) => dt.items.add(f))
    onFiles(dt.files)
  }

  const fmt = (n: number) => (n >= 1024 * 1024 ? (n / 1024 / 1024).toFixed(1) + ' MB' : n >= 1024 ? Math.round(n / 1024) + ' KB' : n + ' B')

  return (
    <div
      tabIndex={0}
      role="button"
      aria-label={label}
      onClick={() => ref.current?.click()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          ref.current?.click()
        }
      }}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
        moveGlow(e.clientX, e.clientY, e.currentTarget)
      }}
      onDragLeave={() => { setIsDragging(false); hideGlow() }}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        hideGlow()
        if (e.dataTransfer.files) onFiles(e.dataTransfer.files)
      }}
      onMouseMove={(e) => moveGlow(e.clientX, e.clientY, e.currentTarget)}
      onMouseLeave={hideGlow}
      onPaste={handlePaste}
      className={`group relative w-full min-h-[260px] flex flex-col items-center justify-center p-8 text-center cursor-pointer outline-none transition-all duration-300 ease-out border-2 border-dashed overflow-hidden ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 scale-[1.01] shadow-[0_0_0_6px_rgba(99,102,241,0.12),0_20px_50px_-20px_rgba(99,102,241,0.45)]'
          : 'border-zinc-300/90 dark:border-zinc-700 bg-gradient-to-b from-zinc-50/80 to-white dark:from-zinc-900/50 dark:to-zinc-900/20 hover:border-indigo-400 dark:hover:border-indigo-500/70 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/[0.06] hover:shadow-[0_10px_36px_-16px_rgba(99,102,241,0.35)]'
      } focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/20`}
    >
      <div
        ref={glowRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ opacity: 0, transition: 'opacity 0.4s ease' }}
      >
        {TRAIL_LAYERS.map((t, i) => (
          <div
            key={i}
            className="absolute top-0 left-0 rounded-full will-change-transform"
            style={{
              width: t.size,
              height: t.size,
              marginLeft: -t.size / 2,
              marginTop: -t.size / 2,
              background: `radial-gradient(circle, ${t.color} 0%, transparent 70%)`,
              filter: `blur(${t.blur}px)`,
              transition: `transform ${t.dur}s cubic-bezier(0.22, 1, 0.36, 1)`,
            }}
          />
        ))}
      </div>
      {files.length > 0 && (
        <div className="relative w-full mb-4 text-left animate-[omni-fade_0.2s_ease-out]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
              {files.length} file{files.length === 1 ? '' : 's'} loaded — ready to work on
            </span>
            {onClear && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onClear() }}
                className="text-[11px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 hover:underline"
              >
                Clear all
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 bg-white dark:bg-zinc-800 px-2.5 py-1.5 shadow-sm">
                {f.url && <img src={f.url} alt="" className="w-8 h-8 object-cover shrink-0" draggable={false} />}
                <div className="min-w-0">
                  <p className="text-[12px] font-bold text-zinc-900 dark:text-white truncate max-w-[160px]">{f.name}</p>
                  <p className="text-[10.5px] font-semibold text-zinc-500 dark:text-zinc-400">{fmt(f.size)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="relative w-16 h-16 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 grid place-items-center mb-4 transition-transform duration-300 group-hover:scale-105">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p className="relative text-sm font-bold text-zinc-900 dark:text-white">{files.length > 0 ? 'Click or drop more files' : label}</p>
      <p className="relative text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1.5">
        {hint || (
          <>
            Click, drag &amp; drop, or press{' '}
            <kbd className="px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 font-mono text-[10.5px]">Ctrl+V</kbd>{' '}
            to paste
          </>
        )}
      </p>
      <input
        ref={ref}
        type="file"
        accept={accept}
        multiple={multiple}
        className="hidden"
        onChange={(e) => e.target.files && onFiles(e.target.files)}
      />
    </div>
  )
}