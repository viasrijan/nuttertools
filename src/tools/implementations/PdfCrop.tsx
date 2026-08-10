import { useState } from 'react'
import DropZone from '../../components/DropZone'
import { PDFDocument } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function PdfCrop() {
  const [top, setTop] = useState(5)
  const [bottom, setBottom] = useState(5)
  const [left, setLeft] = useState(5)
  const [right, setRight] = useState(5)
  const [unit, setUnit] = useState<'mm' | 'pct'>('mm')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const crop = async (fl: FileList) => {
    const file = fl[0]
    if (!file) return
    setBusy(true)
    try {
      const doc = await PDFDocument.load(await file.arrayBuffer())
      const pages = doc.getPages()
      for (const p of pages) {
        const { width, height } = p.getSize()
        const f = unit === 'pct' ? 1 : 72 / 25.4
        const mm = (v: number) => v * f
        p.setCropBox(
          mm(left),
          mm(bottom),
          Math.max(1, width - mm(left) - mm(right)),
          Math.max(1, height - mm(top) - mm(bottom)),
        )
      }
      const out = await doc.save()
      saveBlob(bytesToBlob(out, 'application/pdf'), file.name.replace(/\.[^.]+$/, '') + '-cropped.pdf')
      setStatus(`Cropped ${pages.length} page${pages.length === 1 ? '' : 's'} — check your downloads.`)
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  const input = (label: string, v: number, set: (n: number) => void) => (
    <div>
      <label className="text-[11px] font-semibold text-zinc-900 dark:text-white uppercase">{label}</label>
      <input type="number" min="0" value={v} onChange={e => set(Math.max(0, +e.target.value))} className="w-full border px-2 py-2 text-sm mt-1" />
    </div>
  )

  return (
    <div className="space-y-4 max-w-xl">
      <DropZone onFiles={crop} accept="application/pdf" multiple={false} label="Drop a PDF to crop page margins" />
      <div className="grid grid-cols-4 gap-2">
        {input('Top', top, setTop)}
        {input('Bottom', bottom, setBottom)}
        {input('Left', left, setLeft)}
        {input('Right', right, setRight)}
      </div>
      <div className="flex gap-2 text-sm">
        {(['mm', 'pct'] as const).map(u => (
          <button key={u} onClick={() => setUnit(u)} className={`px-4 h-9 border ${unit === u ? 'bg-white text-zinc-900 ring-1 ring-zinc-300 dark:ring-zinc-600' : ''}`}>{u === 'mm' ? 'Millimeters' : 'Percent of page'}</button>
        ))}
      </div>
      {busy && <p className="text-sm animate-pulse">{status}</p>}
      {!busy && status && <p className="text-sm text-zinc-600">{status}</p>}
    </div>
  )
}
