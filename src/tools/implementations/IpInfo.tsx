import { useEffect, useState } from 'react'

function ua() {
  const ua = navigator.userAgent
  const browser = /Edg\//.test(ua) ? 'Microsoft Edge' : /OPR|Opera/.test(ua) ? 'Opera' : /Chrome\//.test(ua) ? 'Chrome' : /Firefox\//.test(ua) ? 'Firefox' : /Safari\//.test(ua) ? 'Safari' : 'Unknown'
  const os = /Windows/.test(ua) ? 'Windows' : /Mac OS X/.test(ua) ? 'macOS' : /Android/.test(ua) ? 'Android' : /iPhone|iPad/.test(ua) ? 'iOS' : /Linux/.test(ua) ? 'Linux' : 'Unknown'
  return { browser, os, ua }
}

export default function IpInfo() {
  const [ip, setIp] = useState<string | null>(null)
  const [geo, setGeo] = useState<string>('')
  const [error, setError] = useState('')
  const info = ua()

  useEffect(() => {
    fetch('https://ipapi.co/json/')
      .then(r => r.json())
      .then(d => { setIp(d.ip); setGeo(`${d.city}, ${d.region}, ${d.country_name}`) })
      .catch(() => fetch('https://api.ipify.org?format=json').then(r => r.json()).then(d => setIp(d.ip)).catch(() => setError('Could not fetch your IP address.')))
  }, [])

  const screen = `${window.screen.width} × ${window.screen.height}`
  const viewport = `${window.innerWidth} × ${window.innerHeight}`
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone

  const rows: [string, string][] = [
    ['IP address', ip || '…'],
    ['Location', geo || '…'],
    ['Browser', info.browser],
    ['Operating system', info.os],
    ['Screen', screen],
    ['Viewport', viewport],
    ['Timezone', tz],
    ['Language', navigator.language],
    ['Online', navigator.onLine ? 'Yes' : 'No'],
    ['Cores', `${(navigator as any).hardwareConcurrency || '?'} logical`],
    ['Memory', (navigator as any).deviceMemory ? `${(navigator as any).deviceMemory} GB` : '—'],
  ]

  return (
    <div className="space-y-4 max-w-xl">
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="border divide-y divide-zinc-100 dark:divide-zinc-800">
        {rows.map(([k, v]) => (
          <div key={k} className="flex items-center gap-3 px-4 py-2.5">
            <span className="w-32 text-[11px] font-bold uppercase tracking-wider text-zinc-500">{k}</span>
            <code className="flex-1 font-mono text-sm">{v}</code>
            {k === 'IP address' && ip && <button onClick={() => navigator.clipboard.writeText(ip)} className="text-xs border px-2 py-1">Copy</button>}
          </div>
        ))}
      </div>
      <details className="text-sm">
        <summary className="cursor-pointer font-medium">User agent</summary>
        <code className="block mt-2 border p-3 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800">{info.ua}</code>
      </details>
    </div>
  )
}
