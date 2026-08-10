import { useState } from 'react'

const KNOWN: Record<string, string> = {
  '400000': 'Visa (test card) — US',
  '401288': 'Visa (test) — US',
  '411111': 'Visa — US',
  '491748': 'Visa (test) — US',
  '510000': 'Mastercard (test) — US',
  '555555': 'Mastercard (test) — US',
  '370000': 'Amex (test) — US',
  '601100': 'Discover (test) — US',
  '622126': 'UnionPay — CN',
  '625094': 'UnionPay — CN',
}

export default function BinLookup() {
  const [bin, setBin] = useState('411111')
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'fail' | 'err'>('idle')
  const [info, setInfo] = useState<{ scheme: string, type: string, brand: string, bank: string, country: string } | null>(null)

  const lookup = async () => {
    const b = bin.replace(/[\s-]/g, '')
    if (!/^\d{6}$/.test(b)) { setState('fail'); return }
    if (KNOWN[b]) {
      setInfo({ scheme: 'Known test / sample BIN', type: '—', brand: b.slice(0, 1) === '4' ? 'Visa' : '—', bank: 'Sample data', country: KNOWN[b].split('—')[1]?.trim() || '—' })
      setState('ok'); return
    }
    setState('loading')
    try {
      const r = await fetch(`https://binlist.net/json/${b}`)
      if (!r.ok) throw new Error('bad status')
      const j = await r.json()
      if (j.scheme) {
        setInfo({
          scheme: j.scheme || '—',
          type: j.type || '—',
          brand: j.brand || '—',
          bank: j.bank?.name || '—',
          country: j.country?.name ? `${j.country.name} (${j.country.alpha2})` : '—',
        })
        setState('ok')
      } else setState('fail')
    } catch { setState('err') }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex gap-2">
        <input value={bin} onChange={e => setBin(e.target.value.replace(/\D/g, '').slice(0, 8))} placeholder="First 6–8 digits (BIN/IIN)" className="flex-1 border px-3 py-2 text-sm font-mono" />
        <button onClick={lookup} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Lookup</button>
      </div>
      {state === 'loading' && <p className="text-xs text-zinc-500">Looking up…</p>}
      {state === 'fail' && <p className="text-sm text-red-600">Enter exactly 6 digits.</p>}
      {state === 'err' && <p className="text-xs text-zinc-500">Lookup service unreachable — this tool needs internet.</p>}
      {state === 'ok' && info && (
        <div className="border p-3 text-sm space-y-1 text-zinc-900 dark:text-white">
          <div><span className="font-semibold">Scheme:</span> {info.scheme}</div>
          <div><span className="font-semibold">Type:</span> {info.type}</div>
          <div><span className="font-semibold">Brand:</span> {info.brand}</div>
          <div><span className="font-semibold">Bank:</span> {info.bank}</div>
          <div><span className="font-semibold">Country:</span> {info.country}</div>
        </div>
      )}
    </div>
  )
}
