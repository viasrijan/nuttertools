import { useState } from 'react'

import { Button } from '../../components/ui/Button'
import CopyButton from '../../components/ui/CopyButton'

function toB64(buf: ArrayBuffer) {
  const bytes = new Uint8Array(buf)
  let bin = ''
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i])
  return btoa(bin)
}
function fromB64(b64: string) {
  const bin = atob(b64)
  const bytes = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
  return bytes
}

async function deriveKey(password: string, salt: Uint8Array) {
  const material = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveKey'])
  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt.slice(), iterations: 100000, hash: 'SHA-256' },
    material,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )
}

export default function TextEncryptor() {
  const [plain, setPlain] = useState('This is a secret message.')
  const [password, setPassword] = useState('')
  const [secret, setSecret] = useState('')
  const [out, setOut] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const encrypt = async () => {
    setError(''); setBusy(true)
    try {
      if (!password) throw new Error('Enter a password')
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await deriveKey(password, salt)
      const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, new TextEncoder().encode(plain))
      const payload = new Uint8Array(16 + 12 + ct.byteLength)
      payload.set(salt, 0); payload.set(iv, 16); payload.set(new Uint8Array(ct), 28)
      setOut(toB64(payload.buffer))
    } catch (e: any) { setError(e.message) } finally { setBusy(false) }
  }

  const decrypt = async () => {
    setError(''); setBusy(true)
    try {
      if (!password) throw new Error('Enter a password')
      const payload = fromB64(secret.trim())
      const salt = payload.slice(0, 16)
      const iv = payload.slice(16, 28)
      const ct = payload.slice(28)
      const key = await deriveKey(password, salt)
      const pt = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct)
      setPlain(new TextDecoder().decode(pt))
    } catch (e: any) { setError('Decryption failed — wrong password or corrupt data'); } finally { setBusy(false) }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <div>
        <label className="text-sm font-semibold">Message</label>
        <textarea value={plain} onChange={e => setPlain(e.target.value)} className="w-full border p-3 h-24 text-sm mt-1" />
      </div>
      <div>
        <label className="text-sm font-semibold">Password (AES-256-GCM)</label>
        <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full border px-3 h-9 text-sm mt-1" />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      <div className="flex gap-2.5">
        <Button variant="secondary" onClick={encrypt} disabled={busy} isLoading={busy}>Encrypt</Button>
        <Button variant="outline" disabled={busy} onClick={decrypt}>{busy ? '…' : 'Decrypt'}</Button>
        {out && <CopyButton value={out} />}
      </div>
      <div>
        <label className="text-sm font-semibold">Encrypted text (base64)</label>
        <textarea value={out} onChange={e => setOut(e.target.value)} className="w-full border p-3 h-24 font-mono text-xs mt-1" placeholder="Encrypted output appears here" />
      </div>
      <p className="text-[11px] font-medium text-zinc-500">Everything runs in your browser via the Web Crypto API. The same password encrypts and decrypts.</p>
    </div>
  )
}
