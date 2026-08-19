import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result } from '../../components/ui/Result'

const SYLLABLES = /[aiouy]+e*|e[aiou]|ea|oa|ee|oo|iou|[^aeiou\s][aeiou][^aeiou]*/gi

export default function ReadabilityScore() {
  const [text, setText] = useState('The quick brown fox jumps over the lazy dog. A short sentence is easy to read. This longer passage contains words like nevertheless and consequently which increase the difficulty for readers.')

  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  const words = text.trim().split(/\s+/).filter(Boolean)
  const syllables = words.reduce((acc, w) => acc + countSyllables(w), 0)

  const fre = words.length && sentences.length ? 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length) : 0
  const fkGrade = words.length && sentences.length ? 0.39 * (words.length / sentences.length) + 11.8 * (syllables / words.length) - 15.59 : 0
  const avgLen = words.length ? words.reduce((a, w) => a + w.length, 0) / words.length : 0
  const hard = words.filter((w) => countSyllables(w) >= 3).length

  const label = (v: number) => {
    if (v >= 90) return 'Very easy'
    if (v >= 70) return 'Easy'
    if (v >= 50) return 'Fairly difficult'
    if (v >= 30) return 'Difficult'
    return 'Very difficult'
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Your text</span>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="w-full p-3 text-[14px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        <Result label="Flesch Reading Ease" value={`${fre.toFixed(1)}`} tone="good" />
        <Result label="Reading level" value={label(fre)} tone="good" />
        <Result label="Flesch-Kincaid grade" value={`${fkGrade.toFixed(1)}`} />
        <Result label="Words" value={words.length.toLocaleString()} />
        <Result label="Sentences" value={sentences.length.toLocaleString()} />
        <Result label="Syllables" value={syllables.toLocaleString()} />
        <Result label="Avg word length" value={`${avgLen.toFixed(1)} chars`} />
        <Result label="Hard words (3+ syllables)" value={`${hard} (${words.length ? Math.round((hard / words.length) * 100) : 0}%)`} />
      </div>
      <div className="p-4 bg-zinc-100 dark:bg-zinc-800">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1.5">
          <span>Hard to read</span>
          <span>Easy to read</span>
        </div>
        <div className="h-2 bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-500 relative">
          <div className="absolute -top-1.5 w-0.5 h-5 bg-zinc-900 dark:bg-white" style={{ left: `${Math.max(0, Math.min(100, ((fre + 10) / 120) * 100))}%` }} />
        </div>
      </div>
    </div>
  )
}

function countSyllables(w: string): number {
  const s = w.toLowerCase().replace(/[^a-z]/g, '')
  if (!s) return 0
  if (s.length <= 3) return 1
  let n = (s.match(/[aeiouy]+/g) || []).length
  if (s.endsWith('e') && n > 1) n--
  if (s.endsWith('le') && s.length > 2 && !'aeiouy'.includes(s[s.length - 3])) n = Math.max(1, n)
  return Math.max(1, n)
}