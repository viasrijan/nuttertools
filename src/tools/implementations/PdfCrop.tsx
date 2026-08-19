import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import { Select } from '../../components/ui/Select'
import Progress from '../../components/Progress'
import { PDFDocument } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function PdfCrop() {
  const [file, setFile] = useState<{ name: string, size: number } | null>(null)
  const [top, setTop] = useState(5)
  const [bottom, setBottom] = useState(5)
  const [left, setLeft] = useState(5)
  const [right, setRight] = useState(5)
  const [unit, setUnit] = useState('mm')
  const [busy, setBusy] = useState(false)
  const [status, setStatus] = useState('')

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

  const crop = async (fl: FileList) => {
    const f = fl[0]
    if (!f) return
    setFile({ name: f.name, size: f.size })
    setBusy(true)
    try {
      const doc = await PDFDocument.load(await f.arrayBuffer())
      const pages = doc.getPages()
      for (const p of pages) {
        const { width, height } = p.getSize()
        const f2 = unit === 'pct' ? 1 : 72 / 25.4
        const mm = (v: number) => v * f2
        p.setCropBox(
          mm(left),
          mm(bottom),
          Math.max(1, width - mm(left) - mm(right)),
          Math.max(1, height - mm(top) - mm(bottom)),
        )
      }
      const out = await doc.save()
      saveBlob(bytesToBlob(out, 'application/pdf'), f.name.replace(/\.[^.]+$/, '') + '-cropped.pdf')
      setStatus(`Cropped ${pages.length} page${pages.length === 1 ? '' : 's'} successfully — check your downloads.`)
    } catch (e: any) { setStatus('Error: ' + e.message) }
    setBusy(false)
  }

  const input = (label: string, v: number, set: (n: number) => void) => (
    <div className="space-y-1.5">
      <label className="text-xs font-bold text-zinc-700 dark:text-zinc-300 uppercase tracking-wide">{label}</label>
      <input type="number" min="0" value={v} onChange={e => set(Math.max(0, +e.target.value))} className="w-full bg-zinc-100 dark:bg-zinc-800 px-3 h-10 text-sm font-semibold rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" />
    </div>
  )

  return (
    <div className="space-y-6 max-w-xl">
      <DropZone
        onFiles={crop}
        accept="application/pdf"
        multiple={false}
        files={dropFiles}
        onClear={() => { setFile(null); setStatus('') }}
        label="Drop a PDF to crop page margins"
      />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {input('Top', top, setTop)}
        {input('Bottom', bottom, setBottom)}
        {input('Left', left, setLeft)}
        {input('Right', right, setRight)}
      </div>
      <div className="max-w-[240px]">
        <Select label="Unit" value={unit} onChange={setUnit} options={[{ v: 'mm', label: 'Millimeters (mm)' }, { v: 'pct', label: 'Percent (%)' }]} />
      </div>
      {busy && <Progress label={status || 'Processing PDF…'} />}
      {!busy && status && <p className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">{status}</p>}
    </div>
  )
}
