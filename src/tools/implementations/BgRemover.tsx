import { useState } from 'react'
import DropZone from '../../components/DropZone'

const PROXY = '/api/proxy?service=removebg'

export default function BgRemover(){
  const [orig,setOrig]=useState<string>("")
  const [out,setOut]=useState<string>("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [engine, setEngine] = useState("")

  const fileToBase64 = (f: File) => new Promise<string>((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(f)
  })

  const localRemove = async (file: File) => {
    const mod = await import('@imgly/background-removal').catch(() => null)
    if (!mod) throw new Error('Background removal engine failed to load.')
    return mod.removeBackground(file)
  }

  const onFiles = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setOrig(URL.createObjectURL(file))
    setOut("")
    setLoading(true)
    setError("")
    setEngine("")
    try {
      setEngine('server')
      const b64 = await fileToBase64(file)
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
        const blob = await localRemove(file)
        setOut(URL.createObjectURL(blob))
      } catch (e2) {
        console.log(e2)
        setError('Background removal failed. The local engine could not load — try again or use a different browser.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <DropZone onFiles={onFiles} accept="image/*" multiple={false} />
      {loading && <p className="text-sm animate-pulse">{engine === 'server' ? 'Removing background...' : 'Removing background with local AI... first run downloads the model (~40MB)'}</p>}
      {error && <p className="text-sm text-red-500 font-medium">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        {orig && <div><p className="text-xs mb-1">Original</p><img src={orig} className="border bg-zinc-200" /></div>}
        {out && <div><p className="text-xs mb-1">No Background</p><div className="border bg-zinc-100 dark:bg-zinc-800"><img src={out} /></div><a href={out} download="no-bg.png" className="text-xs underline mt-2 block">Download PNG</a></div>}
      </div>
    </div>
  )
}
