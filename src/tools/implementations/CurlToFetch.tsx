import { useState } from 'react'

import CopyButton from '../../components/ui/CopyButton'

function parseCurl(curl: string): string {
  let url = ''
  const headers: [string, string][] = []
  let method = 'GET'
  let body = ''
  let isCompressed = false
  const tokens = curl.match(/(?:[^\s"']+|"[^"]*"|'[^']*')+/g) || []
  for (let i = 1; i < tokens.length; i++) {
    const t = tokens[i].replace(/^["']|["']$/g, '')
    if (t === '-X' || t === '--request') { method = (tokens[++i] || '').replace(/["']/g, '').toUpperCase() }
    else if (t === '-H' || t === '--header') {
      const h = (tokens[++i] || '').replace(/^["']|["']$/g, '')
      const idx = h.indexOf(':')
      if (idx > 0) headers.push([h.slice(0, idx).trim(), h.slice(idx + 1).trim()])
    }
    else if (t === '-d' || t === '--data' || t === '--data-raw' || t === '--data-urlencode') { method = 'POST'; body = (tokens[++i] || '').replace(/^["']|["']$/g, '') }
    else if (t === '--compressed') { isCompressed = true }
    else if (t.startsWith('http')) { url = t }
  }
  if (!url) return '// Could not find a URL in the curl command'
  const lines: string[] = []
  lines.push(`fetch(${JSON.stringify(url)}, {`)
  const opts: string[] = []
  if (method !== 'GET') opts.push(`  method: ${JSON.stringify(method)}`)
  if (headers.length) {
    opts.push(`  headers: {`)
    headers.forEach(h => opts.push(`    ${JSON.stringify(h[0])}: ${JSON.stringify(h[1])},`))
    opts.push(`  },`)
  }
  if (body) opts.push(`  body: ${JSON.stringify(body)},`)
  if (isCompressed && !headers.find(h => h[0].toLowerCase() === 'accept-encoding')) opts.push(`  // (curl --compressed) add "accept-encoding": "gzip, deflate" header if needed,`)
  lines.push(...opts)
  lines.push(`})`)
  lines.push(`  .then(r => r.json())`)
  lines.push(`  .then(data => console.log(data))`)
  lines.push(`  .catch(err => console.error(err))`)
  return lines.join('\n')
}

export default function CurlToFetch() {
  const [curl, setCurl] = useState(`curl -X POST 'https://api.example.com/login' \\
  -H 'Content-Type: application/json' \\
  -d '{"username":"john","password":"secret"}'`)
  const fetchCode = parseCurl(curl)
  return (
    <div className="space-y-5">
      <div className="grid md:grid-cols-2 gap-3">
        <div>
          <p className="text-sm font-semibold mb-1">cURL</p>
          <textarea value={curl} onChange={e => setCurl(e.target.value)} className="w-full h-72 border p-3 font-mono text-xs" />
        </div>
        <div>
          <p className="text-sm font-semibold mb-1">JavaScript fetch</p>
          <textarea value={fetchCode} readOnly className="w-full h-72 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
          <CopyButton value={fetchCode} />
        </div>
      </div>
    </div>
  )
}
