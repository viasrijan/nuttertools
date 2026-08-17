import { useEffect, useRef, useState } from 'react'

import { Button } from '../../components/ui/Button'

const SAMPLE = 'the quick brown fox jumps over the lazy dog the quick brown fox jumps over the lazy dog'

export default function TypingTest() {
  const [words, setWords] = useState<string[]>(SAMPLE.split(' '))
  const [input, setInput] = useState('')
  const [started, setStarted] = useState<number | null>(null)
  const [done, setDone] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { inputRef.current?.focus() }, [])

  const onChange = (v: string) => {
    if (!started) setStarted(Date.now())
    setInput(v)
    const typed = v.trim().split(/\s+/)
    if (typed.length === words.length && v.endsWith(' ')) { setDone(true); setInput('') }
  }

  const elapsed = started ? (Date.now() - started) / 1000 / 60 : 0
  const typedWords = input.trim() ? input.trim().split(/\s+/).length : 0
  const wpm = elapsed > 0 && typedWords > 0 ? Math.round(typedWords / elapsed) : 0
  const accuracy = (() => {
    const target = words.slice(0, typedWords).join(' ')
    const typed = input.trim()
    let correct = 0
    for (let i = 0; i < Math.min(target.length, typed.length); i++) if (target[i] === typed[i]) correct++
    return typed.length ? Math.round((correct / typed.length) * 100) : 100
  })()

  const restart = () => {
    const pool = 'the quick brown fox jumps over the lazy dog one two three four five six seven eight nine ten time flies like an arrow fruit flies like a banana'.split(' ')
    setWords(Array.from({ length: 30 }, () => pool[Math.floor(Math.random() * pool.length)]))
    setInput(''); setStarted(null); setDone(false)
  }

  return (
    <div className="space-y-5 max-w-2xl omni-rise">
      <div className="grid grid-cols-4 gap-2">
        <Stat v={wpm} l="WPM" />
        <Stat v={`${accuracy}%`} l="Accuracy" />
        <Stat v={typedWords} l="Words" />
        <Stat v={started ? Math.floor((Date.now() - started) / 1000) : 0} l="Seconds" />
      </div>
      <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-6 text-lg leading-relaxed font-medium select-none transition-all duration-200">
        {words.map((w, i) => {
          const typed = input.split(' ')[i] || ''
          let cls = 'text-zinc-900 dark:text-white'
          if (typed !== '') {
            if (typed === w) cls = 'text-emerald-500'
            else cls = 'text-red-500'
          } else if (i === typedWords) cls = 'text-zinc-900 dark:text-white bg-sky-100 dark:bg-sky-500/20'
          return <span key={i} className={`mr-2 ${cls}`}>{w}</span>
        })}
      </div>
      <input
        ref={inputRef}
        value={input}
        onChange={e => onChange(e.target.value)}
        disabled={done}
        placeholder={done ? 'Done! Click new words to go again.' : 'Start typing…'}
        className="w-full border px-4 h-12 text-base"
      />
      <Button variant="secondary" onClick={restart}>New words</Button>
    </div>
  )
}

function Stat({ v, l }: { v: number | string, l: string }) {
  return <div className=" border border-zinc-200/80 dark:border-zinc-700/80 bg-white/50 dark:bg-zinc-900/50 p-4 text-center transition-all duration-200"><div className="text-xl font-bold">{v}</div><div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">{l}</div></div>
}
