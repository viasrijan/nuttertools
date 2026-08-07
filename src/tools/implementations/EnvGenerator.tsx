import { useState } from 'react'

const TEMPLATES: Record<string, { key: string, desc: string, value: string, secret?: boolean }[]> = {
  'Web app': [
    { key: 'NODE_ENV', desc: 'Runtime environment', value: 'development' },
    { key: 'PORT', desc: 'Server port', value: '3000' },
    { key: 'DATABASE_URL', desc: 'Database connection string', value: 'postgresql://user:pass@localhost:5432/db', secret: true },
    { key: 'JWT_SECRET', desc: 'Token signing secret', value: 'change-me', secret: true },
    { key: 'API_BASE_URL', desc: 'Public API base URL', value: 'http://localhost:3000/api' },
  ],
  Frontend: [
    { key: 'VITE_API_URL', desc: 'Backend API URL', value: 'http://localhost:3000/api' },
    { key: 'VITE_PUBLIC_KEY', desc: 'Stripe/PayPal public key', value: 'pk_test_xxx', secret: true },
    { key: 'VITE_APP_NAME', desc: 'App display name', value: 'NutterTools' },
  ],
  Database: [
    { key: 'DB_HOST', desc: 'Database host', value: 'localhost' },
    { key: 'DB_PORT', desc: 'Database port', value: '5432' },
    { key: 'DB_USER', desc: 'Database user', value: 'postgres' },
    { key: 'DB_PASSWORD', desc: 'Database password', value: 'secret', secret: true },
    { key: 'DB_NAME', desc: 'Database name', value: 'app' },
  ],
  Docker: [
    { key: 'MYSQL_ROOT_PASSWORD', desc: 'Root password', value: 'root', secret: true },
    { key: 'MYSQL_DATABASE', desc: 'Database to create', value: 'app' },
    { key: 'REDIS_URL', desc: 'Redis connection', value: 'redis://localhost:6379' },
  ],
}

export default function EnvGenerator() {
  const [tpl, setTpl] = useState('Web app')
  const [rows, setRows] = useState(TEMPLATES['Web app'])
  const [out, setOut] = useState('')

  const select = (name: string) => { setTpl(name); setRows(TEMPLATES[name]) }

  const gen = () => {
    setOut(rows.map(r => `${r.key}=${r.value}`).join('\n') + '\n')
  }

  return (
    <div className="space-y-4 max-w-3xl">
      <div className="flex flex-wrap gap-2">
        {Object.keys(TEMPLATES).map(k => (
          <button key={k} onClick={() => select(k)} className={`px-3 h-9 text-sm border ${tpl === k ? 'bg-zinc-900 text-white' : ''}`}>{k}</button>
        ))}
      </div>
      <div className="space-y-2">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <input value={r.key} onChange={e => { const n = [...rows]; n[i] = { ...r, key: e.target.value }; setRows(n) }} className="border px-3 h-9 font-mono text-sm" placeholder="KEY" />
            <input value={r.value} onChange={e => { const n = [...rows]; n[i] = { ...r, value: e.target.value }; setRows(n) }} className="border px-3 h-9 font-mono text-sm" placeholder="value" />
            <button onClick={() => setRows(rows.filter((_, x) => x !== i))} className="h-9 border px-2 text-xs">✕</button>
          </div>
        ))}
        <button onClick={() => setRows([...rows, { key: 'NEW_KEY', desc: '', value: '' }])} className="px-3 h-8 border text-sm">+ Add key</button>
      </div>
      <button onClick={gen} className="px-5 h-10 bg-zinc-900 text-white text-sm">Generate .env</button>
      {out && (
        <>
          <textarea value={out} readOnly className="w-full h-40 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
          <div className="flex gap-2">
            <button onClick={() => navigator.clipboard.writeText(out)} className="px-4 h-9 border text-sm">Copy</button>
          </div>
        </>
      )}
    </div>
  )
}
