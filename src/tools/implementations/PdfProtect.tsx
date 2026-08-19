import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import { Select } from '../../components/ui/Select'
import Progress from '../../components/Progress'
import { encryptPDF } from '@pdfsmaller/pdf-encrypt'
import { decryptPDF } from '@pdfsmaller/pdf-decrypt'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function PdfProtect() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [action, setAction] = useState('protect')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

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
    <div className="space-y-5 max-w-xl">
      <div className="max-w-[240px]">
        <Select label="Action" value={action} onChange={setAction} options={[{ v: 'protect', label: 'Protect (add password)' }, { v: 'unlock', label: 'Unlock (remove password)' }]} />
      </div>
      <DropZone onFiles={fl => { setFile(fl[0]); setError('') }} accept="application/pdf" multiple={false} files={dropFiles} onClear={() => { setFile(null); setError('') }}
        label={action === 'protect' ? 'Drop a PDF to add a password' : 'Drop a protected PDF to remove its password'} />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 h-10 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" placeholder={action === 'protect' ? 'Password to protect with' : 'Password'} />
      {error && <p className="text-xs font-semibold text-rose-600">{error}</p>}
      <button onClick={run} disabled={busy || !file} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-xs uppercase tracking-wider transition-colors">
        {busy ? 'Working…' : action === 'protect' ? 'Encrypt & download' : 'Unlock & download'}
      </button>
      {busy && <Progress label={action === 'protect' ? 'Encrypting PDF…' : 'Unlocking PDF…'} />}
      <p className="text-[11px] font-semibold text-zinc-500">Uses AES-256 (PDF 2.0) encryption via the Web Crypto API — everything happens in your browser.</p>
    </div>
  )
}
