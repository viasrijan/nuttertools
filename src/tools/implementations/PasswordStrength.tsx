import { useMemo, useState } from 'react'

const COMMON = ['password', '123456', '123456789', 'qwerty', 'abc123', 'letmein', 'admin', 'welcome', 'monkey', 'dragon', 'iloveyou', 'sunshine', 'princess', 'football', 'baseball', '111111', 'trustno1', 'master', 'shadow', 'superman', 'hello', 'charlie', 'donald', 'starwars']

export default function PasswordStrength() {
  const [pw, setPw] = useState('NutterTools2024!')

  const score = useMemo(() => {
    const p = pw
    if (!p) return { score: 0, max: 4, checks: [], entropy: 0 }
    const checks = [
      { label: 'Length ≥ 12', ok: p.length >= 12 },
      { label: 'Mixed case', ok: /[a-z]/.test(p) && /[A-Z]/.test(p) },
      { label: 'Has number', ok: /\d/.test(p) },
      { label: 'Has symbol', ok: /[^a-zA-Z0-9]/.test(p) },
    ]
    const pool = (/[a-z]/.test(p) ? 26 : 0) + (/[A-Z]/.test(p) ? 26 : 0) + (/\d/.test(p) ? 10 : 0) + (/[^a-zA-Z0-9]/.test(p) ? 33 : 0)
    const entropy = pool ? Math.round(p.length * Math.log2(pool)) : 0
    let s = checks.filter(c => c.ok).length
    const lower = p.toLowerCase()
    if (COMMON.includes(lower)) s = 0
    if (/(.)\1{2,}/.test(p)) s = Math.max(0, s - 1)
    if (/^(123|abc|qwe)/.test(lower)) s = Math.max(0, s - 1)
    return { score: s, max: 4, checks, entropy }
  }, [pw])

  const labels = ['Very weak', 'Weak', 'Fair', 'Good', 'Strong']
  const colors = ['#dc2626', '#ea580c', '#eab308', '#16a34a', '#059669']

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <input type={pw.length ? 'password' : 'text'} value={pw} onChange={e => setPw(e.target.value)} placeholder="Type a password…" className="w-full border px-3 py-2 text-sm font-mono" />
      {pw && (
        <>
          <div>
            <div className="flex gap-1 h-2">
              {[0, 1, 2, 3].map(i => (
                <div key={i} className="flex-1 " style={{ background: i < score.score ? colors[score.score] : '#e4e4e7' }} />
              ))}
            </div>
            <div className="flex justify-between mt-1 text-sm">
              <span className="font-bold" style={{ color: colors[score.score] }}>{labels[score.score]}</span>
              <span className="text-xs font-mono text-zinc-500">~{score.entropy.toLocaleString()} bits entropy</span>
            </div>
          </div>
          <ul className="space-y-1 text-sm">
            {score.checks.map((c, i) => (
              <li key={i} className={c.ok ? 'text-green-600' : 'text-zinc-400'}>{(c.ok ? '✓' : '✗') + ' ' + c.label}</li>
            ))}
            <li className={!COMMON.includes(pw.toLowerCase()) && pw.length > 0 ? 'text-green-600' : 'text-zinc-400'}>{(score.score > 0 ? '✓' : '✗') + ' Not a commonly used password'}</li>
          </ul>
          <p className="text-[11px] text-zinc-500">Entropy assumes random characters — a short dictionary word scores lower in practice. This checker runs entirely offline.</p>
        </>
      )}
    </div>
  )
}
