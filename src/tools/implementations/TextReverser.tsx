import { useState } from 'react'

import { Button } from '../../components/ui/Button'

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
    <div className="space-y-5">
      <div className="flex flex-wrap gap-2.5">
        {modes.map(m => (
          <Button variant="outline" key={m.id} onClick={() => setMode(m.id)} className={`px-3 h-9 text-sm  ${mode === m.id ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{m.label}</Button>
        ))}
      </div>
      <textarea value={text} onChange={e => setText(e.target.value)} className="w-full h-32 border p-3 text-sm" />
      <div className="flex gap-2.5">
        <Button variant="secondary" size="sm" onClick={() => navigator.clipboard.writeText(run())}>Copy result</Button>
      </div>
      <div className="border p-4 bg-zinc-50 dark:bg-zinc-800 font-mono text-sm whitespace-pre-wrap break-words">{run()}</div>
    </div>
  )
}
