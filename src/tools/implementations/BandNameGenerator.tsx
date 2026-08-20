import { useRef, useState } from 'react'
import { Shuffle, ImagePlus, X, RefreshCw, Music2 } from 'lucide-react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'
import { Field } from '../../components/ui/Field'
import { Select } from '../../components/ui/Select'

const ADJ = ['Atomic', 'Velvet', 'Midnight', 'Electric', 'Golden', 'Neon', 'Broken', 'Silver', 'Lucky', 'Angry', 'Cosmic', 'Tiny', 'Wild', 'Frozen', 'Starlight', 'Dirty', 'Pretty', 'Giant', 'Hollow', 'Restless', 'Solar', 'Moonlit', 'Crimson', 'Jade', 'Turbulent', 'Sweet', 'Savage', 'Quiet']
const NOUN = ['Felines', 'Rabbits', 'Kings', 'Pigeons', 'Volcanoes', 'Slippers', 'Orchids', 'Pianos', 'Comets', 'Cheeseburgers', 'Umbrellas', 'Camels', 'Teapots', 'Fireflies', 'Biscuits', 'Wolves', 'Ghosts', 'Locomotives', 'Marigolds', 'Satellites', 'Astronauts', 'Crickets', 'Mannequins', 'Paperclips']
const SUFFIX = ['& the Misfits', 'and the Robots', 'Express', 'Club', 'Avenue', 'Wars', 'Parade', 'Inc.', 'Collective', 'Hour', 'District', 'Society', 'Bureau', 'Patrol']

const STOP = new Set([
  'this', 'that', 'with', 'from', 'have', 'your', 'about', 'into', 'over', 'after', 'photo', 'image', 'the', 'and', 'for', 'are', 'was', 'were', 'but', 'not', 'just', 'very', 'can', 'will', 'when', 'what', 'them', 'band', 'name',
])

const STYLES = [
  { v: 'The ___ ___', label: 'The ___ ___' },
  { v: '___ and the ___', label: '___ and the ___' },
  { v: '___ ___ Club', label: '___ ___ Club' },
  { v: '___ ___', label: '___ ___' },
  { v: 'The ___', label: 'The ___' },
]

const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const r = new FileReader()
    r.onload = () => resolve(String(r.result).split(',')[1])
    r.onerror = reject
    r.readAsDataURL(file)
  })

const ocrText = async (file: File): Promise<string | null> => {
  try {
    const image = await fileToBase64(file)
    const res = await fetch('/api/proxy?service=ocrspace', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image, mime: file.type }),
    })
    if (!res.ok) return null
    const data = await res.json()
    const text = (data?.ParsedResults?.map((r: { ParsedText?: string }) => r.ParsedText || '').join(' ') || '').trim()
    return text || null
  } catch {
    return null
  }
}

const keywordsFrom = (text: string): string[] => {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w))
  return [...new Set(words)].slice(0, 4)
}

const stem = (name: string): string =>
  name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim().slice(0, 24)

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)]

const cap = (w: string): string => w.charAt(0).toUpperCase() + w.slice(1)

function makeName(style: string, keywords: string[]): string {
  const kw = keywords.filter((k) => k.trim())
  const a = pick(ADJ)
  const b = pick(NOUN)
  const k = kw.length > 0 ? cap(pick(kw)) : pick(NOUN)
  switch (style) {
    case 'The ___ ___':
      return `The ${Math.random() < 0.35 && kw.length > 0 ? `${k} ${a}` : `${a} ${k}`} ${b}`
    case '___ and the ___':
      return `${Math.random() < 0.4 && kw.length > 0 ? k : a} and the ${Math.random() < 0.4 && kw.length > 0 ? b : k}`
    case '___ ___ Club':
      return `${Math.random() < 0.4 && kw.length > 0 ? k : a} ${b} ${pick(SUFFIX).split(' ').pop()}`
    case 'The ___':
      return `The ${Math.random() < 0.5 && kw.length > 0 ? k : a} ${b}`
    default:
      return `${a} ${b} ${pick(SUFFIX)}`
  }
}

export default function BandNameGenerator() {
  const [keywords, setKeywords] = useState('')
  const [style, setStyle] = useState('The ___ ___')
  const [count, setCount] = useState('8')
  const [names, setNames] = useState<string[]>([])
  const [photo, setPhoto] = useState<{ file: File; url: string; topic: string } | null>(null)
  const [detected, setDetected] = useState<string | null>(null)
  const [ocrBusy, setOcrBusy] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const kwList = () => {
    const manual = keywords.split(/[,;\n]+/).map((s) => s.trim()).filter((s) => s.length > 1)
    const ocr = detected ? detected.split(',').map((s) => s.trim()).filter(Boolean) : []
    return [...manual, ...ocr]
  }

  const gen = () => {
    const n = Math.min(50, parseInt(count) || 8)
    const kws = kwList()
    const out = new Set<string>()
    let guard = 0
    while (out.size < n && guard++ < 200) out.add(makeName(style, kws))
    setNames([...out])
  }

  const replaceOne = (i: number) => {
    setNames((prev) => {
      const next = [...prev]
      let guard = 0
      do {
        next[i] = makeName(style, kwList())
      } while (next[i] === prev[i] && guard++ < 20)
      return next
    })
  }

  const addPhoto = async (f: File) => {
    if (!f.type.startsWith('image/')) return
    setPhoto({ file: f, url: URL.createObjectURL(f), topic: stem(f.name) })
    setOcrBusy(true)
    const text = await ocrText(f)
    setOcrBusy(false)
    if (text) {
      const kw = keywordsFrom(text)
      setDetected(kw.join(', '))
      if (kw.length > 0) gen()
    } else {
      setDetected(null)
    }
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_110px] gap-3 items-end">
        <Field
          label="Keywords / vibe"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="e.g. desert, neon, midnight city…"
        />
        <Select label="Style" value={style} onChange={setStyle} options={STYLES.map((s) => ({ value: s.v, label: s.label }))} />
        <label className="block">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300 mb-1.5">Names</span>
          <input type="number" min={1} max={50} value={count} onChange={(e) => setCount(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) addPhoto(f); e.target.value = '' }}
        />
        {photo ? (
          <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 shadow-sm px-3 py-2 max-w-full">
            <img src={photo.url} alt="" className="w-10 h-10 object-cover" />
            <div className="min-w-0">
              <p className="text-[12.5px] font-bold text-zinc-900 dark:text-white truncate max-w-[180px]">{photo.file.name}</p>
              <p className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">
                {ocrBusy ? 'Reading words from the image…' : detected ? `Ideas found: ${detected}` : 'Image ready — words in it will inspire names'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove image"
              onClick={() => { setPhoto(null); setDetected(null) }}
              className="w-10 h-10 grid place-items-center text-white bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(225,29,72,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button variant="accent" icon={<ImagePlus />} onClick={() => inputRef.current?.click()}>Get ideas from an image</Button>
        )}
        <div className="flex-1" />
        <Button variant="gradient" size="lg" icon={<Shuffle />} onClick={gen}>Generate band names</Button>
      </div>

      {names.length > 0 && (
        <div className="space-y-2 animate-[omni-fade_0.25s_ease-out]">
          {names.map((n, i) => (
            <div key={`${n}-${i}`} className="flex items-center gap-3 bg-white dark:bg-zinc-900 shadow-sm px-4 py-3">
              <Music2 className="shrink-0 w-4 h-4 text-zinc-400 dark:text-zinc-500" strokeWidth={2.2} />
              <p className="flex-1 min-w-0 text-[15px] font-bold text-zinc-900 dark:text-white truncate">{n}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  aria-label="Regenerate this name"
                  onClick={() => replaceOne(i)}
                  className="w-10 h-10 grid place-items-center text-white bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.18),0_6px_16px_-6px_rgba(245,158,11,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <CopyButton value={n} label="Name" />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11.5px] font-medium text-zinc-500 dark:text-zinc-400">
        Keywords and text found in your image are woven into the names — everything stays in your browser, and your image is never stored.
      </p>
    </div>
  )
}
