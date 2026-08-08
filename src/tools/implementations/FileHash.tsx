import { useState } from 'react'
import DropZone from '../../components/DropZone'

function md5(bytes: Uint8Array): string {
  const s: number[] = [7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21]
  const K: number[] = []
  for (let i = 0; i < 64; i++) K.push(Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296))
  const bitLen = bytes.length * 8
  const padded = new Uint8Array((((bytes.length + 8) >> 6) + 1) << 6)
  padded.set(bytes)
  padded[bytes.length] = 0x80
  const dv = new DataView(padded.buffer)
  dv.setUint32(padded.length - 8, bitLen >>> 0, true)
  dv.setUint32(padded.length - 4, Math.floor(bitLen / 4294967296), true)
  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476
  const rotl = (x: number, c: number) => (x << c) | (x >>> (32 - c))
  for (let off = 0; off < padded.length; off += 64) {
    const M: number[] = []
    for (let j = 0; j < 16; j++) M.push(dv.getUint32(off + j * 4, true))
    let A = a0, B = b0, C = c0, D = d0
    for (let i = 0; i < 64; i++) {
      let F = 0, g = 0
      if (i < 16) { F = (B & C) | (~B & D); g = i }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16 }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16 }
      else { F = C ^ (B | ~D); g = (7 * i) % 16 }
      F = (F + A + K[i] + M[g]) >>> 0
      A = D; D = C; C = B
      B = (B + rotl(F, s[i])) >>> 0
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0; c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0
  }
  const toHex = (n: number) => (n >>> 0).toString(16).padStart(8, '0')
  return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0)
}

const hex = (buf: ArrayBuffer) => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')

export default function FileHash() {
  const [files, setFiles] = useState<File[]>([])
  const [alg, setAlg] = useState('SHA-256')
  const [results, setResults] = useState<{ name: string, size: string, hash: string }[]>([])

  const run = async () => {
    const out: { name: string, size: string, hash: string }[] = []
    for (const f of files) {
      const buf = new Uint8Array(await f.arrayBuffer())
      let hash = ''
      if (alg === 'MD5') hash = md5(buf)
      else hash = hex(await crypto.subtle.digest(alg as AlgorithmIdentifier, buf))
      out.push({ name: f.name, size: (f.size / 1024).toFixed(1) + ' KB', hash })
    }
    setResults(out)
  }

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={fl => setFiles(Array.from(fl))} accept="*" multiple label="Drop files to hash (runs locally)" />
      {files.length > 0 && <p className="text-xs text-zinc-500">{files.length} file{files.length === 1 ? '' : 's'} selected</p>}
      <div className="flex flex-wrap gap-2 text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white self-center">Algorithm</label>
        {['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'].map(a => (
          <button key={a} onClick={() => setAlg(a)} className={`px-3 h-9 text-xs border ${alg === a ? 'bg-zinc-900 text-white' : ''}`}>{a}</button>
        ))}
      </div>
      <button onClick={run} disabled={!files.length} className="px-5 h-10 bg-zinc-900 text-white text-sm">Hash files</button>
      {results.map((r, i) => (
        <div key={i} className="border p-3 text-xs">
          <div className="flex justify-between mb-1"><span className="font-semibold">{r.name}</span><span className="text-zinc-500">{r.size}</span></div>
          <code className="break-all font-mono">{r.hash}</code>
        </div>
      ))}
    </div>
  )
}
