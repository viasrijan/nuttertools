import { useEffect, useMemo, useRef, useState } from 'react'
import { Button } from '../../components/ui/Button'

import { saveBlob } from '../../lib/download'

const L = ['0001101', '0011001', '0010011', '0111101', '0100011', '0110001', '0101111', '0111011', '0110111', '0001011']
const G = ['0100111', '0110011', '0011011', '0100001', '0011101', '0111001', '0000101', '0010001', '0001001', '0010111']
const R = ['1110010', '1100110', '1101100', '1000010', '1011100', '1001110', '1010000', '1000100', '1001000', '1110100']
const PARITY: Record<number, string> = {
  0: 'LLLLLL', 1: 'LLGLGG', 2: 'LLGGLG', 3: 'LLGGGL', 4: 'LGLLGG', 5: 'LGGLLG', 6: 'LGGGLL', 7: 'LGLGLG', 8: 'LGLGGL', 9: 'LGGLGL',
}
const CODE39: Record<string, string> = {
  '0': 'nnnwwnwnn', '1': 'wnnwnnnnw', '2': 'nnwwnnnnw', '3': 'wnwwnnnnn', '4': 'nnnwwnnnw', '5': 'wnnwwnnnn', '6': 'nnwwwnnnn',
  '7': 'nnnwnnwnw', '8': 'wnnwnnwnn', '9': 'nnwwnnwnn', 'A': 'wnnnnwnnw', 'B': 'nnwnnwnnw', 'C': 'wnwnnwnnn', 'D': 'nnnnwwnnw',
  'E': 'wnnnwwnnn', 'F': 'nnwnwwnnn', 'G': 'nnnnnwwnw', 'H': 'wnnnnwwnn', 'I': 'nnwnnwwnn', 'J': 'nnnnwwwnn', 'K': 'wnnnnnnww',
  'L': 'nnwnnnnww', 'M': 'wnwnnnnwn', 'N': 'nnnnwnnww', 'O': 'wnnnwnnwn', 'P': 'nnwnwnnwn', 'Q': 'nnnnnnwww', 'R': 'wnnnnnwwn',
  'S': 'nnwnnnwwn', 'T': 'nnnnwnwwn', 'U': 'wwnnnnnnw', 'V': 'nwwnnnnnw', 'W': 'wwwnnnnnn', 'X': 'nwnnwnnnw', 'Y': 'wwnnwnnnn',
  'Z': 'nwwnwnnnn', '-': 'nwnnnnwnw', '.': 'wwnnnnwnn', ' ': 'nwwnnnwnn', '$': 'nwnwnwnnn', '/': 'nwnwnnnwn', '+': 'nwnnnwnwn', '%': 'nnnwnwnwn',
  '*': 'nwnnwnwnn',
}

function eanChecksum(d: string, weights: number[]) {
  let sum = 0
  for (let i = 0; i < d.length; i++) sum += +d[i] * weights[i % weights.length]
  return (10 - sum % 10) % 10
}

function code39Bits(text: string): string {
  const symbols = '*' + text + '*'
  let bits = '0'.repeat(10)
  for (let s = 0; s < symbols.length; s++) {
    const p = CODE39[symbols[s]]
    if (!p) return ''
    for (let i = 0; i < p.length; i++) {
      const isBar = i % 2 === 0
      const w = p[i] === 'w' ? 3 : 1
      bits += isBar ? '1'.repeat(w) : '0'.repeat(w)
    }
    if (s < symbols.length - 1) bits += '0'
  }
  return bits + '0'.repeat(10)
}

export default function BarcodeGenerator() {
  const [value, setValue] = useState('5901234123457')
  const [format, setFormat] = useState<'ean13' | 'ean8' | 'upca' | 'code39'>('ean13')
  const [height, setHeight] = useState(80)
  const [scale, setScale] = useState(2)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { bits, valid, display } = useMemo(() => {
    const v = value.replace(/\s/g, '')
    if (format === 'ean13' || format === 'upca') {
      const digits = (format === 'upca' ? '0' : '') + v
      if (!/^\d{12}$/.test(digits) && !/^\d{13}$/.test(digits)) return { bits: '', valid: false, display: '' }
      const d13 = digits.length === 12 ? digits + String(eanChecksum(digits, [1, 3])) : digits
      const parity = PARITY[+d13[0]]
      let s = '101'
      for (let i = 0; i < 6; i++) s += (parity[i] === 'L' ? L : G)[+d13[i + 1]]
      s += '01010'
      for (let i = 7; i < 13; i++) s += R[+d13[i]]
      s += '101'
      return { bits: s, valid: eanChecksum(d13.slice(0, 12), [1, 3]) === +d13[12], display: d13 }
    }
    if (format === 'ean8') {
      if (!/^\d{7}$/.test(v) && !/^\d{8}$/.test(v)) return { bits: '', valid: false, display: '' }
      const d8 = v.length === 7 ? v + String(eanChecksum(v, [3, 1])) : v
      let s = '101'
      for (let i = 0; i < 4; i++) s += L[+d8[i]]
      s += '01010'
      for (let i = 4; i < 8; i++) s += R[+d8[i]]
      s += '101'
      return { bits: s, valid: true, display: d8 }
    }
    const up = v.toUpperCase()
    const b = code39Bits(up)
    return { bits: b, valid: !!b, display: up }
  }, [value, format])

  const draw = () => {
    const canvas = canvasRef.current
    if (!canvas || !bits) return
    const ctx = canvas.getContext('2d')!
    const quiet = format === 'code39' ? 10 * scale : 7 * scale
    canvas.width = bits.length * scale + quiet * 2
    canvas.height = height + 26
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.fillStyle = '#000'
    for (let i = 0; i < bits.length; i++) if (bits[i] === '1') ctx.fillRect(quiet + i * scale, 0, scale, height)
    ctx.font = `${Math.max(10, scale * 9)}px monospace`
    ctx.textAlign = 'center'
    ctx.fillText(display, canvas.width / 2, height + 18)
  }

  useEffect(() => { draw() })

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap gap-2 text-sm">
        {([['ean13', 'EAN-13'], ['ean8', 'EAN-8'], ['upca', 'UPC-A'], ['code39', 'Code 39']] as const).map(([k, l]) => (
          <Button variant="outline" key={k} onClick={() => setFormat(k)} className={`px-4 h-9 border ${format === k ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{l}</Button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 text-sm items-center">
        <input value={value} onChange={e => setValue(e.target.value)} placeholder={format === 'code39' ? 'ABC-123' : 'Digits only'} className="flex-1 border px-3 py-2 font-mono" />
        <label className="font-semibold text-zinc-900 dark:text-white text-xs">Scale</label>
        <input type="range" min="1" max="4" value={scale} onChange={e => setScale(+e.target.value)} className="w-24" />
        <label className="font-semibold text-zinc-900 dark:text-white text-xs">Height</label>
        <input type="range" min="40" max="200" value={height} onChange={e => setHeight(+e.target.value)} className="w-24" />
      </div>
      {valid ? (
        <>
          <canvas ref={canvasRef} className="border bg-white max-w-full" />
          <Button variant="outline" size="sm" onClick={draw}>Redraw</Button>
          <button onClick={() => canvasRef.current?.toBlob(b => b && saveBlob(b, `barcode-${format}.png`))} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Download PNG</button>
        </>
      ) : (
        <p className="text-sm text-red-600">{format === 'code39' ? 'Only A–Z, 0–9 and - . space $ / + % allowed.' : `Enter ${format === 'ean8' ? '7 or 8' : format === 'upca' ? '11 or 12' : '12 or 13'} digits — check digit is added automatically.`}</p>
      )}
      <p className="text-[11px] text-zinc-500">EAN/UPC need a GS1 license for real retail use; check digits are computed for you. Code 39 needs a leading/trailing *.</p>
    </div>
  )
}
