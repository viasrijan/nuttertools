import { useState } from 'react'
import { Field } from '../../components/ui/Field'
import { Result, ResultGrid } from '../../components/ui/Result'

export default function GeneratorWattage() {
  const [devices, setDevices] = useState('refrigerator:700\nfreezer:500\nlights:300\nTV:150')
  const [surgePct, setSurgePct] = useState('200')

  const rows = devices.split('\n').map((l) => l.trim()).filter(Boolean).map((l) => {
    const [name, watts] = l.split(':')
    return { name: (name || '').trim(), watts: parseFloat(watts) || 0 }
  })
  const running = rows.reduce((a, r) => a + r.watts, 0)
  const biggest = rows.reduce((a, r) => Math.max(a, r.watts), 0)
  const surge = running + biggest * ((parseFloat(surgePct) || 200) / 100 - 1)
  const rec = Math.ceil(surge / 1000 * 1.25)

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-1.5">
        <span className="block text-[12px] font-bold uppercase tracking-wide text-zinc-700 dark:text-zinc-300">Devices — one per line: "name:watts"</span>
        <textarea value={devices} onChange={(e) => setDevices(e.target.value)} rows={6} className="w-full p-3 font-mono text-[13px] bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
      </div>
      <div className="max-w-[240px]">
        <Field label="Startup surge %" type="number" value={surgePct} onChange={(e) => setSurgePct(e.target.value)} hint="Motors surge ~2–3×" />
      </div>
      <ResultGrid>
        <Result label="Running watts" value={`${running.toLocaleString()} W`} />
        <Result label="Peak (surge) watts" value={`${Math.round(surge).toLocaleString()} W`} tone="warn" />
        <Result label="Recommended generator" value={`≥ ${rec.toLocaleString()} W running`} tone="good" />
      </ResultGrid>
    </div>
  )
}