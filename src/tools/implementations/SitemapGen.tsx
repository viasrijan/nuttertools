import { useState } from 'react'

export default function SitemapGen() {
  const [domain, setDomain] = useState('https://example.com')
  const [paths, setPaths] = useState('/\n/about\n/blog\n/contact')
  const [freq, setFreq] = useState('weekly')
  const [priority, setPriority] = useState('0.8')
  const [lastmod, setLastmod] = useState(new Date().toISOString().slice(0, 10))

  const gen = () => {
    const items = paths.split('\n').map(p => p.trim()).filter(Boolean)
    const lines: string[] = []
    lines.push('<?xml version="1.0" encoding="UTF-8"?>')
    lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">')
    for (const p of items) {
      const url = p.startsWith('http') ? p : `${domain.replace(/\/$/, '')}${p.startsWith('/') ? p : '/' + p}`
      lines.push('  <url>')
      lines.push(`    <loc>${url}</loc>`)
      if (lastmod) lines.push(`    <lastmod>${lastmod}</lastmod>`)
      lines.push(`    <changefreq>${freq}</changefreq>`)
      lines.push(`    <priority>${priority}</priority>`)
      lines.push('  </url>')
    }
    lines.push('</urlset>')
    return lines.join('\n')
  }

  return (
    <div className="space-y-4 max-w-2xl">
      <input value={domain} onChange={e => setDomain(e.target.value)} className="w-full border px-3 h-9 text-sm" placeholder="https://example.com" />
      <textarea value={paths} onChange={e => setPaths(e.target.value)} className="w-full border p-3 h-32 font-mono text-xs" placeholder="One path per line" />
      <div className="grid grid-cols-3 gap-3">
        <label className="text-sm">Frequency
          <select value={freq} onChange={e => setFreq(e.target.value)} className="w-full border px-2 h-9 mt-1 text-sm bg-transparent">
            <option>daily</option><option>weekly</option><option>monthly</option><option>yearly</option><option>always</option><option>hourly</option><option>never</option>
          </select></label>
        <label className="text-sm">Priority
          <select value={priority} onChange={e => setPriority(e.target.value)} className="w-full border px-2 h-9 mt-1 text-sm bg-transparent">
            <option>1.0</option><option>0.9</option><option>0.8</option><option>0.7</option><option>0.6</option><option>0.5</option><option>0.4</option><option>0.3</option><option>0.2</option><option>0.1</option>
          </select></label>
        <label className="text-sm">Last mod
          <input type="date" value={lastmod} onChange={e => setLastmod(e.target.value)} className="w-full border px-2 h-9 mt-1 text-sm" /></label>
      </div>
      <div className="flex gap-2">
        <button onClick={() => navigator.clipboard.writeText(gen())} className="px-4 h-9 bg-zinc-900 text-white text-sm">Copy sitemap</button>
        <a href={`data:text/xml;charset=utf-8,${encodeURIComponent(gen())}`} download="sitemap.xml" className="px-4 h-9 border text-sm inline-flex items-center">Download sitemap.xml</a>
      </div>
      <textarea value={gen()} readOnly className="w-full h-64 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
    </div>
  )
}
