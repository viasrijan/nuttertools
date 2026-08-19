import { useState } from 'react'
import DropZone from '../../components/DropZone'
import type { DropFile } from '../../components/DropZone'
import Progress from '../../components/Progress'
import { PDFDocument, degrees } from 'pdf-lib'
import { saveBlob, bytesToBlob } from '../../lib/download'

export default function RotatePdf() {
  const [file, setFile] = useState<File | null>(null)
  const [angle, setAngle] = useState(90)
  const [all, setAll] = useState(true)
  const [pages, setPages] = useState('1-3')
  const [busy, setBusy] = useState(false)

  const dropFiles: DropFile[] = file ? [{ name: file.name, size: file.size }] : []

  const run = async () => {
    if (!file) return
    setBusy(true)
    try {
      const pdf = await PDFDocument.load(await file.arrayBuffer())
      const allPages = pdf.getPages()
      const apply = (p: any) => p.setRotation(degrees((p.getRotation().angle + angle) % 360))
      if (all) {
        allPages.forEach(apply)
      } else {
        const nums: number[] = []
        pages.split(',').forEach(p => {
          if (p.includes('-')) { const [a, b] = p.split('-').map(Number); for (let i = a; i <= b; i++) nums.push(i - 1) }
          else nums.push(parseInt(p) - 1)
        })
        nums.forEach(i => { if (allPages[i]) apply(allPages[i]) })
      }
      saveBlob(bytesToBlob(await pdf.save(), 'application/pdf'), 'rotated.pdf')
    } catch (e: any) { alert('Error: ' + e.message) }
    setBusy(false)
  }

  return (
    <div className="space-y-5 max-w-xl">
      <DropZone onFiles={fl => setFile(fl[0])} accept="application/pdf" multiple={false} files={dropFiles} onClear={() => setFile(null)} label="Drop a PDF to rotate" />
      <div className="flex flex-wrap gap-2">
        {[90, 180, 270].map(a => (
          <button key={a} onClick={() => setAngle(a)} className={`px-4 h-9 text-sm font-bold ${angle === a ? 'bg-zinc-900 text-white dark:bg-white dark:text-zinc-900' : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300'}`}>{a}° clockwise</button>
        ))}
      </div>
      <label className="flex items-center gap-2 text-sm font-bold"><input type="checkbox" checked={all} onChange={e => setAll(e.target.checked)} className="w-4 h-4 accent-indigo-600" />All pages</label>
      {!all && <input value={pages} onChange={e => setPages(e.target.value)} className="px-3 h-10 text-sm font-semibold bg-zinc-100 dark:bg-zinc-800 rounded-none outline-none focus:shadow-[0_0_0_3px_rgba(99,102,241,0.2)]" placeholder="1-3,5,7-9" />}
      <button onClick={run} disabled={busy} className="px-5 h-10 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider transition-colors">{busy ? 'Rotating…' : 'Rotate & download'}</button>
      {busy && <Progress label="Rotating PDF…" />}
    </div>
  )
}
