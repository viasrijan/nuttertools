import { useState } from 'react'

export default function OgPreviewer() {
  const [url, setUrl] = useState('https://github.com/viasrijan/nuttertools')
  const [meta, setMeta] = useState<{ title: string, desc: string, image: string, url: string, icon: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const preview = async () => {
    setLoading(true); setError(''); setMeta(null)
    try {
      const u = new URL(url)
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(u.href)}`)
      if (!res.ok) throw new Error('Fetch failed')
      const html = await res.text()
      const doc = new DOMParser().parseFromString(html, 'text/html')
      const pick = (sel: string[]) => { for (const s of sel) { const el = doc.querySelector(s); if (el?.getAttribute('content')) return el.getAttribute('content')! } return '' }
      const title = pick(['meta[property="og:title"]', 'meta[name="twitter:title"]', 'title']) || u.hostname
      const desc = pick(['meta[property="og:description"]', 'meta[name="twitter:description"]', 'meta[name="description"]'])
      const image = pick(['meta[property="og:image"]', 'meta[name="twitter:image"]'])
      const icon = doc.querySelector('link[rel="icon"], link[rel="shortcut icon"]')?.getAttribute('href') || `${u.origin}/favicon.ico`
      const resolve = (src: string) => src.startsWith('http') ? src : new URL(src, u.origin).href
      setMeta({ title, desc, image: image ? resolve(image) : '', url: u.href, icon: resolve(icon) })
    } catch (e: any) { setError('Could not fetch that URL (CORS or network issue). Try another URL.') }
    finally { setLoading(false) }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div className="flex gap-2">
        <input value={url} onChange={e => setUrl(e.target.value)} className="flex-1 border px-3 h-10 text-sm" placeholder="https://example.com" />
        <button onClick={preview} disabled={loading} className="px-4 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">{loading ? 'Loading…' : 'Preview'}</button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {meta && (
        <>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Google</p>
          <div className="border p-4">
            <div className="text-[13px] text-emerald-700 dark:text-emerald-400">{meta.url}</div>
            <div className="text-lg text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">{meta.title}</div>
            <div className="text-sm text-zinc-600 dark:text-zinc-300 line-clamp-2">{meta.desc}</div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Facebook</p>
          <div className="border p-4 max-w-sm">
            {meta.image ? <img src={meta.image} alt="" className="w-full h-48 object-cover rounded-t" /> : <div className="w-full h-48 grid place-items-center bg-zinc-100 dark:bg-zinc-800 text-zinc-400 text-sm">No image</div>}
            <div className="p-3 bg-zinc-50 dark:bg-zinc-800 rounded-b">
              <div className="text-[10px] uppercase text-zinc-400 font-semibold">{new URL(meta.url).hostname}</div>
              <div className="font-semibold text-sm leading-snug">{meta.title}</div>
              <div className="text-xs text-zinc-500 line-clamp-2">{meta.desc}</div>
            </div>
          </div>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">Twitter</p>
          <div className="border p-4 max-w-sm bg-black text-white rounded-xl overflow-hidden">
            <div className="flex items-center gap-2 px-3 pt-3">
              <div className="w-8 h-8 rounded-full bg-zinc-700 grid place-items-center text-xs">{meta.icon ? <img src={meta.icon} className="w-8 h-8 rounded-full" alt="" /> : '?'}</div>
              <div className="text-sm"><div className="font-semibold">{meta.title}</div></div>
            </div>
            {meta.image && <img src={meta.image} className="w-full h-48 object-cover mt-3" alt="" />}
            <div className="p-3"><p className="text-sm text-zinc-300">{meta.desc}</p></div>
          </div>
        </>
      )}
    </div>
  )
}
