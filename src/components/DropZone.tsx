import { useRef, useState } from 'react'

export default function DropZone({ onFiles, accept, multiple = true, label = "Drop files here or click to browse" }: { onFiles: (files: FileList) => void, accept?: string, multiple?: boolean, label?: string }) {
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
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') ref.current?.click() }}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files) onFiles(e.dataTransfer.files) }}
      onPaste={handlePaste}
      className={`w-full min-h-[320px] rounded-3xl flex flex-col items-center justify-center border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 outline-none ${
        isDragging
          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/20 scale-[0.99]'
          : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 hover:bg-zinc-50/80 dark:hover:bg-zinc-900/50'
      } focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15`}
    >
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-800 grid place-items-center text-3xl mb-4 shadow-sm border border-zinc-200/80 dark:border-zinc-700/80 group-hover:scale-105 transition-transform">
        📂
      </div>
      <p className="text-base font-semibold text-zinc-900 dark:text-white">{label}</p>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1.5">Click, drag & drop, or press <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[11px]">Ctrl+V</kbd> to paste</p>
      <p className="text-[11px] font-medium text-zinc-400 dark:text-zinc-500 mt-1">100% private & client-side • No file upload limits</p>
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => e.target.files && onFiles(e.target.files)} />
    </div>
  )
}
