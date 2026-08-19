import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'

export default function HeicToJpg() {
  const [items, setItems] = useState<any[]>([])
  const [status, setStatus] = useState('')

  const dropFiles: DropFile[] = items.filter((i) => i.url).map((i) => ({ name: i.name, size: 0, url: i.url }))

  const onFiles = async (fl: FileList) => {
    const arr = Array.from(fl)
    setStatus('Converting…')
    try {
      const heic2any = (await import('heic2any')).default as any
      const out = await Promise.all(arr.map(async (f) => {
        try {
          const blob = await heic2any({ blob: f, toType: 'image/jpeg', quality: 0.8 })
          const url = URL.createObjectURL(Array.isArray(blob) ? blob[0] : blob)
          return { name: f.name.replace(/\.heic$/i, '.jpg'), url }
        } catch (e) {
          return { name: f.name, error: String(e) }
        }
      }))
      setItems(out)
      setStatus(`Done — ${out.filter((i) => i.url).length} converted`)
    } catch {
      setStatus('HEIC support could not load — try JPG/PNG for now.')
    }
  }

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept=".heic,.heif,image/*"
        files={dropFiles}
        onClear={() => { setItems([]); setStatus('') }}
        label="Drop HEIC files from iPhone"
      />
      {status && <p className="text-[13px] font-bold text-zinc-600 dark:text-zinc-300">{status}</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {items.map((it, i) => (
          <div key={i} className="bg-zinc-100 dark:bg-zinc-800 p-2">
            {it.url ? (
              <>
                <img src={it.url} className="w-full h-32 object-contain" alt="" />
                <a href={it.url} download={it.name} className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-1.5 block">{it.name} — Download</a>
              </>
            ) : (
              <p className="text-xs font-semibold text-rose-600 p-2">{it.name}: {it.error}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}