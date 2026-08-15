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
      className={`w-full min-h-[260px] rounded-none flex flex-col items-center justify-center border-2 border-dashed p-8 text-center cursor-pointer transition-all duration-200 outline-none ${
        isDragging
          ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
          : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-900/40 hover:bg-zinc-100/80 dark:hover:bg-zinc-900'
      } focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20`}
    >
      <div className="w-14 h-14 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 grid place-items-center text-xl mb-3 shadow-sm">
        📁
      </div>
      <p className="text-sm font-bold text-zinc-900 dark:text-white">{label}</p>
      <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1.5">Click, drag & drop, or press <kbd className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-mono text-[11px]">Ctrl+V</kbd> to paste</p>
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => e.target.files && onFiles(e.target.files)} />
    </div>
  )
}
