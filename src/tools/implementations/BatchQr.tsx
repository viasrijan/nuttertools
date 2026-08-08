import { useRef, useState } from 'react'
import QRCode from 'qrcode'
import JSZip from 'jszip'
import { saveBlob } from '../../lib/download'

export default function BatchQr() {
  const [lines, setLines] = useState('https://nutter.tools\nhttps://nutter.tools/tools\nmailto:hi@nutter.tools\nWIFI:S:NutterNet;T:WPA;P:secret123;;')
  const [size, setSize] = useState(512)
  const [generated, setGenerated] = useState(false)
  const [busy, setBusy] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const items = lines.split('\n').map(l => l.trim()).filter(Boolean)

  const gen = async () => {
    const div = containerRef.current
    if (!div) return
    div.innerHTML = ''
    setBusy(true)
    for (const [i, l] of items.entries()) {
      const canvas = document.createElement('canvas')
      await QRCode.toCanvas(canvas, l, { width: size, margin: 2, errorCorrectionLevel: 'M' })
      const wrap = document.createElement('div')
      wrap.className = 'border p-2 text-center'
      const label = document.createElement('div')
      label.className = 'text-[10px] text-zinc-500 mt-1 break-all max-w-[160px] mx-auto'
      label.textContent = l
      wrap.appendChild(canvas)
      wrap.appendChild(label)
      div.appendChild(wrap)
    }
    setGenerated(true)
    setBusy(false)
  }

  const downloadZip = async () => {
    const zip = new JSZip()
    for (const [i, l] of items.entries()) {
      const dataUrl = await QRCode.toDataURL(l, { width: size, margin: 2, errorCorrectionLevel: 'M' })
      zip.file(`qr-${String(i + 1).padStart(3, '0')}.png`, dataUrl.split(',')[1], { base64: true })
    }
    const blob = await zip.generateAsync({ type: 'blob' })
    saveBlob(blob, 'batch-qr.zip')
  }

  return (
    <div className="space-y-4">
      <textarea value={lines} onChange={e => { setLines(e.target.value); setGenerated(false) }} placeholder="One URL/text per line…" className="w-full h-[160px] border p-3 text-sm font-mono" />
      <div className="flex flex-wrap gap-2 items-center text-sm">
        <label className="font-semibold text-zinc-900 dark:text-white">Size</label>
        <select value={size} onChange={e => { setSize(+e.target.value); setGenerated(false) }} className="border px-2 py-2">
          {[256, 512, 1024].map(s => <option key={s} value={s}>{s}px</option>)}
        </select>
        <button onClick={gen} disabled={busy || !items.length} className="px-5 h-10 bg-zinc-900 text-white text-sm">{busy ? 'Generating…' : `Generate ${items.length || ''} QR codes`}</button>
        {generated && <button onClick={downloadZip} className="px-5 h-10 border text-sm">Download ZIP</button>}
      </div>
      <div ref={containerRef} className="grid grid-cols-2 md:grid-cols-4 gap-3" />
      <p className="text-[11px] text-zinc-500">Tip: use <code>WIFI:S:NETWORK;T:WPA;P:PASSWORD;;</code> lines to make Wi-Fi login QR codes.</p>
    </div>
  )
}
