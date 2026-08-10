import { useState } from 'react'

function b64url(input: string): string {
  return input.replace(/-/g, '+').replace(/_/g, '/')
}
function b64pad(s: string) { return s + '='.repeat((4 - (s.length % 4)) % 4) }

function decodePart(part: string): string {
  try {
    const bin = atob(b64pad(b64url(part)))
    const bytes = Uint8Array.from(bin, c => c.charCodeAt(0))
    return new TextDecoder('utf-8').decode(bytes)
  } catch { return part }
}

export default function JwtTool() {
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6Ik9tbmlUb29scyIsImlhdCI6MTUxNjIzOTAyMn0.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c')
  const [payload, setPayload] = useState('')
  const [error, setError] = useState('')

  const decode = () => {
    setError('')
    const parts = token.trim().split('.')
    if (parts.length !== 3) { setError('Invalid JWT: expected 3 dot-separated parts.'); return }
    const header = decodePart(parts[0])
    const body = decodePart(parts[1])
    setPayload(JSON.stringify(JSON.parse(body), null, 2))
    setHeader(header)
    setBody(body)
  }

  const [header, setHeader] = useState('')
  const [body, setBody] = useState('')

  return (
    <div className="space-y-4 max-w-3xl">
      <textarea value={token} onChange={e => setToken(e.target.value)} className="w-full border p-3 h-24 font-mono text-xs break-all" placeholder="Paste JWT token" />
      <div className="flex gap-2">
        <button onClick={decode} className="px-4 h-9 bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600 text-sm">Decode</button>
        <button onClick={() => navigator.clipboard.writeText(JSON.stringify(JSON.parse(payload || '{}'), null, 2))} className="px-4 h-9 border text-sm">Copy</button>
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {payload && (
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Header (alg)</p>
            <pre className="border p-3 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 overflow-auto">{header}</pre>
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-1">Payload (claims)</p>
            <pre className="border p-3 text-xs font-mono bg-zinc-50 dark:bg-zinc-800 overflow-auto">{body}</pre>
          </div>
        </div>
      )}
    </div>
  )
}
