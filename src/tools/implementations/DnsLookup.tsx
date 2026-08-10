import { useState } from 'react'

const TYPES = ['A', 'AAAA', 'MX', 'NS', 'TXT', 'CNAME', 'SOA']

export default function DnsLookup() {
  const [host, setHost] = useState('nutter.tools')
  const [type, setType] = useState('A')
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [rows, setRows] = useState<{ name: string, ttl: number, data: string }[]>([])

  const lookup = async () => {
    if (!host.trim()) return
    setState('loading')
    try {
      const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(host)}&type=${type}`)
      const j = await r.json()
      if (j.Status === 3) { setRows([]); setState('ok'); return }
      setRows((j.Answer || []).map((a: any) => ({ name: a.name, ttl: a.TTL, data: a.data })))
      setState('ok')
    } catch { setState('err') }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex gap-2">
        <input value={host} onChange={e => setHost(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookup()} placeholder="example.com" className="flex-1 border px-3 py-2 text-sm" />
        <button onClick={lookup} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Lookup</button>
      </div>
      <div className="flex flex-wrap gap-2">
        {TYPES.map(t => (
          <button key={t} onClick={() => { setType(t); }} className={`px-3 h-9 text-xs border font-mono ${type === t ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{t}</button>
        ))}
      </div>
      {state === 'loading' && <p className="text-xs text-zinc-500">Querying…</p>}
      {state === 'err' && <p className="text-xs text-zinc-500">DNS lookup unavailable — needs internet.</p>}
      {state === 'ok' && (
        rows.length ? (
          <div className="border text-xs font-mono overflow-x-auto">
            <table className="w-full">
              <thead><tr className="border-b text-left"><th className="p-2 font-semibold">Name</th><th className="p-2 font-semibold">TTL</th><th className="p-2 font-semibold">Value</th></tr></thead>
              <tbody>
                {rows.map((r, i) => <tr key={i} className="border-b last:border-0"><td className="p-2 break-all">{r.name}</td><td className="p-2">{r.ttl}</td><td className="p-2 break-all">{r.data}</td></tr>)}
              </tbody>
            </table>
          </div>
        ) : <p className="text-sm text-zinc-500">No {type} records found for <b>{host}</b>.</p>
      )}
      <p className="text-[11px] text-zinc-500">Uses DNS-over-HTTPS via dns.google — no local DNS required, works from any network.</p>
    </div>
  )
}
