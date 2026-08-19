import { useRef, useState } from 'react'
import { Shuffle, ImagePlus, X, RefreshCw } from 'lucide-react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'
import { Field } from '../../components/ui/Field'
import { Select } from '../../components/ui/Select'

const VIBES: Record<string, { label: string; grad: string; bar: string; emojis: string[] }> = {
  chill: { label: 'Chill', grad: 'from-sky-500 to-sky-600', bar: 'bg-sky-500', emojis: ['🌊', '🌅', '☕', '😌', '🍃'] },
  funny: { label: 'Funny', grad: 'from-amber-400 to-amber-500', bar: 'bg-amber-400', emojis: ['😂', '🤣', '🙃', '🫠', '🤡'] },
  aesthetic: { label: 'Aesthetic', grad: 'from-fuchsia-500 to-pink-500', bar: 'bg-fuchsia-500', emojis: ['✨', '📸', '🎞️', '🌸', '💫'] },
  motivational: { label: 'Motivational', grad: 'from-emerald-500 to-teal-500', bar: 'bg-emerald-500', emojis: ['💪', '🔥', '🌱', '🚀', '🌟'] },
}

const OPENERS = [
  "Here's a", 'Check out this', 'Nothing beats a', 'Weekend mood:', 'You need to see this',
  'Throwing it back to', 'PSA:', 'Obsessed with this', 'Mood:', 'POV: you found',
]

const STOP = new Set([
  'this', 'that', 'with', 'from', 'have', 'your', 'youre', 'about', 'into', 'over', 'after', 'photo', 'image',
  'the', 'and', 'for', 'are', 'was', 'were', 'but', 'not', 'just', 'very', 'can', 'will', 'when', 'what', 'them',
])

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

const keywordsFrom = (text: string): string => {
  const words = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w))
  return [...new Set(words)].slice(0, 3).join(', ')
}

const stem = (name: string): string =>
  name.replace(/\.[a-z0-9]+$/i, '').replace(/[-_]+/g, ' ').trim().slice(0, 24) || 'this photo'

function captionFor(subject: string, vibe: string, emoji: string, topic: string): string {
  const s = subject || topic || 'this photo'
  const pick = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)]
  const pools: Record<string, string[]> = {
    chill: [
      `${pick(OPENERS)} ${s}${emoji}`, `slow moments, best moments. ${s}${emoji}`,
      `${s} — no caption needed${emoji}`, `posting ${s} because why not${emoji}`,
      `${s} hits different today${emoji}`, `saved a little calm for the feed — ${s}${emoji}`,
    ],
    funny: [
      `my therapist told me to post ${s} more often${emoji}`, `${s} or I'll scream${emoji}`,
      `warning: ${s} content ahead${emoji}`, `no thoughts, just ${s}${emoji}`,
      `I came, I saw, I posted ${s}${emoji}`, `gatekeeping ${s} is over. we share now${emoji}`,
    ],
    aesthetic: [
      `chasing light — ${s}${emoji}`, `${s} in 4k memories${emoji}`,
      `golden hour thoughts. ${s}${emoji}`, `soft light, ${s}, good day${emoji}`,
      `a little ${s} for your feed${emoji}`, `${s}, but make it a film scene${emoji}`,
    ],
    motivational: [
      `one step at a time. ${s}${emoji}`, `even ${s} starts somewhere${emoji}`,
      `growth looks like ${s}${emoji}`, `keep going — ${s} proves it${emoji}`,
      `future you thanks you for ${s}${emoji}`, `your only competition is yesterday's ${s}${emoji}`,
    ],
  }
  return pick(pools[vibe] || pools.chill)
}

export default function CaptionGenerator() {
  const [subject, setSubject] = useState('sunset at the beach')
  const [vibe, setVibe] = useState('chill')
  const [emojis, setEmojis] = useState(true)
  const [photo, setPhoto] = useState<{ file: File; url: string; topic: string } | null>(null)
  const [detected, setDetected] = useState<string | null>(null)
  const [ocrBusy, setOcrBusy] = useState(false)
  const [captions, setCaptions] = useState<string[]>([])
  const [showAll, setShowAll] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const emojiFor = (v: string) => VIBES[v]?.emojis[Math.floor(Math.random() * VIBES[v].emojis.length)] ?? ''

  const makeCaptions = (count = 5) => {
    const v = VIBES[vibe]
    const em = emojis ? emojiFor(vibe) : ''
    const topic = photo?.topic ?? ''
    const out = new Set<string>()
    let guard = 0
    while (out.size < count && guard++ < 60) out.add(captionFor(subject, vibe, em, topic))
    setCaptions([...out])
    setShowAll(true)
  }

  const addPhoto = async (f: File) => {
    if (!f.type.startsWith('image/')) return
    setPhoto({ file: f, url: URL.createObjectURL(f), topic: stem(f.name) })
    setOcrBusy(true)
    const text = await ocrText(f)
    setOcrBusy(false)
    if (text) {
      const kw = keywordsFrom(text)
      setDetected(kw)
      setPhoto((p) => (p ? { ...p, topic: kw || p.topic } : p))
    } else {
      setDetected(null)
    }
    makeCaptions()
  }

  const replaceOne = (i: number) => {
    setCaptions((prev) => {
      const v = VIBES[vibe]
      const em = emojis ? emojiFor(vibe) : ''
      const next = [...prev]
      let guard = 0
      do {
        next[i] = captionFor(subject, vibe, em, photo?.topic ?? '')
      } while (next[i] === prev[i] && guard++ < 20)
      return next
    })
  }

  const v = VIBES[vibe]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-[1fr_180px_auto] gap-3 items-end">
        <Field label="What's in the post?" value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. sunset at the beach, my new coffee setup…" />
        <Select label="Vibe" value={vibe} onChange={setVibe} options={Object.entries(VIBES).map(([value, cfg]) => ({ value, label: cfg.label }))} />
        <label className="flex items-center gap-2 h-10 px-3 bg-zinc-100 dark:bg-zinc-800 cursor-pointer select-none">
          <input type="checkbox" checked={emojis} onChange={(e) => setEmojis(e.target.checked)} />
          <span className="text-sm font-bold text-zinc-900 dark:text-white">Emojis</span>
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
                {ocrBusy ? 'Reading text from photo…' : detected ? `Detected: ${detected}` : 'Photo ready — captions will reference it'}
              </p>
            </div>
            <button
              type="button"
              aria-label="Remove photo"
              onClick={() => { setPhoto(null); setDetected(null) }}
              className="w-8 h-8 grid place-items-center text-white bg-gradient-to-b from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(225,29,72,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <Button variant="accent" icon={<ImagePlus />} onClick={() => inputRef.current?.click()}>Generate captions from a photo</Button>
        )}
        <div className="flex-1" />
        <Button variant="gradient" size="lg" icon={<Shuffle />} onClick={makeCaptions}>Shuffle captions</Button>
      </div>

      {showAll && captions.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 animate-[omni-fade_0.25s_ease-out]">
          {captions.map((c, i) => (
            <div key={`${c}-${i}`} className="flex items-center gap-3 bg-white dark:bg-zinc-900 shadow-sm px-4 py-3.5">
              <span className={`shrink-0 w-1.5 self-stretch ${v.bar}`} />
              <p className="flex-1 min-w-0 text-[14px] font-medium text-zinc-900 dark:text-white leading-relaxed">{c}</p>
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  aria-label="Regenerate this caption"
                  onClick={() => replaceOne(i)}
                  className="w-8 h-8 grid place-items-center text-white bg-gradient-to-b from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 shadow-[0_1px_2px_rgba(0,0,0,0.18),0_6px_16px_-6px_rgba(245,158,11,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                </button>
                <CopyButton value={c} label="Caption" />
              </div>
            </div>
          ))}
        </div>
      )}

      <p className="text-[11.5px] font-medium text-zinc-500 dark:text-zinc-400">
        Captions stay in your browser. When you add a photo, text in the image is detected locally via OCR to inspire the captions — your photo is never stored.
      </p>
    </div>
  )
}