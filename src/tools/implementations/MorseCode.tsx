import { useState } from 'react'

const MORSE: Record<string, string> = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
  '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
  '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.',
  '(': '-.--.', ')': '-.--.-', '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
  '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.', '$': '...-..-', '@': '.--.-.',
}
const REV = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

const toMorse = (s: string) => s.toUpperCase().split('').map(c => MORSE[c] || ' ').join(' ').replace(/\s{3,}/g, ' / ').trim()
const fromMorse = (s: string) => s.split('/').map(w => w.trim().split(/\s+/).map(code => REV[code] || '?').join('')).join(' ')

export default function MorseCode() {
  const [text, setText] = useState('SOS HELP')
  const [morse, setMorse] = useState('')
  const [mode, setMode] = useState<'t2m' | 'm2t'>('t2m')
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex gap-2">
        <button onClick={() => setMode('t2m')} className={`px-4 h-9 text-sm border ${mode === 't2m' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Text → Morse</button>
        <button onClick={() => setMode('m2t')} className={`px-4 h-9 text-sm border ${mode === 'm2t' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Morse → Text</button>
        <button onClick={() => navigator.clipboard.writeText(morse)} className="px-4 h-9 border text-sm">Copy</button>
      </div>
      {mode === 't2m' ? (
        <div className="grid md:grid-cols-2 gap-3">
          <textarea value={text} onChange={e => { setText(e.target.value); setMorse(toMorse(e.target.value)) }} className="w-full h-44 border p-3 text-sm" />
          <textarea value={morse} readOnly className="w-full h-44 border p-3 font-mono text-sm bg-zinc-50 dark:bg-zinc-800" />
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-3">
          <textarea value={morse} onChange={e => { setMorse(e.target.value); setText(fromMorse(e.target.value)) }} className="w-full h-44 border p-3 font-mono text-sm" placeholder="... --- ..." />
          <textarea value={text} readOnly className="w-full h-44 border p-3 text-sm bg-zinc-50 dark:bg-zinc-800" />
        </div>
      )}
      <button onClick={() => { if (mode === 't2m') setMorse(toMorse(text)); else setText(fromMorse(morse)) }} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Convert</button>
    </div>
  )
}
