import { useState } from 'react'

export default function TextReverser() {
  const [text, setText] = useState('Hello world this is NutterTools')
  const [mode, setMode] = useState<'chars' | 'words' | 'lines' | 'case'>('chars')

  const run = () => {
    if (mode === 'chars') return text.split('').reverse().join('')
    if (mode === 'words') return text.split(/\s+/).reverse().join(' ')
    if (mode === 'lines') return text.split('\n').reverse().join('\n')
    if (mode === 'case') return text.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('')
    return ''
  }

  const modes: { id: typeof mode, label: string }[] = [
    { id: 'chars', label: 'Reverse characters' },
    { id: 'words', label: 'Reverse words' },
    { id: 'lines', label: 'Reverse lines' },
    { id: 'case', label: 'Invert case' },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {modes.map(m => (
          <button key={m.id} onClick={() => setMode(m.id)} className={`px-3 h-9 text-sm border ${mode === m.id ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{m.label}</button>
        ))}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-32 border p-3 text-sm" />
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(run())} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Copy result</button>
      </div>
      <div className="border p-4 bg-zinc-50 dark:bg-zinc-800 font-mono text-sm whitespace-pre-wrap break-words">{run()}</div>
    </div>
  )
}
