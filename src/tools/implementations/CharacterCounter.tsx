import { useState } from 'react'
import { Result } from '../../components/ui/Result'

export default function CharacterCounter() {
  const [text, setText] = useState('')

  const chars = text.length
  const charsNoSpaces = text.replace(/\s/g, '').length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim()).length
  const lines = text ? text.split('\n').length : 0
  const bytes = new Blob([text]).size
  const readingMin = words / 200
  const speakingMin = words / 130

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Type or paste your text</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} autoFocus className="w-full p-3 text-[14px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" placeholder="Start typing…" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Result label="Characters" value={chars.toLocaleString()} tone="good" />
        <Result label="Characters (no spaces)" value={charsNoSpaces.toLocaleString()} />
        <Result label="Words" value={words.toLocaleString()} />
        <Result label="Sentences" value={sentences.toLocaleString()} />
        <Result label="Lines" value={lines.toLocaleString()} />
        <Result label="Bytes (UTF-8)" value={bytes.toLocaleString()} />
        <Result label="Reading time" value={`${readingMin < 1 ? 'Under a minute' : readingMin.toFixed(1) + ' min'}`} />
        <Result label="Speaking time" value={`${speakingMin < 1 ? 'Under a minute' : speakingMin.toFixed(1) + ' min'}`} />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="p-4 bg-zinc-100 dark:bg-zinc-800">
          <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">Social platform limits</p>
          {[['X / Twitter', 280], ['Facebook post', 63206], ['Instagram caption', 2200], ['LinkedIn post', 3000], ['SMS', 160]].map(([name, limit]) => {
            const l = limit as number
            const ok = chars <= l
            return (
              <div key={name as string} className="flex items-center justify-between py-1 text-sm">
                <span className="font-semibold text-zinc-700 dark:text-zinc-300">{name}</span>
                <b className={ok ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}>{chars.toLocaleString()} / {l.toLocaleString()}</b>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}