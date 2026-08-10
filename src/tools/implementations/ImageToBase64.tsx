import { useRef, useState } from 'react'

export default function ImageToBase64() {
  const [dataUrl, setDataUrl] = useState('')
  const [name, setName] = useState('')
  const [size, setSize] = useState(0)
  const [copied, setCopied] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = (file: File) => {
    if (!file.type.startsWith('image/')) return
    const reader = new FileReader()
    reader.onload = () => {
      setDataUrl(String(reader.result))
      setName(file.name)
      setSize(file.size)
    }
    reader.readAsDataURL(file)
  }

  const copy = async () => {
    await navigator.clipboard.writeText(dataUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([dataUrl], { type: 'text/plain' }))
    a.download = `${name || 'image'}.txt`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const f = e.dataTransfer.files?.[0]; if (f) handle(f) }}
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 p-10 text-center cursor-pointer hover:border-indigo-600 transition">
        <p className="text-sm font-semibold text-zinc-900 dark:text-white">Drop an image here or click to browse</p>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">The data URL can be very long for large images</p>
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) handle(f) }} />
      </div>
      {dataUrl && (
        <div className="space-y-3">
          <div className="flex items-center gap-4 flex-wrap">
            <img src={dataUrl} alt="" className="w-20 h-20 object-contain border bg-white dark:bg-zinc-900 p-1" />
            <div className="text-sm">
              <div className="font-bold text-zinc-900 dark:text-white">{name}</div>
              <div className="text-zinc-500 dark:text-zinc-400 font-mono mt-0.5">{(size / 1024).toFixed(1)} KB → data URL {(dataUrl.length / 1024).toFixed(1)} KB</div>
            </div>
          </div>
          <textarea value={dataUrl} readOnly rows={6} spellCheck={false}
            className="w-full border bg-transparent p-3 font-mono text-[12px] text-zinc-900 dark:text-white outline-none break-all" />
          <div className="flex flex-wrap gap-2">
            <button onClick={copy} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm font-semibold">{copied ? 'Copied!' : 'Copy data URL'}</button>
            <button onClick={download} className="px-5 h-10 text-sm font-semibold ring-1 ring-zinc-200 dark:ring-zinc-800">Download as .txt</button>
          </div>
        </div>
      )}
    </div>
  )
}
