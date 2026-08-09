import { useRef } from 'react'

export default function DropZone({ onFiles, accept, multiple = true, label = "Drop files here or click to browse" }: { onFiles: (files: FileList) => void, accept?: string, multiple?: boolean, label?: string }) {
  const ref = useRef<HTMLInputElement>(null)

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
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) => { e.preventDefault(); if (e.dataTransfer.files) onFiles(e.dataTransfer.files) }}
      onPaste={handlePaste}
      className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-8 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/30"
    >
      <div className="text-3xl mb-2">📁</div>
      <p className="text-sm font-medium">{label}</p>
      <p className="text-xs font-medium text-zinc-900 dark:text-white mt-1">Click, drop, or press Ctrl+V to paste</p>
      <p className="text-xs font-medium text-zinc-900 dark:text-white mt-0.5 opacity-60">Works on desktop, tablet and phone</p>
      <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={(e) => e.target.files && onFiles(e.target.files)} />
    </div>
  )
}
