import { useMemo, useState } from 'react'

function luhn(num: string): boolean {
  let sum = 0, dbl = false
  for (let i = num.length - 1; i >= 0; i--) {
    let d = num.charCodeAt(i) - 48
    if (d < 0 || d > 9) return false
    if (dbl) { d *= 2; if (d > 9) d -= 9 }
    sum += d
    dbl = !dbl
  }
  return sum % 10 === 0
}

function detect(num: string) {
  const t = num.replace(/[\s-]/g, '')
  const len = t.length
  if (/^4/.test(t) && [13, 16, 19].includes(len)) return { brand: 'Visa', color: '#1a1f71' }
  if (/^(5[1-5]|2[2-7])/.test(t) && len === 16) return { brand: 'Mastercard', color: '#eb001b' }
  if (/^3[47]/.test(t) && len === 15) return { brand: 'American Express', color: '#2e77bc' }
  if (/^6(011|5|4[4-9])/.test(t) && len === 16) return { brand: 'Discover', color: '#f2711c' }
  if (/^35(2[89]|[3-8])/.test(t) && len === 16) return { brand: 'JCB', color: '#0e4c96' }
  if (/^62/.test(t) && len >= 16 && len <= 19) return { brand: 'UnionPay', color: '#e21836' }
  if (/^3[068]/.test(t) && len === 14) return { brand: 'Diners Club', color: '#0079be' }
  if (/^50|^56|^57|^58/.test(t) && len === 16) return { brand: 'Maestro', color: '#b21b1b' }
  return { brand: 'Unknown', color: '#71717a' }
}

export default function CardValidator() {
  const [input, setInput] = useState('4242 4242 4242 4242')

  const res = useMemo(() => {
    const t = input.replace(/[\s-]/g, '')
    if (!/^\d{12,19}$/.test(t)) return null
    const b = detect(t)
    return { ...b, len: t.length, luhn: luhn(t) }
  }, [input])

  return (
    <div className="space-y-4 max-w-xl">
      <input value={input} onChange={e => setInput(e.target.value)} placeholder="Card number (12–19 digits)" className="w-full border px-3 py-2 text-sm font-mono tracking-wider" />
      {res ? (
        <div className="space-y-2">
          <div className={`border p-3 text-sm font-semibold ${res.luhn ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}>
            {res.luhn ? '✓ Passes Luhn check — valid card number' : '✗ Fails Luhn check — not a valid card number'}
          </div>
          <div className="border p-3 text-sm flex items-center gap-3">
            <span className="inline-block w-3 h-2 rounded-sm" style={{ background: res.color }} />
            <span className="font-bold" style={{ color: res.color }}>{res.brand}</span>
            <span className="text-xs text-zinc-500">{res.len} digits</span>
          </div>
          <p className="text-[11px] text-zinc-500">Luhn only verifies the checksum — it does not confirm a card exists. Never enter a real card here; everything stays on your device.</p>
        </div>
      ) : (
        <p className="text-xs text-zinc-500">Enter 12–19 digits to check the Luhn checksum and detect the brand.</p>
      )}
    </div>
  )
}
