import { useState } from 'react'

import { Button } from '../../components/ui/Button'

type Brand = { name: string, prefixes: string[], length: number, cvv: number }

const BRANDS: Brand[] = [
  { name: 'Visa', prefixes: ['4'], length: 16, cvv: 3 },
  { name: 'Mastercard', prefixes: ['51', '52', '53', '54', '55', '2221', '2720'], length: 16, cvv: 3 },
  { name: 'Amex', prefixes: ['34', '37'], length: 15, cvv: 4 },
  { name: 'Discover', prefixes: ['6011', '65', '644'], length: 16, cvv: 3 },
  { name: 'Generic', prefixes: ['4', '5', '6'], length: 16, cvv: 3 },
]

function luhnCheckDigit(partial: string): number {
  let sum = 0
  const digits = [...partial].map(Number)
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i]
    if ((digits.length - i) % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return (10 - (sum % 10)) % 10
}

function validLuhn(number: string): boolean {
  let sum = 0
  const digits = [...number].map(Number)
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i]
    if ((digits.length - i) % 2 === 0) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
  }
  return sum % 10 === 0
}

function formatNumber(n: string): string {
  return n.replace(/(\d{4})(?=\d)/g, '$1 ')
}

export default function CreditCardGenerator() {
  const [brand, setBrand] = useState(0)
  const [cards, setCards] = useState<{ number: string, expiry: string, cvv: string }[]>([])
  const [copied, setCopied] = useState('')

  const b = BRANDS[brand]

  const generate = () => {
    const list = Array.from({ length: 5 }, () => {
      const prefix = b.prefixes[Math.floor(Math.random() * b.prefixes.length)]
      const len = b.length === 15 ? 14 : 15
      let body = prefix + Array.from({ length: len - prefix.length }, () => Math.floor(Math.random() * 10)).join('')
      body += String(luhnCheckDigit(body))
      const year = new Date().getFullYear() + 1 + Math.floor(Math.random() * 4)
      const month = String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')
      const cvv = String(Math.floor(Math.random() * 10 ** b.cvv)).padStart(b.cvv, '0')
      return { number: body, expiry: `${month}/${String(year).slice(2)}`, cvv }
    })
    setCards(list)
  }

  const copy = async (n: string, number: string) => {
    await navigator.clipboard.writeText(number)
    setCopied(n)
    setTimeout(() => setCopied(''), 1200)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex flex-wrap gap-2.5">
        {BRANDS.map((x, i) => (
          <Button variant="outline" key={x.name} onClick={() => setBrand(i)} className={`px-4 h-10 text-sm font-semibold ${i === brand ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : 'ring-1 ring-zinc-200 dark:ring-zinc-800'}`}>
            {x.name}
          </Button>
        ))}
      </div>
      <Button variant="secondary" onClick={generate}>Generate 5 test cards</Button>
      {cards.length > 0 && (
        <div className="space-y-5">
          {cards.map((c) => (
            <div key={c.number} className="border p-4 flex flex-wrap items-center gap-3 justify-between">
              <div className="font-mono">
                <div className="text-lg font-bold">{formatNumber(c.number)}</div>
                <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{c.expiry} · CVV {c.cvv} · {b.name} · Luhn {validLuhn(c.number) ? 'valid' : 'invalid'}</div>
              </div>
              <Button variant="ghost" size="sm" className="text-xs font-bold text-green-600 dark:text-green-400 shrink-0">{copied === c.number ? 'Copied!' : 'Copy'}</Button>
            </div>
          ))}
        </div>
      )}
      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">These numbers pass the Luhn check but are randomly generated — use them only for testing payment forms and app sandboxes. Never try to use them for real payments.</p>
    </div>
  )
}
