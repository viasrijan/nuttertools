import { useMemo, useState } from 'react'

import { Button } from '../../components/ui/Button'

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/
const TLD_RE = /^[a-z]{2,}$/i

export default function EmailValidator() {
  const [input, setInput] = useState('')
  const [checkDns, setCheckDns] = useState(true)
  const [dns, setDns] = useState<'idle' | 'checking' | 'ok' | 'fail' | 'error'>('idle')

  const validSyntax = useMemo(() => EMAIL_RE.test(input.trim()), [input])

  const checkDnsNow = async () => {
    const email = input.trim()
    if (!EMAIL_RE.test(email)) return
    setDns('checking')
    try {
      const domain = email.split('@')[1]
      const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`)
      const j = await r.json()
      setDns(j && j.Answer && j.Answer.length ? 'ok' : 'fail')
    } catch { setDns('error') }
  }

  const parts = useMemo(() => {
    const t = input.trim()
    const at = t.lastIndexOf('@')
    if (at < 1) return null
    const local = t.slice(0, at)
    const domain = t.slice(at + 1)
    return { local, domain, tld: domain.split('.').pop() || '', hasTLD: TLD_RE.test(domain.split('.').pop() || '') }
  }, [input])

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <input value={input} onChange={e => { setInput(e.target.value); setDns('idle') }} placeholder="name@example.com" className="w-full border px-3 py-2 text-sm" />
      {input.trim() ? (
        <div className="space-y-2 text-sm">
          <div className={`border p-3 font-semibold ${validSyntax ? 'border-green-500 text-green-600' : 'border-red-500 text-red-600'}`}>
            {validSyntax ? '✓ Valid email syntax' : '✗ Invalid email syntax'}
          </div>
          {parts && (
            <div className="border p-3 text-xs space-y-1 text-zinc-900 dark:text-white">
              <div>Local part: <code>{parts.local}</code> ({parts.local.length} chars{parts.local.length > 64 ? ', exceeds 64' : ''})</div>
              <div>Domain: <code>{parts.domain}</code></div>
              <div>TLD: <code>{parts.tld}</code> — {parts.hasTLD ? 'valid format' : 'missing/invalid'}</div>
            </div>
          )}
          {validSyntax && (
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs"><input type="checkbox" checked={checkDns} onChange={e => setCheckDns(e.target.checked)} /> Check MX records (DNS lookup)</label>
              <Button variant="outline" size="sm" onClick={checkDnsNow} disabled={dns === 'checking'}>Check DNS</Button>
              {dns === 'checking' && <span className="text-xs text-zinc-500">Checking…</span>}
              {dns === 'ok' && <span className="text-xs text-green-600">Domain accepts mail (MX found)</span>}
              {dns === 'fail' && <span className="text-xs text-red-600">No MX records — domain likely cannot receive mail</span>}
              {dns === 'error' && <span className="text-xs text-zinc-500">DNS check unavailable (offline / blocked)</span>}
            </div>
          )}
        </div>
      ) : (
        <p className="text-xs text-zinc-500">Type or paste an email address to validate. Optionally verifies the domain&apos;s MX records via DNS-over-HTTPS.</p>
      )}
    </div>
  )
}
