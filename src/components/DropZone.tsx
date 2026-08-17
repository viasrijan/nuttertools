import { useRef, useState } from 'react'

export default function DropZone({
  onFiles,
  accept,
  multiple = true,
  label = 'Drop files here or click to browse',
  hint,
}: {
  onFiles: (files: FileList) => void
  accept?: string
  multiple?: boolean
  label?: string
  hint?: string
}) {
  const ref = useRef<HTMLInputElement>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handlePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items
    const files: File[] = []
    if (items) {
      for (const it of Array.from(items)) {
        if (it.kind === 'file') {
          const f = it.getAsFile()
          if (f) files.push(f)
        }
      }
    }
    if (files.length === 0) return
    e.preventDefault()
    const dt = new DataTransfer()
    files.forEach((f) => dt.items.add(f))
    onFiles(dt.files)
  }

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
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault()
        setIsDragging(false)
        if (e.dataTransfer.files) onFiles(e.dataTransfer.files)
      }}
      onPaste={handlePaste}
      className={`group relative w-full min-h-[260px]  flex flex-col items-center justify-center p-8 text-center cursor-pointer outline-none transition-all duration-300 ease-out border-2 border-dashed overflow-hidden ${
        isDragging
          ? 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 scale-[1.01] shadow-[0_0_0_6px_rgba(99,102,241,0.12),0_20px_50px_-20px_rgba(99,102,241,0.45)]'
          : 'border-zinc-300/90 dark:border-zinc-700 bg-gradient-to-b from-zinc-50/80 to-white dark:from-zinc-900/50 dark:to-zinc-900/20 hover:border-indigo-400 dark:hover:border-indigo-500/70 hover:bg-indigo-50/30 dark:hover:bg-indigo-500/[0.06] hover:shadow-[0_10px_36px_-16px_rgba(99,102,241,0.35)]'
      } focus-visible:border-indigo-500 focus-visible:ring-4 focus-visible:ring-indigo-500/20`}
    >
      {/* soft radial glow behind icon */}
      <div
        aria-hidden
        className={`pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-72 h-48  blur-3xl transition-all duration-500 ${
          isDragging ? 'bg-indigo-400/25' : 'bg-indigo-400/0 group-hover:bg-indigo-400/10'
        }`}
      />
      <div
        className={`relative w-16 h-16  grid place-items-center mb-4 transition-all duration-300 ${
          isDragging
            ? 'bg-gradient-to-br from-indigo-500 to-violet-500 text-white scale-110 rotate-3 shadow-[0_12px_28px_-8px_rgba(99,102,241,0.6)]'
            : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 group-hover:bg-gradient-to-br group-hover:from-indigo-500 group-hover:to-violet-500 group-hover:text-white group-hover:scale-105 group-hover:-rotate-3 group-hover:shadow-[0_10px_24px_-8px_rgba(99,102,241,0.55)]'
        }`}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>
      <p className="relative text-sm font-bold text-zinc-900 dark:text-white">{label}</p>
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
