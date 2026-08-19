import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result } from '../../components/ui/Result'

const ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen']
const TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety']
const SCALES: [number, string][] = [[1e12, 'trillion'], [1e9, 'billion'], [1e6, 'million'], [1e3, 'thousand']]

function threeDigits(n: number): string {
  const out: string[] = []
  const h = Math.floor(n / 100)
  if (h) out.push(ONES[h] + ' hundred')
  const r = n % 100
  if (r) out.push(r < 20 ? ONES[r] : TENS[Math.floor(r / 10)] + (r % 10 ? '-' + ONES[r % 10] : ''))
  return out.join(' ')
}

export default function NumberToWords() {
  const [num, setNum] = useState('1234.56')
  const [currency, setCurrency] = useState('USD')

  const n = parseFloat(num)
  const negative = n < 0
  const abs = Math.abs(n)
  const int = Math.floor(abs)
  const frac = Math.round((abs - int) * 100)

  const wordsFor = (x: number): string => {
    if (x === 0) return 'zero'
    const parts: string[] = []
    for (const [scale, name] of SCALES) {
      const v = Math.floor(x / scale)
      if (v) { parts.push(threeDigits(v) + ' ' + name); x -= v * scale }
    }
    if (x) parts.push(threeDigits(x))
    return parts.join(' ')
  }

  const plain = (negative ? 'negative ' : '') + wordsFor(int) + (frac ? ` point ${frac}` : '')
  const cur: Record<string, [string, string]> = {
    USD: ['dollars', 'cents'],
    EUR: ['euros', 'cents'],
    GBP: ['pounds', 'pence'],
    INR: ['rupees', 'paise'],
  }
  const [cMajor, cMinor] = cur[currency] || ['units', 'cents']
  const money = (negative ? 'negative ' : '') + wordsFor(int) + ` ${int === 1 ? cMajor.slice(0, -1) : cMajor}` + (frac ? ` and ${wordsFor(frac)} ${frac === 1 ? cMinor.slice(0, -1) : cMinor}` : '')

  return (
    <div className="space-y-6 max-w-xl">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Field label="Number" value={num} onChange={(e) => setNum(e.target.value)} className="sm:col-span-2" />
        <div className="space-y-1.5">
          <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Currency</span>
          <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full h-10 px-3 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]">
            {Object.keys(cur).map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      {!isNaN(n) && (
        <>
          <div className="space-y-1.5">
            <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Plain English</span>
            <p className="text-lg font-bold leading-relaxed text-zinc-900 dark:text-white">{plain}</p>
          </div>
          <div className="space-y-1.5">
            <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">Money format</span>
            <p className="text-lg font-bold leading-relaxed text-emerald-600 dark:text-emerald-400">{money}</p>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <Result label="Digits" value={num.replace(/[-.]/g, '').length} />
            <Result label="Roman numeral (integer)" value={toRoman(Math.min(int, 3999))} />
          </div>
        </>
      )}
    </div>
  )
}

function toRoman(x: number): string {
  const map: [number, string][] = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let out = ''
  for (const [v, s] of map) while (x >= v) { out += s; x -= v }
  return out || '0'
}