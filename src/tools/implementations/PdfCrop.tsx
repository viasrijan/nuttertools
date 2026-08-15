import { useState } from 'react'
import DropZone from '../../components/DropZone'
import Progress from '../../components/Progress'
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
      setStatus(`Cropped ${pages.length} page${pages.length === 1 ? '' : 's'} successfully — check your downloads.`)
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  const input = (label: string, v: number, set: (n: number) => void) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">{label}</label>
      <input type="number" min="0" value={v} onChange={e => set(Math.max(0, +e.target.value))} className="w-full border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-3 h-10 text-sm font-semibold rounded-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/20" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-xl">
      <DropZone onFiles={crop} accept="application/pdf" multiple={false} label="Drop a PDF to crop page margins" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {input('Top', top, setTop)}
        {input('Bottom', bottom, setBottom)}
        {input('Left', left, setLeft)}
        {input('Right', right, setRight)}
      </div>
      <div className="flex flex-wrap gap-2">
        {(['mm', 'pct'] as const).map(u => (
          <button
            key={u}
            onClick={() => setUnit(u)}
            className={`px-5 h-10 text-xs font-bold uppercase tracking-wider rounded-none transition-all ${
              unit === u
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700'
            }`}
          >
            {u === 'mm' ? 'Millimeters (mm)' : 'Percent (%)'}
          </button>
        ))}
      </div>
      {busy && <Progress label={status || 'Processing PDF…'} />}
      {!busy && status && <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{status}</p>}
    </div>
  )
}
