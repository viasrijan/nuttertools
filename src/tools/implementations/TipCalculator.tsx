import { useState } from 'react'

export default function TipCalculator() {
  const [bill, setBill] = useState('100')
  const [tipPct, setTipPct] = useState(15)
  const [people, setPeople] = useState(1)
  const [roundUp, setRoundUp] = useState(false)

  const b = parseFloat(bill) || 0
  let tip = b * tipPct / 100
  let total = b + tip
  if (roundUp) { total = Math.ceil(total); tip = total - b }
  const perPerson = people > 0 ? total / people : total

  return (
    <div className="space-y-4 max-w-md">
      <label className="block text-sm font-semibold">Bill amount <input type="number" value={bill} onChange={e => setBill(e.target.value)} className="w-full border px-3 h-10 mt-1 text-lg" /></label>
      <div>
        <p className="text-sm font-semibold">Tip: {tipPct}%</p>
        <input type="range" min={0} max={40} value={tipPct} onChange={e => setTipPct(parseInt(e.target.value))} className="w-full mt-2" />
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[10, 15, 18, 20, 25].map(t => (
            <button key={t} onClick={() => setTipPct(t)} className={`px-3 h-8 border text-sm ${tipPct === t ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{t}%</button>
          ))}
        </div>
      </div>
      <label className="block text-sm font-semibold">People <input type="number" min={1} value={people} onChange={e => setPeople(parseInt(e.target.value) || 1)} className="w-full border px-3 h-9 mt-1" /></label>
      <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={roundUp} onChange={e => setRoundUp(e.target.checked)} />Round total up</label>
      <div className="border p-4 space-y-2 bg-zinc-50 dark:bg-zinc-800">
        <Row l="Tip amount" v={`$${tip.toFixed(2)}`} />
        <Row l="Total" v={`$${total.toFixed(2)}`} />
        <div className="border-t border-zinc-300 dark:border-zinc-600 pt-2 flex justify-between items-center">
          <span className="text-sm font-bold">Per person</span>
          <span className="text-2xl font-extrabold">${perPerson.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function Row({ l, v }: { l: string, v: string }) {
  return <div className="flex justify-between text-sm"><span className="font-medium">{l}</span><b>{v}</b></div>
}
