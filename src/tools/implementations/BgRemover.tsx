import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import Progress from '../../components/Progress'

const PROXY = '/api/proxy?service=removebg'

export default function BgRemover() {
  const [file, setFile] = useState<{ name: string, size: number, url: string } | null>(null)
  const [out, setOut] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [engine, setEngine] = useState('')

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size, url: file.url }] : []

  const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(f)
  })

  const localRemove = async (f: File) => {
    const mod = await import('@imgly/background-removal').catch(() => null)
    if (!mod) throw new Error('Background removal engine failed to load.')
    return mod.removeBackground(f)
  }

  const onFiles = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setFile({ name: f.name, size: f.size, url: URL.createObjectURL(f) })
    setOut('')
    setLoading(true)
    setError('')
    setEngine('')
    try {
      setEngine('server')
      const b64 = await fileToBase64(f)
      const res = await fetch(PROXY, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ image: b64, size: 'auto' }),
      })
      if (res.ok) {
        const blob = await res.blob()
        setOut(URL.createObjectURL(blob))
      } else {
        throw new Error(`server (${res.status})`)
      }
    } catch (e) {
      console.log('proxy bg removal failed, falling back to local AI', e)
      try {
        setEngine('local')
        const blob = await localRemove(f)
        setOut(URL.createObjectURL(blob))
      } catch (e2) {
        console.log(e2)
        setError('Background removal failed. The local engine could not load — try again or use a different browser.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="space-y-5">
      <DropZone
        onFiles={onFiles}
        accept="image/*"
        multiple={false}
        files={dropFiles}
        onClear={() => { setFile(null); setOut('') }}
        label="Drop a photo to remove its background"
      />
      {loading && <Progress label={engine === 'server' ? 'Removing background…' : 'Removing background with local AI… first run downloads the model (~40 MB)'} />}
      {error && <p className="text-sm font-semibold text-rose-600">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {file && <div><p className="text-[12px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400 mb-1">Original</p><img src={file.url} className="bg-zinc-100 dark:bg-zinc-800" alt="" /></div>}
        {out && (
          <div>
            <p className="text-[12px] font-bold uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1">No background</p>
            <div className="bg-[repeating-conic-gradient(#f4f4f5_0%_25%,#fff_0%_50%)] dark:bg-[repeating-conic-gradient(#27272a_0%_25%,#18181b_0%_50%)] bg-[length:16px_16px]"><img src={out} alt="" /></div>
            <a href={out} download="no-bg.png" className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline mt-2 block">Download PNG</a>
          </div>
        )}
      </div>
    </div>
  )
}