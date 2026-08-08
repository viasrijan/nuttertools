import { useMemo, useState } from 'react'

export default function ReadingTime() {
  const [text, setText] = useState('')
  const [wpm, setWpm] = useState('200')

  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const sentences = (text.match(/[.!?]+(\s|$)/g) || []).length
    const avg = words / (sentences || 1)
    const speed = Math.max(1, parseFloat(wpm) || 200)
    const readMin = words / speed
    const speakMin = words / 130
    const hmm = Math.ceil(words / 150) / 2
    return { words, chars, charsNoSpace: text.replace(/\s/g, '').length, sentences, avg: avg.toFixed(1), readSec: Math.round(readMin * 60), speakSec: Math.round(speakMin * 60), hmm }
  }, [text, wpm])

  const fmt = (s: number) => s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.words.toLocaleString()}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Words</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.chars.toLocaleString()}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Characters</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.sentences}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Sentences</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{stats.avg}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Avg words/sentence</div></div>
        <div className="border p-3 text-center"><div className="text-xl font-bold">{fmt(stats.readSec)}</div><div className="text-[11px] font-semibold text-zinc-900 dark:text-white">Reading time</div></div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Reading speed (WPM)</label>
        <input type="number" value={wpm} onChange={e => setWpm(e.target.value)} className="border px-2 py-2 w-24" />
        <span className="text-xs text-zinc-500">avg 200 · slow 130 · fast 300</span>
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Paste text…" className="w-full h-[240px] border p-3 text-sm" />
      <div className="flex gap-4 text-sm text-zinc-900 dark:text-white">
        <span><b>{fmt(stats.speakSec)}</b> speaking aloud (130 WPM)</span>
        <span><b>{fmt(stats.hmm)}</b> by slow readers (150 WPM)</span>
      </div>
    </div>
  )
}
