import { useState } from 'react'

export default function WhoisLookup() {
  const [domain, setDomain] = useState('nutter.tools')
  const [state, setState] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [info, setInfo] = useState<{ key: string, value: string }[]>([])

  const lookup = async () => {
    const d = domain.trim().replace(/^https?:\/\//, '').replace(/\/.*$/, '')
    if (!d) return
    setState('loading')
    try {
      const r = await fetch(`https://rdap.org/domain/${d}`)
      if (!r.ok) { setState('err'); return }
      const j = await r.json()
      const rows: { key: string, value: string }[] = []
      const push = (k: string, v: any) => { if (v !== undefined && v !== null) rows.push({ key: k, value: String(v) }) }
      push('Domain', j.ldhName)
      push('Status', (j.status || []).join(', '))
      push('Registrar', j.entities?.find((e: any) => e.roles?.includes('registrar'))?.vcardArray?.[1]?.find((l: any) => l[0] === 'fn')?.[3])
      push('Registered', j.events?.find((e: any) => e.eventAction === 'registration')?.eventDate)
      push('Last changed', j.events?.find((e: any) => e.eventAction === 'last changed')?.eventDate)
      push('Expires', j.events?.find((e: any) => e.eventAction === 'expiration')?.eventDate)
      const ns = j.nameservers?.map((n: any) => n.ldhName).join(', ')
      push('Nameservers', ns)
      rows.push({ key: 'Registrant / contacts', value: (j.entities || []).map((e: any) => {
        const fn = e.vcardArray?.[1]?.find((l: any) => l[0] === 'fn')?.[3]
        return `${fn || e.handle || '?'} (${(e.roles || ['?']).join(', ')})`
      }).join(' · ') })
      setInfo(rows.filter(r => r.value && r.value !== 'undefined'))
      setState('ok')
    } catch { setState('err') }
  }

  return (
    <div className="space-y-4 max-w-xl">
      <div className="flex gap-2">
        <input value={domain} onChange={e => setDomain(e.target.value)} onKeyDown={e => e.key === 'Enter' && lookup()} placeholder="example.com" className="flex-1 border px-3 py-2 text-sm" />
        <button onClick={lookup} className="px-5 h-10 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Whois</button>
      </div>
      {state === 'loading' && <p className="text-xs text-zinc-500">Querying RDAP registry…</p>}
      {state === 'err' && <p className="text-sm text-zinc-500">No registration data found (domain may be unregistered) or the registry is unreachable.</p>}
      {state === 'ok' && (
        <div className="border text-sm">
          {info.map((r, i) => (
            <div key={i} className="grid grid-cols-3 border-b last:border-0 text-xs">
              <div className="p-2 font-semibold uppercase text-[10px] tracking-wider text-zinc-500 self-start">{r.key}</div>
              <div className="p-2 col-span-2 break-all">{r.value}</div>
            </div>
          ))}
        </div>
      )}
      <p className="text-[11px] text-zinc-500">Uses RDAP — the modern successor to WHOIS. Contact details are often hidden by registrars for privacy.</p>
    </div>
  )
}
