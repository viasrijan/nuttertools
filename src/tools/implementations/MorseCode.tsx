import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

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
    <div className="space-y-5 max-w-3xl omni-rise">
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={() => setMode('t2m')} className={`px-4 h-9 text-sm  ${mode === 't2m' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>Text → Morse</Button>
        <Button variant="outline" onClick={() => setMode('m2t')} className={`px-4 h-9 text-sm  ${mode === 'm2t' ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>Morse → Text</Button>
        <CopyButton value={morse} />
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
      <button onClick={() => { if (mode === 't2m') setMorse(toMorse(text)); else setText(fromMorse(morse)) }} className="px-4 h-9 text-sm font-bold text-white bg-gradient-to-b from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(79,70,229,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95">Convert</button>
    </div>
  )
}
