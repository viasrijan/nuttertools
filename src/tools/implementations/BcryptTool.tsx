import { useState } from 'react'
import bcrypt from 'bcryptjs'

export default function BcryptTool() {
  const [password, setPassword] = useState('hunter2')
  const [rounds, setRounds] = useState(10)
  const [hash, setHash] = useState('')
  const [checkPassword, setCheckPassword] = useState('hunter2')
  const [checkHash, setCheckHash] = useState('')
  const [result, setResult] = useState<boolean | null>(null)
  const [busy, setBusy] = useState(false)

  const gen = async () => {
    setBusy(true)
    await new Promise(r => setTimeout(r, 30))
    const salt = bcrypt.genSaltSync(rounds)
    setHash(bcrypt.hashSync(password, salt))
    setBusy(false)
  }

  const check = () => {
    try { setResult(bcrypt.compareSync(checkPassword, checkHash)) } catch { setResult(null) }
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <p className="text-sm font-semibold mb-2">Generate</p>
        <div className="flex flex-wrap gap-2 items-center">
          <input value={password} onChange={e => setPassword(e.target.value)} className="border px-3 h-9 text-sm flex-1 min-w-[160px]" placeholder="Password" />
          <label className="text-sm">Rounds <input type="number" min={4} max={15} value={rounds} onChange={e => setRounds(parseInt(e.target.value) || 10)} className="border px-2 h-9 w-16 text-sm" /></label>
          <button onClick={gen} disabled={busy} className="px-4 h-9 bg-zinc-900 text-white text-sm">{busy ? '…' : 'Hash'}</button>
        </div>
        {hash && (
          <>
            <code className="block mt-2 border p-3 font-mono text-xs break-all bg-zinc-50 dark:bg-zinc-800">{hash}</code>
            <button onClick={() => navigator.clipboard.writeText(hash)} className="px-3 h-8 border text-sm mt-2">Copy</button>
          </>
        )}
      </div>
      <div>
        <p className="text-sm font-semibold mb-2">Verify</p>
        <div className="flex flex-wrap gap-2 items-center">
          <input value={checkPassword} onChange={e => setCheckPassword(e.target.value)} className="border px-3 h-9 text-sm flex-1 min-w-[140px]" placeholder="Password" />
          <input value={checkHash} onChange={e => setCheckHash(e.target.value)} className="border px-3 h-9 text-sm flex-[2] min-w-[180px] font-mono text-xs" placeholder="Hash" />
          <button onClick={check} className="px-4 h-9 bg-zinc-900 text-white text-sm">Check</button>
        </div>
        {result !== null && (
          <div className={`mt-2 border p-3 text-sm font-semibold ${result ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300'}`}>
            {result ? '✓ Match — the password is correct' : '✗ No match — wrong password or invalid hash'}
          </div>
        )}
      </div>
    </div>
  )
}
