import { useState } from 'react'
import { Button } from '../../components/ui/Button'

import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
import { encryptPDF } from '@pdfsmaller/pdf-encrypt'
import { decryptPDF } from '@pdfsmaller/pdf-decrypt'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function PdfProtect() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [action, setAction] = useState<'protect' | 'unlock'>('protect')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const run = async () => {
    if (!file) return
    setBusy(true); setError('')
    try {
      const bytes = new Uint8Array(await file.arrayBuffer())
      if (action === 'protect') {
        if (!password) { setError('Enter a password first.'); setBusy(false); return }
        const out = await encryptPDF(bytes, password, { allowCopying: false, allowModifying: false, allowPrinting: true, allowAnnotating: false })
        saveBlob(bytesToBlob(out, 'application/pdf'), 'protected.pdf')
      } else {
        if (!password) { setError('Enter the password to unlock with.'); setBusy(false); return }
        const out = await decryptPDF(bytes, password)
        saveBlob(bytesToBlob(out, 'application/pdf'), 'unlocked.pdf')
      }
    } catch (e: any) {
      setError(e?.code === 'WRONG_PASSWORD' || /password/i.test(e?.message || '') ? 'Wrong password — could not process this PDF.' : e.message)
    }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl omni-rise">
      <div className="flex gap-2.5">
        <Button variant="outline" onClick={() => setAction('protect')} className={`px-4 h-9 text-sm border ${action === 'protect' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Protect</Button>
        <Button variant="outline" onClick={() => setAction('unlock')} className={`px-4 h-9 text-sm border ${action === 'unlock' ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>Unlock</Button>
      </div>
      <DropZone onFiles={fl => setFile(fl[0])} accept="application/pdf" multiple={false}
        label={action === 'protect' ? 'Drop a PDF to add a password' : 'Drop a protected PDF to remove its password'} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 h-10 text-sm" placeholder={action === 'protect' ? 'Password to protect with' : 'Password'} />
      {error && <p className="text-xs text-red-500">{error}</p>}
      <Button variant="secondary" disabled={busy || !file} onClick={run}>
        {busy ? 'Working…' : action === 'protect' ? 'Encrypt & download' : 'Unlock & download'}
      </Button>
      {busy && <Progress label={action === 'protect' ? 'Encrypting PDF…' : 'Unlocking PDF…'} />}
      <p className="text-[11px] font-medium text-zinc-500">Uses AES-256 (PDF 2.0) encryption via the Web Crypto API — everything happens in your browser.</p>
    </div>
  )
}
