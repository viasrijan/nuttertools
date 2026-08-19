import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

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
    <div className="space-y-5 max-w-3xl omni-rise">
      <div className="flex flex-wrap gap-2.5">
        {Object.keys(TEMPLATES).map(k => (
          <Button variant="outline" key={k} onClick={() => select(k)} className={`px-3 h-9 text-sm  ${tpl === k ? 'bg-indigo-600 text-white shadow-[0_4px_14px_-4px_rgba(79,70,229,0.6)]' : ''}`}>{k}</Button>
        ))}
      </div>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center">
            <input value={r.key} onChange={e => { const n = [...rows]; n[i] = { ...r, key: e.target.value }; setRows(n) }} className="border px-3 h-9 font-mono text-sm" placeholder="KEY" />
            <input value={r.value} onChange={e => { const n = [...rows]; n[i] = { ...r, value: e.target.value }; setRows(n) }} className="border px-3 h-9 font-mono text-sm" placeholder="value" />
            <Button variant="ghost" size="sm" onClick={() => setRows(rows.filter((_, x) => x !== i))}>✕</Button>
          </div>
        ))}
        <button onClick={() => setRows([...rows, { key: 'NEW_KEY', desc: '', value: '' }])} className="px-4 h-9 text-sm font-bold text-white bg-gradient-to-b from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 shadow-[0_1px_2px_rgba(0,0,0,0.15),0_6px_16px_-6px_rgba(5,150,105,0.5)] transition-all duration-200 hover:-translate-y-0.5 active:scale-95">+ Add key</button>
      </div>
      <Button variant="secondary" onClick={gen}>Generate .env</Button>
      {out && (
        <>
          <textarea value={out} readOnly className="w-full h-40 border p-3 font-mono text-xs bg-zinc-50 dark:bg-zinc-800" />
          <div className="flex gap-2.5">
            <CopyButton value={out} />
          </div>
        </>
      )}
    </div>
  )
}
